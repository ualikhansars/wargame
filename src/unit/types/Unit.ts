import {gridSize} from '../../config';
import {
  isObjectEmpty,
  getNodeFromMap
} from '../../utils';
import {
  deleteUnitFromArray, isUnitInArray
} from '../../utils/unit/general';
import {radius} from '../../config/unit';
import MapNode from '../../map/nodes/MapNode';

class Unit {
  id: number;
  name: string;
  x: number;
  y: number;
  centerX: number;
  centerY: number;
  radius: number = radius;
  moveToNode: MapNode;
  currentNode: MapNode;
  nextNode: MapNode;
  isCurrentlyChosen: boolean = false;
  controlBy: string;
  imgSrc: string = './src/img/units/pikemen.jpg';
  isMoving: boolean = false;
  isVisible:boolean = false;
  unitToPursue: any = null;
  isFighting: boolean = false;
  figthAgainst: any = {
    front: {},
    flank: [],
    rear: {},
    all: []
  };

  // general
  description: string;
  cost: number;
  advantageOver: string[];
  vulnerableAgainst: string[];

  // Characteristics
  type: string;
  health: number = 100;
  speed: number = 10;
  armour: number = 1;
  range: number = 0;
  mobility: number = 1;
  meleeDamage: number = 1;
  missileDamage: number = 0;
  shotsRemained:number = 0;
  charge:number = 2;
  discipline: number = 5;
  weight: number = 0;
  visibility:number = 5;
  morale: number = 100;
  condition: number = 100;
  initialHealth: number;

  // AI attributes
  position:string; // position in formation
  task:string;
  unitToProtect:number;
  baseNode:any = {};
  isUnitUnderProtection:boolean = false;
  unitToHelp:number;
  isUnitNeedHelp:boolean = false;
  beCloseTo:any[] = [];
  commandNumber: number;
  frozen:boolean = false; // to prevent too many orders in short period of time
  
  constructor(id:number, x:number, y:number, controlBy:string='player') {
    this.id = id;
    this.x = x;
    this.y = y;
    this.centerX = x + (gridSize / 2);
    this.centerY = y + (gridSize / 2);
    this.controlBy = controlBy;
    this.currentNode = getNodeFromMap(x, y);
    this.nextNode = getNodeFromMap(x, y);
  }

  setX(x:number) {
    this.x = x;
    this.centerX = x + (gridSize / 2);
  }

  setY(y:number) {
    this.y = y;
    this.centerY = y + (gridSize / 2);
  }

  setIsMovingToFalse() {
    this.isMoving = false;
  }

  setIsMovingToTrue() {
    this.isMoving = true;
  }

  setUnitToPursue(opponentsUnit:Unit) {
    this.unitToPursue = opponentsUnit;
  }

  setUnitToPursueToNull() {
    this.unitToPursue = null;
  }

  setIsFightingToTrue() {
    this.isFighting = true;
  }

  setIsFightingToFalse() {
    this.isFighting = false;
  }

  assignMoveToPosition(x:number, y:number) {
    let node: MapNode = getNodeFromMap(x, y);
    if(node) {
      this.moveToNode = node;
    }

  }

  removeEnemyFromFlank(opponent:Unit) {
    for(let i = 0; i < this.figthAgainst.flank.length; ++i) {
      if(this.figthAgainst.flank[i].id === opponent.id) {
        this.figthAgainst.flank = deleteUnitFromArray(opponent, this.figthAgainst.flank);
      }
    }
  }

  increaseCondition(value:number) {
    if(this.condition < 100) { // condition cannot be more than 100
      this.condition += value;
    }
  }

  decreaseCondition(value:number) {
    if(this.condition > 0) { // condition cannot be less than 0
      this.condition -= value;
    }

  }

  setCurrentNode(node: MapNode) {
    let foundNode: MapNode = getNodeFromMap(node.x, node.y);
    if(foundNode) {
      this.currentNode = foundNode;
    } else {
      throw 'Error: Node not found in the map';
    }
  }

  setNextNode(node: MapNode) {
    let foundNode: MapNode = getNodeFromMap(node.x, node.y);
    if(foundNode) {
      this.nextNode = foundNode;
    } else {
      throw 'Error: Node not found in the map';
    }
  }

  assignEnemy(enemy:Unit) {
    if(isObjectEmpty(this.figthAgainst.front)) { // don't have front enemy
      this.figthAgainst.front = enemy;
    } else { // unit is already have front line enemy
      let frontEnemyNode = this.figthAgainst.front.currentNode;
      let newEnemyNode = enemy.currentNode;
      let unitNode = this.currentNode;
      let frontEnemyDiffX = (unitNode.x - frontEnemyNode.x) / gridSize;
      let frontEnemyDiffY = (unitNode.y - frontEnemyNode.y) / gridSize;
      let newEnemyDiffX = (unitNode.x - newEnemyNode.x) / gridSize;
      let newEnemyDiffY = (unitNode.y - newEnemyNode.y) / gridSize;
      if(frontEnemyDiffX === -newEnemyDiffX && frontEnemyDiffY === -newEnemyDiffY) { // enemy is rear
        this.figthAgainst.rear = enemy;
      }
      else if(frontEnemyDiffX === newEnemyDiffX && frontEnemyDiffY === -newEnemyDiffY) { // enemy is rear
        this.figthAgainst.rear = enemy;
      }
      else if(frontEnemyDiffX === -newEnemyDiffX && frontEnemyDiffY === newEnemyDiffY) { // enemy is rear
        this.figthAgainst.rear = enemy;
      }
      else {
        this.figthAgainst.flank.push(enemy);
      }
    }
    if(!isUnitInArray(enemy, this.figthAgainst.all)) {
      this.figthAgainst.all.push(enemy);
    }
    this.isFighting = true;
  }

  increaseWeightInPercentage(percentage: number) {
    let newWeight = this.weight + (this.weight * (percentage * 0.01));
    if(newWeight < 0) newWeight = 0;
    else if(newWeight > 100) newWeight = 100;
    this.weight = Math.round(newWeight);
  }

  removeEnemyFromFightAgainst(enemy:Unit) {
    if(enemy.id === this.figthAgainst.front.id) {
      this.figthAgainst.front = {};
      this.arrangeFightAgainst();
    }

    else if(enemy.id === this.figthAgainst.rear.id) {
      this.figthAgainst.rear = {};
    }

    else if(this.figthAgainst.flank.length !== 0) {
      for(let unit of this.figthAgainst.flank) {
        if(unit.id === enemy.id) {
          this.removeEnemyFromFlank(enemy);
        }
      }
    }

    this.figthAgainst.all = deleteUnitFromArray(enemy, this.figthAgainst.all);

    if(this.figthAgainst.all.length === 0) {
      this.isFighting = false;
    }
  }

  arrangeFightAgainst() {
    let updatedFlank:Unit[] = Object.assign([], this.figthAgainst.flank);
    let updatedRear:Unit = Object.assign({}, this.figthAgainst.rear);

    this.figthAgainst.flank = [];
    this.figthAgainst.rear = {};

    if(updatedFlank.length > 0) {
      for(let enemy of updatedFlank) {
          this.assignEnemy(enemy);
      }
    }
    if(!isObjectEmpty(updatedRear)) {
      this.assignEnemy(updatedRear);
    }
  }

  clearFightAgainst() {
    this.figthAgainst.front = {};
    this.figthAgainst.rear = {};
    this.figthAgainst.flank = [];
    this.figthAgainst.all = [];
    this.isFighting = false;
  }

  // AI methods
  assignTask(task:string) {
    if(task === 'exploration') {
      this.task = task;
    }
    else if(task === 'protection') {
      this.task = task;
    }
    else if(task === 'patrol') {
      this.task = task;
    }
    else if(task === 'holdPosition') {
      this.task = task;
    }
    else {
      throw new Error('Cannot assign task for unit ' + this.name);
    }
    console.error(' new task for unit', this.name, 'is', task);
  }

  clearTask() {
    this.task = '';
  }

  setIsUnitUnderProtectionToTrue() {
    this.isUnitUnderProtection = true;
  }
  setIsUnitUnderProtectionToFalse() {
    this.isUnitUnderProtection = false;
  }
  assignUnitToProtect(unitId:number) {
    this.unitToProtect = unitId;
  }
  clearUnitToProtect() {
    this.unitToProtect = null;
  }
  setIsUnitNeedHelpToTrue() {
    this.isUnitNeedHelp = true;
  }
  setIsUnitNeedHelpToFalse() {
    this.isUnitNeedHelp = false;
  }
  assignUnitToHelp(id:number) {
    this.unitToHelp = id;
  }
  clearUnitToHelp() {
    this.unitToHelp = null;
  }
  assignBaseNode(node:any) {
    if(node) {
      this.baseNode = node;
    }
  }
  removeBaseNode() {
    this.baseNode = {};
  }

  setCommandNumber(commandNumber: number) {
    this.commandNumber = commandNumber;
  }
}

export default Unit;
