import {
  mainMenu,
  dragAndDropCanvas
} from '../GUI/mainMenu/mainMenuSettings';

import {
  canvas,
  auxiliaryCanvas,
  backgroundCanvas,
  terrain
} from '../map/mapConfig';
import {clearMainMenu} from '../GUI/mainMenu/mainMenuSettings';
import {clearMap} from '../map/createMap';
import {setMainMenuMode} from './globalConfig';
import {launchGame} from './launchGame';

export const activateMainMenuMode = () => {
  dragAndDropCanvas.style.zIndex = '6';
  mainMenu.style.zIndex = '5';
  auxiliaryCanvas.style.zIndex = '4';
  canvas.style.zIndex = '3';
  terrain.style.zIndex = '2'
  backgroundCanvas.style.zIndex = '1';
  clearMap();
  setMainMenuMode();
  launchGame();
}
