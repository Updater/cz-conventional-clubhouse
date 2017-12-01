const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const types = require('conventional-commit-types').types;
const formatAnswers = require('./src/format-answers');

function formatTypes(types) {
  const length = longest(Object.keys(types)).length + 1;
  return (choices = map(types, function(type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key,
    };
  }));
}

module.exports = {
  // When a user runs `git cz`, prompter will
  // be executed. We pass you cz, which currently
  // is just an instance of inquirer.js. Using
  // this you can ask questions and get answers.
  //
  // The commit callback should be executed when
  // you're ready to send back a commit template
  // to git.
  prompter: function(cz, commit) {
    console.log(
      '\nLine 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.\n'
    );

    cz
      .prompt([
        {
          type: 'list',
          name: 'type',
          message: "Select the type of change that you're committing:",
          choices: formatTypes(types),
        },
        {
          type: 'input',
          name: 'scope',
          message: 'What is the scope of this change? (press enter to skip)',
        },
        {
          type: 'input',
          name: 'subject',
          message: 'Write a short, imperative tense description of the change:',
        },
        {
          type: 'input',
          name: 'body',
          message:
            'Provide a longer description of the change: (press enter to skip)\n',
        },
        {
          type: 'confirm',
          name: 'isBreaking',
          message: 'Are there any breaking changes?',
          default: false,
        },
        {
          type: 'input',
          name: 'breaking',
          message: 'Describe the breaking changes:\n',
          when: answers => answers.isBreaking,
        },
        {
          type: 'confirm',
          name: 'isIssueAffected',
          message: 'Does this change affect any open Github issues?',
          default: false,
        },
        {
          type: 'input',
          name: 'issues',
          message: 'Add issue references (e.g. "fix #123", "re #123".):',
          when: answers => answers.isIssueAffected,
        },
        {
          type: 'confirm',
          name: 'isClubhouseBranch',
          message: `Would you like to link this branch to any Clubhouse.io stories not already linked?`,
          default: false,
        },
        {
          type: 'input',
          name: 'branchStories',
          message: `What stories?(comma seperated)`,
          when: answers => answers.isClubhouseBranch,
        },
        {
          type: 'confirm',
          name: 'isClubhouseStory',
          message: `Would you like to directly reference any Clubhouse.io stories that aren't already linked via the branch?`,
          default: false,
        },
        {
          type: 'input',
          name: 'stories',
          message: `What stories?(comma seperated)`,
          when: answers => answers.isClubhouseStory,
        },
      ])
      .then(() => commit(formatAnswers));
  },
};
