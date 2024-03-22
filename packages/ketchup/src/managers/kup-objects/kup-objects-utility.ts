import { KupObj } from './kup-objects-declarations';

export const isButton = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'J4' === obj.t && 'BTN' === obj.p;
};

export const isDate = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'D8' === obj.t;
};

export const objectIsNumber = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'NR' === obj.t || 'NP' === obj.t;
};

export const isIcon = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'J4' === obj.t && 'ICO' === obj.p;
};

export const isTime = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'I1' === obj.t || 'I2' === obj.t;
};

export const isTimestamp = (obj: KupObj): boolean => {
    if (!obj) return false;
    return 'I3' === obj.t && '2' === obj.p;
};
