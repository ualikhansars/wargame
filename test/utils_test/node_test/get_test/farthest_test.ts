import { assert } from 'chai';
import {
  getFarthestNodeFromEnemy,
  getFarthestXNodes
} from '../../../../src/utils/node/get';
import { createUnit } from '../../../../src/unit/create';
import { removeAllUnits } from '../../../../src/store/unit/units';
import { removeUnit } from '../../../../src/unit/remove';
import Unit from '../../../../src/unit/types/Unit';

describe('NodeUtils: get: farthest nodes test', () => {
  let enemy: Unit;
  let nodes: any[];
  before(() => {
    enemy = createUnit('lightInfantry', 80, 40, 'player');

    nodes = [
      {x: 80, y: 80},
      {x: 240, y: 120},
      {x: 400, y: 500},
      {x: 400, y: 0},
      {x: 180, y: 300},
      {x: 0, y: 200}
    ];
    removeAllUnits();
  });

  after(() => {
    removeUnit(enemy);
  });

  describe('getFarthestNodeFromEnemy', () => {
    it('fathestNode should be {x: 400, y: 120}', () => {
        let node = getFarthestNodeFromEnemy(enemy, nodes);
        assert.equal(node.x, 400);
        assert.equal(node.y, 500);
    });
  });

  describe('getFarthestXNodes', () => {
    it('farthestXNodes are {x: 400, y: 500},{x: 400, y: 0} and {x: 0, y: 200}', () => {
      let farthestXNodes:any[] = getFarthestXNodes(nodes);
      let pass:boolean = true;
      for(let node of farthestXNodes) {
        if((node.x === 400 || node.x === 0) && (node.y === 500 || node.y === 0 || node.y === 200)) {
          // pass
        } else {
          pass = false;
        }
      }
      assert.equal(pass, true);
    });
  });
});
