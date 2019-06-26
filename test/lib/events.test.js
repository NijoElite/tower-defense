const mocha = require('mocha');
const chai = require('chai');
const spies = require('chai-spies');
const GameEvent = require('../../src/js/lib/events');


chai.use(spies);

const expect = chai.expect;


describe('GameEvent', () => {
  let event;
  let expectedFn;
  
  beforeEach(() => {
    event = new GameEvent('ExpectedName');
    expectedFn = () => {};
  });

  describe('add()', () => {
    it('should add function to subscribers', () => {
      event.add(expectedFn);

      expect(event.contains(expectedFn)).to.be.true;
    });
  });

  describe('remove()', () => {
    it('should remove function from subscribers', () => {
      event.add(expectedFn);
      event.remove(expectedFn);

      expect(event.contains(expectedFn)).to.be.false;
    });

    it('should do nothing if event does not contain that function in subscribers', () => {
      event.add(expectedFn);
      event.remove(() => {});

      const containsExpected = event.contains(expectedFn);

      expect(containsExpected).to.be.true;
    });
  });

  describe('removeAll()', () => {
    it('should remove all functions from subscribers', () => {
      const event = new GameEvent('ExpectedName');
      const fnArray = [];
      const fnCount = 150;

      for (let i = 0; i < fnCount; i++) {
        const fn = () => {};
        fnArray.push(fn);
        event.add(fn);
      }

      event.removeAll();

      for (let i = 0; i < fnCount; i++) {
        expect(event.contains(fnArray[i])).to.be.false;
      };
    });
  });

  describe('notifyAll()', () => {
    it('should notify all subscribers', () => {
      const event = new GameEvent('ExpectedName');
      const expectedFn = () => {};

      const spy = chai.spy(expectedFn);

      event.add(spy);
      event.notifyAll();

      expect(spy).has.be.called();
    });
  });
});
