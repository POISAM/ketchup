import { KupDom } from '../kup-manager/kup-manager-declarations';
import {
    KupDataCell,
    KupDataDataset,
    KupDataFindCellFilters,
    KupDataRow,
} from './kup-data-declarations';

const dom: KupDom = document.documentElement as KupDom;

/**
 * Utility used by findRow and findCell.
 * @param {KupDataDataset} dataset - Input dataset.
 * @param {KupDataFindCellFilters} filters - Filters of the research.
 * @returns {{cells: KupDataCell[], rows: KupDataRow[]}}  Object containing rows and cells.
 */
export function finder(
    dataset: KupDataDataset,
    filters: KupDataFindCellFilters
): { cells: KupDataCell[]; rows: KupDataRow[] } {
    const columns = filters ? filters.columns : null;
    const range = filters ? filters.range : null;
    const value = filters ? filters.value : null;
    const min = range && range.min ? range.min : null;
    const max = range && range.max ? range.max : null;
    const result: { cells: KupDataCell[]; rows: KupDataRow[] } = {
        cells: [],
        rows: [],
    };
    for (let index = 0; index < dataset.rows.length; index++) {
        const row = dataset.rows[index];
        const cells = row.cells;
        for (const key in cells) {
            const cell = cells[key];
            if (!columns || !columns.length || columns.includes(key)) {
                if (min && max) {
                    let d: Date = null,
                        s = '',
                        n = 0;
                    if (dom.ketchup.objects.isDate(cell.obj)) {
                        d = dom.ketchup.dates.toDate(cell.value);
                        const dMax = dom.ketchup.dates.toDate(
                            max instanceof String ? max.valueOf() : max
                        );
                        const dMin = dom.ketchup.dates.toDate(
                            min instanceof String ? min.valueOf() : min
                        );
                        if (
                            d === dMax ||
                            d === dMin ||
                            (d < dMax && d > dMin)
                        ) {
                            result.cells.push(cell);
                            result.rows.push(row);
                        }
                    } else if (
                        typeof min === 'string' ||
                        min instanceof String
                    ) {
                        s = cell.value;
                        if (s === max || s === min || (s < max && s > min)) {
                            result.cells.push(cell);
                            result.rows.push(row);
                        }
                    } else {
                        n = dom.ketchup.data.numberify(cell.value);
                        if (n === max || n === min || (n < max && n > min)) {
                            result.cells.push(cell);
                            result.rows.push(row);
                        }
                    }
                } else if (value === cell.value) {
                    result.cells.push(cell);
                    result.rows.push(row);
                }
            }
        }
    }
    return result;
}
