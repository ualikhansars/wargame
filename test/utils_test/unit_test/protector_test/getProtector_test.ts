import {assert} from 'chai';
import {createUnit} from '../../../../src/unit/create';
import {
  getProtector
} from '../../../../src/utils/unit/protector';
import {
  removeUnit,
  removeAllUnits
} from '../../../../src/store/unit/units';
import Unit from '../../../../src/unit/types/Unit';

describe('unitProtectorUtils test', () => {

  describe('getProtector test', () => {
    let currentUnit:Unit, unit1:Unit, unit2:Unit, unit3:Unit, unit4:Unit;
    let units:Unit[] = [];

    before(() => {
      removeAllUnits();
      currentUnit = createUnit('Militia', 440, 160, 5, 'computer');
      unit1 = createUnit('HeavyInfantry', 400, 160, 5, 'computer');
      unit2 = createUnit('HeavyCavalry', 480, 200, 5, 'computer');
      unit3 = createUnit('Pikemen', 360, 120, 5, 'computer');
      unit4 = createUnit('Scouts', 440, 240, 5, 'computer');

      // assign unit3 to protect current unit
      unit3.assignUnitToProtect(currentUnit);

    });

    // remove units after test completed
    after(() => {
      removeUnit(currentUnit);
      removeUnit(unit1);
      removeUnit(unit2);
      removeUnit(unit3);
      removeUnit(unit4);
    });

    it('unit3 should protect current unit', () => {
      const protector:Unit = getProtector(currentUnit);

      assert.notEqual(protector.id, currentUnit.id);
      assert.notEqual(protector.id, unit1.id);
      assert.notEqual(protector.id, unit2.id);
      assert.equal(protector.id, unit3.id);
      assert.notEqual(protector.id, unit4.id);
    });
  });
});