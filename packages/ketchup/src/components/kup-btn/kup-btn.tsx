import {
    Component,
    Element,
    Prop,
    State,
    h,
    Event,
    EventEmitter,
} from '@stencil/core';
import { FButtonStyling } from '../../f-components/f-button/f-button-declarations';
import { GenericObject } from '../../types/GenericTypes';

import { ButtonConfig } from './kup-btn-declarations';

@Component({
    tag: 'kup-btn',
    styleUrl: 'kup-btn.scss',
    shadow: true,
})
export class KupBtn {
    @Element() rootElement: HTMLElement;
    @Prop() buttons: any[];

    // setup props
    @Prop() config: ButtonConfig = { showicon: true, showtext: true };

    @State() selectedBtnIndex: number;

    @Event({
        eventName: 'kupBtnClick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    btnClicked: EventEmitter<{
        id: number;
    }>;

    onBtnClicked(event: CustomEvent) {
        this.selectedBtnIndex = parseInt(
            (event.target as HTMLElement).dataset.id
        );
        this.btnClicked.emit({
            id: this.selectedBtnIndex,
        });
    }

    render() {
        let buttonsInGrid = [];
        if (this.buttons) {
            if (this.config.columns && this.config.columns > 0) {
                this.buttons.forEach((btn, index) => {
                    const mod = index % this.config.columns;

                    if (mod === 0) {
                        // new row
                        buttonsInGrid.push([]);
                    }

                    buttonsInGrid[buttonsInGrid.length - 1].push(btn);
                });
            } else {
                if (this.config.horizontal) {
                    buttonsInGrid[0] = this.buttons;
                } else {
                    buttonsInGrid = this.buttons.map((b) => {
                        const arr = [];
                        arr.push(b);
                        return arr;
                    });
                }
            }
        }

        let buttonsJsx = null;
        let id = 0;

        if (buttonsInGrid.length > 0) {
            buttonsJsx = buttonsInGrid.map((btns) => {
                const btnsJsx = btns.map((btn) => {
                    const props = {
                        ...(this.config.fillspace
                            ? { class: 'kup-full-width' }
                            : {}),
                        ...(this.config.showtext ? { label: btn.value } : {}),
                        ...(this.config.showicon ? { icon: btn.icon } : {}),
                        ...(this.config.flat
                            ? { styling: FButtonStyling.FLAT }
                            : {}),
                        'data-id': id++,
                        onKupButtonClick: (ev) => this.onBtnClicked(ev),
                    };

                    let classObj: GenericObject = {};
                    if (this.rootElement.classList.contains('kup-large')) {
                        classObj['kup-large'] = true;
                    }

                    return (
                        <td>
                            <kup-button class={classObj} {...props} />
                        </td>
                    );
                });

                return <tr>{btnsJsx}</tr>;
            });
        }

        let compClass = 'btn-container';
        if (this.config.fillspace) {
            compClass += ' fillspace';
        }

        if (!this.config.horizontal) {
            compClass += ' vertical';
        }

        //- Composes the style of the button -
        // TODO this is how currently JSX can set custom CSS vars. Check periodically for a better way
        // It simply sets them in style inside the html. Not the most elegant way,
        // https://medium.com/geckoboard-under-the-hood/how-we-made-our-product-more-personalized-with-css-variables-and-react-b29298fde608
        // https://medium.com/fbdevclagos/how-to-leverage-styled-components-and-css-variables-to-build-truly-reusable-components-in-react-4bbf50467666

        return (
            <table class={compClass}>
                <tbody>{buttonsJsx}</tbody>
            </table>
        );
    }
}
