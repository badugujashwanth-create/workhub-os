const asId = (value) => String(value?._id || value || '');

const includesUser = (values = [], userId) =>
  values.some((value) => asId(value) === asId(userId));

export const isAdministrator = (user) => user?.role === 'admin';

export const projectVisibilityFilter = (user) => {
  if (isAdministrator(user)) return {};
  return {
    $or: [
      { owner: user._id },
      { managers: user._id },
      { members: user._id }
    ]
  };
};

export const canViewProject = (user, project) =>
  Boolean(
    user &&
      project &&
      (isAdministrator(user) ||
        asId(project.owner) === asId(user._id) ||
        includesUser(project.managers, user._id) ||
        includesUser(project.members, user._id))
  );

export const canManageProject = (user, project) =>
  Boolean(
    user &&
      project &&
      (isAdministrator(user) ||
        asId(project.owner) === asId(user._id) ||
        includesUser(project.managers, user._id))
  );

export const canViewTask = (user, task, project = null) =>
  Boolean(
    user &&
      task &&
      (isAdministrator(user) ||
        asId(task.assignedTo) === asId(user._id) ||
        asId(task.assignedBy) === asId(user._id) ||
        canViewProject(user, project || task.project))
  );

export const canManageTask = (user, task, project = null) =>
  Boolean(
    user &&
      task &&
      (isAdministrator(user) ||
        asId(task.assignedBy) === asId(user._id) ||
        canManageProject(user, project || task.project))
  );

export const manageableProjectIds = async (user, ProjectModel) => {
  if (isAdministrator(user)) return null;
  const projects = await ProjectModel.find({
    $or: [{ owner: user._id }, { managers: user._id }]
  }).select('_id');
  return projects.map((project) => project._id);
};
