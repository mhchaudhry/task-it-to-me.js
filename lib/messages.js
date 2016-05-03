module.exports = {
  listingProjectHeader:     listingProjectHeader,
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
  changedTaskName:          changedTaskName,
  taskDoesntExist:          taskDoesntExist,
  deletedTask:              deletedTask,
  taskNotFound:             taskNotFound,
  finishedTask:             finishedTask,
  projectMenu:              projectMenu,
  taskMenu:                 taskMenu
};

function listingProjectHeader() {
  return "\x1b[38;5;40mListing projects:\x1b[0m\n";
}

function noProjectsExist() {
  return "\x1b[40;38;5;214mNo projects created\x1b[0m\n\n";
}

function promptForProjectName() {
  return "\x1b[0;3mEnter a project name:\x1b[0m";
}

function createdProject(name) {
  return "\x1b[38;5;40mCreated project:\x1b[0m '" + name + "'\n\n";
}

function cantDeleteProject() {
  return "\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n";
}

function deletingProject(name) {
  return "\x1b[38;5;40mDeleting project:\x1b[0m '" + name + "'\n\n";
}

function projectDoesntExist(name) {
  return "\x1b[40;38;5;214mProject doesn't exist: '" + name + "'\x1b[0m\n\n";
}

function editingProject(name) {
  return "\x1b[38;5;40mEditing project:\x1b[0m '" + name + "'\n\n";
}

function unknownCommand(command) {
  return "\x1b[40;38;5;214mUnknown command: '" + command + "'";
}

function promptForNewProjectName() {
  return "\x1b[0;35mEnter new project name:\x1b[0m";
}

function changedProjectName(oldName, newName) {
  return "\x1b[0;35mChanged project name from\x1b[0m '" + oldName + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m";
}

function changedTaskName(oldName, newName) {
  return "\x1b[0;35mChanged task name from\x1b[0m '" + oldName + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m";
}

function promptForTaskName() {
  return "\x1b[0;35mEnter a task name:\x1b[0m";
}

function promptForNewTaskName() {
  return "\x1b[0;35mEnter a new task name:\x1b[0m";
}

function createdTask(name) {
  return "\x1b[0;35mCreated task: '" + name + "'\n\x1b[0m";
}

function noTasksCreated(projectName) {
  return "\x1b[40;38;5;214mNo tasks created in '" + projectName + "'\x1b[0m\n\n";
}

function listingTasksHeader(projectName) {
  return "\x1b[38;5;40mListing tasks in " + projectName + ":\x1b[0m\n";
}

function taskDoesntExist(name) {
  return "\x1b[40;38;5;214mTask doesn't exist: '" + name + "'\x1b[0m\n\n";
}

function deletedTask(name) {
  return "\x1b[38;5;40mDeleted task:\x1b[0m '" + name + "'\n\n";
}

function taskNotFound(name) {
  return "\x1b[40;38;5;214mTask not found: '" + name + "'\x1b[0m\n\n";
}

function finishedTask(name) {
  return "\x1b[38;5;40mFinished task:\x1b[0m '" + name + "'!\n\n";
}

function projectMenu() {
  return  "\x1b[38;5;40mWelcome to Taskitome!\n" +
          "\x1b[0;37m=============================\n\n" +
          "\x1b[0mPROJECTS MENU\n" +
          "\x1b[0;37m-----------------------------\n" +
          "\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n" +
          "\x1b[1;37ma   \x1b[0;35mAdd a new project\n" +
          "\x1b[1;37mls  \x1b[0;35mList all project\n" +
          "\x1b[1;37md   \x1b[0;35mDelete a project\n" +
          "\x1b[1;37me   \x1b[0;35mEdit a project\n" +
          "\x1b[1;37mq   \x1b[0;35mQuit the app\x1b[0m\n\n\n";
}

function taskMenu() {
  return  "\x1b[0mTASKS MENU\n" +
          "\x1b[0;37m-----------------------------\n" +
          "\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n" +
          "\x1b[1;37mc   \x1b[0;35mChange the project name\n" +
          "\x1b[1;37ma   \x1b[0;35mAdd a new task\n" +
          "\x1b[1;37mls  \x1b[0;35mList all tasks\n" +
          "\x1b[1;37md   \x1b[0;35mDelete a task\n" +
          "\x1b[1;37me   \x1b[0;35mEdit a task\n" +
          "\x1b[1;37mf   \x1b[0;35mFinish a task\n" +
          "\x1b[1;37mb   \x1b[0;35mBack to Projects menu\x1b[0m\n\n\n";
}
