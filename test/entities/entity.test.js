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

  describe('appendChild', () => {
    let entity;
    let child;

    beforeEach(() => {
      entity = new Entity();
      child = new Entity();
      entity.appendChild(child);
    });

    it('should append new child', () => {
      expect(entity.childs.size).not.to.be.equal(0);
    });

    it('should delete child', () => {
      entity.removeChild(child);
      expect(entity.childs.size).to.be.equal(0);
    });
  });

  describe('getAbsolutePosition()', () => {
    let entity;

    beforeEach(() => {
      entity = new Entity({
        position: {x: 0, y: 0},
        size: {width: 30, height: 30},
      });
    });

    afterEach(() => {
      const position = entity.getAbsolutePosition();

      expect(position.x).to.be.equal(0);
      expect(position.y).to.be.equal(0);
    });

    it('should return top left corner position when ' +
       'not centered and without parent', () => {
      entity.centered = false;
    });

    it('should return top left corner position when ' +
    'centered and without parent', () => {
      entity.centered = true;
    });

    it('should return top left corner position when ' +
    'centered, relative without parent', () => {
      entity.centered = true;
      entity.relative = true;
    });

    it('should return top left corner position when ' +
    'centered, relative and with parent', () => {
      entity.centered = true;
      entity.relative = true;

      entity.position = {x: -15, y: -15};
      entity.parent = new Entity({position: {x: 15, y: 15}});
    });
  });
});
