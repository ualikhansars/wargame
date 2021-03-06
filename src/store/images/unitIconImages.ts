import { loadImage } from "../../utils";
import { moveIconSrc, fightIconSrc, swordIconSrc, spearIconSrc, spearAndShieldSrc, swordAndRoundShieldSrc } from "../../UI/battleUI/unitPanel/icon/iconSettings";
import { defaultUnits, createDefaultUnits } from "../unit/defaultUnits";

export let unitIconImages: any = {};
export let movementIconImage: any;
export let fightIconImage: any;
export let swordIconImage: any;
export let spearIconImage: any;
export let spearAndShieldIconImage: any;
export let swordAndRoundShieldIconImage: any;

export const loadIcons = () => {
    loadFightIconImage();
    loadMovementIconImage();
    loadSwordIconImage();
    loadSpearIconImage();
    loadSpearAndShieldIconImage();
    loadSwordAndRoundShieldIconImage();
}

export const loadUnitIcons = () => {
    return new Promise(resolve => {
        createDefaultUnits().then(() => loadDefaultUnits()
        .then(() => resolve()));
    });
}

const loadDefaultUnits = () => {
    return new Promise(resolve => {
        loadUnitIconImages().then(() => {
            resolve();
        });
    });
}

const loadMovementIconImage = () => {
    loadImage(moveIconSrc, (err: any, img: any) => {
        if(err) {
            throw new Error("cannot load movement icon");
        }
        movementIconImage = img;
    });
}

const loadFightIconImage = () => {
    loadImage(fightIconSrc, (err: any, img: any) => {
        if(err) {
            throw new Error("cannot load fight icon");
        }
        fightIconImage = img;
    });
}

const loadUnitIconImages = (i: number = 0) => {
    return new Promise(resolve => {
        if(i === defaultUnits.length) {
            resolve();
        }
        loadImage(defaultUnits[i].imgSrc, (err: any, img: any) => {
            if(err) {
                throw new Error(`Cannot load images of unit ${defaultUnits[i].name}`);
            }
            unitIconImages[defaultUnits[i].name] = img;
            resolve(loadUnitIconImages(i + 1));
        });
    });
}

export const loadSwordIconImage = () => {
    loadImage(swordIconSrc, (err: any, img: any) => {
        if(err) {
            throw new Error(`cannot load sword icon at path ${swordIconImage}`);
        }
        swordIconImage = img;
    });
}

export const loadSpearIconImage = () => {
    loadImage(spearIconSrc, (err: any, img: any) => {
        if(err) {
            throw new Error(`cannot load spear icon at path: ${spearIconSrc}`);
        }
        spearIconImage = img;
    });
}

export const loadSpearAndShieldIconImage = () => {
    loadImage(spearAndShieldSrc, (err: any, img: any) => {
        if(err) {
            throw new Error(`cannot load spear and shield icon at path ${spearAndShieldSrc}`);
        }
        spearAndShieldIconImage = img;
    });
}

export const loadSwordAndRoundShieldIconImage = () => {
    loadImage(swordAndRoundShieldSrc, (err: any, img: any) => {
        if(err) {
            throw new Error(`cannot load sword and round shild icon at path ${swordAndRoundShieldSrc}`);
        }
        swordAndRoundShieldIconImage = img;
    });
}

