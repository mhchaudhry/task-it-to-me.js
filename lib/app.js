var messages = require('./messages');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var currentProject = undefined;
  var projects = {};

  function projectInEditMode() {
    return !!currentProject;
  }

  function enterProject(projectName) {
    currentProject = projectName;
  }

  function exitProject() {
    currentProject = undefined;
  }

  function projectNames(projects) {
    return Object.keys(projects);
  }

  function thereAreProjects(projects) {
    return !!projectNames(projects).length;
  }

  function taskLocation(currentProject, taskName) {
    return currentProject.indexOf(taskName);
  }

  function taskExists(currentProject, taskName) {
    return taskLocation(currentProject, taskName) >= 0;
  }

  function removeTask(currentProject, taskName) {
    currentProject.splice(taskLocation(currentProject, taskName), 1);
  }


  function run(callback) {
    callback = callback || function noop() {};

    function nextCommand() {
      outputStream.write(menu());
      inputStream.once('data', processInput);
    }

    function menu() {
      var menu;
      if (projectInEditMode()) {
        menu = messages.taskMenu();
      } else {
        menu = messages.projectMenu();
      }
      return menu;
    }

    function processInput(rawData) {
      var data = rawData.toString().trim();
      if (data === 'q') {
        return callback();
      } else if (!projectInEditMode()) {
        if (data === 'ls') {
          if (projects && thereAreProjects(projects)) {
            outputStream.write(messages.listProjects(projectNames(projects)));
            nextCommand();
          } else {
            outputStream.write(messages.listingProjectHeader());
            outputStream.write(messages.noProjectsExist());
            nextCommand();
          }
        } else if (data === 'a') {
          outputStream.write(messages.promptForProjectName());
          inputStream.once('data', function createProject(rawData) {
            var projectName = rawData.toString().trim();
            if (!projects) {
              projects = {};
            }
            projects[projectName] = [];

            outputStream.write(messages.createdProject(projectName));
            nextCommand();
          });
        } else if (data === 'd') {
          if (projects && thereAreProjects(projects)) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function deleteProject(rawData) {
              var projectName = rawData.toString().trim();
              if (projects[projectName]) {
                delete projects[projectName];
                outputStream.write(messages.deletingProject(projectName));
                nextCommand();
              } else {
                outputStream.write(messages.projectDoesntExist(projectName));
                nextCommand();
              }
            });
          } else {
            outputStream.write(messages.noProjectsExist());
            outputStream.write(messages.cantDeleteProject());
            nextCommand();
          }
        } else if (data === 'e') {
          if (projects && thereAreProjects(projects)) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function editProject(rawData) {
              var projectName = rawData.toString().trim();
              if (projects[projectName]) {
                outputStream.write(messages.editingProject(projectName));
                enterProject(projectName);
              } else {
                outputStream.write(messages.projectDoesntExist(projectName));
              }
              nextCommand();
            });
          } else {
            outputStream.write(messages.noProjectsExist());
            outputStream.write(messages.cantDeleteProject());
            nextCommand();
          }
        } else {
          outputStream.write(messages.unknownCommand(data));
          nextCommand();
        }
      } else {
        if (data === 'c') {
          outputStream.write(messages.promptForNewProjectName());
          inputStream.once('data', function changeProjectName(rawData) {
            var newName = rawData.toString().trim();
            var tasks = projects[currentProject];
            delete projects[currentProject];
            projects[newName] = tasks;
            outputStream.write(messages.changedProjectName(currentProject, newName));
            enterProject(newName);
            nextCommand();
          });
        } else if (data === 'a') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function addTask(rawData) {
            var taskName = rawData.toString().trim();
            if ( projects[currentProject].indexOf(taskName) >= 0 ) {
              outputStream.write(messages.taskAlreadyExists(taskName));
            } else {
              projects[currentProject].push(taskName);
              outputStream.write(messages.createdTask(taskName));
            }
            nextCommand();
          });
        } else if (data === 'ls') {
          if (!projects[currentProject].length) {
            outputStream.write(messages.noTasksCreated(currentProject));
          } else {
            outputStream.write(messages.listTasks(currentProject, projects[currentProject]));
          }
          nextCommand();
        } else if (data === 'e') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function editTaskName(rawData) {
            var oldName = rawData.toString().trim();
            if (taskExists(projects[currentProject], oldName)) {
              outputStream.write(messages.promptForNewTaskName());
              inputStream.once('data', function changeTaskName(rawData) {
                var newName = rawData.toString().trim();
                var index = taskLocation(projects[currentProject], oldName);
                projects[currentProject][index] = newName;
                outputStream.write(messages.changedTaskName(oldName, newName));
                nextCommand();
              });
            } else {
              outputStream.write(messages.taskDoesntExist(oldName));
              nextCommand();
            }
          });
        } else if (data === 'd') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function deleteTask(rawData) {
            var taskName = rawData.toString().trim();
            if (!projects[currentProject].length) {
              outputStream.write(messages.noTasksCreated(currentProject));
              nextCommand();
            } else if (!taskExists(projects[currentProject], taskName)) {
              outputStream.write(messages.taskDoesntExist(taskName));
              nextCommand();
            } else {
              removeTask(projects[currentProject], taskName);
              outputStream.write(messages.deletedTask(taskName));
              nextCommand();
            }
          });
        } else if (data === 'f') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function finishTask(rawData) {
            var task = rawData.toString().trim();
            if (!taskExists(projects[currentProject], task)) {
              outputStream.write(messages.taskNotFound(task));
              nextCommand();
            } else {
              removeTask(projects[currentProject], task);
              outputStream.write(messages.finishedTask(task));
              nextCommand();
            }
          });
        } else if (data === 'b') {
          exitProject();
          inputStream.once('data', processInput);
        } else {
          outputStream.write(messages.unknownCommand(data));
          nextCommand();
        }
      }
    }

    nextCommand();
  }

  return {
    run: run
  };
};


