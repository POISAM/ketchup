import {
    Component,
    Event,
    EventEmitter,
    Element,
    forceUpdate,
    h,
    Host,
    Listen,
    Method,
    Prop,
    State,
} from '@stencil/core';
import type { GenericObject, KupComponent } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    ItemsDisplayMode,
    KupListEventPayload,
} from '../kup-list/kup-list-declarations';
import { consistencyCheck } from '../kup-list/kup-list-helper';
import { FTextField } from '../../f-components/f-text-field/f-text-field';
import { FTextFieldMDC } from '../../f-components/f-text-field/f-text-field-mdc';
import {
    KupComboboxEventPayload,
    KupComboboxProps,
} from './kup-combobox-declarations';
import { KupThemeIconValues } from '../../utils/kup-theme/kup-theme-declarations';
import { getProps, setProps } from '../../utils/utils';
import { componentWrapperId } from '../../variables/GenericVariables';
import { KupManagerClickCb } from '../../utils/kup-manager/kup-manager-declarations';
import { KupDynamicPositionPlacement } from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';

@Component({
    tag: 'kup-combobox',
    styleUrl: 'kup-combobox.scss',
    shadow: true,
})
export class KupCombobox {
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    @State() displayedValue: string = undefined;
    @State() value: string = '';

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the sub-components (date input text field).
     */
    @Prop() data: Object = undefined;
    /**
     * Defaults at false. When set to true, the component is disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * Sets how to show the selected item value. Suported values: "code", "description", "both".
     */
    @Prop() displayMode: ItemsDisplayMode = ItemsDisplayMode.DESCRIPTION;
    /**
     * Sets the initial value of the component
     */
    @Prop() initialValue: string = '';
    /**
     * Lets the combobox behave as a select element.
     */
    @Prop({ reflect: true }) isSelect: boolean = false;
    /**
     * Sets how to return the selected item value. Suported values: "code", "description", "both".
     */
    @Prop() selectMode: ItemsDisplayMode = ItemsDisplayMode.CODE;
    /**
     * When true shows the drop-down icon, for open list.
     */
    @Prop() showDropDownIcon: boolean = true;

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    private elStyle: any = undefined;
    private listEl: HTMLKupListElement = undefined;
    private textfieldWrapper: HTMLElement = undefined;
    private textfieldEl: HTMLInputElement | HTMLTextAreaElement = undefined;
    private clickCb: KupManagerClickCb = null;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    @Event({
        eventName: 'kup-combobox-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupComboboxEventPayload>;

    @Event({
        eventName: 'kup-combobox-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupComboboxEventPayload>;

    @Event({
        eventName: 'kup-combobox-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupComboboxEventPayload>;

    @Event({
        eventName: 'kup-combobox-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupComboboxEventPayload>;

    @Event({
        eventName: 'kup-combobox-input',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<KupComboboxEventPayload>;

    @Event({
        eventName: 'kup-combobox-iconclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIconClick: EventEmitter<KupComboboxEventPayload>;

    @Event({
        eventName: 'kup-combobox-itemclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupItemClick: EventEmitter<KupComboboxEventPayload>;

    onKupBlur() {
        this.kupBlur.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupChange(e: UIEvent & { target: HTMLInputElement }) {
        this.consistencyCheck(null, e.target.value);
        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupClick(e: UIEvent & { target: HTMLInputElement }) {
        const { target } = e;

        if (this.isSelect) {
            if (this.textfieldWrapper.classList.contains('toggled')) {
                this.closeList();
            } else {
                this.openList();
            }
        }

        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupFocus(e: UIEvent & { target: HTMLInputElement }) {
        const { target } = e;
        this.kupFocus.emit({
            comp: this,
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupInput(e: UIEvent & { target: HTMLInputElement }) {
        this.consistencyCheck(null, e.target.value);
        this.kupInput.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupIconClick(event: UIEvent & { target: HTMLInputElement }) {
        const { target } = event;

        if (this.textfieldWrapper.classList.contains('toggled')) {
            this.closeList();
        } else {
            this.openList();
        }
        this.kupIconClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: target.value,
        });
    }

    onKupItemClick(e: CustomEvent) {
        this.consistencyCheck(e);
        this.closeList();
        if (this.textfieldEl) {
            this.textfieldEl.focus();
        }
        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
        this.kupItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    /*-------------------------------------------------*/
    /*                L i s t e n e r s                */
    /*-------------------------------------------------*/

    @Listen('keydown')
    listenKeydown(e: KeyboardEvent) {
        if (this.isListOpened()) {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    this.listEl.focusNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    this.listEl.focusPrevious();
                    break;
                case 'Enter':
                    e.preventDefault();
                    e.stopPropagation();
                    this.listEl.select().then(() => {
                        this.closeList();
                        this.textfieldEl.focus();
                    });
                    break;
                case 'Escape':
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeList();
                    break;
            }
        } else {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    e.stopPropagation();
                    this.openList();
                    this.listEl.focusNext();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    this.openList();
                    this.listEl.focusPrevious();
                    break;
            }
        }
    }

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        return getProps(this, KupComboboxProps, descriptions);
    }
    /**
     * Retrieves the component's value.
     * @returns {string} Value of the component.
     */
    @Method()
    async getValue(): Promise<string> {
        return this.value;
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }
    /**
     * Sets the focus to the component.
     */
    @Method()
    async setFocus() {
        this.textfieldEl.focus();
    }
    /**
     * Sets the props to the component.
     * @param {GenericObject} props - Object containing props that will be set to the component.
     */
    @Method()
    async setProps(props: GenericObject): Promise<void> {
        setProps(this, KupComboboxProps, props);
    }
    /**
     * Sets the component's value.
     * @param {string} value - Value to be set.
     */
    @Method()
    async setValue(value: string) {
        this.value = value;
        this.consistencyCheck(undefined, value);
    }

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    openList() {
        this.textfieldWrapper.classList.add('toggled');
        this.listEl.menuVisible = true;
        const elStyle = this.listEl.style;
        elStyle.height = 'auto';
        elStyle.minWidth = this.textfieldWrapper.clientWidth + 'px';
        if (this.kupManager.dynamicPosition.isRegistered(this.listEl)) {
            this.kupManager.dynamicPosition.changeAnchor(
                this.listEl,
                this.textfieldWrapper
            );
        } else {
            this.kupManager.dynamicPosition.register(
                this.listEl,
                this.textfieldWrapper,
                0,
                KupDynamicPositionPlacement.AUTO,
                true
            );
        }
        this.kupManager.dynamicPosition.start(this.listEl);
        if (!this.clickCb) {
            this.clickCb = {
                cb: () => {
                    this.closeList();
                },
                el: this.listEl,
            };
        }
        this.kupManager.addClickCallback(this.clickCb, true);
    }

    closeList() {
        this.textfieldWrapper.classList.remove('toggled');
        this.listEl.menuVisible = false;
        this.kupManager.dynamicPosition.stop(this.listEl);
        this.kupManager.removeClickCallback(this.clickCb);
    }

    isListOpened(): boolean {
        return this.listEl.menuVisible == true;
    }

    consistencyCheck(e?: CustomEvent, valueIn?: string) {
        let ret = consistencyCheck(
            valueIn,
            this.data['kup-list'],
            this.listEl,
            this.selectMode,
            this.displayMode,
            e
        );
        this.value = ret.value;
        this.displayedValue = ret.displayedValue;
    }

    prepList() {
        return (
            <kup-list
                {...this.data['kup-list']}
                displayMode={this.displayMode}
                is-menu
                onkup-list-click={(e: CustomEvent<KupListEventPayload>) =>
                    this.onKupItemClick(e)
                }
                ref={(el) => (this.listEl = el)}
            ></kup-list>
        );
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.value = this.initialValue;
        if (!this.data) {
            this.data = {
                'kup-list': {},
                'kup-text-field': {},
            };
        }
    }

    componentDidLoad() {
        this.consistencyCheck(undefined, this.value);
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const f: HTMLElement = root.querySelector('.f-text-field');
            if (f) {
                this.textfieldWrapper = f;
                this.textfieldEl = f.querySelector('input');
                FTextFieldMDC(f);
            }
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        const fullHeight: boolean =
            this.rootElement.classList.contains('kup-full-height');
        const fullWidth: boolean =
            this.rootElement.classList.contains('kup-full-width');

        return (
            <Host
                class={`${fullHeight ? 'kup-full-height' : ''} ${
                    fullWidth ? 'kup-full-width' : ''
                }`}
                style={this.elStyle}
            >
                <style>
                    {this.kupManager.theme.setKupStyle(
                        this.rootElement as KupComponent
                    )}
                </style>
                <div id={componentWrapperId} style={this.elStyle}>
                    <FTextField
                        {...this.data['kup-text-field']}
                        disabled={this.disabled}
                        fullHeight={fullHeight}
                        fullWidth={fullWidth}
                        icon={
                            this.showDropDownIcon
                                ? KupThemeIconValues.DROPDOWN
                                : null
                        }
                        readOnly={this.isSelect}
                        trailingIcon={true}
                        value={this.displayedValue}
                        onBlur={() => this.onKupBlur()}
                        onChange={(e: UIEvent & { target: HTMLInputElement }) =>
                            this.onKupChange(e)
                        }
                        onClick={(
                            e: MouseEvent & { target: HTMLInputElement }
                        ) => this.onKupClick(e)}
                        onFocus={(
                            e: FocusEvent & { target: HTMLInputElement }
                        ) => this.onKupFocus(e)}
                        onInput={(e: UIEvent & { target: HTMLInputElement }) =>
                            this.onKupInput(e)
                        }
                        onIconClick={(
                            e: MouseEvent & { target: HTMLInputElement }
                        ) => this.onKupIconClick(e)}
                    >
                        {this.prepList()}
                    </FTextField>
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        if (this.listEl) {
            this.kupManager.dynamicPosition.unregister([this.listEl]);
            this.listEl.remove();
        }
        this.kupManager.theme.unregister(this);
    }
}
