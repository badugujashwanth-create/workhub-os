import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import express from 'express';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import authRoutes from '../routes/authRoutes.js';
import projectRoutes from '../routes/projectRoutes.js';
import taskRoutes from '../routes/taskRoutes.js';
import adminRoutes from '../routes/adminRoutes.js';
import workRoutes from '../routes/workRoutes.js';
import Role from '../models/Role.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';

process.env.JWT_SECRET = 'workhub-integration-test-secret';

let mongo;
let server;
let baseUrl;
let users;

const request = async (path, { token, method = 'GET', body } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'content-type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  return {
    status: response.status,
    body: text ? JSON.parse(text) : null
  };
};

const login = async (email) => {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: { email, password: 'Password123!' }
  });
  assert.equal(response.status, 200);
  return response.body.token;
};

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());

  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/projects', projectRoutes);
  app.use('/api/tasks', taskRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/work', workRoutes);
  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  });
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
  await Role.ensureCoreRoles();
  const password = await bcrypt.hash('Password123!', 4);
  const seed = [
    ['Admin', 'admin@workhub.test', 'admin'],
    ['Manager A', 'manager-a@workhub.test', 'manager'],
    ['Manager B', 'manager-b@workhub.test', 'manager'],
    ['Employee A', 'employee-a@workhub.test', 'employee'],
    ['Employee B', 'employee-b@workhub.test', 'employee']
  ];
  const created = await User.insertMany(
    seed.map(([name, email, role]) => ({ name, email, role, password }))
  );
  users = Object.fromEntries(created.map((user) => [user.email, user]));
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});

test('authenticated project and task workflow enforces object-level access', async () => {
  const managerAToken = await login('manager-a@workhub.test');
  const managerBToken = await login('manager-b@workhub.test');
  const employeeAToken = await login('employee-a@workhub.test');
  const employeeBToken = await login('employee-b@workhub.test');

  const beforeExplicitStart = await request('/api/work/current', {
    token: employeeAToken
  });
  assert.equal(beforeExplicitStart.status, 200);
  assert.equal(beforeExplicitStart.body, null);

  const idempotentStop = await request('/api/work/stop', {
    token: employeeAToken,
    method: 'POST'
  });
  assert.equal(idempotentStop.status, 200);
  assert.equal(idempotentStop.body, null);

  const explicitStart = await request('/api/work/start', {
    token: employeeAToken,
    method: 'POST'
  });
  assert.equal(explicitStart.status, 201);
  assert.equal(explicitStart.body.status, 'active');

  const projectResponse = await request('/api/projects', {
    token: managerAToken,
    method: 'POST',
    body: {
      name: 'Client launch',
      code: 'CLIENT-LAUNCH',
      members: [users['employee-a@workhub.test']._id]
    }
  });
  assert.equal(projectResponse.status, 201);
  const projectId = projectResponse.body._id;

  const hiddenProject = await request(`/api/projects/${projectId}`, {
    token: employeeBToken
  });
  assert.equal(hiddenProject.status, 403);

  const foreignManagerUpdate = await request(`/api/projects/${projectId}`, {
    token: managerBToken,
    method: 'PATCH',
    body: { name: 'Unauthorized rename' }
  });
  assert.equal(foreignManagerUpdate.status, 403);

  const taskResponse = await request('/api/tasks', {
    token: managerAToken,
    method: 'POST',
    body: {
      title: 'Prepare launch checklist',
      project: projectId,
      assignedTo: users['employee-a@workhub.test']._id,
      priority: 'high'
    }
  });
  assert.equal(taskResponse.status, 201);
  const taskId = taskResponse.body._id;

  const foreignTask = await request(`/api/tasks/${taskId}`, { token: employeeBToken });
  assert.equal(foreignTask.status, 403);

  const foreignManagerTask = await request(`/api/tasks/${taskId}`, {
    token: managerBToken
  });
  assert.equal(foreignManagerTask.status, 403);

  const foreignProject = await Project.create({
    name: 'Foreign project',
    owner: users['manager-b@workhub.test']._id,
    managers: [users['manager-b@workhub.test']._id],
    members: [users['employee-b@workhub.test']._id]
  });
  const crossProjectMove = await request(`/api/tasks/${taskId}`, {
    token: managerAToken,
    method: 'PUT',
    body: { project: foreignProject._id }
  });
  assert.equal(crossProjectMove.status, 403);

  const employeeUpdate = await request(`/api/tasks/${taskId}`, {
    token: employeeAToken,
    method: 'PUT',
    body: {
      status: 'in_progress',
      title: 'Employee attempted rename',
      assignedTo: users['employee-b@workhub.test']._id
    }
  });
  assert.equal(employeeUpdate.status, 200);
  assert.equal(employeeUpdate.body.status, 'in_progress');
  assert.equal(employeeUpdate.body.title, 'Prepare launch checklist');
  assert.equal(employeeUpdate.body.assignedTo._id, String(users['employee-a@workhub.test']._id));

  const persisted = await Task.findById(taskId);
  assert.equal(persisted.title, 'Prepare launch checklist');
  assert.equal(String(persisted.assignedTo), String(users['employee-a@workhub.test']._id));
});

test('manager task lists are scoped to projects they manage', async () => {
  const managerAToken = await login('manager-a@workhub.test');
  const managerBToken = await login('manager-b@workhub.test');
  const projectA = await Project.create({
    name: 'A',
    owner: users['manager-a@workhub.test']._id,
    managers: [users['manager-a@workhub.test']._id],
    members: [users['employee-a@workhub.test']._id]
  });
  const projectB = await Project.create({
    name: 'B',
    owner: users['manager-b@workhub.test']._id,
    managers: [users['manager-b@workhub.test']._id],
    members: [users['employee-b@workhub.test']._id]
  });
  await Task.create([
    {
      title: 'Visible task',
      project: projectA._id,
      assignedTo: users['employee-a@workhub.test']._id,
      assignedBy: users['manager-a@workhub.test']._id
    },
    {
      title: 'Hidden task',
      project: projectB._id,
      assignedTo: users['employee-b@workhub.test']._id,
      assignedBy: users['manager-b@workhub.test']._id
    }
  ]);

  const managerTasks = await request('/api/admin/tasks', { token: managerAToken });
  assert.equal(managerTasks.status, 200);
  assert.deepEqual(managerTasks.body.map((task) => task.title), ['Visible task']);

  const otherEmployeeTasks = await request(
    `/api/tasks/user/${users['employee-b@workhub.test']._id}`,
    { token: managerAToken }
  );
  assert.equal(otherEmployeeTasks.status, 200);
  assert.equal(otherEmployeeTasks.body.length, 0);

  const ownProjectTasks = await request(`/api/projects/${projectB._id}/tasks`, {
    token: managerBToken
  });
  assert.equal(ownProjectTasks.status, 200);
  assert.equal(ownProjectTasks.body.length, 1);
});
