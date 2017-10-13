import {drawUnit} from './unitActions';
import {
  gridSize,
  ctx,
  WIDTH,
  HEIGHT
} from '../map/mapConfig';
import {deleteObjectFromArray} from '../utils/objUtils';
import {assignUnitMoveToPosition} from './unitActions';
import {
  map,
  createUnitObstacle,
  addNeighbours
} from '../map/createMap';
import {aStar} from '../path/AStar';
import {getNodeFromMap} from '../path/drawPath';

import {units, computersUnits,} from '../store/unitStore';
import {checkOtherUnitsPosition} from './unitUtils';
import {checkUnitIsFighting} from './unitFight';
import {findPathFromOneNodeToAnother} from './unitPath';
import {meleeCombat, meleeAttack} from './unitFight';
import {spotEnemy} from './unitRange';

export let updateUnit = (unit:any, path:any[], i:number=0, currentMoveToX:number, currentMoveToY:number, chasenUnit:any=null) => {
  unit.setIsMovingToTrue();
  if(checkUnitIsFighting(unit)) {
    unit.setIsMovingToFalse();
    return;
  }

  if(unit.unitToPursue) {
    // unit now is pursuing opponent's unit
    console.log('allies unit is pursuing another oponents unit');
    let startNode = getNodeFromMap(unit.x, unit.y, map);
    let finishNode = getNodeFromMap(unit.unitToPursue.x, unit.unitToPursue.y, map);
    let newPath:any = aStar(map, startNode, finishNode);
    assignUnitMoveToPosition(unit, finishNode.x, finishNode.y);
    pursueUnit(unit, unit.unitToPursue, finishNode.x, finishNode.y, 0, newPath);
    return;
  }

  if(currentMoveToX !== unit.moveToNodeX || currentMoveToY !== unit.moveToNodeY) { // new destination
    console.log('new destination has been chosen');
    let startNode = getNodeFromMap(unit.x, unit.y, map);
    let finishNode = getNodeFromMap(unit.moveToNodeX, unit.moveToNodeY, map);
    let newPath:any = aStar(map, startNode, finishNode);
    assignUnitMoveToPosition(unit, finishNode.x, finishNode.y);
    updateUnit(unit,newPath, 0, finishNode.x, finishNode.y);
    return;
  }

  let updatedPath = path;
  let node = updatedPath[i]; // get next node

  if(i >= updatedPath.length) {
    unit.setIsMovingToFalse();
    return;
  }

  // ally unit is on the destination position
  // currentUnit should stop moving
  if(checkOtherUnitsPosition(units, unit, node.x, node.y) && i === updatedPath.length - 1) {
    unit.moveToNodeX = unit.x;
    unit.moveToNodeY = unit.y;
    unit.setIsMovingToFalse();
    return;
  }
  if(checkOtherUnitsPosition(units, unit, node.x, node.y)) {
    // unit has another allies' unit on its way
    console.error('updateUnit: another unit is on the way x:',node.x,'y:', node.y);
    let updatedMap = map;
    updatedMap = createUnitObstacle(updatedMap, node.x, node.y);
    addNeighbours(updatedMap);
    console.log('deleted Node', node);
    console.log('updatedMap', updatedMap);
    console.log('node', node);
    let startNode = getNodeFromMap(unit.x, unit.y, updatedMap);
    let finishNode = getNodeFromMap(currentMoveToX, currentMoveToY, updatedMap);
    let newPath:any = aStar(updatedMap, startNode, finishNode);

    console.error('newPath', newPath);
    updateUnit(unit, newPath, 0, currentMoveToX, currentMoveToY);
    return;
  }

  let nodeToClear = node;
  spotEnemy(unit); // check for enemy units
  if(i !== 0) {
    nodeToClear = updatedPath[i - 1];
  }

  moveToNextNodeInUpdateUnit(unit, nodeToClear, node, currentMoveToX, currentMoveToY, path, i);
}

export const pursueUnit = (unit:any, pursuedUnit:any, currentMoveToX:number, currentMoveToY:number, i:number, path:any) => {
  unit.setIsMovingToTrue();
  console.error('pursueUnit');
  console.log('unit.x', unit.x, 'unit.y', unit.y);
  console.log('current moveToX:', currentMoveToX, 'moveToY:', currentMoveToY);
  if(checkUnitIsFighting(unit)) {
    unit.setIsMovingToFalse();
    return;
  }
  if(unit.unitToPursue === null) { // unit isn't pursuing any opponent's units
    let startNode = getNodeFromMap(unit.x, unit.y, map);
    let finishNode = getNodeFromMap(unit.moveToNodeX, unit.moveToNodeY, map);
    let newPath:any = aStar(map, startNode, finishNode);
    assignUnitMoveToPosition(unit, finishNode.x, finishNode.y);
    updateUnit(unit,newPath, 0, finishNode.x, finishNode.y);
    return;
  }
  if(unit.unitToPursue !== null) {
    if(pursuedUnit.name !== unit.unitToPursue.name) {
      // unit is pursuing another opponent's unit
      console.log('allies unit is pursuing another oponents unit');
      let startNode = getNodeFromMap(unit.x, unit.y, map);
      let finishNode = getNodeFromMap(unit.unitToPursue.x, unit.unitToPursue.y, map);
      let newPath:any = aStar(map, startNode, finishNode);
      assignUnitMoveToPosition(unit, finishNode.x, finishNode.y);
      pursueUnit(unit, unit.unitToPursue, finishNode.x, finishNode.y, 0, newPath);
      return;
    }
  }

  let startNode = getNodeFromMap(unit.x, unit.y, map);
  let finishNode = getNodeFromMap(pursuedUnit.x, pursuedUnit.y, map);
  let node = path[i];
  unit.moveToNodeX = pursuedUnit.x;
  unit.moveToNodeY = pursuedUnit.y;
  let previousNode = node;
  if(i !== 0) {
    previousNode = path[i-1];
  }

  // if pursued unit changed position
  if(currentMoveToX !== pursuedUnit.x || currentMoveToY !== pursuedUnit.y) {
    console.error('pursue unit: pursuedUnit change position')
    i = 0;
    currentMoveToX = pursuedUnit.x;
    currentMoveToY = pursuedUnit.y;
    startNode = getNodeFromMap(unit.x, unit.y, map);
    finishNode = getNodeFromMap(pursuedUnit.x, pursuedUnit.y, map);
    console.error('startNode:', startNode);
    console.error('finishNode:', finishNode);
    console.error('pursuedUnit.x:', pursuedUnit.x, 'pursuedUnit.y:', pursuedUnit.y);
    console.error('map', map);
    path = aStar(map, startNode, finishNode);
    unit.moveToNodeX = pursuedUnit.x;
    unit.moveToNodeY = pursuedUnit.y;
    node = path[i]; // get next node
    previousNode = node;
    if(i !== 0) {
      previousNode = path[i-1];
    }
  }

  if(node.x === pursuedUnit.x && node.y === pursuedUnit.y) {
    // unit is reached oponents's unit
    console.log(`unit is reached oponents's unit`);
    unit.setIsMovingToFalse();
    unit.setIsFightingToTrue();
    pursuedUnit.setIsFightingToTrue();
    meleeAttack(unit, pursuedUnit);
    meleeAttack(pursuedUnit, unit);
    return;
  }

  if(checkOtherUnitsPosition(units, unit, node.x, node.y)) {
    // unit has another allies' unit on its way
    console.error('pursueUnit: another unit is on the way x:',node.x, 'y:',node.y);
    let updatedMap = map;
    updatedMap = createUnitObstacle(updatedMap, node.x, node.y);
    addNeighbours(updatedMap);
    console.log('deleted Node', node);
    console.log('updatedMap', updatedMap);
    console.log('node', node);
    startNode = getNodeFromMap(unit.x, unit.y, updatedMap);
    finishNode = getNodeFromMap(pursuedUnit.x, pursuedUnit.y, updatedMap);
    unit.moveToNodeX = pursuedUnit.x;
    unit.moveToNodeY = pursuedUnit.y;
    let newPath:any = aStar(updatedMap, startNode, finishNode);
    previousNode = newPath[0]; // get previous unit's position
    node = newPath[1]; // get next node
    console.error('unit is going to node x:', node.x, 'y:',node.y);
    moveToNextNode(unit, pursuedUnit, previousNode, node, currentMoveToX, currentMoveToY, path, i);
    return;
  }
  console.error('previousNode', previousNode);
  console.error('currentNode', node);
  spotEnemy(unit); // check for enemy units
  moveToNextNode(unit, pursuedUnit, previousNode, node, currentMoveToX, currentMoveToY, path, i);
}

export const moveToNextNode = (unit:any, pursuedUnit:any, currentNode:any, nextNode:any, currX:number, currY:number, allPath:any[], nodeI:number) => {
  // return new Promise(resolve => {
  console.log('moveToNextNode2');
    let startX = currentNode.x + (gridSize * 0.5);
    let startY = currentNode.y + (gridSize * 0.5);
    let finishX = nextNode.x + (gridSize * 0.5);
    let finishY = nextNode.y + (gridSize * 0.5);
    console.error('x:',startX, 'y:', startY);
    console.error('finishX:',finishX, 'finishY:', finishY);
    let path = findPathFromOneNodeToAnother(startX, startY, finishX, finishY);
    console.error('path', path);
    makeMovement(unit, pursuedUnit, currentNode, nextNode, path, allPath, currX, currY, 0, nodeI);

}

export const moveToNextNodeInUpdateUnit = (unit:any, currentNode:any, nextNode:any, currX:number, currY:number, allPath:any[], nodeI:number) => {
  // return new Promise(resolve => {
  console.log('moveToNextNode2');
    let startX = currentNode.x + (gridSize * 0.5);
    let startY = currentNode.y + (gridSize * 0.5);
    let finishX = nextNode.x + (gridSize * 0.5);
    let finishY = nextNode.y + (gridSize * 0.5);
    console.error('x:',startX, 'y:', startY);
    console.error('finishX:',finishX, 'finishY:', finishY);
    let path = findPathFromOneNodeToAnother(startX, startY, finishX, finishY);
    console.error('path', path);
    makeMovementInUpdateUnit(unit, currentNode, nextNode, path, allPath, currX, currY, 0, nodeI);

}

export const makeMovementInUpdateUnit = (unit:any, currentNode:any, nextNode:any, path:any[], allPath:any[], currX:number, currY:number, i:number, nodeI: number) => {
  //console.log('makeMovementInUpdateUnit');
  if(unit.x === nextNode.x && unit.y === nextNode.y) { // unit reach destination point
    nodeI++;
    updateUnit(unit, allPath, nodeI, currX, currY);
  }

  if(i >= path.length) {
    return;
  }

  // delete previous state
   let deleteX, deleteY;
   if(i > 0) {
     deleteX = path[i - 1].x - (gridSize * 0.5);
     deleteY = path[i - 1].y - (gridSize * 0.5);
   } else {
     deleteX = path[i].x  - (gridSize * 0.5);
     deleteY = path[i].y - (gridSize * 0.5);
   }
   ctx.clearRect(deleteX, deleteY, gridSize, gridSize);
   let centerX = path[i].x;
   let centerY = path[i].y;
   unit.setX(centerX - (gridSize * 0.5));
   unit.setY(centerY - (gridSize * 0.5));
   drawUnit(unit);

   setTimeout(() => {
     i++;
     makeMovementInUpdateUnit(unit, currentNode, nextNode, path, allPath, currX, currY, i, nodeI);
   }, 20);
}

export const makeMovement = (unit:any, pursuedUnit:any, currentNode:any, nextNode:any, path:any[], allPath:any[], currX:number, currY:number, i:number, nodeI: number) => {
  console.log('makeMovement2');
  if(unit.x === nextNode.x && unit.y === nextNode.y) { // unit reach destination point
    console.error('unit reached its position');
    nodeI++;
    pursueUnit(unit, pursuedUnit, currX, currY, nodeI, allPath)
  }

  if(i >= path.length) {
    return;
  }

  // delete previous state
   let deleteX, deleteY;
   if(i > 0) {
     deleteX = path[i - 1].x - (gridSize * 0.5);
     deleteY = path[i - 1].y - (gridSize * 0.5);
   } else {
     deleteX = path[i].x  - (gridSize * 0.5);
     deleteY = path[i].y - (gridSize * 0.5);
   }
   ctx.clearRect(deleteX, deleteY, gridSize, gridSize);
   let centerX = path[i].x;
   let centerY = path[i].y;
   unit.setX(centerX - (gridSize * 0.5));
   unit.setY(centerY - (gridSize * 0.5));
   drawUnit(unit);

   setTimeout(() => {
     i++;
     makeMovement(unit, pursuedUnit, currentNode, nextNode, path, allPath, currX, currY, i, nodeI);
   }, 25);
}

export const timeout = (time:number) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, time);
  })
}
