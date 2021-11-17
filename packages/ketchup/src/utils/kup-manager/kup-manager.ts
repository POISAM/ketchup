import type { Interaction } from '@interactjs/core/Interaction';
import type { ActionMap } from '@interactjs/core/scope';
import type { RectResolvable } from '@interactjs/types/index';
import type {
    KupDom,
    KupManagerDatesSettings,
    KupManagerDebugSettings,
    KupManagerInitialization,
    KupManagerInteractSettings,
    KupManagerLanguageSettings,
    KupManagerObjectsSettings,
    KupManagerScrollOnHoverSettings,
    KupManagerThemeSettings,
    KupManagerUtilities,
} from './kup-manager-declarations';
import type { ResizableKupComponent } from '../../types/GenericTypes';
import type { ResizeObserverEntry } from 'resize-observer/lib/ResizeObserverEntry';
import { KupDebug } from '../kup-debug/kup-debug';
import { KupDynamicPosition } from '../kup-dynamic-position/kup-dynamic-position';
import { KupInteract } from '../kup-interact/kup-interact';
import { KupLanguage } from '../kup-language/kup-language';
import { KupObjects } from '../kup-objects/kup-objects';
import { KupScrollOnHover } from '../kup-scroll-on-hover/kup-scroll-on-hover';
import { KupTheme } from '../kup-theme/kup-theme';
import { KupToolbar } from '../kup-toolbar/kup-toolbar';
import { ResizeObserver } from 'resize-observer';
import {
    KupLanguageDefaults,
    KupLanguageJSON,
} from '../kup-language/kup-language-declarations';
import { KupObjectsJSON } from '../kup-objects/kup-objects-declarations';
import { KupThemeJSON } from '../kup-theme/kup-theme-declarations';
import { KupDates } from '../kup-dates/kup-dates';
import { KupDatesLocales } from '../kup-dates/kup-dates-declarations';
import { KupDebugCategory } from '../kup-debug/kup-debug-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * This class controls every other Ketch.UP utility suite.
 * @module KupManager
 */
export class KupManager {
    dates: KupDates;
    debug: KupDebug;
    dynamicPosition: KupDynamicPosition;
    interact: KupInteract;
    language: KupLanguage;
    magicBox: HTMLKupMagicBoxElement;
    objects: KupObjects;
    overrides?: KupManagerInitialization;
    resize: ResizeObserver;
    scrollOnHover: KupScrollOnHover;
    utilities: KupManagerUtilities;
    theme: KupTheme;
    toolbar: KupToolbar;
    /**
     * Initializes KupManager.
     */
    constructor(overrides?: KupManagerInitialization) {
        let datesLocale: string = null,
            debugActive: boolean = null,
            debugAutoprint: boolean = null,
            debugLogLimit: number = null,
            dialogRestrictContainer: RectResolvable<
                [number, number, Interaction<keyof ActionMap>]
            > = null,
            dialogZIndex: number = null,
            languageList: KupLanguageJSON = null,
            languageName: string = null,
            objectsList: KupObjectsJSON = null,
            scrollOnHoverDelay: number = null,
            scrollOnHoverStep: number = null,
            themeList: KupThemeJSON = null,
            themeName: string = null;
        if (overrides) {
            const dates: KupManagerDatesSettings = overrides.dates;
            const debug: KupManagerDebugSettings = overrides.debug;
            const interact: KupManagerInteractSettings = overrides.interact;
            const language: KupManagerLanguageSettings = overrides.language;
            const objects: KupManagerObjectsSettings = overrides.objects;
            const scrollOnHover: KupManagerScrollOnHoverSettings =
                overrides.scrollOnHover;
            const theme: KupManagerThemeSettings = overrides.theme;
            if (dates) {
                datesLocale = dates.locale ? dates.locale : null;
            }
            if (debug) {
                debugActive = debug.active ? debug.active : null;
                debugAutoprint = debug.autoPrint ? debug.autoPrint : null;
                debugLogLimit = debug.logLimit ? debug.logLimit : null;
            }
            if (interact) {
                dialogRestrictContainer = interact.restrictContainer
                    ? dialogRestrictContainer
                    : null;
                dialogZIndex = interact.zIndex ? interact.zIndex : null;
            }
            if (language) {
                languageList = language.list ? language.list : null;
                languageName = language.name ? language.name : null;
            }
            if (objects) {
                objectsList = objects.list ? objects.list : null;
            }
            if (scrollOnHover) {
                scrollOnHoverDelay = scrollOnHover.delay
                    ? scrollOnHover.delay
                    : null;
                scrollOnHoverStep = scrollOnHover.step
                    ? scrollOnHover.step
                    : null;
            }
            if (theme) {
                themeList = theme.list ? theme.list : null;
                themeName = theme.name ? theme.name : null;
            }
        }
        this.dates = new KupDates(datesLocale);
        this.debug = new KupDebug(debugActive, debugAutoprint, debugLogLimit);
        this.dynamicPosition = new KupDynamicPosition();
        this.interact = new KupInteract(dialogZIndex, dialogRestrictContainer);
        this.language = new KupLanguage(languageList, languageName);
        this.magicBox = null;
        this.overrides = overrides ? overrides : null;
        this.objects = new KupObjects(objectsList);
        this.resize = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.contentRect.height && entry.contentRect.width) {
                    (entry.target as ResizableKupComponent).resizeCallback();
                    this.debug.logMessage(
                        'kup-manager (' +
                            entry.target.tagName +
                            '#' +
                            entry.target.id +
                            ')',
                        'Size changed to x: ' +
                            entry.contentRect.width +
                            ', y: ' +
                            entry.contentRect.height +
                            '.'
                    );
                }
            });
        });
        this.scrollOnHover = new KupScrollOnHover(
            scrollOnHoverDelay,
            scrollOnHoverStep
        );
        this.utilities = {
            lastPointerDownPath: null,
            lastPointerDownString: null,
            pointerDownCallbacks: new Set(),
        };
        this.theme = new KupTheme(themeList, themeName);
        this.toolbar = new KupToolbar();
        document.addEventListener('pointerdown', (e) => {
            const paths = e.composedPath() as HTMLElement[];
            const lastString =
                paths[0].innerText || (paths[0] as HTMLInputElement).value;
            this.utilities.lastPointerDownPath = paths;
            this.utilities.lastPointerDownString = lastString;
            this.utilities.pointerDownCallbacks.forEach((obj) => {
                if (obj.el.isConnected && !paths.includes(obj.el)) {
                    obj.cb();
                    if (obj.onlyOnce) {
                        this.utilities.pointerDownCallbacks.delete(obj);
                    }
                }
            });
            if (lastString) {
                document.dispatchEvent(
                    new CustomEvent('kup-manager-stringfinder', {
                        bubbles: true,
                        detail: { string: lastString },
                    })
                );
            }
        });
    }
    /**
     * Creates kup-magic-box component.
     */
    showMagicBox(): void {
        if (this.magicBox) {
            return;
        }
        this.magicBox = document.createElement('kup-magic-box');
        this.magicBox.id = 'kup-magic-box';
        this.magicBox.style.position = 'fixed';
        this.magicBox.style.left = 'calc(50% - 350px)';
        this.magicBox.style.top = 'calc(50% - 150px)';
        document.body.append(this.magicBox);
    }
    /**
     * Removes kup-magic-box component.
     */
    hideMagicBox(): void {
        if (!this.magicBox) {
            return;
        }
        this.magicBox.remove();
        this.magicBox = null;
    }
    /**
     * Creates or removes kup-magic-box component depending on its existence.
     */
    toggleMagicBox(): void {
        if (!this.magicBox) {
            this.showMagicBox();
        } else {
            this.hideMagicBox();
        }
    }
    /**
     * Sets both locale and language library-wide.
     * @param {KupDatesLocales} locale - The supported locale.
     */
    setLibraryLocalization(locale: KupDatesLocales): void {
        if (!Object.values(KupDatesLocales).includes(locale)) {
            this.debug.logMessage(
                'kup-manager',
                'Missing locale (' + locale + ')!',
                KupDebugCategory.ERROR
            );
            return;
        }
        if (!KupLanguageDefaults[locale]) {
            this.debug.logMessage(
                'kup-manager',
                'Missing language for locale (' + locale + ')!',
                KupDebugCategory.ERROR
            );
            return;
        }
        this.dates.setLocale(locale);
        this.language.set(KupLanguageDefaults[locale]);
    }
}
/**
 * Called by the Ketch.UP components to retrieve the instance of KupManager (or creating a new one when missing).
 * @returns {KupManager} KupManager instance.
 */
export function kupManagerInstance(): KupManager {
    if (!dom.ketchup) {
        const overrides: KupManagerInitialization = dom.ketchupInit
            ? dom.ketchupInit
            : null;
        dom.ketchup = new KupManager(overrides);
        dom.ketchup.theme.set();
        if (dom.ketchup.debug.active) {
            dom.ketchup.debug.toggle(dom.ketchup.debug.active);
        }
        globalThis.kupManager = dom.ketchup;
        document.dispatchEvent(new CustomEvent('kup-manager-ready'));
    }
    return dom.ketchup;
}
