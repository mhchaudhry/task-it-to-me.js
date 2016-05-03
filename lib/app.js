var messages = require('./messages');

module.exports = function(outputStream, inputStream) {
  inputStream.resume();

  var projects, currentProject;

  function run(callback) {
    callback = callback || function noop() {};

    function nextCommand() {
      inputStream.once('data', processInput);
    }

    function listProjects() {
      if (thereAreProjects(projects)) {
        projectNames(projects).forEach(function printProjectName(projectName) {
            outputStream.write("  " + projectName + "\n");
            });
        outputStream.write("\n");
        nextCommand();
      } else {
        outputStream.write(messages.noProjectsCreated());
        nextCommand();
      }
    } 

    function processInput(rawData) {
      var data = rawData.toString().trim();
      if (data === 'q') {
        return callback();
      } else if (!currentProject) {
        if (data === 'ls') {
          outputStream.write(messages.listProjectsHeader());
          if (projects) {
            listProjects();
          } else {
            outputStream.write(messages.noProjectsCreated());
            nextCommand();
          }
        } else if (data === 'a') {
          outputStream.write("\x1b[0;3mEnter a project name:\x1b[0m");
          inputStream.once('data', function createProject(rawData) {
            var projectName = rawData.toString().trim();
            if (!projects) {
              projects = {};
            }
            projects[projectName] = [];
            outputStream.write("\x1b[38;5;40mCreated project:\x1b[0m '" + projectName + "'\n\n");
            nextCommand();
          });
        } else if (data === 'd') {
          if (!projects) {
            outputStream.write(messages.noProjectsCreated());
            outputStream.write("\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n");
            nextCommand();
          } else {
            if (thereAreProjects(projects)) {
              outputStream.write("\x1b[0;3mEnter a project name: \x1b[0m");
              inputStream.once('data', function deleteProject(rawData) {
                var projectName = rawData.toString().trim();
                if (projects[projectName]) {
                  delete projects[projectName];
                  outputStream.write("\x1b[38;5;40mDeleting project:\x1b[0m '" + projectName + "'\n\n");
                  nextCommand();
                } else {
                  outputStream.write("\x1b[40;38;5;214mProject doesn't exist: '" + projectName + "'\x1b[0m\n\n");
                  nextCommand();
                }
              });
            } else {
              outputStream.write(messages.noProjectsCreated());
              outputStream.write("\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n");
              nextCommand();
            }
          }
        } else if (data === 'e') {
          if (projects) {
            if (thereAreProjects(projects)) {
              outputStream.write("\x1b[0;3mEnter a project name: \x1b[0m");
              inputStream.once('data', function editProject(rawData) {
                var projectName = rawData.toString().trim();
                if (projects[projectName]) {
                  outputStream.write("\x1b[38;5;40mEditing project:\x1b[0m '" + projectName + "'\n\n");
                  currentProject = projectName;
                  outputStream.write(
                    "\x1b[0mTASKS MENU\n" +
                    "\x1b[0;37m-----------------------------\n" +
                    "\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n" +
                    "\x1b[1;37mc   \x1b[0;35mChange the project name\n" +
                    "\x1b[1;37ma   \x1b[0;35mAdd a new task\n" +
                    "\x1b[1;37mls  \x1b[0;35mList all tasks\n" +
                    "\x1b[1;37md   \x1b[0;35mDelete a task\n" +
                    "\x1b[1;37me   \x1b[0;35mEdit a task\n" +
                    "\x1b[1;37mf   \x1b[0;35mFinish a task\n" +
                    "\x1b[1;37mb   \x1b[0;35mBack to Projects menu\x1b[0m\n\n\n"
                  );
                } else {
                  outputStream.write("\x1b[40;38;5;214mProject doesn't exist: '" + projectName + "'\x1b[0m\n\n");
                }
                nextCommand();
              });
            } else {
              outputStream.write(messages.noProjectsCreated());
              outputStream.write("\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n");
              nextCommand();
            }
          } else {
            outputStream.write(messages.noProjectsCreated());
            outputStream.write("\x1b[40;38;5;214mCan't delete a project\x1b[0m\n\n");
            nextCommand();
          }
        } else {
          outputStream.write("\x1b[40;38;5;214mUnknown command: '" + data + "'");
          nextCommand();
        }
      } else {
        if (data === 'c') {
          outputStream.write("\x1b[0;35mEnter new project name:\x1b[0m");
          inputStream.once('data', function changeProjectName(rawData) {
            var newName = rawData.toString().trim();
            var tasks = projects[currentProject];
            delete projects[currentProject];
            projects[newName] = tasks;
            outputStream.write("\x1b[0;35mChanged project name from\x1b[0m '" + currentProject + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m");
            currentProject = newName;
            nextCommand();
          });
        } else if (data === 'a') {
          outputStream.write("\x1b[0;35mEnter a task name:\x1b[0m");
          inputStream.once('data', function addTask(rawData) {
            var taskName = rawData.toString().trim();
            projects[currentProject].push(taskName);
            outputStream.write("\x1b[0;35mCreated task: '" + taskName + "'\n\x1b[0m");
            nextCommand();
          });
        } else if (data === 'ls') {
          if (!projects[currentProject].length) {
            outputStream.write("\x1b[40;38;5;214mNo tasks created in '" + currentProject + "'\x1b[0m\n\n");
          } else {
            outputStream.write("\x1b[38;5;40mListing tasks in " + currentProject + ":\x1b[0m\n");
            projects[currentProject].forEach(function printTaskName(taskName) {
              outputStream.write("  " + taskName + "\n");
            });
            outputStream.write("\n");
          }
          nextCommand();
        } else if (data === 'e') {
          inputStream.once('data', function editTaskName(rawData) {
            var oldName = rawData.toString().trim();
            var index = projects[currentProject].indexOf(oldName);
            if (index >= 0) {
              inputStream.once('data', function changeTaskName(rawData) {
                var newName = rawData.toString().trim();
                projects[currentProject][index] = newName;
                outputStream.write("\x1b[0;35mChanged task name from\x1b[0m '" + oldName + "' \x1b[38;5;40mto\x1b[0m '" + newName + "'\n\n\x1b[0m");
                nextCommand();
              });
            } else {
              outputStream.write("\x1b[40;38;5;214mTask doesn't exist: '" + oldName + "'\x1b[0m\n\n");
              nextCommand();
            }
          });
        } else if (data === 'd') {
          inputStream.once('data', function deleteTask(rawData) {
            var taskName = rawData.toString().trim();
            if (!projects[currentProject].length) {
              outputStream.write("\x1b[40;38;5;214mNo tasks created in '" + currentProject + "'\x1b[0m\n\n");
              nextCommand();
            } else if (!taskExists(projects[currentProject], taskName)) {
              outputStream.write("\x1b[40;38;5;214mTask doesn't exist: '" + taskName + "'\x1b[0m\n\n");
              nextCommand();
            } else {
              removeTask(projects[currentProject], taskName);
              outputStream.write("\x1b[38;5;40mDeleted task:\x1b[0m '" + taskName + "'\n\n");
              nextCommand();
            }
          });
        } else if (data === 'f') {
          inputStream.once('data', function finishTask(rawData) {
            var task = rawData.toString().trim();
            if (!taskExists(projects[currentProject], task)) {
              outputStream.write("\x1b[40;38;5;214mTask not found: '" + task + "'\x1b[0m\n\n");
              nextCommand();
            } else {
              removeTask(projects[currentProject], task);
              outputStream.write("\x1b[38;5;40mFinished task:\x1b[0m '" + task + "'!\n\n");
              nextCommand();
            }
          });
        } else if (data === 'b') {
          currentProject = undefined;
          nextCommand();
        } else {
          outputStream.write("\x1b[40;38;5;214mUnknown command: '" + data + "'");
          nextCommand();
        }
      }
    }

    outputStream.write(
      "\x1b[38;5;40mWelcome to Taskitome!\n" +
      "\x1b[0;37m=============================\n\n" +
      "\x1b[0mPROJECTS MENU\n" +
      "\x1b[0;37m-----------------------------\n" +
      "\x1b[40;38;5;214mENTER A COMMAND:\x1b[0m\n" +
      "\x1b[1;37ma   \x1b[0;35mAdd a new project\n" +
      "\x1b[1;37mls  \x1b[0;35mList all project\n" +
      "\x1b[1;37md   \x1b[0;35mDelete a project\n" +
      "\x1b[1;37me   \x1b[0;35mEdit a project\n" +
      "\x1b[1;37mq   \x1b[0;35mQuit the app\x1b[0m\n\n\n"
    );

    nextCommand();
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


