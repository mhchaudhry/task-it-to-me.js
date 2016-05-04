var Stream = require('stream');

var test        = require('tape');
var tapeMethods = require(__dirname + '/support/tape_extensions');
test.Test.prototype.match    = tapeMethods.match;
test.Test.prototype.notMatch = tapeMethods.notMatch;

var TestStreams  = require(__dirname + '/support/test_streams');
var App          = require(__dirname + '/../lib/app');

var testStreams, app;

function setup() {
  testStreams = new TestStreams();
  app = new App(testStreams.outputStream, testStreams.inputStream);
}

function includesProjectMenu(test, output) {
  test.match(output, "a   Add a new project");
  test.match(output, "ls  List all project");
  test.match(output, "d   Delete a project");
  test.match(output, "e   Edit a project");
  test.match(output, "q   Quit the app");
}

function includesTaskMenu(test, output) {
  test.match(output, 'c   Change the project name');
  test.match(output, 'a   Add a new task');
  test.match(output, 'ls  List all tasks');
  test.match(output, 'd   Delete a task');
  test.match(output, 'e   Edit a task');
  test.match(output, 'f   Finish a task');
  test.match(output, 'b   Back to Projects menu');
}

function splitOutput(substring) {
  return testStreams.plainOutput().split(substring);
}

test('application displays a menus and quits on q', function(test) {
  setup();
  test.plan(6);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Welcome to Taskitome!");
    includesProjectMenu(test, testStreams.plainOutput());
  });

  testStreams.mockInput(['q']);
});

test('failure message when listing project and there are no projects', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "No projects created");
  });

  testStreams.mockInput(['ls', 'q']);
});

test('adding projects works', function(test) {
  setup();
  test.plan(2);

  app.run(function() {
    test.match(testStreams.plainOutput(), 'Enter a project name');
    test.match(testStreams.plainOutput(), "Created project: 'Cat Husbandry'");
  });

  testStreams.mockInput(['a', 'Cat Husbandry', 'q']);
});

test('listing projects' , function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    // NOTE: this is a pretty brittle test :(
    test.match(testStreams.plainOutput(), "Listing projects: \n  Cat Servitude\n  House work");
  });

  testStreams.mockInput(['a', 'Cat Servitude', 'a', 'House work', 'ls', 'q']);
});

test('deleting projects when no projects', function(test) {
  setup();
  test.plan(2);

  app.run(function() {
    test.match(testStreams.plainOutput(), 'No projects created');
    test.match(testStreams.plainOutput(), "Can't delete a project");
  });

  testStreams.mockInput(['d', 'q']);
});

test('deleting projects when there is a project', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Deleting project: 'House work'");
  });

  testStreams.mockInput(['a', 'House work', 'd', 'House work', 'ls', 'q']);
});

test('deleting a project that does not exist', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Project doesn't exist: 'House Work'");
  });

  testStreams.mockInput(['a', 'House work', 'd', 'House Work', 'q']);
});

test('project menu displayed after project commands', function(test) {
  setup();
  test.plan(16);

  app.run(function() {
    var parts = splitOutput("PROJECTS MENU");
    var numberOfMenus = parts.length - 1;

    test.equal(numberOfMenus, 3);

    includesProjectMenu(test, parts[1]);
    includesProjectMenu(test, parts[2]);
    includesProjectMenu(test, parts[3]);
  });

  testStreams.mockInput(['a', 'House work', 'ls', 'q']);
});

test('editing a project that does not exist', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Project doesn't exist: 'House Work'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House Work', 'q']);
});

test('editing a project shows tasks menu', function(test) {
  setup();
  test.plan(7);

  app.run(function() {
    includesTaskMenu(test, testStreams.plainOutput());
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'q']);
});

test('changing a project name', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Changed project name from 'House work' to 'Chores'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'c', 'Chores', 'q']);
});

test('adding a task', function(test) {
  setup();
  test.plan(2);

  app.run(function() {
    test.match(testStreams.plainOutput(), 'Enter a task name');
    test.match(testStreams.plainOutput(), "Created task: 'clean out the freezer'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'q']);
});


test('listing tasks when no tasks exists', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "No tasks created in 'House work'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'ls', 'q']);
});

test('listing tasks when tasks exist', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    var parts = testStreams.plainOutput().split("Created task: 'clean out the freezer'");
    test.match(parts[1], 'clean out the freezer');
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'ls', 'q']);
});

test('editing a task that does not exist', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Task doesn't exist: 'clean out the freezer'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'e', 'clean out the freezer', 'q']);
});

test('editing a task that does exist', function(test) {
  setup();
  test.plan(2);

  app.run(function() {
    var lastOutput = testStreams.plainOutput().split('Listing tasks')[1];
    test.notMatch(lastOutput, 'clean out the freezer');
    test.match(lastOutput, 'clean out fridge');
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'e', 'clean out the freezer', 'clean out fridge', 'ls', 'q']);
});

test('deleting a task when tasks are empty', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "No tasks created in 'House work'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'd', 'clean out the freezer', 'q']);
});

test('deleting a task that does not exist exists', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Task doesn't exist: 'eat defrosting food'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'd', 'eat defrosting food', 'q']);
});

test('deleting a task that exists', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Deleted task: 'clean out the freezer'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'd', 'clean out the freezer', 'ls', 'q']);
});

test('finishing a task when tasks are empty', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Task not found: 'clean out the freezer'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'f', 'clean out the freezer', 'q']);
});

test('finishing a task that does not exist exists', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Task not found: 'eat defrosting food'");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'f', 'eat defrosting food', 'q']);
});

test('finishing a task that exists', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Finished task: 'clean out the freezer'!");
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'clean out the freezer', 'f', 'clean out the freezer', 'ls', 'q']);
});

test('going back to the projects menu', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    var numberOfTimesProjectsListed = testStreams.plainOutput().split('Listing projects').length - 1;
    test.equal(numberOfTimesProjectsListed, 1);
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'b', 'ls', 'q']);
});

test('task menu displayed after each task commands', function(test) {
  setup();
  test.plan(22);

  app.run(function() {
    var parts = splitOutput("TASKS MENU");
    var numberOfMenus = parts.length - 1;

    test.equal(numberOfMenus, 3);

    includesTaskMenu(test, parts[1]);
    includesTaskMenu(test, parts[2]);
    includesTaskMenu(test, parts[3]);
  });

  testStreams.mockInput(['a', 'House work', 'e', 'House work', 'a', 'feed the dog', 'ls', 'q']);
});

test('bug: app hangs at unknown command', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Unknown command: 'jj'");
  });

  testStreams.mockInput(['jj', 'q']);
});

test('bug: app hangs at unknown command inside the tasks menu', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    test.match(testStreams.plainOutput(), "Unknown command: 'jj'");
  });

  testStreams.mockInput(['a', 'Chores', 'e', 'Chores', 'jj', 'q']);
});

test('bug: editing a task does not use task name prompts', function(test) {
  setup();
  test.plan(2);

  app.run(function() {
    numberOfTaskPrompts = testStreams.plainOutput().split("Enter a task name:").length - 1;
    test.equal(numberOfTaskPrompts, 2);
    test.match(testStreams.plainOutput(), "Enter a new task name:");
  });

  testStreams.mockInput(['a', 'Chores', 'e', 'Chores', 'a', 'new task', 'e', 'new task', 'newer task', 'q']);
});

test('bug: finishing a task does not use task name prompt', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    numberOfTaskPrompts = testStreams.plainOutput().split("Enter a task name:").length - 1;
    test.equal(numberOfTaskPrompts, 2);
  });

  testStreams.mockInput(['a', 'Chores', 'e', 'Chores', 'a', 'new task', 'f', 'new task', 'q']);
});

test('bug: deleting a task does not use task name prompt', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    numberOfTaskPrompts = testStreams.plainOutput().split("Enter a task name:").length - 1;
    test.equal(numberOfTaskPrompts, 2);
  });

  testStreams.mockInput(['a', 'Chores', 'e', 'Chores', 'a', 'new task', 'd', 'new task', 'q']);
});

test('bug: creating duplicate tasks', function(test) {
  setup();
  test.plan(1);

  app.run(function() {
    var lsOutput = testStreams.plainOutput().split("Listing tasks in")[1];
    var numTasks = lsOutput.split('buymilk').length - 1;
    test.equal(numTasks, 1);
  });

  testStreams.mockInput(['a', 'Project', 'e', 'Project', 'a', 'buymilk', 'a', 'buymilk', 'ls', 'q']);
});

