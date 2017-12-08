const formatAnswers = require('./src/format-answers');
const questions = require('./src/questions');

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
    cz.prompt(questions).then(answers => commit(formatAnswers(answers)));
  },
};
