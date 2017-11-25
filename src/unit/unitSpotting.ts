/*
  Functions that works with unit's visibility
*/

import {getNodeFromMap} from '../path/drawPath';
import {map} from '../map/createMap';
import {ctx} from '../map/mapConfig';
import {gridSize} from '../map/mapSettings';
import {drawUnit} from './drawUnit';
import {
  playersUnits,
  computersUnits,
  spottedUnits,
  visibleForPlayerUnits,
  visibleForComputerUnits,
  addUnitIntoVisibleArray,
  removeUnitFromVisibleArray,
  addUnitToSpottedUnits,
} from '../store/unitStore';

import {
  isObjectInArray,
  deleteObjectFromArray
} from '../utils/objUtils';

// AI
import {hidedEmenies} from '../AI/setUpAI';

/*
  spotEnemy: checks if enemies is in its visibility range
  if true, change property isVisible to true
*/
export const spotEnemy = (unit:any) => {
  let enemies:any[];
  if(unit.controlBy === 'player') { // if unit is control by player enemies will be computer's units
    enemies = Object.assign([], computersUnits);
  }
  if(unit.controlBy === 'computer') { //if unit is control by computer enemies will be player's units
    enemies = Object.assign([], playersUnits);
  }
  let visibility = unit.visibility;
  let visibilityRange = visibility * gridSize;
  let unitNode = getNodeFromMap(unit.x, unit.y, map);
  for(let enemy of enemies) {
    let enemyNode = getNodeFromMap(enemy.x, enemy.y, map);
    let dx = Math.abs(unitNode.x - enemyNode.x);
    let dy = Math.abs(unitNode.y - enemyNode.y);
    if(visibilityRange >= dx && visibilityRange >= dy) { // enemy has been spotted
      //console.error(enemy.name, 'has been spotted');
      if(unit.controlBy === 'computer' && enemy.isVisible === false) {
        hidedEmenies.removeFromHidedEnemies(enemy);
      }
      enemy.isVisible = true;
      drawUnit(enemy); // show enemy on the map
      addUnitIntoVisibleArray(enemy);
      if(unit.controlBy === 'computer') { // for computer add enemy into spottedUnits
        addUnitToSpottedUnits(enemy);
      }
    }
  }
  // console.error('visibleForPlayerUnits', visibleForPlayerUnits);
  // console.error('visibleForComputerUnits', visibleForComputerUnits);
  // console.error('spottedUnits', spottedUnits);
}

/*
  Checks if unit has been spotted by enemies
  Switch isVisible to false if not spotted by all enemies
*/
export const isUnitSpottedByEnemy = (unit:any) => {
  let enemies:any[];
  if(unit.controlBy === 'player') { // if unit is control by player enemies will be computer's units
    enemies = Object.assign([], computersUnits);
  }
  if(unit.controlBy === 'computer') { //if unit is control by computer enemies will be player's units
    enemies = Object.assign([], playersUnits);
  }
  if(enemies.length === 0) {
    // no enemy to spot the unit
    return;
  }
  let unitNode = getNodeFromMap(unit.x, unit.y, map);
  let isSpotted = false;
  for(let enemy of enemies) {
    let visibility = enemy.visibility;
    let visibilityRange = visibility * gridSize;
    let enemyNode = getNodeFromMap(enemy.x, enemy.y, map);
    let dx = Math.abs(unitNode.x - enemyNode.x);
    let dy = Math.abs(unitNode.y - enemyNode.y);
    if(visibilityRange >= dx && visibilityRange >= dy) { // enemy has been spotted
      //console.error(unit.name, 'has been spotted by enemy', enemy.name);
      addUnitIntoVisibleArray(unit);
      isSpotted = true;
      if(unit.isVisible === false && unit.controlBy === 'player') {
        hidedEmenies.removeFromHidedEnemies(unit);
      }
      unit.isVisible = true;
      if(unit.controlBy === 'computer') { // for computer add enemy into spottedUnits
        addUnitToSpottedUnits(enemy);
      }
      if(unit.controlBy === 'computer') {
        drawUnit(unit); // show computer unit on the map
      }
    }
  }
  if(!isSpotted) { // unit is not in range of any enemies
    removeUnitFromVisibleArray(unit);
    if(unit.controlBy === 'player' && unit.isVisible === true) { // unit has been in the spottedUnits
      hidedEmenies.addToHidedEnemies(unit);
    }
    unit.isVisible = false;
    if(unit.controlBy === 'computer' && !unit.isMoving) { // if unit is computer's and not moving
      ctx.clearRect(unit.x, unit.y, gridSize, gridSize); // hide computer unit on the map
    }
  }
}

export const spotUnits = (units:any[]) => {
  if(units.length > 0) {
    for(let unit of units) {
      isUnitSpottedByEnemy(unit);
    }
  }
  // console.error('visibleForPlayerUnits', visibleForPlayerUnits);
  // console.error('visibleForComputerUnits', visibleForComputerUnits);
}
