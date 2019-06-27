const chai = require('chai');
const spies = require('chai-spies');
const Enemy = require('../../src/js/entities/enemy');

chai.use(spies);
const expect = chai.expect;

describe('Enemy', () => {
  let enemy;

  beforeEach(() => {
    enemy = new Enemy();
    enemy.health = 500;
  });

  describe('onDeath event', () => {
    let spy;
    beforeEach(() => {
      spy = chai.spy((enemy) => enemy);
      enemy.on('onDeath', spy);
    });

    it('should return the killed enemy (himself)', () => {
      spy = chai.spy((e) => {
        expect(e).to.be.equal(enemy);
      });

      enemy.on('onDeath', spy);
      enemy.health = -600;
    });

    it('should fire \'onDeath\' event when hp < 0', () => {
      enemy.applyDamage(600);
      expect(spy).to.be.called();
    });

    it('should fire \'onDeath\' event when hp = 0', () => {
      enemy.applyDamage(500);
      expect(spy).to.be.called();
    });

    it('should fire \'onDeath\' event when hp set to <= 0', () => {
      enemy.health = 0;
      expect(spy).to.be.called();
    });
  });

  describe('kill()', () => {
    let spy;
    beforeEach(() => {
      spy = chai.spy(() => {});
      enemy.on('onDeath', spy);
    });

    it('should set hp to 0', () => {
      enemy.kill();
      expect(enemy.health).to.equal(0);
    });

    it('should fire \'onDeath\' event', () => {
      enemy.kill();
      expect(spy).to.be.called();
    });
  });

  describe('applyDamage()', () => {
    it('should remain 100hp of 500hp after the attack', () => {
      enemy.applyDamage(400);
      expect(enemy.health).to.be.equal(100);
    });
  });
});
