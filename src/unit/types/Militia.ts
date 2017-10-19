import Unit from '../Unit';

class Militia extends Unit {
  // general
  description: string = `A military force that is raised from the civil population to supplement a regular army in an emergency.`;
  cost: number = 20;
  advantageOver: string[];

  // Characteristics
  name: string = 'Militia';
  type: string = 'infantry';
  health: number = 20;
  speed: number = 25;
  armour: number = 1;
  range: number = 0;
  mobility: number = 3;
  meleeDamage: number = 2;
  missileDamage: number = 0;
  charge: number = 1;
  discipline: number = 10;

  constructor(id:number, x:number, y:number, radius:number, controlBy:string='player') {
    super(id, x, y, radius, controlBy);
  }
}

export default Militia;