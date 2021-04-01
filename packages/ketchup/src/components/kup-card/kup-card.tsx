import {
    Component,
    Prop,
    Element,
    Host,
    Event,
    EventEmitter,
    State,
    h,
    Method,
    VNode,
} from '@stencil/core';
import { MDCRipple } from '@material/ripple';
import * as collapsibleLayouts from './collapsible/kup-card-collapsible';
import * as dialogLayouts from './dialog/kup-card-dialog';
import * as scalableLayouts from './scalable/kup-card-scalable';
import * as standardLayouts from './standard/kup-card-standard';
import type { GenericObject } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { CardData, CardFamily, KupCardProps } from './kup-card-declarations';
import { FImage } from '../../f-components/f-image/f-image';

@Component({
    tag: 'kup-card',
    styleUrl: 'kup-card.scss',
    shadow: true,
})
export class KupCard {
    /**
     * References the root HTML element of the component (<kup-card>).
     */
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    /**
     * The component-specific CSS set by the current Ketch.UP theme.
     * @default ""
     */
    @State() customStyleTheme: string = '';

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
     * The actual data of the card.
     * @default null
     */
    @Prop() data: CardData = null;
    /**
     * Defines whether the card is a menu or not.
     * Works together with menuVisible.
     * @default false
     */
    @Prop() isMenu: boolean = false;
    /**
     * Sets the type of the card.
     * @default CardFamily.STANDARD
     */
    @Prop() layoutFamily: CardFamily = CardFamily.STANDARD;
    /**
     * Sets the number of the layout.
     * @default 1
     */
    @Prop() layoutNumber: number = 1;
    /**
     * Sets the status of the card as menu, when false it's hidden otherwise it's visible.
     * Works together with isMenu.
     * @default false
     */
    @Prop() menuVisible: boolean = false;
    /**
     * The width of the card, defaults to 100%. Accepts any valid CSS format (px, %, vw, etc.).
     * @default "100%"
     */
    @Prop() sizeX: string = '100%';
    /**
     * The height of the card, defaults to 100%. Accepts any valid CSS format (px, %, vh, etc.).
     * @default "100%"
     */
    @Prop() sizeY: string = '100%';

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * kupCardEvent callback.
     */
    private cardEvent: EventListenerOrEventListenerObject = (
        e: CustomEvent
    ) => {
        this.onKupEvent(e);
    };
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    /**
     * Previous height of the component, tested when the card is collapsible.
     */
    private oldSizeY: string;
    /**
     * Used to prevent too many resizes callbacks at once.
     */
    private resizeTimeout: number;
    /**
     * Prevents multiple scaling callbacks when the card is scalable.
     */
    private scalingActive: boolean = false;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    /**
     * Triggered when the card is clicked.
     */
    @Event({
        eventName: 'kupCardClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        card: KupCard;
    }>;
    /**
     * Triggered when a sub-component of the card emits an event.
     */
    @Event({
        eventName: 'kupCardEvent',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupEvent: EventEmitter<{
        card: KupCard;
        event: any;
    }>;

    onKupClick(): void {
        this.kupClick.emit({
            card: this,
        });
    }

    onKupEvent(e: CustomEvent): void {
        const root = this.rootElement.shadowRoot;

        if (e.type === 'kupButtonClick' && e.detail.id === 'dialog-close') {
            this.rootElement.remove();
            return;
        }

        if (e.type === 'kupButtonClick' && e.detail.id === 'expand-action') {
            let collapsibleCard = root.querySelector('.collapsible-card');
            if (!collapsibleCard.classList.contains('expanded')) {
                collapsibleCard.classList.add('expanded');
                this.oldSizeY = this.sizeY;
                this.sizeY = 'auto';
            } else if (this.oldSizeY) {
                collapsibleCard.classList.remove('expanded');
                this.sizeY = this.oldSizeY;
            }
            return;
        }

        this.kupEvent.emit({
            card: this,
            event: e,
        });
    }

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * This method is invoked by the theme manager.
     * Whenever the current Ketch.UP theme changes, every component must be re-rendered with the new component-specific customStyle.
     * @param customStyleTheme - Contains current theme's component-specific CSS.
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     * @see https://ketchup.smeup.com/ketchup-showcase/#/theming
     */
    @Method()
    async themeChangeCallback(customStyleTheme: string): Promise<void> {
        this.customStyleTheme = customStyleTheme;
    }
    /**
     * This method is invoked by KupManager whenever the component changes size.
     */
    @Method()
    async resizeCallback(): Promise<void> {
        window.clearTimeout(this.resizeTimeout);
        this.resizeTimeout = window.setTimeout(() => {
            this.layoutManager();
        }, 300);
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
            props = KupCardProps;
        } else {
            for (const key in KupCardProps) {
                if (Object.prototype.hasOwnProperty.call(KupCardProps, key)) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    /**
     * This method is invoked by the layout manager when the layout family is collapsible.
     * When the card is not expanded and the collapsible content fits the wrapper, the bottom bar won't be displayed.
     */
    collapsible(): void {
        const root = this.rootElement.shadowRoot;
        const el = root.querySelector('.collapsible-element');
        const card = root.querySelector('.collapsible-card');
        const wrapper = root.querySelector('.collapsible-wrapper');
        if (!card.classList.contains('expanded')) {
            if (el.clientHeight > wrapper.clientHeight) {
                if (!card.classList.contains('collapsible-active')) {
                    card.classList.add('collapsible-active');
                }
            } else {
                if (card.classList.contains('collapsible-active')) {
                    card.classList.remove('collapsible-active');
                }
            }
        }
    }
    /**
     * This method will return the virtual node of the card, selecting the correct layout through layoutFamily and layoutNumber.
     * @returns {VNode} Virtual node of the card for the specified family layout and number.
     */
    getLayout(): VNode {
        const family: string = this.layoutFamily.toLowerCase();
        const method: string = 'create' + this.layoutNumber;

        try {
            switch (family) {
                case CardFamily.COLLAPSIBLE: {
                    return collapsibleLayouts[method](this);
                }
                case CardFamily.DIALOG: {
                    return dialogLayouts[method](this);
                }
                case CardFamily.SCALABLE: {
                    return scalableLayouts[method](this);
                }
                default:
                case CardFamily.STANDARD: {
                    return standardLayouts[method](this);
                }
            }
        } catch (error) {
            this.kupManager.debug.logMessage(this, error, 'warning');
            let props = {
                resource: 'warning',
                title: 'Layout not yet implemented!',
            };
            return <FImage {...props}></FImage>;
        }
    }
    /**
     * This method will trigger whenever the card's render() hook occurs or when the size changes (through KupManager), in order to manage the more complex layout families.
     * It will also update any dynamic color handled by the selected layout.
     */
    dialog() {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const card: HTMLElement = this.rootElement as HTMLElement;
            const headerBar: HTMLElement = root.querySelector('#header-bar');
            if (!this.kupManager.moveOnDrag.isRegistered(card)) {
                if (headerBar) {
                    this.kupManager.moveOnDrag.register(card, headerBar);
                } else {
                    this.kupManager.moveOnDrag.register(card);
                }
            }
        }
    }
    /**
     * This method will trigger whenever the card's render() hook occurs or when the size changes (through KupManager), in order to manage the more complex layout families.
     * It will also update any dynamic color handled by the selected layout.
     */
    layoutManager(): void {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        const family: string = this.layoutFamily.toLowerCase();
        const dynColors: NodeListOf<HTMLElement> = root.querySelectorAll(
            '.dyn-color'
        );
        for (let index = 0; index < dynColors.length; index++) {
            this.rootElement.style.setProperty(
                '--dyn-color-' + index,
                this.kupManager.theme.colorContrast(
                    window.getComputedStyle(dynColors[index]).backgroundColor
                )
            );
        }
        switch (family) {
            case CardFamily.COLLAPSIBLE:
                this.collapsible();
                break;
            case CardFamily.DIALOG:
                this.dialog();
                break;
            case CardFamily.SCALABLE:
                if (!this.scalingActive) {
                    this.scalable();
                }
                break;
            default:
                break;
        }
    }
    /**
     * Sets the event listeners on the sub-components, in order to properly emit the generic kupCardEvent.
     */
    registerListeners(): void {
        const root = this.rootElement.shadowRoot;
        root.addEventListener('kupButtonClick', this.cardEvent);
        root.addEventListener('kupCheckboxChange', this.cardEvent);
        root.addEventListener('kupChipClick', this.cardEvent);
        root.addEventListener('kupChipIconClick', this.cardEvent);
        root.addEventListener('kupComboboxItemClick', this.cardEvent);
        root.addEventListener('kupTextFieldClearIconClick', this.cardEvent);
        root.addEventListener('kupDatePickerClearIconClick', this.cardEvent);
        root.addEventListener('kupTimePickerClearIconClick', this.cardEvent);
        root.addEventListener('kupTextFieldInput', this.cardEvent);
        root.addEventListener('kupDatePickerInput', this.cardEvent);
        root.addEventListener('kupDatePickerItemClick', this.cardEvent);
        root.addEventListener('kupTimePickerInput', this.cardEvent);
        root.addEventListener('kupTimePickerItemClick', this.cardEvent);
        root.addEventListener('kupTextFieldSubmit', this.cardEvent);
        root.addEventListener('kupDatePickerTextFieldSubmit', this.cardEvent);
        root.addEventListener('kupTimePickerTextFieldSubmit', this.cardEvent);
    }
    /**
     * This method is invoked by the layout manager when the layout family is scalable.
     * The content of the card (.scalable-element) will be resized to fit the wrapper (.scalable-card).
     * The scaling is performed by using a CSS variable (--multiplier) which will impact the card's font-size.
     * When there is empty space, the multiplier will be increased, as will the content.
     * Viceversa, when the content exceeds the boundaries, the multiplier will be decreased.
     */
    scalable(): void {
        this.scalingActive = true;
        const root: ShadowRoot = this.rootElement.shadowRoot;
        const el: HTMLElement = root.querySelector('.scalable-element');
        const card: HTMLElement = root.querySelector('.scalable-card');
        let multiplierStep: number = 0.1;
        let multiplier: number = parseFloat(
            card.style.getPropertyValue('--multiplier')
        );
        if (multiplier < 0.1) {
            multiplier = 1;
        }
        /**
         * cardHeight sets the maximum height of the content, when exceeded the multiplier will be reduced (90%).
         */
        let cardHeight: number = (90 / 100) * card.clientHeight;
        /**
         * cardWidthLow and cardWidthHigh will set the boundaries in which the component must fit (85% - 95%).
         */
        let cardWidthLow: number = (85 / 100) * card.clientWidth;
        let cardWidthHigh: number = (95 / 100) * card.clientWidth;
        let tooManyAttempts: number = 2000;
        /**
         * Cycle to adjust the width.
         */
        while (
            (el.clientWidth < cardWidthLow || el.clientWidth > cardWidthHigh) &&
            tooManyAttempts > 0 &&
            multiplier > multiplierStep
        ) {
            tooManyAttempts--;
            if (el.clientWidth < cardWidthLow) {
                multiplier = multiplier + multiplierStep;
                card.style.setProperty('--multiplier', multiplier + '');
            } else if (el.clientWidth > cardWidthHigh) {
                multiplier = multiplier - multiplierStep;
                card.style.setProperty('--multiplier', multiplier + '');
            } else {
                tooManyAttempts = 0;
            }
        }
        /**
         * Cycle to adjust the height, in case it exceeds its boundaries after having adjusted width.
         */
        while (el.clientHeight > cardHeight && multiplier > multiplierStep) {
            multiplier = multiplier - multiplierStep;
            card.style.setProperty('--multiplier', multiplier + '');
        }
        this.scalingActive = false;
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.registerListeners();
    }

    componentDidLoad() {
        const rippleEl: HTMLElement = this.rootElement.shadowRoot.querySelector(
            '.mdc-ripple-surface'
        );
        if (rippleEl) {
            MDCRipple.attachTo(rippleEl);
        }
        this.kupManager.resize.observe(this.rootElement);
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.layoutManager();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        if (!this.data) {
            this.kupManager.debug.logMessage(
                this,
                'Data missing, not rendering!',
                'warning'
            );
            return;
        }

        const style = {
            '--kup-card-height': this.sizeY ? this.sizeY : '100%',
            '--kup-card-width': this.sizeX ? this.sizeX : '100%',
        };

        return (
            <Host style={style}>
                <style>{this.kupManager.theme.setCustomStyle(this)}</style>
                <div
                    id="kup-component"
                    class={`${this.isMenu ? 'mdc-menu mdc-menu-surface' : ''} ${
                        this.menuVisible ? 'visible' : ''
                    }`}
                    onClick={() => this.onKupClick()}
                >
                    {this.getLayout()}
                </div>
            </Host>
        );
    }

    componentDidUnload() {
        this.kupManager.theme.unregister(this);
        this.kupManager.moveOnDrag.unregister([
            this.rootElement as HTMLElement,
        ]);
        this.kupManager.resize.unobserve(this.rootElement);
    }
}
