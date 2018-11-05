import Unit from './Unit';

class Peltasts extends Unit {
  // general
  description: string = 'Low range skirmishers armed with javelins';
  cost: number = 50;
  advantageOver: string[] = [
    'Hoplites', 'Pikemen'
  ];
  vulnerableAgainst: string[] = [
    'LightCavalry', 'HeavyCavalry'
  ];
  // Characteristics
  name: string = 'Peltasts';
  type: string = 'skirmishers';
  imgSrc:string = './src/img/units/pikemen.jpg';
  health: number = 50;
  speed: number = 22;
  armour: number = 4;
  range: number = 3;
  ammunition:number =  10;
  mobility: number = 6;
  meleeDamage: number = 4;
  missileDamage: number = 12;
  shotsRemained:number = 5;
  charge: number = 1;
  discipline: number = 50;
  initialWeight: number = 25;
  weight: number = this.initialWeight;

  constructor(id:number, x:number, y:number, controlBy:string='player') {
    super(id, x, y, controlBy);
  }
}

export default Peltasts;
