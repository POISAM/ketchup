import { KupState } from '../kup-state/kup-state';

import {
    GenericFilter,
    GroupObject,
    SortObject,
    GroupLabelDisplayMode,
    TotalsMap,
} from './kup-data-table-declarations';

export class KupDataTableState implements KupState {
    filters: GenericFilter = {};
    expandGroups = false;
    groupLabelDisplay = GroupLabelDisplayMode.BOTH;
    density: string = 'small';
    enableSortableColumns: boolean = false;
    forceOneLine: boolean = false;
    globalFilter = false;
    globalFilterValue = '';
    groups: Array<GroupObject> = [];
    headerIsPersistent = true;
    lazyLoadRows = false;
    loadMoreLimit: number = 1000;
    multiSelection = false;
    rowsPerPage = 10;
    showFilters = false;
    showHeader = true;
    showLoadMore: boolean = false;
    sortEnabled = true;
    sort: Array<SortObject> = [];
    sortableColumnsMutateData: boolean = true;
    pageSelected: number = 1;
    selectRow: number;
    selectRowsById: string;
    dragEnabled: boolean = false;
    dropEnabled: boolean = false;
    totals: TotalsMap;
    load: boolean = false;

    public toDebugString() {
        // TODO
        return 'state';
    }
}
