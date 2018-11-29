import {
  spotEnemy,
  charge,
  removeUnitFromEnemiesFightAgainst
} from '../..';
import { getNodeFromMap } from '../../../utils';
import {
  createUnitObstacle,
  addNeighbors
} from '../../../map';
import { initialMap } from '../../../map/createMap/initialMap';
import { aStar } from '../../../path';
import { anotherUnitIsOnTheWay } from '../../../utils';
import { unitCanGetOutOfCombat } from '../../../utils/unit/movementUtils';
import { getSurroundedBlockedNodes } from '../../../utils/node';
import { moveToNextNodeInPursueUnit } from './moveToNextNode';
import { updateUnit } from './updateUnit';
import { Unit } from '../../types';
import { stopMoving } from './stopMoving';
import { unitCanMoveToTheNode } from '../../../utils/unit/priority';
import MapNode from '../../../map/nodes/MapNode';
import { getInterceptedEnemies } from '../../../utils/unit/interception/getInterceptedEnemies';

export const pursueUnit = (unit: Unit, pursuedUnit: Unit, currentMoveToX:number, currentMoveToY:number, i:number, path:any, newMovement:boolean) => {
  if(unit.isFighting) {
    unit.setUnitToPursueToNull();
    if(newMovement && unitCanGetOutOfCombat(unit)) { // unit is trying to out of combat
      unit.setIsFightingToFalse(); // unit is not fighting now
      unit.clearFightAgainst(); // now unit not fighting with anyone
      removeUnitFromEnemiesFightAgainst(unit);
      unit.setIsMovingToTrue();
    } else {
      let currentNode = getNodeFromMap(unit.x, unit.y); // get currentNode
      unit.setCurrentNode(currentNode); // set currentNode
      unit.setNextNode(currentNode); // set nextNode
      unit.setIsMovingToFalse();
      return;
    }
  }
  if(unit.unitToPursue === null) { // unit isn't pursuing any opponent's units
    let startNode = getNodeFromMap(unit.x, unit.y);
    let finishNode = getNodeFromMap(unit.moveToNode.x, unit.moveToNode.y);
    let newPath:any = aStar(initialMap, startNode, finishNode);
    unit.assignMoveToPosition(finishNode.x, finishNode.y);
    updateUnit(unit,newPath, 0, finishNode.x, finishNode.y, null, false);
    return;
  }
  if(unit.unitToPursue !== null && pursuedUnit.id !== unit.unitToPursue.id) {
    let startNode = getNodeFromMap(unit.x, unit.y);
    let finishNode = getNodeFromMap(unit.unitToPursue.x, unit.unitToPursue.y);
    let newPath:any = aStar(initialMap, startNode, finishNode);
    unit.assignMoveToPosition(finishNode.x, finishNode.y)
    pursueUnit(unit, unit.unitToPursue, finishNode.x, finishNode.y, 0, newPath, false);
    return;
  }

  let updatedPath = Object.assign([], path);
  let node = updatedPath[i]; // get next node
  if(!node) return;
  let nextNode: MapNode;
  if(i + 1 === updatedPath.length) { // last node
    nextNode = node;
  } else {
    nextNode = updatedPath[i + 1];
  }

  let currentNode = getNodeFromMap(unit.x, unit.y);
  unit.setCurrentNode(currentNode); 
  unit.setNextNode(nextNode);
  let startNode = getNodeFromMap(unit.x, unit.y);
  let finishNode = getNodeFromMap(pursuedUnit.x, pursuedUnit.y);
  
  // if pursued unit changed position
  if(currentMoveToX !== pursuedUnit.x || currentMoveToY !== pursuedUnit.y) {
    i = 0;
    currentMoveToX = pursuedUnit.x;
    currentMoveToY = pursuedUnit.y;
    startNode = getNodeFromMap(unit.x, unit.y);
    finishNode = getNodeFromMap(pursuedUnit.x, pursuedUnit.y);
    
    path = aStar(initialMap, startNode, finishNode);
    unit.assignMoveToPosition(pursuedUnit.currentNode.x, pursuedUnit.currentNode.y);
    node = path[i];
  }

  // unit is reached oponents's unit
  if(nextNode.x === pursuedUnit.currentNode.x && nextNode.y === pursuedUnit.currentNode.y) {
    stopMoving(unit, currentNode);
    unit.setUnitToPursueToNull();
    unit.setIsFightingToTrue();
    pursuedUnit.setIsFightingToTrue();
    unit.assignEnemy(pursuedUnit); // assign pursuedUnit as front line enemy
    pursuedUnit.assignEnemy(unit);
    charge(unit, pursuedUnit);
    return;
  }

  if(anotherUnitIsOnTheWay(unit)) {
    // unit has another allies' unit on its way
    console.error("ANOTHER UNIT IS ON THE WAY");
    const permission:boolean = unitCanMoveToTheNode(nextNode, unit);
    console.log('PERMISSION', permission);
    if(!permission) {
      stopMoving(unit, currentNode);
      let updatedMap = Object.assign([], initialMap);
      let blockedNodes = getSurroundedBlockedNodes(unit);
      for(let blockedNode of blockedNodes) {
        updatedMap = createUnitObstacle(updatedMap, blockedNode.x, blockedNode.y); // create obstacle for currentNode
      }
      addNeighbors(updatedMap); // create new neighbours for updated map
      let startNode = getNodeFromMap(unit.x, unit.y, updatedMap);
      let finishNode = getNodeFromMap(currentMoveToX, currentMoveToY, updatedMap);

      let newPath:any = aStar(updatedMap, startNode, finishNode);
      pursueUnit(unit, pursuedUnit, currentMoveToX, currentMoveToY, i, newPath, false);
      return;
    }
  }

  unit.assignMoveToPosition(pursuedUnit.currentNode.x, pursuedUnit.currentNode.y);
  unit.setIsMovingToTrue();
  spotEnemy(unit); // check for enemy units
  unit.decreaseCondition(1); // decreaseCondition while moving
  moveToNextNodeInPursueUnit(unit, pursuedUnit, currentNode, nextNode, currentMoveToX, currentMoveToY, path, i);
}
