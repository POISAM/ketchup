/**
 * Fixed position element.
 */
export interface DynamicallyPositionedElement extends HTMLElement {
    dynamicPosition: {
        anchor: HTMLElement;
        margin: number;
        above: boolean;
        rAF: number;
        right: boolean;
    };
}
