import {calculateUnitTypes} from '../../analyzeModule/unitAnalyze';
import {calculatePercentRatio} from './percentRatio';

export const calculateTypesRatio = ():any => {

    let computerTypes:any = calculateUnitTypes();
    let playerTypes:any = calculateUnitTypes('revealed');

    let infantryNumber:number = computerTypes.infantry;
    let spearmenNumber:number = computerTypes.spearmen;
    let lightInfantryNumber:number = computerTypes.lightInfantry;
    let heavyInfantryNumber:number = computerTypes.heavyInfantry;
    let scoutsNumber:number = computerTypes.scouts;
    let skirmishersNumber:number = computerTypes.skirmishers;
    let cavalryNumber:number = computerTypes.cavalry;

    let playerInfantryNumber:number = playerTypes.infantry;
    let playerSpearmenNumber:number = playerTypes.spearmen;
    let playerLightInfantryNumber:number = playerTypes.lightInfantry;
    let playerHeavyInfantryNumber:number = playerTypes.heavyInfantry;
    let playerScoutsNumber:number = playerTypes.scouts;
    let playerSkirmishersNumber:number = playerTypes.skirmishers;
    let playerCavalryNumber:number = playerTypes.cavalry;

    let infantryRatio:number = calculatePercentRatio(infantryNumber, playerInfantryNumber);
    let spearmenRatio:number = calculatePercentRatio(spearmenNumber, playerSpearmenNumber);
    let lightInfantryRatio:number = calculatePercentRatio(lightInfantryNumber, playerLightInfantryNumber);
    let heavyInfantryRatio:number = calculatePercentRatio(heavyInfantryNumber, playerHeavyInfantryNumber);
    let skirmisherRatio:number = calculatePercentRatio(skirmishersNumber, playerSkirmishersNumber);
    let scoutsRatio:number = calculatePercentRatio(scoutsNumber, playerScoutsNumber)
    let cavalryRatio:number = calculatePercentRatio(cavalryNumber, playerCavalryNumber)
    
    return {
        infantryRatio,
        spearmenRatio,
        lightInfantryRatio,
        heavyInfantryRatio,
        skirmisherRatio,
        scoutsRatio,
        cavalryRatio
    }
}

