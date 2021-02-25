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
import { FChip } from '../../f-components/f-chip/f-chip';
import { FChipMDC } from '../../f-components/f-chip/f-chip-mdc';
import {
    FChipData,
    FChipsProps,
    FChipType,
} from '../../f-components/f-chip/f-chip-declarations';

@Component({
    tag: 'kup-chip',
    styleUrl: 'kup-chip.scss',
    shadow: true,
})
export class KupChip {
    /**
     * References the root HTML element of the component (<kup-image>).
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
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     * @default ""
     */
    @Prop() customStyle: string = '';
    /**
     * List of elements.
     * @default []
     */
    @Prop() data: FChipData[] = [];
    /**
     * The type of chip. Available types: input, filter, choice or empty for default.
     * @default FChipType.STANDARD
     */
    @Prop() type: FChipType = FChipType.STANDARD;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    /**
     * Triggered when a chip loses focus.
     */
    @Event({
        eventName: 'kupChipBlur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<{
        id: string;
        index: number;
        value: string;
    }>;
    /**
     * Triggered when a chip is clicked.
     */
    @Event({
        eventName: 'kupChipClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        id: string;
        index: number;
        value: string;
    }>;
    /**
     * Triggered when a chip gets focused.
     */
    @Event({
        eventName: 'kupChipFocus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<{
        id: string;
        index: number;
        value: string;
    }>;
    /**
     * Triggered when the removal icon on input chips is clicked.
     */
    @Event({
        eventName: 'kupChipIconClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIconClick: EventEmitter<{
        id: string;
        index: number;
        value: string;
    }>;

    onKupBlur(i: number) {
        let value: string = undefined;
        if (this.data[i]) {
            value = this.data[i].value;
        }
        this.kupBlur.emit({
            id: this.rootElement.id,
            index: i,
            value: value,
        });
    }

    onKupClick(i: number) {
        const isChoice = this.type.toLowerCase() === FChipType.CHOICE;
        const isFilter = this.type.toLowerCase() === FChipType.FILTER;
        let value: string;
        if (this.data[i]) {
            value = this.data[i].value;
        }
        if (isChoice) {
            for (let j = 0; j < this.data.length; j++) {
                if (j !== i && this.data[j].checked) {
                    this.data[j].checked = false;
                }
            }
        }
        if (isChoice || isFilter) {
            if (this.data[i].checked) {
                this.data[i].checked = false;
            } else {
                this.data[i].checked = true;
            }
            let newData = [...this.data];
            this.data = newData;
        }
        this.kupClick.emit({
            id: this.rootElement.id,
            index: i,
            value: value,
        });
    }

    onKupFocus(i: number) {
        let value: string = undefined;
        if (this.data[i]) {
            value = this.data[i].value;
        }
        this.kupFocus.emit({
            id: this.rootElement.id,
            index: i,
            value: value,
        });
    }

    onKupIconClick(i: number) {
        let value: string = undefined;
        if (this.data[i]) {
            value = this.data[i].value;
        }
        this.data.splice(i, 1);
        let newData = [...this.data];
        this.data = newData;
        this.kupIconClick.emit({
            id: this.rootElement.id,
            index: i,
            value: value,
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
    async refreshCustomStyle(customStyleTheme: string) {
        this.customStyleTheme = customStyleTheme;
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
            const f: HTMLElement = root.querySelector('.f-chip--wrapper');
            if (f) {
                const chips: NodeListOf<HTMLElement> = f.querySelectorAll(
                    '.mdc-chip'
                );
                for (let j = 0; j < chips.length; j++) {
                    const primaryEl: HTMLElement = chips[j].querySelector(
                        '.mdc-chip__primary-action'
                    );
                    primaryEl.onblur = () => this.onKupBlur(j);
                    primaryEl.onfocus = () => this.onKupFocus(j);

                    const cancelIcon: HTMLElement = chips[j].querySelector(
                        '.mdc-chip__icon.clear'
                    );
                    if (cancelIcon) {
                        cancelIcon.onclick = () => this.onKupIconClick(j);
                    }

                    chips[j].onclick = () => this.onKupClick(j);
                }
                FChipMDC(f);
            }
        }
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        logLoad(this, false);
        setThemeCustomStyle(this);
    }

    componentDidLoad() {
        logLoad(this, true);
    }

    componentWillUpdate() {
        const isChoice = this.type.toLowerCase() === FChipType.CHOICE;
        let firstCheckedFound: boolean = false;
        if (isChoice) {
            for (let j = 0; j < this.data.length; j++) {
                if (this.data[j].checked && firstCheckedFound) {
                    this.data[j].checked = false;
                    let message =
                        'Found occurence of data(' +
                        j +
                        ") to be set on 'checked' when another one was found before! Overriding to false because the 'choice' type only allows 1 'checked'.";

                    logMessage(this, message, 'warning');
                }
                if (this.data[j].checked && !firstCheckedFound) {
                    firstCheckedFound = true;
                }
            }
        }
    }

    componentWillRender() {
        logRender(this, false);
    }

    componentDidRender() {
        this.setEvents();
        logRender(this, true);
    }

    render() {
        let props: FChipsProps = {
            data: this.data,
            type: this.type,
        };

        if (this.data.length === 0) {
            let message = 'Empty data.';
            logMessage(this, message, 'warning');
            return;
        }

        return (
            <Host>
                <style>{setCustomStyle(this)}</style>
                <div id="kup-component">
                    <FChip {...props} />
                </div>
            </Host>
        );
    }
}
