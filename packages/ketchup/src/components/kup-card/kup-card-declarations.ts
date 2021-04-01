import { GenericObject } from '../../types/GenericTypes';
/**
 * Props of the kup-card component.
 * Used to export every prop in an object.
 */
export enum KupCardProps {
    customStyle = 'Custom style of the component.',
    data = 'The actual data of the card.',
    isMenu = 'Defines whether the card is a menu or not. Works together with menuVisible.',
    layoutFamily = 'Sets the type of the card.',
    layoutNumber = 'Sets the number of the layout.',
    menuVisible = "Sets the status of the card as menu, when false it's hidden otherwise it's visible. Works together with isMenu.",
    sizeX = 'The width of the card, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).',
    sizeY = 'The height of the card, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).',
}
/**
 * Data prop of the kup-card component.
 */
export interface CardData {
    button?: GenericObject[];
    chart?: GenericObject[];
    checkbox?: GenericObject[];
    chip?: GenericObject[];
    color?: string[];
    combobox?: GenericObject[];
    datepicker?: GenericObject[];
    image?: GenericObject[];
    progressbar?: GenericObject[];
    text?: string[];
    textfield?: GenericObject[];
    timepicker?: GenericObject[];
}
/**
 * Layout families of the kup-card component.
 * @enum {string}
 * @property {string} COLLAPSIBLE - Cards belonging to this family will display an area usable to expand the content of the card.
 * @property {string} SCALABLE - Content will fit its container, resizing itself automatically.
 * @property {string} STANDARD - Stndard layouts.
 */
export enum CardFamily {
    COLLAPSIBLE = 'collapsible',
    DIALOG = 'dialog',
    SCALABLE = 'scalable',
    STANDARD = 'standard',
}
