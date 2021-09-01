import { Column, Row } from '../kup-data-table/kup-data-table-declarations';

import { KupTreeNodeSelectedEventPayload } from './../kup-tree/kup-tree-declarations';

import { KupEventPayload } from '../../types/GenericTypes';

/**
 * Props of the kup-accordion component.
 * Used to export every prop in an object.
 */
export enum KupAccordionProps {
    customStyle = 'Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization',
    data = 'Data of the accordion.',
    globalFilter = 'When set to true it activates the global filter.',
    globalFilterValue = 'The value of the global filter.',
}
/**
 * Data of the accordion.
 */
export interface KupAccordionData {
    columns: Column[];
    rows: Row[];
}

export interface KupAccordionTreeNodeSelectedEventPayload
    extends KupTreeNodeSelectedEventPayload {
    itemName: string;
}

export interface KupAccordionItemSelectedEventPayload extends KupEventPayload {
    itemName: string;
}
