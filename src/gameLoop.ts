import {
  computerUnits,
  playerUnits,
  units
} from './store/unit/units';
import { drawMessage } from './UI/messages/drawMessage';
import { isUnitSpottedByEnemy, meleeCombat } from './unit';
import { finishBattle } from './config/global/globalConfig';

export const battleListener = () => {
  for(let unit of units) {
    isUnitSpottedByEnemy(unit)
  }
  meleeCombat();
  setTimeout(() => {
   battleListener();
  }, 600);
}

export const isBattleEnd = () => {
  let computerNumber = computerUnits.length;
  let playerNumber = playerUnits.length;
  if(computerNumber === 0 || playerNumber === 0) {
    finishBattle();
    checkWinner(computerNumber, playerNumber);
  }
}

export const checkWinner = (computerNumber: number, playerNumber: number) => {
  if(computerNumber === 0) {
    drawMessage('Victory');
  }
  else if(playerNumber === 0) {
    finishBattle();
    drawMessage('Defeat');
  }
}
