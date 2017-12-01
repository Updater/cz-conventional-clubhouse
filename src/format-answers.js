const wrap = require('word-wrap');
const STORY_REGEX = /[,]/;

function filter(array) {
  return array.filter(function(x) {
    return x;
  });
}

function formatStory(story) {
  return `[ch${story}]`;
}

function formatBranchStory(story) {
  return `[branch ch${story}]`;
}

module.exports = function(answers) {
  var maxLineWidth = 100;

  var wrapOptions = {
    trim: true,
    newline: '\n',
    indent: '',
    width: maxLineWidth,
  };

  // parentheses are only needed when a scope is present
  let scope = answers.scope.trim();
  scope = scope ? '(' + answers.scope.trim() + ')' : '';

  const headline = answers.type + scope + ': ' + answers.subject.trim();

  const head = headline.slice(0, maxLineWidth);

  const remainingHeadline = headline.slice(maxLineWidth, -1);

  const body = wrap(
    remainingHeadline.length > 0
      ? `...${remainingHeadline}\n${answers.body}`
      : answers.body,
    wrapOptions
  );

  // Apply breaking change prefix, removing it if already present
  let breaking = answers.breaking ? answers.breaking.trim() : '';
  breaking = breaking
    ? 'BREAKING CHANGE: ' + breaking.replace(/^BREAKING CHANGE: /, '')
    : '';
  breaking = wrap(breaking, wrapOptions);

  const issues = answers.issues ? wrap(answers.issues, wrapOptions) : '';

  const stories = answers.stories
    ? answers.stories
        .split(STORY_REGEX)
        .map(formatStory)
        .join('\n')
    : '';
  const branchStories = answers.branchStories
    ? answers.branchStories
        .split(STORY_REGEX)
        .map(formatBranchStory)
        .join('\n')
    : '';

  const footer = filter([branchStories, stories, breaking, issues]).join(
    '\n\n'
  );

  return `${head}\n\n${body}\n\n${footer}`;
};
