const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const types = require('conventional-commit-types').types;

function formatTypes(types) {
  const length = longest(Object.keys(types)).length + 1;
  return (choices = map(types, function(type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key,
    };
  }));
}

module.exports = [
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
    name: 'isClubhouseStory',
    message: `Link this commit to Clubhouse`,
    default: false,
  },
  {
    type: 'input',
    name: 'stories',
    message: `What story id(s)? (comma seperated)`,
    when: answers => answers.isClubhouseStory,
  },
  {
    type: 'confirm',
    name: 'isClubhouseBranch',
    message: `Link this branch to Clubhouse`,
    default: false,
  },
  {
    type: 'input',
    name: 'branchStories',
    message: `What story id(s)?(comma seperated)`,
    when: answers => answers.isClubhouseBranch,
  },
];
