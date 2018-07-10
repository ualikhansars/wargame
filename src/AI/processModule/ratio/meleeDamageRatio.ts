import {revealedUnits} from '../../../store/AI/enemies/revealedEnemies';
import {computerUnits} from '../../../store/unit/units';
import {calculatePercentRatio} from './percentRatio';

export const calculateMeleeDamageRatio = () => {
    
    let totalComputerMeleeDamage: number = 0;
    let totalPlayerMeleeDamage: number = 0;
    let averageComputerMeleeDamage: number;
    let averagePlayerMeleeDamage: number;
    let ratio: number = 0;

    // calculate total computer speed
    for(let unit of computerUnits) {
        totalComputerMeleeDamage += unit.meleeDamage; 
    }

    // calculate total player speed
    for(let unit of revealedUnits) {
        totalPlayerMeleeDamage += unit.meleeDamage; 
    }

    // find ratio
    ratio = calculatePercentRatio(totalComputerMeleeDamage, totalPlayerMeleeDamage);

    return ratio;
    
}