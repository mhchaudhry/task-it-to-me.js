var formatter = require('./formatter');

module.exports = {
  listingProjectHeader:     listingProjectHeader,
  listProjects:             listProjects,
  noProjectsExist:          noProjectsExist,
  promptForProjectName:     promptForProjectName,
  createdProject:           createdProject,
  cantDeleteProject:        cantDeleteProject,
  deletingProject:          deletingProject,
  projectDoesntExist:       projectDoesntExist,
  editingProject:           editingProject,
  unknownCommand:           unknownCommand,
  promptForNewProjectName:  promptForNewProjectName,
  changedProjectName:       changedProjectName,
  promptForTaskName:        promptForTaskName,
  promptForNewTaskName:     promptForNewTaskName,
  createdTask:              createdTask,
  noTasksCreated:           noTasksCreated,
  listingTasksHeader:       listingTasksHeader,
  listTasks:                listTasks,
  changedTaskName:          changedTaskName,
  taskDoesntExist:          taskDoesntExist,
  taskAlreadyExists:        taskAlreadyExists,
  deletedTask:              deletedTask,
  taskNotFound:             taskNotFound,
  finishedTask:             finishedTask,
  projectMenu:              projectMenu,
  taskMenu:                 taskMenu,
};

function listingProjectHeader() {
  return formatter.info('Listing projects') + formatter.lineBreak;
}

function listProjects(projectNames) {
  var message = listingProjectHeader();
  projectNames.forEach(function printProjectName(projectName) {
    message += "  " + projectName + formatter.lineBreak;
  });
  message += formatter.lineBreak;
  return message;
}

function noProjectsExist() {
  return formatter.alert('No projects created') + formatter.sectionBreak;
}

function promptForProjectName() {
  return formatter.prompt("Enter a project name");
}

function createdProject(name) {
  return formatter.info('Created project') + formatter.quoted(name) + formatter.sectionBreak;
}

function cantDeleteProject() {
  return formatter.alert("Can't delete a project") + formatter.sectionBreak;
}

function deletingProject(name) {
  return formatter.info('Deleting project') + formatter.quoted(name) + formatter.sectionBreak;
}

function projectDoesntExist(name) {
  return formatter.alert("Project doesn't exist: ") + formatter.quoted(name) + formatter.sectionBreak;
}

function editingProject(name) {
  return formatter.info('Editing project') + formatter.quoted(name) + formatter.sectionBreak;
}

function unknownCommand(command) {
  return formatter.alert('Unknown command: ') + formatter.quoted(command) + formatter.sectionBreak;
}

function promptForNewProjectName() {
  return formatter.prompt("Enter new project name");
}

function changedProjectName(oldName, newName) {
  return formatter.success('Changed project name from ') +
      formatter.quoted(oldName) +
      formatter.success(' to ') +
      formatter.quoted(newName) +
      formatter.sectionBreak;
}

function changedTaskName(oldName, newName) {
  return formatter.success('Changed task name from ') +
      formatter.quoted(oldName) +
      formatter.success(' to ') +
      formatter.quoted(newName) +
      formatter.sectionBreak;
}

function promptForTaskName() {
  return formatter.prompt("Enter a task name");
}

function promptForNewTaskName() {
  return formatter.prompt("Enter a new task name");
}

function createdTask(name) {
  return formatter.info('Created task') + formatter.quoted(name) + formatter.sectionBreak;
}

function noTasksCreated(projectName) {
  return formatter.alert('No tasks created in ') + formatter.quoted(projectName) + formatter.sectionBreak;
}

function listingTasksHeader(projectName) {
  return formatter.info('Listing tasks in ' + formatter.quoted(projectName)) + formatter.lineBreak;
}

function listTasks(currentProject, tasks) {
  var message = listingTasksHeader(currentProject);
  tasks.forEach(function printTaskName(taskName) {
    message += "  " + taskName + formatter.lineBreak;
  });
  message += formatter.lineBreak;
  return message;
}

function taskDoesntExist(name) {
  return formatter.alert("Task doesn't exist: " + formatter.quoted(name)) + formatter.sectionBreak;
}

function taskAlreadyExists(name) {
  return formatter.alert("Task already exists: " + formatter.quoted(name)) + formatter.sectionBreak;
}

function deletedTask(name) {
  return formatter.info('Deleted task') + formatter.quoted(name) + formatter.sectionBreak;
}

function taskNotFound(name) {
  return formatter.alert('Task not found: ' + formatter.quoted(name)) + formatter.sectionBreak;
}

function finishedTask(name) {
  return formatter.info('Finished task') + formatter.quoted(name) + '!' + formatter.sectionBreak;
}

function projectMenu() {
  return  formatter.success('Welcome to Taskitome!') + formatter.lineBreak +
          formatter.dividerHeavy() +
          "PROJECTS MENU" + formatter.lineBreak +
          formatter.dividerLight() +
          formatter.alert('ENTER A COMMAND:') + formatter.lineBreak +
          formatter.command('a') + '   ' + formatter.description('Add a new project') + formatter.lineBreak +
          formatter.command('ls') + '  ' + formatter.description('List all project') + formatter.lineBreak +
          formatter.command('d') + '   ' + formatter.description('Delete a project') + formatter.lineBreak +
          formatter.command('e') + '   ' + formatter.description('Edit a project') + formatter.lineBreak +
          formatter.command('q') + '   ' + formatter.description('Quit the app') + formatter.sectionBreak;
}

function taskMenu() {
  return  "TASKS MENU" + formatter.lineBreak +
          formatter.dividerLight() +
          formatter.alert('ENTER A COMMAND:') + formatter.lineBreak +
          formatter.command('c') + '   ' + formatter.description('Change the project name') + formatter.lineBreak +
          formatter.command('a') + '   ' + formatter.description('Add a new task') + formatter.lineBreak +
          formatter.command('ls') + '  ' + formatter.description('List all tasks') + formatter.lineBreak +
          formatter.command('d') + '   ' + formatter.description('Delete a task') + formatter.lineBreak +
          formatter.command('e') + '   ' + formatter.description('Edit a task') + formatter.lineBreak +
          formatter.command('f') + '   ' + formatter.description('Finish a task') + formatter.lineBreak +
          formatter.command('b') + '   ' + formatter.description('Back to Projects menu') + formatter.lineBreak;
}
