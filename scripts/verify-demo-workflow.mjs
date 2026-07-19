const api = process.env.WORKHUB_API_URL || 'http://127.0.0.1:5000/api';

const request = async (path, { token, method = 'GET', body } = {}) => {
  const response = await fetch(`${api}${path}`, {
    method,
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(body ? { 'content-type': 'application/json' } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${payload?.message || text}`);
  }
  return payload;
};

const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } });

const admin = await login('admin@workos.dev', 'Admin@123');
const employee = await login('eli@workos.dev', 'Employee@123');
const projects = await request('/projects', { token: admin.token });
const project = projects.find((candidate) => candidate.code === 'MC-OPS');
if (!project) throw new Error('Seeded Meeting Cockpit project was not found.');

const projectTasks = await request(`/projects/${project._id}/tasks`, { token: admin.token });
let task = projectTasks.find((candidate) => candidate.title === '[Demo] Launch readiness review');
if (!task) {
  task = await request('/tasks', {
    token: admin.token,
    method: 'POST',
    body: {
      title: '[Demo] Launch readiness review',
      description: 'Confirm the synthetic launch checklist and hand the result back to the manager.',
      project: project._id,
      assignedTo: employee.user._id,
      priority: 'high'
    }
  });
}

const employeeTasks = await request(`/tasks/user/${employee.user._id}`, {
  token: employee.token
});
if (!employeeTasks.some((candidate) => candidate._id === task._id)) {
  throw new Error('The seeded employee cannot see the assigned demo task.');
}

const updated = await request(`/tasks/${task._id}`, {
  token: employee.token,
  method: 'PUT',
  body: { status: 'in_progress' }
});
if (updated.status !== 'in_progress') throw new Error('Task status did not persist.');

const currentSession = await request('/work/current', { token: employee.token });
if (!currentSession) throw new Error('Employee login did not establish a work session.');

const verified = await request(`/tasks/${task._id}`, { token: admin.token });
if (verified.status !== 'in_progress') throw new Error('Manager-side verification did not match.');

console.log(JSON.stringify({
  status: 'verified',
  workflow: 'admin project -> task assignment -> employee status -> manager verification',
  data: 'synthetic in-memory seed',
  task: verified.title
}, null, 2));
