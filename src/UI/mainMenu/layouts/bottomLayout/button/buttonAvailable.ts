import {
  playerArmy,
  computerArmy
} from '../../../../../store/roster/army';
import {
  computerSpendedGold,
  playerSpendedGold,
} from '../../../../../config/mainMenu/gold/spendedGold';
import {totalGold} from '../../../../../config/mainMenu/gold/totalGold';
import {
  disableStartBattleButton,
  enableStartBattleButton
} from '../../../../../config/mainMenu';
import {
  drawBottomLayout
} from '../layout';
/*
  Checks total player and computer units and spended gold
  and decide if battle can start or not
*/
export const isStartBattleAvailable = () => {
  let computerUnitsNumber:number = computerArmy.length;
  let playerUnitsNumber:number = playerArmy.length;
  let computerRemainGold:number = totalGold - computerSpendedGold;
  let playerRemainGold:number = totalGold - playerSpendedGold;
  if(computerUnitsNumber < 1 || playerUnitsNumber < 1) {
    // computer or(and) player don't have units
    disableStartBattleButton();
    drawBottomLayout(); // redraw startBattle layout
  }
  else if(computerRemainGold < 0 || playerRemainGold < 0) {
    // computer or(and player) exceed total available gold
    disableStartBattleButton();
    drawBottomLayout(); // redraw startBattle layout
  }
  else {
    enableStartBattleButton();
    drawBottomLayout(); // redraw startBattle layout
  }
}
