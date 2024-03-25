import { findColumns } from './kup-data-column-helper';
import { KupDataColumn, KupDataDataset } from './kup-data-declarations';

export const dataColumnFind = (
    dataset: KupDataDataset | KupDataColumn[],
    filters: Partial<KupDataColumn>
): KupDataColumn[] => {
    return findColumns(dataset, filters);
};
