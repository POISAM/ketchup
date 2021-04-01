import {
    Component,
    Element,
    State,
    Event,
    Prop,
    h,
    Host,
    Method,
    EventEmitter,
} from '@stencil/core';
import Picker from 'vanilla-picker';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { KupTextField } from '../kup-text-field/kup-text-field';
import type { DynamicallyPositionedElement } from '../../utils/dynamic-position/dynamic-position-declarations';
import type { GenericObject } from '../../types/GenericTypes';
import { KupColorPickerProps } from './kup-color-picker-declarations';

@Component({
    tag: 'kup-color-picker',
    styleUrl: 'kup-color-picker.scss',
    shadow: true,
})
export class KupColorPicker {
    @Element() rootElement: HTMLElement;
    @State() customStyleTheme: string = undefined;
    @State() value: string = undefined;

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the text field.
     */
    @Prop() data: Object = undefined;
    /**
     * Defaults at false. When set to true, the component is disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * Sets the initial value of the component. Can be css color name, hex code or rgb code (sample: "red" or rgb(255, 0, 0) or "#FF0000" ).
     */
    @Prop() initialValue: string = '';
    /**
     * When true, the component's text field will be replaced by a swatch.
     */
    @Prop() swatchOnly: boolean = false;

    private anchorEl: HTMLElement;
    dropdownEl: HTMLElement;
    /**
     * Instance of the KupManager class.
     */
    kupManager: KupManager = kupManagerInstance();
    private picker: Picker;
    private textfieldEl: KupTextField;

    @Event({
        eventName: 'kupColorPickerChange',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupColorPickerInput',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<{
        value: any;
    }>;

    //---- Methods ----

    @Method()
    async getValue(): Promise<string> {
        return this.value;
    }

    @Method()
    async themeChangeCallback(customStyleTheme: string) {
        this.customStyleTheme = customStyleTheme;
    }

    @Method()
    async setFocus() {
        this.textfieldEl.setFocus();
    }

    @Method()
    async setValue(value: string) {
        this.value = value;
        this.textfieldEl.setValue(value);
    }
    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        let props: GenericObject = {};
        if (descriptions) {
            props = KupColorPickerProps;
        } else {
            for (const key in KupColorPickerProps) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        KupColorPickerProps,
                        key
                    )
                ) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }

    private onKupInput(e: CustomEvent) {
        this.value = e.detail.value;
        this.setHexValue();

        this.kupInput.emit({
            value: this.value,
        });
    }

    private setHexValue() {
        if (this.value) {
            if (this.value.indexOf('#') < 0) {
                this.value = this.kupManager.theme.colorCheck(
                    this.value
                ).hexColor;
            }
            if (
                this.picker &&
                this.value &&
                this.value.indexOf('#') > -1 &&
                this.value.length === 7
            ) {
                this.picker.setColour(this.value, true);
            }
        }
    }

    private prepTextField() {
        let initialValue = undefined;
        let textfieldData = { ...this.data['kup-text-field'] };
        let customStyle: string = ` #kup-component .icon-container{box-sizing: border-box; border: 3px solid rgba(var(--kup-text-color-rgb),.575); border-radius: 50%; background-color:${this.value}!important;}`;
        if (!textfieldData['icon']) {
            textfieldData['icon'] = 'brightness-1';
        }
        if (textfieldData['trailingIcon'] === undefined) {
            textfieldData['trailingIcon'] = true;
        }

        if (this.value === '') {
            initialValue = this.value;
            textfieldData['icon'] = '';
        } else if (!this.value) {
            let message = 'Invalid color: ' + this.value;
            initialValue = message;
            textfieldData['icon'] = 'warning';
            textfieldData['title'] = 'Invalid color: ' + this.value;
        } else {
            initialValue = this.value;
            if (textfieldData['icon'] === 'brightness-1') {
                if (!textfieldData['customStyle']) {
                    textfieldData['customStyle'] = customStyle;
                } else {
                    textfieldData['customStyle'] += customStyle;
                }
            }
        }

        return (
            <kup-text-field
                {...textfieldData}
                disabled={this.disabled}
                initialValue={initialValue}
                onKupTextFieldInput={(e: any) => this.onKupInput(e)}
                ref={(el) => (this.textfieldEl = el as any)}
            ></kup-text-field>
        );
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.value = this.initialValue;
        this.setHexValue();
        if (!this.data) {
            this.data = {
                'kup-text-field': {},
            };
        }
    }

    componentDidLoad() {
        const root = this.rootElement.shadowRoot;

        if (root) {
            this.picker = new Picker({
                alpha: false,
                color: this.value,
                parent: this.anchorEl,
            });
            this.picker['kupColorPicker'] = this;
            this.picker['onClose'] = function (color) {
                let colorPicker = this['kupColorPicker'];
                colorPicker.setValue(color.hex.substr(0, 7));
                colorPicker.kupManager.dynamicPosition.stop(
                    colorPicker.dropdownEl as DynamicallyPositionedElement
                );
                colorPicker.kupChange.emit({
                    value: colorPicker.value,
                });
            };
            this.picker['onOpen'] = function () {
                let colorPicker = this['kupColorPicker'];
                if (!colorPicker.dropdownEl) {
                    colorPicker.dropdownEl = this[
                        'kupColorPicker'
                    ].rootElement.shadowRoot.querySelector('.picker_wrapper');
                    colorPicker.kupManager.dynamicPosition.register(
                        colorPicker.dropdownEl,
                        colorPicker.anchorEl
                    );
                }
                if (!colorPicker.disabled) {
                    colorPicker.kupManager.dynamicPosition.start(
                        colorPicker.dropdownEl as DynamicallyPositionedElement
                    );
                }
            };
        }
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillUpdate() {
        this.setHexValue();
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let hostClass: Record<string, boolean> = {};
        let widget: HTMLElement = undefined;
        if (this.swatchOnly) {
            widget = (
                <button
                    type="button"
                    disabled={this.disabled}
                    class="color-picker"
                    style={{
                        backgroundColor: this.value,
                    }}
                />
            );
        } else {
            widget = this.prepTextField();
        }

        if (
            this.data &&
            this.data['kup-text-field'] &&
            this.data['kup-text-field']['className'] &&
            this.data['kup-text-field']['className'].indexOf(
                'kup-full-height'
            ) > -1
        ) {
            hostClass['kup-full-height'] = true;
        }

        if (
            this.data &&
            this.data['kup-text-field'] &&
            this.data['kup-text-field']['fullWidth']
        ) {
            hostClass['kup-full-width'] = true;
        }

        return (
            <Host class={hostClass}>
                <style>{this.kupManager.theme.setCustomStyle(this)}</style>
                <div
                    id="kup-component"
                    ref={(el) => (this.anchorEl = el as any)}
                >
                    {widget}
                </div>
            </Host>
        );
    }

    componentDidUnload() {
        this.kupManager.theme.unregister(this);
        const dynamicPositionElements: NodeListOf<DynamicallyPositionedElement> = this.rootElement.shadowRoot.querySelectorAll(
            '.dynamic-position'
        );
        if (dynamicPositionElements.length > 0) {
            this.kupManager.dynamicPosition.unregister(
                Array.prototype.slice.call(dynamicPositionElements)
            );
        }
    }
}
