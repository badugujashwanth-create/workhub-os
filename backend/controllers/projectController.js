import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { respondIfInvalidObjectId } from '../utils/objectId.js';
import { recordAuditLog } from '../utils/auditLogger.js';
import {
  canManageProject,
  canViewProject,
  projectVisibilityFilter
} from '../services/workspaceAccessService.js';

const PROJECT_FIELDS = [
  'name',
  'code',
  'description',
  'status',
  'priority',
  'members',
  'startDate',
  'dueDate',
  'tags'
];

const pickFields = (payload, fields) =>
  Object.fromEntries(
    fields.filter((field) => payload?.[field] !== undefined).map((field) => [field, payload[field]])
  );

export const listProjects = async (req, res) => {
  const projects = await Project.find(projectVisibilityFilter(req.user))
    .populate('owner', 'name email')
    .populate('managers', 'name email')
    .populate('members', 'name email role')
    .sort({ updatedAt: -1 });
  res.json(projects);
};

export const createProject = async (req, res) => {
  const payload = req.body || {};
  const safePayload = pickFields(payload, PROJECT_FIELDS);
  const isAdmin = req.user.role === 'admin';
  const project = await Project.create({
    ...safePayload,
    owner: isAdmin && payload.owner ? payload.owner : req.user._id,
    managers: isAdmin && payload.managers ? payload.managers : [req.user._id]
  });
  await recordAuditLog({
    user: req.user._id,
    role: req.user.role,
    action: 'project:create',
    entityType: 'project',
    entityId: project._id,
    description: `Project ${project.name} created`,
    metadata: { priority: project.priority },
    ipAddress: req.ip
  });
  const populated = await Project.findById(project._id)
    .populate('owner', 'name email')
    .populate('managers', 'name email')
    .populate('members', 'name email role');
  res.status(201).json(populated);
};

export const updateProject = async (req, res) => {
  if (respondIfInvalidObjectId(res, req.params.id, 'project id')) return;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!canManageProject(req.user, project))
    return res.status(403).json({ message: 'Forbidden' });

  const allowedFields = req.user.role === 'admin'
    ? [...PROJECT_FIELDS, 'owner', 'managers']
    : PROJECT_FIELDS;
  Object.assign(project, pickFields(req.body, allowedFields));
  await project.save();
  await recordAuditLog({
    user: req.user._id,
    role: req.user.role,
    action: 'project:update',
    entityType: 'project',
    entityId: project._id,
    description: `Project ${project.name} updated`,
    metadata: req.body,
    ipAddress: req.ip
  });

  const populated = await Project.findById(project._id)
    .populate('owner', 'name email')
    .populate('managers', 'name email')
    .populate('members', 'name email role');
  res.json(populated);
};

export const getProject = async (req, res) => {
  if (respondIfInvalidObjectId(res, req.params.id, 'project id')) return;
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('managers', 'name email')
    .populate('members', 'name email role');
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!canViewProject(req.user, project))
    return res.status(403).json({ message: 'Forbidden' });
  res.json(project);
};

export const getProjectTasks = async (req, res) => {
  if (respondIfInvalidObjectId(res, req.params.id, 'project id')) return;
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  if (!canViewProject(req.user, project))
    return res.status(403).json({ message: 'Forbidden' });
  const tasks = await Task.find({ project: req.params.id })
    .populate('assignedTo', 'name email role')
    .populate('assignedBy', 'name email role');
  res.json(tasks);
};
