/**
 * Props of the kup-dropdown-button component.
 * Used to export every prop in an object.
 */
export enum KupDropdownButtonProps {
    customStyle = 'Custom style of the component.',
    data = 'Props of the sub-components.',
    disabled = 'Defaults at false. When set to true, the component is disabled.',
    displayMode = 'Sets how the show the selected item value. Suported values: "code", "description", "both".',
    icon = 'Defaults at null. When set, the button will show this icon.',
    initialValue = 'Sets the initial value of the component.',
    label = 'Defaults at null. When set, the button will show this text.',
    selectMode = 'Sets how the return the selected item value. Suported values: "code", "description", "both".',
    styling = 'Defines the style of the button. Available styles are "flat" and "outlined", "raised" is the default.',
    trailingIcon = 'Defaults at null. When set, the icon will be shown after the text.',
}
