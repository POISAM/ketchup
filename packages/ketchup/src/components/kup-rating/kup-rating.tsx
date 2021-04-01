import {
    Component,
    Prop,
    Event,
    Element,
    Host,
    EventEmitter,
    State,
    Watch,
    h,
    Method,
} from '@stencil/core';
import { GenericObject } from '../../types/GenericTypes';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import { KupRatingProps } from './kup-rating-declarations';

@Component({
    tag: 'kup-rating',
    styleUrl: 'kup-rating.scss',
    shadow: true,
})
export class KupRating {
    @Element() rootElement: HTMLElement;
    @State() customStyleTheme: string = undefined;
    @State() stars: Array<object> = [];

    /**
     * Custom style of the component. For more information: https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Defaults at false. When set to true, the component is disabled.
     */
    @Prop() disabled: boolean = false;
    /**
     * Max number of stars (default 5)
     */
    @Prop() maxValue: number = 5;
    /**
     * Rated stars
     */
    @Prop() value: number = 0;

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();

    @Event() kupRatingClicked: EventEmitter;

    @Watch('value')
    @Watch('maxValue')
    private onValueChanged() {
        this.buildStars(this.value);
    }

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
            props = KupRatingProps;
        } else {
            for (const key in KupRatingProps) {
                if (Object.prototype.hasOwnProperty.call(KupRatingProps, key)) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }

    onStarClicked(newValue: number) {
        if (!this.disabled) {
            this.value = newValue;
            this.buildStars(this.value);
            this.kupRatingClicked.emit({ value: this.value });
        }
    }

    onMouseOver(newValue: number) {
        if (!this.disabled) {
            this.buildStars(newValue);
        }
    }

    onMouseOut() {
        if (!this.disabled) {
            this.buildStars(this.value);
        }
    }

    buildStars(numberOfStars: number) {
        let stars = [];

        for (let i = 1; i <= this.maxValue; i++) {
            if (i <= numberOfStars) {
                stars.push(
                    <span
                        class="rating"
                        onMouseOver={() => this.onMouseOver(i)}
                        onMouseOut={() => this.onMouseOut()}
                        onClick={() => this.onStarClicked(i)}
                    >
                        &#x2605;
                    </span>
                );
            } else {
                stars.push(
                    <span
                        class="rating"
                        onMouseOver={() => this.onMouseOver(i)}
                        onMouseOut={() => this.onMouseOut()}
                        onClick={() => this.onStarClicked(i)}
                    >
                        &#x2606;
                    </span>
                );
            }
        }

        this.stars = stars;
    }

    //---- Lifecycle hooks ----

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.onValueChanged();
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        return (
            <Host>
                <style>{this.kupManager.theme.setCustomStyle(this)}</style>
                <div id="kup-component">
                    <div>{this.stars}</div>
                </div>
            </Host>
        );
    }

    componentDidUnload() {
        this.kupManager.theme.unregister(this);
    }
}
