import {
    Component,
    Prop,
    Element,
    Host,
    State,
    h,
    Method,
    getAssetPath,
} from '@stencil/core';
import type { GenericObject } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { KupProgressBarProps } from './kup-progress-bar-declarations';

@Component({
    tag: 'kup-progress-bar',
    styleUrl: 'kup-progress-bar.scss',
    shadow: true,
})
export class KupProgressBar {
    @Element() rootElement: HTMLElement;
    @State() customStyleTheme: string = undefined;

    /**
     * Displays the label in the middle of the progress bar. It's the default for the radial variant and can't be changed.
     */
    @Prop() centeredLabel: boolean = true;
    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Flag to show or hide the progress bar's label.
     */
    @Prop() hideLabel: boolean = false;
    /**
     * Specifies an icon to replace the label.
     */
    @Prop() icon: string = undefined;
    /**
     * Specifies a text for the bar's label.
     */
    @Prop() label: string = undefined;
    /**
     * Radial version.
     */
    @Prop({ reflect: true }) isRadial: boolean = false;
    /**
     * The current value the progress bar must display.
     */
    @Prop() value: number = 0;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    //---- Methods ----

    @Method()
    async themeChangeCallback(customStyleTheme: string) {
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
            props = KupProgressBarProps;
        } else {
            for (const key in KupProgressBarProps) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        KupProgressBarProps,
                        key
                    )
                ) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }

    private createIconElement() {
        if (!this.icon) {
            return undefined;
        }

        if (
            this.icon.indexOf('.') > -1 ||
            this.icon.indexOf('/') > -1 ||
            this.icon.indexOf('\\') > -1
        ) {
            return (
                <span class="label icon-container is-image">
                    <img src={this.icon}></img>
                </span>
            );
        } else {
            let svg: string = `url('${getAssetPath(
                `./assets/svg/${this.icon}.svg`
            )}') no-repeat center`;
            let iconStyle = {
                mask: svg,
                webkitMask: svg,
            };
            return <span style={iconStyle} class="label icon-container"></span>;
        }
    }

    //---- Lifecycle hooks ----

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
        const root = this.rootElement.shadowRoot;

        if (root && this.isRadial) {
            let deg = this.value * 3.6 + 'deg';
            root.querySelector('.left-side').setAttribute(
                'style',
                'transform: rotate(' + deg + ')'
            );
        }
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let componentClass: string = '';
        let pieClass: string = 'pie';
        let radialStyle = undefined;
        if (this.isRadial) {
            componentClass = 'pie-wrapper';
        } else {
            componentClass = 'progress-bar';
        }

        let labelStyle = undefined;

        const valueStyle = {
            width: `${this.value}%`,
        };

        if (!this.centeredLabel) {
            labelStyle = valueStyle;
            if (this.value > 2) {
                componentClass += ' text-color-on-primary';
            }
        } else if (this.value > 49) {
            componentClass += ' text-color-on-primary';
        }

        let label = null;
        if (this.icon) {
            label = this.createIconElement();
        } else {
            if (!this.hideLabel) {
                if (this.isRadial) {
                    if (this.label) {
                        label = <span class="label">{this.label}</span>;
                    } else {
                        label = (
                            <span class="label">
                                {this.value}
                                <span class="smaller">%</span>
                            </span>
                        );
                    }
                } else {
                    if (this.label) {
                        label = this.label;
                    } else {
                        label = this.value + '%';
                    }
                }
            }
        }

        if (this.value > 0) {
            pieClass += ' has-value';
            if (this.value > 50) {
                pieClass += ' is-more-than-half';
            } else {
                pieClass += ' is-less-than-half';
            }
        }

        let el: HTMLElement;
        if (this.isRadial) {
            el = (
                <div class={componentClass}>
                    {label}
                    <div class={pieClass}>
                        <div
                            style={radialStyle}
                            class="left-side half-circle"
                        ></div>
                        <div class="right-side half-circle"></div>
                    </div>
                    <div class="shadow"></div>
                </div>
            );
        } else {
            el = (
                <div class={componentClass}>
                    <div class="progress-bar-percentage" style={valueStyle}>
                        <span style={labelStyle}>{label}</span>
                    </div>
                </div>
            );
        }

        return (
            <Host>
                <style>{this.kupManager.theme.setCustomStyle(this)}</style>
                <div id="kup-component">{el}</div>
            </Host>
        );
    }

    componentDidUnload() {
        this.kupManager.theme.unregister(this);
    }
}
