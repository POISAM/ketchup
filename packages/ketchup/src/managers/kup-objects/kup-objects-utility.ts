import { KupObj } from './kup-objects-declarations';

export const objectsIsButton = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'J4' === obj.t && 'BTN' === obj.p;
};

export const objectsIsDate = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'D8' === obj.t;
};

export const objectsIsNumber = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'NR' === obj.t || 'NP' === obj.t;
};

export const objectsIsIcon = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'J4' === obj.t && 'ICO' === obj.p;
};

export const objectsIsImage = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'J4' === obj.t && 'IMG' === obj.p;
};

export const objectsIsTime = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'I1' === obj.t || 'I2' === obj.t;
};

export const objectsIsTimestamp = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'I3' === obj.t && '2' === obj.p;
};
