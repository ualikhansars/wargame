import { expect, should, assert} from 'chai';
import {
  playerPower,
  computerPower,
  calculateTotalPlayerPower,
  calculateTotalComputerPower
} from '../src/AI/analyzeModule/powerAnalyze';

import {
  addUnitIntoVisibleArray,
  computersUnits
} from '../src/store/unitStore';

import {
  playerUnits,
  controlByComputerUnits
} from './units';

describe('AI: Power Analyze Test', function() {
  describe('calculateTotalPlayerPower', function() {
    for(let unit of playerUnits) {
      addUnitIntoVisibleArray(unit);
    }
    calculateTotalPlayerPower();
    it('Total health should be equal to  181', function() {
      assert.equal(playerPower.totalHealth, 181);
    });
    it('Total speed should be equal to 25', function() {
      assert.equal(playerPower.totalSpeed, 25);
    });
    it('Total armour should be equal to 13', function() {
      assert.equal(playerPower.totalArmour, 13);
    });
    it('Total meleeDamage should be equal to 16', function() {
      assert.equal(playerPower.totalMeleeDamage, 16);
    });
    it('Total missileDamage should be equal to 3', function() {
      assert.equal(playerPower.totalMissileDamage, 3);
    });
    it('Total discipline should be equal to 79', function() {
      assert.equal(playerPower.totalDiscipline, 79);
    });
    it('Total morale should be equal to 132', function() {
      assert.equal(playerPower.totalMorale, 132);
    });
    it('Total condition should be equal to 190', function() {
      assert.equal(playerPower.totalCondition, 190);
    });
  });
  describe('calculateTotalComputerPower', function() {
    for(let unit of controlByComputerUnits) {
      computersUnits.push(unit);
    }
    calculateTotalComputerPower();
    it('Total health should be equal to  159', function() {
      assert.equal(computerPower.totalHealth, 159);
    });
    it('Total speed should be equal to 32', function() {
      assert.equal(computerPower.totalSpeed, 32);
    });
    it('Total armour should be equal to 15', function() {
      assert.equal(computerPower.totalArmour, 15);
    });
    it('Total meleeDamage should be equal to 41', function() {
      assert.equal(computerPower.totalMeleeDamage, 41);
    });
    it('Total missileDamage should be equal to 20', function() {
      assert.equal(computerPower.totalMissileDamage, 20);
    });
    it('Total discipline should be equal to 123', function() {
      assert.equal(computerPower.totalDiscipline, 123);
    });
    it('Total morale should be equal to 124', function() {
      assert.equal(computerPower.totalMorale, 124);
    });
    it('Total condition should be equal to 231', function() {
      assert.equal(computerPower.totalCondition, 231);
    });
  });
});