const formatAnswers = require('./format-answers');
const shortid = require('shortid');

const BRANCH_REGEX = /\[branch ch(.*)\]/;
const STORY_REGEX = /\[ch(.*)\]/;
const type = 'jest';
const scope = 'testing';
const subject = 'this is a test subject';
const body =
  'This body is longer than 100 characters so itll get split into two pieces. Hopefully this doesnt cause problems with your linting';

describe('formatAnswers', () => {
  let branches = new Array(Math.floor(Math.random() * 6) + 1).fill(0);
  let stories = new Array(Math.floor(Math.random() * 6) + 1).fill(0);
  let mockAnswers;
  let commitmsg;

  beforeEach(() => {
    branches = branches.map(shortid.generate);
    stories = stories.map(shortid.generate);

    mockAnswers = {
      stories: stories.join(','),
      branchStories: branches.join(','),
      scope,
      subject,
      issues: '',
      type,
      body,
      breaking: '',
    };

    commitmsg = formatAnswers(mockAnswers);
  });

  describe('convention', () => {
    it('places the type at the start of the first line', () => {
      expect(commitmsg.slice(0, type.length)).toBe(type);
    });

    it('adds a scope between parentheses', () => {
      expect(commitmsg.slice(type.length, scope.length + 2 + type.length)).toBe(
        `(${scope})`
      );
    });

    it('places a : and a space after the scope', () => {
      const colonPosition = type.length + scope.length + 2;
      expect(commitmsg.slice(colonPosition, colonPosition + 2)).toBe(': ');
    });

    it('adds the subject after the scope a : and a space', () => {
      const startOfSubject = type.length + scope.length + 4;
      const endOfSubject = startOfSubject + subject.length;
      expect(commitmsg.slice(startOfSubject, endOfSubject)).toBe(`${subject}`);
    });

    it('places the body after a newline', () => {
      const pieces = commitmsg.split('\n');
      expect(pieces[1]).toBe('');
    });
  });

  describe('clubhouse', () => {
    it('correctly parses and appends the stories to link to the branch', () => {
      const branchmsgs = commitmsg
        .split('\n')
        .filter(s => s.match(BRANCH_REGEX));
      expect(branchmsgs.length).toBe(branches.length);
      branchmsgs.forEach((msg, i) =>
        expect(msg.match(BRANCH_REGEX)[1]).toBe(branches[i])
      );
    });

    it('correctly parses and appends the stories to link to the commit', () => {
      const storymsgs = commitmsg.split('\n').filter(s => s.match(STORY_REGEX));
      expect(storymsgs.length).toBe(stories.length);
      storymsgs.forEach((msg, i) =>
        expect(msg.match(STORY_REGEX)[1]).toBe(stories[i])
      );
    });
  });
});
