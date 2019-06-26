const chai = require('chai');
const spies = require('chai-spies');
const Entity = require('../../src/js/entities/entity');
const GameEvent = require('../../src/js/lib/events');

chai.use(spies);
const expect = chai.expect;

describe('Entity', () => {
  describe('on()', () => {
    let entity;
    let spy;

    beforeEach(() => {
      entity = new Entity();
      spy = chai.spy(() => {});
    });


    it('should notify Test Event subscribers', () => {
      entity._events.set('Test', new GameEvent('Test'));

      entity.on('Test', spy);
      entity._fireEvent('Test');

      expect(spy).to.has.been.called();
    });


    it('should throw error if callback is not function (e.g. array)', () => {
      expect(() => entity.on('Test', [])).to.throw();
    });


    it('should throw error if event does not exist', () => {
      expect(() => entity.on('THIS_EVENT_DOES_NOT_EXIST', [])).to.throw();
    });
  });
});
