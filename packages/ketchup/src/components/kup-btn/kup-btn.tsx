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
import type { GenericObject } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { FButton } from '../../f-components/f-button/f-button';
import { FButtonMDC } from '../../f-components/f-button/f-button-mdc';
import { FButtonProps } from '../../f-components/f-button/f-button-declarations';
import { KupBtnProps } from './kup-btn-declarations';
import { TreeNode } from '../kup-tree/kup-tree-declarations';
import { ComponentListElement } from '../kup-list/kup-list-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';

@Component({
    tag: 'kup-btn',
    styleUrl: 'kup-btn.scss',
    shadow: true,
})
export class KupBtn {
    /**
     * References the root HTML element of the component (<kup-button>).
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
     * Number of columns for draw sub-components.
     */
    @Prop() columns: number = 0;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the sub-components.
     */
    @Prop() data: TreeNode[] = [];
    /**
     * Default at false. When set to true, the sub-components are disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * Defines the style of the buttons. Available styles are "flat" and "outlined", "raised" is the default.
     * If set, will be valid for all sub-components.
     */
    @Prop({ reflect: true }) styling: string = '';

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    @Event({
        eventName: 'kupBtnClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<{
        id: string;
        subId: string;
        obj: any;
    }>;

    onKupClick(index: string, subIndex: string) {
        this.kupClick.emit({
            id: index,
            subId: subIndex,
            obj: this.getObjForEvent(index, subIndex),
        });
    }

    onDropDownItemClick(e: CustomEvent, index: string) {
        this.onKupClick(index, e.detail.value);
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
     * Used to retrieve component's props values.
     * @param {boolean} descriptions - When provided and true, the result will be the list of props with their description.
     * @returns {Promise<GenericObject>} List of props as object, each key will be a prop.
     */
    @Method()
    async getProps(descriptions?: boolean): Promise<GenericObject> {
        let props: GenericObject = {};
        if (descriptions) {
            props = KupBtnProps;
        } else {
            for (const key in KupBtnProps) {
                if (Object.prototype.hasOwnProperty.call(KupBtnProps, key)) {
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
     * Set the events of the component and instantiates Material Design.
     */
    private setEvents(): void {
        const root: ShadowRoot = this.rootElement.shadowRoot;
        if (root) {
            const fs: NodeListOf<HTMLElement> = root.querySelectorAll(
                '.f-button--wrapper'
            );
            if (fs != null) {
                for (let i = 0; i < fs.length; i++) {
                    let f: HTMLElement = fs[i];
                    const buttonEl: HTMLButtonElement = f.querySelector(
                        'button'
                    );
                    if (buttonEl) {
                        buttonEl.onclick = () => this.onKupClick(f.id, '-1');
                    }
                    FButtonMDC(f);
                }
            }
        }
    }

    private renderButton(node: TreeNode, index: number) {
        if (node == null) {
            let message = 'Empty data button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        let data: GenericObject = this.prepareDataFromTreeNode(node, index);
        if (!data.label && !data.icon) {
            let message = 'Empty button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        let props: FButtonProps = {
            checked: data.checked,
            disabled: data.disabled,
            fullHeight: data.fullHeight,
            fullWidth: data.fullWidth,
            icon: data.icon,
            iconOff: data.iconOff,
            id: data.id,
            label: data.label,
            large: data.large,
            shaped: data.shaped,
            styling: data.styling,
            toggable: data.toggable,
            trailingIcon: data.trailingIcon,
            title: data.title,
        };
        return <FButton {...props} />;
    }

    private renderDropdownButton(node: TreeNode, index: number) {
        if (node == null) {
            let message = 'Empty data dropdown button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        let data: GenericObject = this.prepareDataFromTreeNode(node, index);
        if (!data.label && !data.icon) {
            let message = 'Empty dropdown button.';
            this.kupManager.debug.logMessage(
                this,
                message,
                KupDebugCategory.WARNING
            );
            return null;
        }
        data.data = {
            'kup-list': {
                data: this.getKupListDataForChildren(node.children),
                showIcons: true,
            },
        };
        return (
            <kup-dropdown-button
                class={this.rootElement.className}
                {...data}
                onKupDropdownSelectionItemClick={(e) =>
                    this.onDropDownItemClick(e, index.toString())
                }
            />
        );
    }

    private prepareDataFromTreeNode(
        node: TreeNode,
        index: number
    ): GenericObject {
        let data: GenericObject = node.data != null ? { ...node.data } : {};

        if (this.customStyle != null && this.customStyle.trim() != '') {
            data.customStyle = this.customStyle;
        }
        if (this.disabled == true || node.disabled == true) {
            data.disabled = true;
        }
        if (this.styling != null && this.styling.trim() != '') {
            data.styling = this.styling;
        }
        if (data.icon == null) {
            data.icon = node.icon;
        }
        if (data.label == null) {
            data.label = node.value;
        }
        data.fullHeight = this.rootElement.classList.contains('kup-full-height')
            ? true
            : false;
        data.fullWidth = this.rootElement.classList.contains('kup-full-width')
            ? true
            : false;
        data.id = index.toString();
        data.large = this.rootElement.classList.contains('kup-large')
            ? true
            : false;
        data.shaped = this.rootElement.classList.contains('kup-shaped')
            ? true
            : false;
        return data;
    }

    private getKupListDataForChildren(
        children: TreeNode[]
    ): ComponentListElement[] {
        let ris: ComponentListElement[] = [];

        for (let i = 0; i < children.length; i++) {
            let tn: TreeNode = children[i];
            ris.push({ text: tn.value, icon: tn.icon, value: i.toString() });
        }
        return ris;
    }

    private getObjForEvent(index: string, subIndex: string) {
        let indexInt: number = Number(index);
        let subIndexInt: number = -1;
        if (subIndex != null && subIndex.trim() != '') {
            subIndexInt = Number(subIndex);
        }

        let tn: TreeNode = this.data[indexInt];
        if (subIndexInt != -1) {
            return tn.children[subIndexInt].obj;
        }
        return tn.obj;
    }

    private renderButtons() {
        let columns = [];
        for (let i = 0; i < this.data.length; i++) {
            let node: TreeNode = this.data[i];
            let b;
            if (node.children != null && node.children.length > 0) {
                b = this.renderDropdownButton(node, i);
            } else {
                b = this.renderButton(node, i);
            }
            if (b == null) {
                continue;
            }
            columns.push(b);
        }
        return columns;
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.setEvents();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let buttons = this.renderButtons();
        let nrOfColumns = this.columns;
        if (nrOfColumns <= 0) {
            nrOfColumns = this.data.length;
        }

        let hostStyle = {
            '--grid-columns': `repeat(${nrOfColumns}, auto)`,
        };
        return (
            <Host style={hostStyle}>
                <style>{this.kupManager.theme.setCustomStyle(this)}</style>
                <div id="kup-component">
                    <div class="btn-container">{buttons}</div>
                </div>
            </Host>
        );
    }

    componentDidUnload() {
        this.kupManager.theme.unregister(this);
    }
}
