const formatAnswers = require('./format-answers');
const shortid = require('shortid');
const wrap = require('word-wrap');

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
  let arbitrarySpacesJoin = `,${' '.repeat(Math.floor(Math.random() * 3))}`;
  let mockAnswers;
  let commitmsg;
  let buildMsg;

  beforeEach(() => {
    branches = branches.map(shortid.generate);
    stories = stories.map(shortid.generate);

    buildMsg = options => {
      mockAnswers = {
        stories: stories.join(arbitrarySpacesJoin),
        branchStories: branches.join(arbitrarySpacesJoin),
        scope,
        subject,
        issues: '',
        type,
        body,
        breaking: '',
      };

      Object.assign(mockAnswers, options);

      commitmsg = formatAnswers(mockAnswers);
      commitmsgPieces = commitmsg.split('\n');
    };
  });

  describe('simple message', () => {
    beforeEach(() => buildMsg());

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
      expect(commitmsgPieces[1]).toBe('');
    });

    it(`correctly wraps every line at 100 characters`, () => {
      commitmsgPieces.forEach(line => expect(line.length).toBeLessThan(101));
    });
  });

  describe('clubhouse', () => {
    describe('stories', () => {
      it('correctly parses and appends singular stories', () => {
        buildMsg({
          stories: '1234',
        });

        const storymsgs = commitmsgPieces.filter(s => s.match(STORY_REGEX));
        expect(storymsgs.length).toBe(1);
        expect(storymsgs[0].match(STORY_REGEX)[1]).toBe('1234');
      });

      it('correctly parses and appends comma seperated stories', () => {
        buildMsg({
          stories: '1234,5678',
        });

        const storymsgs = commitmsgPieces.filter(s => s.match(STORY_REGEX));
        expect(storymsgs.length).toBe(2);
        expect(storymsgs[0].match(STORY_REGEX)[1]).toBe('1234');
        expect(storymsgs[1].match(STORY_REGEX)[1]).toBe('5678');
      });

      it('correctly parses and appends comma and space seperated stories', () => {
        buildMsg({
          stories: '1234, 5678',
        });

        const storymsgs = commitmsgPieces.filter(s => s.match(STORY_REGEX));
        expect(storymsgs.length).toBe(2);
        expect(storymsgs[0].match(STORY_REGEX)[1]).toBe('1234');
        expect(storymsgs[1].match(STORY_REGEX)[1]).toBe('5678');
      });

      it('handles an arbitrary number of spaces and stories', () => {
        buildMsg();

        const storymsgs = commitmsgPieces.filter(s => s.match(STORY_REGEX));
        expect(storymsgs.length).toBe(stories.length);
        storymsgs.forEach((msg, i) =>
          expect(msg.match(STORY_REGEX)[1]).toBe(stories[i])
        );
      });
    });

    describe('branches', () => {
      it('correctly parses and appends singular branches', () => {
        buildMsg({
          branchStories: '1234',
        });

        const branchmsgs = commitmsgPieces.filter(s => s.match(BRANCH_REGEX));
        expect(branchmsgs.length).toBe(1);
        expect(branchmsgs[0].match(BRANCH_REGEX)[1]).toBe('1234');
      });

      it('correctly parses and appends comma seperated branches', () => {
        buildMsg({
          branchStories: '1234,5678',
        });

        const branchmsgs = commitmsgPieces.filter(s => s.match(BRANCH_REGEX));
        expect(branchmsgs.length).toBe(2);
        expect(branchmsgs[0].match(BRANCH_REGEX)[1]).toBe('1234');
        expect(branchmsgs[1].match(BRANCH_REGEX)[1]).toBe('5678');
      });

      it('correctly parses and appends comma and space seperated branches', () => {
        buildMsg({
          branchStories: '1234, 5678',
        });

        const branchmsgs = commitmsgPieces.filter(s => s.match(BRANCH_REGEX));
        expect(branchmsgs.length).toBe(2);
        expect(branchmsgs[0].match(BRANCH_REGEX)[1]).toBe('1234');
        expect(branchmsgs[1].match(BRANCH_REGEX)[1]).toBe('5678');
      });

      it('handles an arbitrary number of spaces and branches', () => {
        buildMsg();

        const branchmsgs = commitmsgPieces.filter(s => s.match(BRANCH_REGEX));
        expect(branchmsgs.length).toBe(branches.length);
        branchmsgs.forEach((msg, i) =>
          expect(msg.match(BRANCH_REGEX)[1]).toBe(branches[i])
        );
      });
    });
  });
});
