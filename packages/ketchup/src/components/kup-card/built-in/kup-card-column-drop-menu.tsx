import { h, VNode } from '@stencil/core';
import {
    KupChipEventPayload,
    KupChipNode,
} from '../../kup-chip/kup-chip-declarations';
import {
    KupListData,
    KupListEventPayload,
} from '../../kup-list/kup-list-declarations';
import { FButtonStyling } from '../../../f-components/f-button/f-button-declarations';
import {
    KupLanguageColumn,
    KupLanguageGeneric,
    KupLanguageTotals,
} from '../../../managers/kup-language/kup-language-declarations';
import { KupDom } from '../../../managers/kup-manager/kup-manager-declarations';
import { KupCard } from '../kup-card';
import { KupCardColumnDropMenuOptions } from '../kup-card-declarations';
import { KupDataNewColumnTypes } from '../../../managers/kup-data/kup-data-declarations';

const dom: KupDom = document.documentElement as KupDom;

const premadeFormulas = [
    KupLanguageTotals.AVERAGE,
    KupLanguageTotals.DIFFERENCE,
    KupLanguageTotals.PRODUCT,
    KupLanguageTotals.SUM,
];

export function prepareColumnDropMenu(component: KupCard) {
    const options = component.data.options as KupCardColumnDropMenuOptions;
    const chipData: KupChipNode[] = [];
    let list: VNode, combobox: VNode, button: VNode, chipSet: VNode;
    for (let index = 0; index < options.data.columns.length; index++) {
        const column = options.data.columns[index];
        if (
            column.visible !== false &&
            column.obj &&
            dom.ketchup.objects.isNumber(column.obj)
        ) {
            chipData.push({
                obj: column.obj,
                value: column.name,
                title: column.title,
                id: column.name,
            });
        }
    }
    const numericalColumnsExist = !!(chipData.length > 0);
    if (options.enableMerge || options.enableMove) {
        list = prepareList(options);
    }
    if (options.enableFormula) {
        combobox = prepareCombobox(options, numericalColumnsExist);
        if (numericalColumnsExist) {
            button = (
                <kup-button
                    onKup-button-click={() => applyFormula(component)}
                    label={dom.ketchup.language.translate(
                        KupLanguageTotals.CALCULATE
                    )}
                    styling={FButtonStyling.OUTLINED}
                ></kup-button>
            );
            chipSet = (
                <div class="sub-chip">
                    <kup-chip
                        data={chipData}
                        onKup-chip-click={(
                            e: CustomEvent<KupChipEventPayload>
                        ) => typeColumn(e, component)}
                    ></kup-chip>
                </div>
            );
        }
    }

    return [list, combobox, button, chipSet];
}

function prepareList(options: KupCardColumnDropMenuOptions): VNode {
    const listData: KupListData[] = [];

    if (options.enableMerge) {
        listData.push({
            text: dom.ketchup.language.translate(KupLanguageGeneric.MERGE),
            value: KupLanguageGeneric.MERGE,
            icon: 'library_add',
        });
    }
    if (options.enableMove) {
        listData.push({
            text: dom.ketchup.language.translate(KupLanguageGeneric.MOVE),
            value: KupLanguageGeneric.MOVE,
            icon: 'swap_horiz',
        });
    }

    return listData.length > 0 ? (
        <kup-list
            data={listData}
            showIcons={true}
            onkup-list-click={(e: CustomEvent<KupListEventPayload>) =>
                listClick(e, options)
            }
        ></kup-list>
    ) : null;
}

function prepareCombobox(
    options: KupCardColumnDropMenuOptions,
    numericalColumnsExist: boolean
): VNode {
    const comboListData: KupListData[] = [];
    const numeric: boolean =
        dom.ketchup.objects.isNumber(options.receivingColumn.obj) &&
        dom.ketchup.objects.isNumber(options.starterColumn.obj);
    if (numeric) {
        comboListData.push(
            {
                text: dom.ketchup.language.translate(KupLanguageTotals.AVERAGE),
                value: KupLanguageTotals.AVERAGE,
            },
            {
                text: dom.ketchup.language.translate(
                    KupLanguageTotals.DIFFERENCE
                ),
                value: KupLanguageTotals.DIFFERENCE,
            },
            {
                text: dom.ketchup.language.translate(KupLanguageTotals.PRODUCT),
                value: KupLanguageTotals.PRODUCT,
            },
            {
                text: dom.ketchup.language.translate(KupLanguageTotals.SUM),
                value: KupLanguageTotals.SUM,
            },
            {
                text: `[${options.starterColumn.name}] / [${options.receivingColumn.name}] * 100`,
                value: `([${options.starterColumn.name}]/[${options.receivingColumn.name}])*100`,
            },
            {
                text: `[${options.receivingColumn.name}] / [${options.starterColumn.name}] * 100`,
                value: `([${options.receivingColumn.name}]/[${options.starterColumn.name}])*100`,
            }
        );
    } else {
        comboListData.push({
            text: dom.ketchup.language.translate(KupLanguageColumn.NO_FORMULA),
            value: KupLanguageColumn.NO_FORMULA,
        });
    }
    const comboData = {
        'kup-list': {
            data: comboListData,
            selectable: numeric ? true : false,
        },
        'kup-text-field': {
            helper: !numericalColumnsExist
                ? dom.ketchup.language.translate(
                      KupLanguageColumn.NON_NUMERICAL_IN_TABLE
                  )
                : numeric
                ? `i.e.: [${options.receivingColumn.name}] - [${options.starterColumn.name}] + 1`
                : dom.ketchup.language.translate(
                      KupLanguageColumn.NON_NUMERICAL
                  ),
            label: dom.ketchup.language.translate(KupLanguageTotals.FORMULA),
            outlined: true,
        },
    };
    return (
        <kup-combobox
            data={comboData}
            disabled={!numericalColumnsExist}
        ></kup-combobox>
    );
}

function getCombobox(component: KupCard): HTMLKupComboboxElement {
    return component.rootElement.shadowRoot.querySelector('kup-combobox');
}

function typeColumn(e: CustomEvent<KupChipEventPayload>, component: KupCard) {
    const combobox = getCombobox(component);
    const value = e.detail.chip.value;
    combobox.getValue().then((res) => {
        let currentFormula = res;
        currentFormula += '[' + value + ']';
        combobox.setValue(currentFormula);
    });
}

function listClick(
    e: CustomEvent<KupListEventPayload>,
    options: KupCardColumnDropMenuOptions
) {
    const value = e.detail.selected.value;
    switch (value) {
        case KupLanguageGeneric.MERGE:
            if (options.mergeCb) {
                options.mergeCb();
            }
            break;
        case KupLanguageGeneric.MOVE:
            if (options.moveCb) {
                options.moveCb();
            }
            break;
    }
}

async function applyFormula(component: KupCard) {
    const options = component.data.options as KupCardColumnDropMenuOptions;
    const combobox = getCombobox(component);
    if (combobox) {
        const value = (await combobox.getValue()) as KupLanguageTotals;
        if (premadeFormulas.includes(value)) {
            dom.ketchup.data.datasetOperations.column.new(
                options.data,
                KupDataNewColumnTypes.MATH,
                {
                    columns: [
                        options.receivingColumn.name,
                        options.starterColumn.name,
                    ],
                    operation: value,
                }
            );
            if (options.formulaCb !== undefined) {
                options.formulaCb();
            }
        } else {
            const result = dom.ketchup.data.datasetOperations.column.new(
                options.data,
                KupDataNewColumnTypes.MATH,
                {
                    operation: value,
                }
            );
            if (typeof result === 'string' || result instanceof String) {
                combobox.classList.add('kup-danger');
                combobox.data['kup-text-field'].helper = result as string;
                combobox.refresh();
            } else if (options.formulaCb !== undefined) {
                options.formulaCb();
            }
        }
    }
}
