var messages = require('./messages');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var projects, currentProject;

  function run(callback) {
    callback = callback || function noop() {};

    function processInput(rawData) {
      var data = rawData.toString().trim();
      if (data === 'q') {
        return callback();
      } else if (!currentProject) {
        if (data === 'ls') {
          outputStream.write(messages.listingProjectHeader());
          if (projects && thereAreProjects(projects)) {
            projectNames(projects).forEach(function printProjectName(projectName) {
              outputStream.write("  " + projectName + "\n");
            });
            outputStream.write("\n");
            inputStream.once('data', processInput);
          } else {
            outputStream.write(messages.noProjectsExist());
            inputStream.once('data', processInput);
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
            inputStream.once('data', processInput);
          });
        } else if (data === 'd') {
          if (projects && thereAreProjects(projects)) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function deleteProject(rawData) {
              var projectName = rawData.toString().trim();
              if (projects[projectName]) {
                delete projects[projectName];
                outputStream.write(messages.deletingProject(projectName));
                inputStream.once('data', processInput);
              } else {
                outputStream.write(messages.projectDoesntExist(projectName));
                inputStream.once('data', processInput);
              }
            });
          } else {
            outputStream.write(messages.noProjectsExist());
            outputStream.write(messages.cantDeleteProject());
            inputStream.once('data', processInput);
          }
        } else if (data === 'e') {
          if (projects && thereAreProjects(projects)) {
            outputStream.write(messages.promptForProjectName());
            inputStream.once('data', function editProject(rawData) {
              var projectName = rawData.toString().trim();
              if (projects[projectName]) {
                outputStream.write(messages.editingProject(projectName));
                currentProject = projectName;
                outputStream.write(messages.taskMenu());
              } else {
                outputStream.write(messages.projectDoesntExist(projectName));
              }
              inputStream.once('data', processInput);
            });
          } else {
            outputStream.write(messages.noProjectsExist());
            outputStream.write(messages.cantDeleteProject());
            inputStream.once('data', processInput);
          }
        } else {
          outputStream.write(messages.unknownCommand(data));
          inputStream.once('data', processInput);
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
            currentProject = newName;
            inputStream.once('data', processInput);
          });
        } else if (data === 'a') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function addTask(rawData) {
            var taskName = rawData.toString().trim();
            projects[currentProject].push(taskName);
            outputStream.write(messages.createdTask(taskName));
            inputStream.once('data', processInput);
          });
        } else if (data === 'ls') {
          if (!projects[currentProject].length) {
            outputStream.write(messages.noTasksCreated(currentProject));
          } else {
            outputStream.write(messages.listingTasksHeader(currentProject));
            projects[currentProject].forEach(function printTaskName(taskName) {
              outputStream.write("  " + taskName + "\n");
            });
            outputStream.write("\n");
          }
          inputStream.once('data', processInput);
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
                inputStream.once('data', processInput);
              });
            } else {
              outputStream.write(messages.taskDoesntExist(oldName));
              inputStream.once('data', processInput);
            }
          });
        } else if (data === 'd') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function deleteTask(rawData) {
            var taskName = rawData.toString().trim();
            if (!projects[currentProject].length) {
              outputStream.write(messages.noTasksCreated(currentProject));
              inputStream.once('data', processInput);
            } else if (!taskExists(projects[currentProject], taskName)) {
              outputStream.write(messages.taskDoesntExist(taskName));
              inputStream.once('data', processInput);
            } else {
              removeTask(projects[currentProject], taskName);
              outputStream.write(messages.deletedTask(taskName));
              inputStream.once('data', processInput);
            }
          });
        } else if (data === 'f') {
          outputStream.write(messages.promptForTaskName());
          inputStream.once('data', function finishTask(rawData) {
            var task = rawData.toString().trim();
            if (!taskExists(projects[currentProject], task)) {
              outputStream.write(messages.taskNotFound(task));
              inputStream.once('data', processInput);
            } else {
              removeTask(projects[currentProject], task);
              outputStream.write(messages.finishedTask(task));
              inputStream.once('data', processInput);
            }
          });
        } else if (data === 'b') {
          currentProject = undefined;
          inputStream.once('data', processInput);
        } else {
          outputStream.write(messages.unknownCommand(data));
          inputStream.once('data', processInput);
        }
      }
    }

    outputStream.write(messages.projectMenu());
    inputStream.once('data', processInput);
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

  return {
    run: run
  };
};


