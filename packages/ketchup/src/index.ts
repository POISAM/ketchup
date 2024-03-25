import { KupManager } from './managers/kup-manager/kup-manager';
import { KupManagerInitialization } from './managers/kup-manager/kup-manager-declarations';

/** used for obtain a KupManager instance without a dom document (for UT)  */
export function newKupManager(init: KupManagerInitialization): KupManager {
    return new KupManager(init);
}

export * from './managers/kup-objects/kup-objects-utility';
export * from './managers/kup-math/kup-math-utility';
export * from './managers/kup-dates/kup-dates-utility';
export * from './managers/kup-data/kup-data-utility';

export * from './managers/kup-theme/kup-theme-utility';
