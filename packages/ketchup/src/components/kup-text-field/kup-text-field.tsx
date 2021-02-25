import {
    Component,
    Event,
    EventEmitter,
    Prop,
    Element,
    Host,
    State,
    h,
    Method,
} from '@stencil/core';
import { setThemeCustomStyle, setCustomStyle } from '../../utils/theme-manager';
import { logLoad, logMessage, logRender } from '../../utils/debug-manager';
import { FTextField } from '../../f-components/f-text-field/f-text-field';
import { FTextFieldMDC } from '../../f-components/f-text-field/f-text-field-mdc';
import { FTextFieldProps } from '../../f-components/f-text-field/f-text-field-declarations';

@Component({
    tag: 'kup-text-field',
    styleUrl: 'kup-text-field.scss',
    shadow: true,
})
export class KupTextField {
    /**
     * References the root HTML element of the component (<kup-image>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    /**
     * The value of the component.
     * @default ""
     */
    @State() value: string = '';
    /**
     * The component-specific CSS set by the current Ketch.UP theme.
     * @default ""
     */
    @State() customStyleTheme: string = '';

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     * @default ""
     */
    @Prop() customStyle: string = '';
    /**
     * When set to true, the component is disabled.
     * @default false
     */
    @Prop() disabled: boolean = false;
    /**
     * When the text field is part of the autocomplete component and the list is opened, enter key selects the item and doesn't submit.
     * @default true
     */
    @Prop() emitSubmitEventOnEnter: boolean = true;
    /**
     * When set to true, the component will be rendered at full width.
     * @default false
     */
    @Prop({ reflect: true }) fullWidth: boolean = false;
    /**
     * When set, its content will be shown as a help text below the field.
     * @default null
     */
    @Prop() helper: string = null;
    /**
     * When set, the helper will be shown only when the field is focused.
     * @default false
     */
    @Prop() helperWhenFocused: boolean = false;
    /**
     * When set, the text-field will show this icon.
     * @default null
     */
    @Prop() icon: string = null;
    /**
     * Sets the initial value of the component
     * @default ""
     */
    @Prop() initialValue: string = '';
    /**
     * The HTML type of the input element. It has no effect on text areas.
     * @default "text"
     */
    @Prop() inputType: string = 'text';
    /**
     * Enables a clear trailing icon.
     * @default false
     */
    @Prop() isClearable: boolean = false;
    /**
     * When set, its content will be shown as a label.
     * @default null
     */
    @Prop() label: string = null;
    /**
     * When set to true, the label will be on the left of the component.
     * @default false
     */
    @Prop() leadingLabel: boolean = false;
    /**
     * When set, the helper will display a character counter.
     * @default null
     */
    @Prop() maxLength: number = null;
    /**
     * When set to true, the component will be rendered as an outlined field.
     * @default false
     */
    @Prop() outlined: boolean = false;
    /**
     * Sets the component to read only state, making it not editable, but interactable. Used in combobox component when it behaves as a select.
     * @default false
     */
    @Prop() readOnly: boolean = false;
    /**
     * The HTML step of the input element. It has effect only with number input type.
     * @default null
     */
    @Prop() step: number = null;
    /**
     * When set to true, the component will be rendered as a textarea.
     * @default false
     */
    @Prop() textArea: boolean = false;
    /**
     * When set, the icon will be shown after the text.
     * @default false
     */
    @Prop() trailingIcon: boolean = false;
    /**
     * When set to true, the label will be on the right of the component.
     * @default false
     */
    @Prop() trailingLabel: boolean = false;

    //---- Internal variables ----

    /**
     * Reference to the input element.
     */
    private inputEl: HTMLInputElement | HTMLTextAreaElement;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    /**
     * Triggered when the input element loses focus.
     */
    @Event({
        eventName: 'kupTextFieldBlur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<{
        id: any;
        value: string;
    }>;
    /**
     * Triggered when the input element changes.
     */
    @Event({
        eventName: 'kupTextFieldChange',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<{
        id: any;
        value: string;
    }>;
    /**
     * Triggered when the input element is clicked.
     */
    @Event({
        eventName: 'kupTextFieldClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        id: any;
        value: string;
    }>;
    /**
     * Triggered when the input element gets focused.
     */
    @Event({
        eventName: 'kupTextFieldFocus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<{
        id: any;
        value: string;
    }>;
    /**
     * Triggered when the input element receives an input.
     */
    @Event({
        eventName: 'kupTextFieldInput',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<{
        id: any;
        value: string;
    }>;
    /**
     * Triggered when the text field's icon is clicked.
     */
    @Event({
        eventName: 'kupTextFieldIconClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIconClick: EventEmitter<{
        id: any;
        value: string;
    }>;
    /**
     * Triggered when the text field's clear icon is clicked.
     */
    @Event({
        eventName: 'kupTextFieldClearIconClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClearIconClick: EventEmitter<{
        id: any;
    }>;
    /**
     * Triggered when the Enter key is pressed.
     */
    @Event({
        eventName: 'kupTextFieldSubmit',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTextFieldSubmit: EventEmitter<{
        id: any;
        value: string;
    }>;

    onKupBlur(event: FocusEvent & { target: HTMLInputElement }) {
        const { target } = event;
        this.kupBlur.emit({
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupChange(event: UIEvent & { target: HTMLInputElement }) {
        const { target } = event;
        this.kupChange.emit({
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupClick(event: MouseEvent & { target: HTMLInputElement }) {
        const { target } = event;
        this.kupClick.emit({
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupFocus(event: FocusEvent & { target: HTMLInputElement }) {
        const { target } = event;
        this.kupFocus.emit({
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupInput(event: UIEvent & { target: HTMLInputElement }) {
        const { target } = event;
        this.kupInput.emit({
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupIconClick(event: MouseEvent & { target: HTMLInputElement }) {
        const { target } = event;
        this.kupIconClick.emit({
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupClearIconClick() {
        this.value = '';
        this.inputEl.value = '';
        this.kupClearIconClick.emit({
            id: this.rootElement.id,
        });
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            if (this.emitSubmitEventOnEnter == true) {
                event.preventDefault();
                this.kupTextFieldSubmit.emit({
                    id: this.rootElement.id,
                    value: this.inputEl.value,
                });
            }
        }
    }

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * Returns the component's internal value.
     */
    @Method()
    async getValue(): Promise<string> {
        return this.value;
    }
    /**
     * This method is invoked by the theme manager.
     * Whenever the current Ketch.UP theme changes, every component must be re-rendered with the new component-specific customStyle.
     * @param customStyleTheme - Contains current theme's component-specific CSS.
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     * @see https://ketchup.smeup.com/ketchup-showcase/#/theming
     */
    @Method()
    async refreshCustomStyle(customStyleTheme: string) {
        this.customStyleTheme = customStyleTheme;
    }
    /**
     * Focuses the input element.
     */
    @Method()
    async setFocus() {
        this.inputEl.focus();
    }
    /**
     * Sets the internal value of the component.
     */
    @Method()
    async setValue(value: string) {
        this.value = value;
        try {
            this.inputEl.value = value;
        } catch (error) {
            let message =
                "Couldn't set value on input element: '" + value + "'";
            logMessage(this, message, 'warning');
        }
    }

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    /**
     * Set the events of the component and instantiates Material Design.
     */
    private setEvents(): void {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const f: HTMLElement = root.querySelector('.f-text-field--wrapper');
            if (f) {
                const inputEl:
                    | HTMLInputElement
                    | HTMLTextAreaElement = f.querySelector(
                    '.mdc-text-field__input'
                );
                const icon: HTMLElement = f.querySelector('.action');
                const clearIcon: HTMLElement = f.querySelector('.clear');
                if (inputEl) {
                    inputEl.onblur = (
                        e: FocusEvent & { target: HTMLInputElement }
                    ) => this.onKupBlur(e);
                    inputEl.onchange = (
                        e: UIEvent & { target: HTMLInputElement }
                    ) => this.onKupChange(e);
                    inputEl.onclick = (
                        e: MouseEvent & { target: HTMLInputElement }
                    ) => this.onKupClick(e);
                    inputEl.onfocus = (
                        e: FocusEvent & { target: HTMLInputElement }
                    ) => this.onKupFocus(e);
                    inputEl.oninput = (
                        e: UIEvent & { target: HTMLInputElement }
                    ) => this.onKupInput(e);
                    inputEl.onkeydown = (e: KeyboardEvent) => this.onKeyDown(e);
                    this.inputEl = inputEl;
                }
                if (icon) {
                    icon.onclick = (
                        e: MouseEvent & { target: HTMLInputElement }
                    ) => this.onKupIconClick(e);
                }
                if (clearIcon) {
                    clearIcon.onclick = () => this.onKupClearIconClick();
                }
                FTextFieldMDC(f);
            }
        }
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        logLoad(this, false);
        setThemeCustomStyle(this);
        this.value = this.initialValue;
    }

    componentDidLoad() {
        logLoad(this, true);
    }

    componentWillRender() {
        logRender(this, false);
    }

    componentDidRender() {
        this.setEvents();
        logRender(this, true);
    }

    render() {
        let props: FTextFieldProps = {
            disabled: this.disabled,
            fullHeight: this.rootElement.classList.contains('full-height')
                ? true
                : false,
            fullWidth: this.fullWidth,
            helper: this.helper,
            helperWhenFocused: this.helperWhenFocused,
            icon: this.icon,
            initialValue: this.initialValue,
            inputType: this.inputType,
            isClearable: this.isClearable,
            label: this.label,
            leadingLabel: this.leadingLabel,
            maxLength: this.maxLength,
            outlined: this.outlined,
            readOnly: this.readOnly,
            shaped: this.rootElement.classList.contains('shaped')
                ? true
                : false,
            step: this.step,
            textArea: this.textArea,
            trailingIcon: this.trailingIcon,
            trailingLabel: this.trailingLabel,
            value: this.value,
        };

        return (
            <Host>
                <style>{setCustomStyle(this)}</style>
                <div id="kup-component">
                    <FTextField {...props} />
                </div>
            </Host>
        );
    }
}
