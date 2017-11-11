import {
  mainMenu,
  mainMenuCtx,
  dragAndDropCanvas,
  dragAndDropCanvasCtx
} from './mainMenuSettings';

import {
  roster,
  selectUnitInRoster,
  selectedUnitInRoster,
  addUnitToArmy,
  removeUnitFromArmy
} from './units';
import {
  rosterImgWidth,
  rosterImgHeight
} from './unitRoster';
import {loadImage} from '../../utils/loadImage';
import {WIDTH, HEIGHT} from '../../map/mapSettings';
import {
  onChoosePlayer,
  onChooseComputer
} from './title';
import {
  emptyBoxes,
  armyImgWidth,
  armyImgHeight
} from './chosenUnits';

export const dragAndDrop = () => {
  dragAndDropCanvas.addEventListener('click', (e:any) => {
    console.error('Click');
    let x = e.offsetX; // get X
    let y = e.offsetY; // get Y
    console.log('Position x', e.offsetX); // get X
    console.log('Position y', e.offsetY); // get Y
    onChoosePlayer(x, y);
    onChooseComputer(x, y);
    if(selectedUnitInRoster) {
      console.log('unit is added:', isUnitAddedToArmy(x, y));
      if(isUnitAddedToArmy(x,y)) { // draw unit is army list
        let box = isUnitAddedToArmy(x,y);
        if(!box.filled) { // box clear
          box.filled = true;
          showUnitInArmyList(box);
          dragAndDropCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
        }
      } else {
        dragAndDropCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT); // clear canvas
      }
    }
    onChooseRoster(x, y);
  });

  dragAndDropCanvas.addEventListener('mousemove', (e:any) => {
    let x = e.offsetX; // get X
    let y = e.offsetY; // get Y
    onDragUnit(x, y);
  });
}

export let onChooseRoster = (mouseX:number, mouseY:number) => {
  let selectedUnit = null;
  const width = rosterImgWidth;
  const height = rosterImgHeight;
  for(let unit of roster) {
    let x = unit.x;
    let y = unit.y;
    if(mouseX >= x && mouseX < x + width && mouseY >= y && mouseY < y + height) {
      selectedUnit = unit;
    }
  }
  selectUnitInRoster(selectedUnit);
  console.error('selectedUnitInRoster:', selectedUnitInRoster);
}

export let onDragUnit = (mouseX:number, mouseY:number) => {
  if(selectedUnitInRoster) {
    let width = rosterImgWidth;
    let height = rosterImgHeight;
    let x = mouseX - (width / 2);
    let y = mouseY - (height / 2);
    loadImage(selectedUnitInRoster.imgSrc, (err:any, img:any) => {
      dragAndDropCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      dragAndDropCanvasCtx.drawImage(img, x, y, rosterImgWidth, rosterImgHeight);
    });
  }
}

/*
  show if particular unit has been added to army,
  return box if unit has been down in that box,
  if no boxes chosen return null
*/
export const isUnitAddedToArmy = (mouseX:number, mouseY:number):any => {
  const width = armyImgWidth;
  const height = armyImgHeight;
  for(let box of emptyBoxes) {
    let x = box.x;
    let y = box.y;
    if(mouseX >= x && mouseX < (x + width) && mouseY >= y && mouseY < (y + height)) {
      return box;
    }
  }
  return null;
}

export const showUnitInArmyList = (box:any) => {
  if(box) {
    let x = box.x;
    let y = box.y;
    const width = armyImgWidth;
    const height = armyImgHeight;
    loadImage(selectedUnitInRoster.imgSrc, (err:any, img:any) => {
      dragAndDropCanvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
      mainMenuCtx.drawImage(img, x, y, width, height);
    });
  }
}
