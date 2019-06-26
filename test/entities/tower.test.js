const chai = require('chai');
const spies = require('chai-spies');
const Tower = require('../../src/js/entities/tower');
const Enemy = require('../../src/js/entities/enemy');

chai.use(spies);
const expect = chai.expect;


describe('Tower', () => {
  let tower;
  let enemies;

  beforeEach(() => {
    tower = new Tower({
      position: {x: 5, y: 5},
      damage: 50,
    });

    enemies = [];

    enemies.push(new Enemy({
      health: 100,
      position: {x: 10, y: 10},
    },
    ), new Enemy({
      health: 100,
      position: {x: 100, y: 100},
    },
    ));
  });

  describe('attack()', () => {
    it('should attack closest enemy', () => {
      tower.attack(enemies);
      // enemies[0] - closest
      expect(enemies[0].health).to.be.equal(50);
    });
  });
});
