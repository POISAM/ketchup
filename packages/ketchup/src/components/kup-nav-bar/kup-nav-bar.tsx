import {
    Component,
    Prop,
    Element,
    Host,
    Event,
    EventEmitter,
    State,
    h,
    Listen,
    Method,
} from '@stencil/core';
import {
    ComponentNavBarData,
    ComponentNavBarElement,
    getClassNameByComponentMode,
    ComponentNavBarMode,
} from './kup-nav-bar-declarations';
import { MDCTopAppBar } from '@material/top-app-bar';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import { positionRecalc } from '../../utils/recalc-position';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';

@Component({
    tag: 'kup-nav-bar',
    styleUrl: 'kup-nav-bar.scss',
    shadow: true,
})
export class KupNavBar {
    @Element() rootElement: HTMLElement;
    @State() customStyleTheme: string = undefined;

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop({ reflect: true }) customStyle: string = undefined;
    /**
     * The actual data of the nav bar.
     */
    @Prop() data: ComponentNavBarData = {
        title: 'default title',
    };
    /**
     * Defines how the bar will be displayed.
     */
    @Prop({ reflect: true }) mode: ComponentNavBarMode =
        ComponentNavBarMode.DEFAULT;

    private optionsButtonEl: any = undefined;
    private optionsListEl: any = undefined;
    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    private menuButtonEl: any = undefined;
    private menuListEl: any = undefined;
    private textColor: string = 'white';

    @Listen('click', { target: 'document' })
    listenClick() {
        this.closeList();
    }

    @Listen('keyup', { target: 'document' })
    listenKeyup(e: KeyboardEvent) {
        if (this.isListOpened()) {
            if (e.key === 'Escape') {
                this.closeList();
            }
            if (e.key === 'Enter') {
                this.closeList();
            }
            if (e.key === 'ArrowDown') {
                this.arrowDownList();
            }
            if (e.key === 'ArrowUp') {
                this.arrowUpList();
            }
        }
    }

    @Event({
        eventName: 'kupNavbarMenuItemClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarMenuItemClick: EventEmitter<{
        value: any;
    }>;

    @Event({
        eventName: 'kupNavbarOptionItemClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupNavbarOptionItemClick: EventEmitter<{
        value: any;
    }>;

    //---- Methods ----

    @Method()
    async refreshCustomStyle(customStyleTheme: string) {
        this.customStyleTheme =
            'Needs to be refreshed every time the theme changes because there are dynamic colors.';
        this.customStyleTheme = customStyleTheme;
        this.fetchThemeColors();
    }

    onKupNavbarMenuItemClick(e: CustomEvent) {
        let selectedValue: string = e.detail.selected.value;
        this.closeList();
        this.kupNavbarMenuItemClick.emit({
            value: selectedValue,
        });
    }

    onKupNavbarMenuButtonClick(value: string) {
        let selectedValue: string = value;
        this.kupNavbarMenuItemClick.emit({
            value: selectedValue,
        });
    }

    onKupNavbarOptionItemClick(e: CustomEvent) {
        let selectedValue: string = e.detail.selected.value;
        this.closeList();
        this.kupNavbarOptionItemClick.emit({
            value: selectedValue,
        });
    }

    onKupOptionButtonClick(value: string) {
        let selectedValue: string = value;
        this.kupNavbarOptionItemClick.emit({
            value: selectedValue,
        });
    }

    arrowDownList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.optionsListEl.arrowDown = true;
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.menuListEl.arrowDown = true;
        }
    }

    arrowUpList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.optionsListEl.arrowUp = true;
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.menuListEl.arrowUp = true;
        }
    }

    openList(listEl): boolean {
        this.closeList();
        if (listEl == null) {
            return false;
        }
        listEl.menuVisible = true;
        listEl.classList.add('dynamic-position-active');
        let elStyle: any = listEl.style;
        elStyle.height = 'auto';
        return true;
    }

    closeList() {
        if (this.isThisListOpened(this.optionsListEl)) {
            this.closeThisList(this.optionsListEl);
        }
        if (this.isThisListOpened(this.menuListEl)) {
            this.closeThisList(this.menuListEl);
        }
    }

    closeThisList(listEl) {
        if (listEl == null) {
            return;
        }
        listEl.menuVisible = false;
        listEl.classList.remove('dynamic-position-active');
    }

    isListOpened(): boolean {
        return (
            this.isThisListOpened(this.optionsListEl) ||
            this.isThisListOpened(this.menuListEl)
        );
    }

    isThisListOpened(listEl): boolean {
        if (listEl == null) {
            return false;
        }
        return listEl.menuVisible == true;
    }

    prepMenuList(listData: ComponentListElement[]): HTMLElement {
        this.menuListEl = null;
        if (listData.length == 0) {
            return null;
        }
        let comp: HTMLElement = (
            <kup-list
                data={...listData}
                is-menu
                show-icons
                onKupListClick={(e) => this.onKupNavbarMenuItemClick(e)}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.menuListEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    prepOptionsList(listData: ComponentListElement[]): HTMLElement {
        this.optionsListEl = null;
        if (listData.length == 0) {
            return null;
        }
        let comp: HTMLElement = (
            <kup-list
                data={...listData}
                is-menu
                show-icons
                onKupListClick={(e) => this.onKupNavbarOptionItemClick(e)}
                id={this.rootElement.id + '_list'}
                ref={(el) => (this.optionsListEl = el as any)}
            ></kup-list>
        );

        return comp;
    }

    private fetchThemeColors() {
        let color = document.documentElement.style.getPropertyValue(
            '--kup-nav-bar-background-color'
        );
        this.textColor = this.kupManager.theme.colorContrast(color);
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.setThemeCustomStyle(this);
        this.fetchThemeColors();
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        const root = this.rootElement.shadowRoot;
        if (root != null) {
            const topAppBarElement = root.querySelector('.mdc-top-app-bar');
            //MDCTopAppBar.attachTo(topAppBarElement);
            new MDCTopAppBar(topAppBarElement);
        }
        if (this.menuListEl != null) {
            positionRecalc(this.menuListEl, this.menuButtonEl);
        }
        if (this.optionsListEl != null) {
            positionRecalc(this.optionsListEl, this.optionsButtonEl);
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let wrapperClass = undefined;

        let visibleButtons: Array<HTMLElement> = [];
        let optionsButtons: ComponentListElement[] = [];
        let menuButtons: ComponentListElement[] = [];

        if (this.data.optionActions != null) {
            for (let i = 0; i < this.data.optionActions.length; i++) {
                let action: ComponentNavBarElement = this.data.optionActions[i];
                if (action.visible == true) {
                    let button = (
                        <kup-button
                            customStyle={`:host{ --kup-primary-color: ${this.textColor}; }`}
                            icon={action.icon}
                            title={action.tooltip}
                            onKupButtonClick={() =>
                                this.onKupOptionButtonClick(action.value)
                            }
                        ></kup-button>
                    );
                    visibleButtons.push(button);
                } else {
                    let listItem: ComponentListElement = {
                        text: action.text,
                        value: action.value,
                        icon: action.icon,
                    };
                    optionsButtons.push(listItem);
                }
            }
        }

        if (optionsButtons.length > 0) {
            let button = (
                <kup-button
                    customStyle={`:host{ --kup-primary-color: ${this.textColor}; }`}
                    icon="more_vert"
                    title="Options"
                    onKupButtonClick={() => this.openList(this.optionsListEl)}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => (this.optionsButtonEl = el as any)}
                ></kup-button>
            );
            visibleButtons.push(button);
        }

        let menuButton = null;
        if (this.data.menuAction != null) {
            let action = this.data.menuAction;
            menuButton = (
                <kup-button
                    customStyle={`:host{ --kup-primary-color: ${this.textColor}; }`}
                    icon={action.icon}
                    title={action.tooltip}
                    onKupButtonClick={() =>
                        this.onKupNavbarMenuButtonClick(action.value)
                    }
                ></kup-button>
            );
        } else if (this.data.menuActions != null) {
            for (let i = 0; i < this.data.menuActions.length; i++) {
                let action: ComponentNavBarElement = this.data.menuActions[i];
                let listItem: ComponentListElement = {
                    text: action.text,
                    value: action.value,
                    icon: action.icon,
                };
                menuButtons.push(listItem);
            }
            menuButton = (
                <kup-button
                    customStyle={`:host{ --kup-primary-color: ${this.textColor}; }`}
                    icon="menu"
                    title="Open navigation menu"
                    disabled={menuButtons.length == 0}
                    onKupButtonClick={() => this.openList(this.menuListEl)}
                    onClick={(e) => e.stopPropagation()}
                    ref={(el) => (this.menuButtonEl = el as any)}
                ></kup-button>
            );
        }

        let headerClassName =
            'mdc-top-app-bar ' + getClassNameByComponentMode(this.mode);
        let titleStyle = { color: this.textColor };
        return (
            <Host>
                <style>{this.kupManager.theme.setCustomStyle(this)}</style>
                <div id="kup-component" class={wrapperClass}>
                    <header class={headerClassName}>
                        <div class="mdc-top-app-bar__row">
                            <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                                {menuButton}
                                {this.prepMenuList(menuButtons)}
                                <span
                                    class="mdc-top-app-bar__title"
                                    style={titleStyle}
                                >
                                    {this.data.title}
                                </span>
                            </section>
                            <section
                                class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end"
                                role="toolbar"
                            >
                                {visibleButtons}
                                {this.prepOptionsList(optionsButtons)}
                            </section>
                        </div>
                    </header>
                </div>
            </Host>
        );
    }
}
