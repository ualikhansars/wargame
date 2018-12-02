import {terrainCtx} from '../../config/context';
import {loadImage} from '..';

export const drawObstacle = (x:number, y:number, width:number, height:number, src:string) => {
  loadImage(src, (err:any, img:any) => {
    terrainCtx.drawImage(img, x, y, width, height);
  });
}
