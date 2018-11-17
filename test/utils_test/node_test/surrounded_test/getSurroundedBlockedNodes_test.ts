import {assert} from 'chai';
import {getSurroundedBlockedNodes} from '../../../../src/utils/node/surrounded';
import {createUnit} from '../../../../src/unit/create';
import {removeAllUnits} from '../../../../src/store/unit/units';
import {removeUnit} from '../../../../src/unit/remove';
import Unit from '../../../../src/unit/types/Unit';
import { getNodeFromMap } from '../../../../src/utils';

describe('NodeUtils: surrounded test', () => {

  describe('getSurroundedBlockedNodes test', () => {

    before(() => {
      removeAllUnits();
    });

    // create units
    const unit:Unit = createUnit('scouts', 320, 120, 'computer');
    const alliedUnit1:Unit = createUnit('scouts', 320, 80, 'computer');
    const alliedUnit2:Unit = createUnit('scouts', 280, 80, 'computer');

    let node = getNodeFromMap(280, 120);
    alliedUnit2.setNextNode(node);

    // remove units
    after(() => {
      removeUnit(unit);
      removeUnit(alliedUnit1);
      removeUnit(alliedUnit2);
    });

    it('Nodes {x: 320, y:80}, {x: 280, y: 80} and {x:280, y: 120} should be blocked', () => {
      const blockedNodes:any[] = getSurroundedBlockedNodes(unit);
      let pass:boolean = true;
      for(let node of blockedNodes) {
        if(!pass) break; // test not passed, abort loop
        if(node.x === 320 && node.y === 80) { /* pass */ }
        else if(node.x === 280 && node.y === 80) { /* pass */ }
        else if(node.x === 280 && node.y === 120) { /* pass */ }
        else {
          /* not passed */
          pass = false;
        }
      }

      assert.equal(pass, true);
    });
  });
});
