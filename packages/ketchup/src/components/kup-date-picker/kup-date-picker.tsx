import {
    Component,
    Element,
    Event,
    EventEmitter,
    forceUpdate,
    h,
    Host,
    Listen,
    Method,
    Prop,
    State,
    Watch,
} from '@stencil/core';

import type {
    GenericObject,
    KupComponent,
    KupEventPayload,
} from '../../types/GenericTypes';
import {
    kupDynamicPositionAttribute,
    KupDynamicPositionElement,
} from '../../utils/kup-dynamic-position/kup-dynamic-position-declarations';
import {
    KupManager,
    kupManagerInstance,
} from '../../utils/kup-manager/kup-manager';
import {
    getMonthsAsStringByLocale,
    getDaysOfWeekAsStringByLocale,
    fillString,
    DateTimeFormatOptionsMonth,
} from '../../utils/utils';
import {
    KupDatePickerEventPayload,
    KupDatePickerProps,
    SourceEvent,
} from './kup-date-picker-declarations';
import { FButtonStyling } from '../../f-components/f-button/f-button-declarations';
import { KupDebugCategory } from '../../utils/kup-debug/kup-debug-declarations';
import { componentWrapperId } from '../../variables/GenericVariables';
import {
    KupDatesFormats,
    KupDatesNormalize,
} from '../../utils/kup-dates/kup-dates-declarations';

@Component({
    tag: 'kup-date-picker',
    styleUrl: 'kup-date-picker.scss',
    shadow: true,
})
export class KupDatePicker {
    @Element() rootElement: HTMLElement;

    /*-------------------------------------------------*/
    /*                   S t a t e s                   */
    /*-------------------------------------------------*/

    @State() stateSwitcher: boolean = false;
    @State() value: string = '';

    /*-------------------------------------------------*/
    /*                    P r o p s                    */
    /*-------------------------------------------------*/

    /**
     * Custom style of the component.
     * @default ""
     * @see https://ketchup.smeup.com/ketchup-showcase/#/customization
     */
    @Prop() customStyle: string = '';
    /**
     * Props of the sub-components.
     * @default null
     */
    @Prop({ mutable: true }) data: Object = null;
    /**
     * Defaults at false. When set to true, the component is disabled.
     * @default false
     */
    @Prop() disabled: boolean = false;
    /**
     * First day number (0 - sunday, 1 - monday, ...)
     * TODO: manage with kupDates.locale, remove prop
     * @default 1
     */
    @Prop() firstDayIndex: number = 1;
    /**
     * Sets the initial value of the component
     * @default ""
     */
    @Prop() initialValue: string = '';

    /*-------------------------------------------------*/
    /*       I n t e r n a l   V a r i a b l e s       */
    /*-------------------------------------------------*/

    /**
     * Instance of the KupManager class.
     */
    private kupManager: KupManager = kupManagerInstance();
    private calendarView: SourceEvent = SourceEvent.DATE;
    private textfieldEl: any = undefined;
    private pickerContainerEl: HTMLElement = undefined;
    private pickerEl: { value: string; date: Date } = {
        value: new Date().toISOString(),
        date: new Date(),
    };
    private pickerOpened: boolean = false;

    /*-------------------------------------------------*/
    /*                   E v e n t s                   */
    /*-------------------------------------------------*/

    @Event({
        eventName: 'kup-datepicker-blur',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupBlur: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-change',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupChange: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-click',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClick: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-focus',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupFocus: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-input',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupInput: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-iconclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupIconClick: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-itemclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupItemClick: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-textfieldsubmit',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupTextFieldSubmit: EventEmitter<KupDatePickerEventPayload>;

    @Event({
        eventName: 'kup-datepicker-cleariconclick',
        composed: true,
        cancelable: false,
        bubbles: true,
    })
    kupClearIconClick: EventEmitter<KupEventPayload>;

    onKupDatePickerItemClick(e: MouseEvent, value: string) {
        e.stopPropagation();
        this.setPickerValueSelected(value);

        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });

        this.kupItemClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupClearIconClick(e: MouseEvent) {
        e.stopPropagation();
        this.setPickerValueSelected('');

        this.kupChange.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });

        this.kupClearIconClick.emit({
            comp: this,
            id: this.rootElement.id,
        });
    }

    onKupDatePickerMonthYearItemClick(e: MouseEvent, value: string) {
        e.stopPropagation();
        switch (this.calendarView) {
            case SourceEvent.MONTH: {
                this.calendarView = SourceEvent.DATE;
                break;
            }
            case SourceEvent.YEAR: {
                this.calendarView = SourceEvent.MONTH;
                break;
            }
        }
        this.refreshPickerComponentValue(value);
    }

    onKupBlur() {
        this.closePicker();
        this.kupBlur.emit({
            id: this.rootElement.id,
            value: this.value,
            comp: this,
        });
    }

    onKupChange(e: CustomEvent) {
        e.stopPropagation();
        this.refreshPickerValue(e.detail.value, this.kupChange);
    }

    onKupClick(e: UIEvent) {
        e.stopPropagation();
        this.kupClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupFocus(e: UIEvent) {
        e.stopPropagation();
        this.kupFocus.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    onKupInput(e: CustomEvent) {
        e.stopPropagation();
        this.refreshPickerValue(e.detail.value, this.kupInput, true);
    }

    onkupTextFieldSubmit(e: CustomEvent) {
        e.stopPropagation();
        this.refreshPickerValue(e.detail.value, this.kupTextFieldSubmit);
    }

    onKupIconClick(e: UIEvent) {
        e.stopPropagation();
        if (this.isPickerOpened()) {
            this.closePicker();
        } else {
            this.openPicker();
        }
        this.kupIconClick.emit({
            comp: this,
            id: this.rootElement.id,
            value: this.value,
        });
    }

    /*-------------------------------------------------*/
    /*                L i s t e n e r s                */
    /*-------------------------------------------------*/

    @Listen('keyup', { target: 'document' })
    listenKeyup(e: KeyboardEvent) {
        if (this.isPickerOpened()) {
            if (e.key === 'Escape') {
                this.closePicker();
            }
            if (e.key === 'Enter') {
                e.stopPropagation();
                this.setPickerValueSelected();
            }
        }
    }

    /*-------------------------------------------------*/
    /*                  W a t c h e r s                */
    /*-------------------------------------------------*/

    @Watch('firstDayIndex')
    watchFirstDayIndex() {
        if (this.firstDayIndex > 6 || this.firstDayIndex < 0) {
            this.kupManager.debug.logMessage(
                this,
                'property first-day-index=[' +
                    this.firstDayIndex +
                    '] not allowed: it must be >= 0 and <= 6',
                KupDebugCategory.WARNING
            );
            this.firstDayIndex = 1;
        }
    }

    /*-------------------------------------------------*/
    /*           P u b l i c   M e t h o d s           */
    /*-------------------------------------------------*/

    /**
     * Retrieves the component's value.
     * @returns {string} Value of the component.
     */
    @Method()
    async getValue(): Promise<string> {
        return this.value;
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
            props = KupDatePickerProps;
        } else {
            for (const key in KupDatePickerProps) {
                if (
                    Object.prototype.hasOwnProperty.call(
                        KupDatePickerProps,
                        key
                    )
                ) {
                    props[key] = this[key];
                }
            }
        }
        return props;
    }
    /**
     * This method is used to trigger a new render of the component.
     */
    @Method()
    async refresh(): Promise<void> {
        forceUpdate(this);
    }
    /**
     * Sets the focus to the component.
     */
    @Method()
    async setFocus() {
        if (this.textfieldEl != null) {
            this.textfieldEl.setFocus();
        }
    }
    /**
     * Sets the component's value.
     * @param {string} value - Value to be set.
     */
    @Method()
    async setValue(value: string) {
        this.value = value;
        this.setTextFieldInitalValue(this.getDateForOutput());
    }

    /*-------------------------------------------------*/
    /*           P r i v a t e   M e t h o d s         */
    /*-------------------------------------------------*/

    refreshPickerValue(
        eventDetailValue: string,
        eventToRaise: EventEmitter,
        isOnInputEvent?: boolean
    ) {
        let newValue = eventDetailValue;
        let dayJs = this.kupManager.dates.normalize(
            eventDetailValue,
            KupDatesNormalize.DATE
        );
        if (this.kupManager.dates.isValid(eventDetailValue)) {
            newValue = this.kupManager.dates.format(
                this.kupManager.dates.normalize(
                    eventDetailValue,
                    KupDatesNormalize.DATE
                ),
                KupDatesFormats.ISO_DATE
            );

            this.refreshPickerComponentValue(newValue);
            if (isOnInputEvent != true) {
                this.setValue(newValue);
            }
        }

        if (newValue != null) {
            if (eventToRaise != null) {
                eventToRaise.emit({
                    id: this.rootElement.id,
                    value: newValue,
                });
            }
        }
    }

    refreshPickerComponentValue(value: string) {
        if (!this.isPickerOpened()) {
            return;
        }
        let d: Date;
        if (this.kupManager.dates.isValid(value, KupDatesFormats.ISO_DATE)) {
            d = new Date(value);
        } else {
            d = new Date();
        }
        this.pickerEl.value = d.toISOString();
        this.pickerEl.date = d;
        this.refresh();
    }

    setPickerValueSelected(newValue?: string) {
        if (this.disabled == true) {
            return;
        }
        if (newValue == null) {
            newValue = this.getPickerValueSelected();
        }
        this.closePicker();
        if (newValue == null) {
            return;
        }
        this.setValue(newValue);
    }

    getPickerValueSelected(): string {
        return this.pickerEl.value;
    }

    setTextFieldInitalValue(value: string) {
        if (this.textfieldEl !== undefined) {
            this.textfieldEl.setValue(value);
        }
    }

    getValueForPickerComponent() {
        return this.value;
    }

    openPicker() {
        this.calendarView = SourceEvent.DATE;
        let textfieldEl = this.textfieldEl;
        let containerEl = this.pickerContainerEl;
        this.pickerOpened = true;
        this.refreshPickerComponentValue(this.getValueForPickerComponent());

        let textFieldWidth = null;
        if (textfieldEl != null) {
            textFieldWidth =
                textfieldEl.shadowRoot.querySelector(
                    '.mdc-text-field'
                ).clientWidth;
            textfieldEl.classList.add('toggled');
            textfieldEl.emitSubmitEventOnEnter = false;
        }
        if (containerEl != null) {
            this.kupManager.dynamicPosition.start(
                containerEl as KupDynamicPositionElement
            );
            containerEl.classList.add('visible');
            let elStyle: any = containerEl.style;
            elStyle.height = 'auto';
            if (textFieldWidth != null) {
                elStyle.minWidth = textFieldWidth + 'px';
            }
        }
    }

    closePicker() {
        if (!this.isPickerOpened()) {
            return;
        }
        let textfieldEl = this.textfieldEl;
        let containerEl = this.pickerContainerEl;
        this.pickerOpened = false;
        if (textfieldEl != null) {
            textfieldEl.classList.remove('toggled');
            textfieldEl.emitSubmitEventOnEnter = true;
        }
        if (containerEl != null) {
            this.kupManager.dynamicPosition.stop(
                containerEl as KupDynamicPositionElement
            );
            containerEl.classList.remove('visible');
        }
    }

    isPickerOpened(): boolean {
        return this.pickerOpened;
    }

    getTextFieldId(): string {
        return this.textfieldEl.id;
    }

    prepDateTextfield(): any {
        return this.prepTextfield(this.getDateForOutput());
    }

    prepTextfield(initialValue: string): any {
        let textfieldData = { ...this.data['kup-text-field'] };

        if (!textfieldData['icon']) {
            textfieldData['icon'] = 'calendar';
        }

        if (textfieldData['icon']) {
            textfieldData['trailingIcon'] = true;
        }

        let comp: HTMLElement = (
            <kup-text-field
                {...textfieldData}
                disabled={this.disabled}
                id={this.rootElement.id + '_text-field'}
                initialValue={initialValue}
                onkup-textfield-change={(e: any) => this.onKupChange(e)}
                onkup-textfield-click={(e: any) => this.onKupClick(e)}
                onkup-textfield-focus={(e: any) => this.onKupFocus(e)}
                onkup-textfield-input={(e: any) => this.onKupInput(e)}
                onkup-textfield-iconclick={(e: any) => this.onKupIconClick(e)}
                onkup-textfield-submit={(e: any) =>
                    this.onkupTextFieldSubmit(e)
                }
                onkup-textfield-cleariconclick={(e: any) =>
                    this.onKupClearIconClick(e)
                }
                ref={(el) => (this.textfieldEl = el as any)}
            ></kup-text-field>
        );

        return comp;
    }

    getInitEndYear(curYear: number): { initYear: number; endYear: number } {
        let initYear: number = curYear - (curYear % 10);
        let endYear: number = initYear + 16 - 1;

        return { initYear: initYear, endYear: endYear };
    }

    isRelatedTargetInThisComponent(e: any): boolean {
        if (!e.relatedTarget) {
            return false;
        }
        let id = e.relatedTarget.id;
        if (id == null || id.trim() == '') {
            return false;
        }
        if (id == this.getTextFieldId()) {
            return true;
        }

        let idConc =
            '#prev-page#next-page#date-picker-div#change-view-button#calendar#';
        return idConc.indexOf('#' + id + '#') >= 0;
    }

    prepDatePicker() {
        let date: Date = this.pickerEl.date;
        let months = getMonthsAsStringByLocale();
        let curYear: number = date.getFullYear();
        let yearRange = this.getInitEndYear(curYear);
        let initYear: number = yearRange.initYear;
        let endYear: number = yearRange.endYear;

        let changeViewButtonLabel: string = 'not-set';
        switch (this.calendarView) {
            case SourceEvent.DATE: {
                changeViewButtonLabel =
                    months[date.getMonth()] + ', ' + curYear.toString();
                break;
            }
            case SourceEvent.MONTH: {
                changeViewButtonLabel = curYear.toString();
                break;
            }
            case SourceEvent.YEAR: {
                changeViewButtonLabel =
                    initYear.toString() + ' - ' + endYear.toString();
                break;
            }
        }

        let prevButtonComp = null;
        let nextButtonComp = null;
        prevButtonComp = (
            <kup-button
                id="prev-page"
                icon="chevron_left"
                onkup-button-click={(e) => this.prevPage(e)}
            ></kup-button>
        );
        nextButtonComp = (
            <kup-button
                id="next-page"
                icon="chevron_right"
                onkup-button-click={(e) => this.nextPage(e)}
            ></kup-button>
        );

        return (
            <div
                tabindex="0"
                id="date-picker-div"
                ref={(el) => (this.pickerContainerEl = el as any)}
                onBlur={(e: any) => {
                    if (!this.isRelatedTargetInThisComponent(e)) {
                        this.onKupBlur();
                    }
                }}
            >
                <div class="section-1">
                    <div class="sub-1 nav">
                        {prevButtonComp}
                        <kup-button
                            customStyle="#kup-component button {text-transform:capitalize}"
                            id="change-view-button"
                            styling={FButtonStyling.FLAT}
                            label={changeViewButtonLabel}
                            onkup-button-click={(e) => this.changeView(e)}
                        ></kup-button>
                        {nextButtonComp}
                    </div>
                </div>
                <div class="section-2">{this.createCalendar()}</div>
            </div>
        );
    }

    createCalendar() {
        switch (this.calendarView) {
            case SourceEvent.DATE: {
                return this.createDaysCalendar();
            }
            case SourceEvent.MONTH: {
                return this.createMonthsCalendar();
            }
            case SourceEvent.YEAR: {
                return this.createYearsCalendar();
            }
        }
    }

    private createDaysCalendar() {
        let days = getDaysOfWeekAsStringByLocale(this.firstDayIndex);

        let date: Date = this.pickerEl.date;
        let selecteDate: Date = new Date(date);

        let thead = [];
        let tbody = [];
        for (let index = 0; index < days.length; index++) {
            thead.push(
                <th>
                    <span class="item-text">{days[index]}</span>
                </th>
            );
        }

        let firstMonthDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastMonthDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        let finish: boolean = false;
        let currentDayIndex = this.firstDayIndex;
        let firstMonthDayIndex = firstMonthDay.getDay();
        let row = [];
        let daysForRowAdded = 0;
        while (!finish) {
            if (currentDayIndex == firstMonthDayIndex) {
                break;
            }
            row.push(<td class="item empty"></td>);
            currentDayIndex++;
            daysForRowAdded++;
            if (currentDayIndex > 6) {
                currentDayIndex = 0;
            }
        }
        let dayCount = 1;
        while (dayCount <= lastMonthDay.getDate()) {
            for (let i = daysForRowAdded; i < 7; i++) {
                let dayClass = 'item';
                let dataIndex = {
                    'data-index':
                        date.getFullYear().toString() +
                        '-' +
                        fillString(
                            (date.getMonth() + 1).toString(),
                            '0',
                            2,
                            true
                        ) +
                        '-' +
                        fillString(dayCount.toString(), '0', 2, true),
                };
                if (
                    dayCount === selecteDate.getDate() &&
                    date.getMonth() === selecteDate.getMonth() &&
                    date.getFullYear() === selecteDate.getFullYear()
                ) {
                    dayClass += ' selected';
                }
                row.push(
                    <td class={dayClass}>
                        <span
                            {...dataIndex}
                            class="item-number"
                            onClick={(e) => {
                                this.onKupDatePickerItemClick(
                                    e,
                                    dataIndex['data-index']
                                );
                            }}
                        >
                            {dayCount}
                        </span>
                    </td>
                );
                dayCount++;
                if (dayCount > lastMonthDay.getDate()) {
                    break;
                }
            }
            if (row.length > 0) {
                tbody.push(<tr>{row}</tr>);
                row = [];
            }
            daysForRowAdded = 0;
        }

        return (
            <table id="calendar">
                <thead>{thead}</thead>
                <tbody>{tbody}</tbody>
            </table>
        );
    }

    private createMonthsCalendar() {
        let months = getMonthsAsStringByLocale(
            DateTimeFormatOptionsMonth.SHORT
        );

        let date: Date = this.pickerEl.date;
        let selecteDate: Date;
        if (this.value == null || this.value.trim() == '') {
            selecteDate = new Date();
        } else {
            selecteDate = new Date(this.value);
        }
        let tbody = [];
        let row = [];
        let monthCount = 0;
        while (monthCount < 12) {
            for (let i = 0; i < 4; i++) {
                let monthClass = 'item';
                let dataIndex = {
                    'data-index':
                        date.getFullYear().toString() +
                        '-' +
                        fillString((monthCount + 1).toString(), '0', 2, true) +
                        '-' +
                        fillString(date.getDate().toString(), '0', 2, true),
                };
                if (
                    monthCount === selecteDate.getMonth() &&
                    date.getFullYear() == selecteDate.getFullYear()
                ) {
                    monthClass += ' selected';
                }
                row.push(
                    <td class={monthClass}>
                        <span
                            {...dataIndex}
                            class="item-number"
                            onClick={(e) => {
                                this.onKupDatePickerMonthYearItemClick(
                                    e,
                                    dataIndex['data-index']
                                );
                            }}
                        >
                            {months[monthCount]}
                        </span>
                    </td>
                );
                monthCount++;
            }
            if (row.length > 0) {
                tbody.push(<tr>{row}</tr>);
                row = [];
            }
        }

        return (
            <table id="calendar">
                <tbody>{tbody}</tbody>
            </table>
        );
    }

    private createYearsCalendar() {
        let date: Date = this.pickerEl.date;
        let curYear: number = date.getFullYear();
        let yearRange = this.getInitEndYear(curYear);
        let initYear: number = yearRange.initYear;
        let endYear: number = yearRange.endYear;

        let selecteDate: Date;
        if (this.value == null || this.value.trim() == '') {
            selecteDate = new Date();
        } else {
            selecteDate = new Date(this.value);
        }
        let tbody = [];
        let row = [];
        let yearCount = initYear;
        while (yearCount <= endYear) {
            for (let i = 0; i < 4; i++) {
                let yearClass = 'item';
                let dataIndex = {
                    'data-index':
                        yearCount.toString() +
                        '-' +
                        fillString(
                            (date.getMonth() + 1).toString(),
                            '0',
                            2,
                            true
                        ) +
                        '-' +
                        fillString(date.getDate().toString(), '0', 2, true),
                };
                if (yearCount === selecteDate.getFullYear()) {
                    yearClass += ' selected';
                }
                row.push(
                    <td class={yearClass}>
                        <span
                            {...dataIndex}
                            class="item-number"
                            onClick={(e) => {
                                this.onKupDatePickerMonthYearItemClick(
                                    e,
                                    dataIndex['data-index']
                                );
                            }}
                        >
                            {yearCount}
                        </span>
                    </td>
                );
                yearCount++;
            }
            if (row.length > 0) {
                tbody.push(<tr>{row}</tr>);
                row = [];
            }
        }

        return (
            <table id="calendar">
                <tbody>{tbody}</tbody>
            </table>
        );
    }

    private changeView(e: CustomEvent) {
        e.stopPropagation();
        switch (this.calendarView) {
            case SourceEvent.DATE: {
                this.calendarView = SourceEvent.MONTH;
                break;
            }
            case SourceEvent.MONTH: {
                this.calendarView = SourceEvent.YEAR;
                break;
            }
            case SourceEvent.YEAR: {
                this.calendarView = SourceEvent.DATE;
            }
        }
        this.refresh();
    }

    private prevPage(e: CustomEvent) {
        e.stopPropagation();
        let date: Date = this.pickerEl.date;
        let yy: number = date.getFullYear();
        let mm: number = date.getMonth();

        if (this.calendarView == SourceEvent.DATE) {
            if (mm < 1) {
                mm = 11;
                yy--;
            } else {
                mm--;
            }
        }
        if (this.calendarView == SourceEvent.MONTH) {
            yy--;
        }
        if (this.calendarView == SourceEvent.YEAR) {
            let yearRange = this.getInitEndYear(yy);
            yy = yearRange.initYear - 1;
        }
        date.setFullYear(yy);
        date.setMonth(mm);
        this.pickerEl.value = date.toISOString();
        this.pickerEl.date = date;
        this.refresh();
    }

    private nextPage(e: CustomEvent) {
        e.stopPropagation();
        let date: Date = this.pickerEl.date;
        let yy: number = date.getFullYear();
        let mm: number = date.getMonth();
        if (this.calendarView == SourceEvent.DATE) {
            if (mm > 10) {
                mm = 0;
                yy++;
            } else {
                mm++;
            }
        }
        if (this.calendarView == SourceEvent.MONTH) {
            yy++;
        }
        if (this.calendarView == SourceEvent.YEAR) {
            let yearRange = this.getInitEndYear(yy);
            yy = yearRange.endYear + 1;
        }
        date.setFullYear(yy);
        date.setMonth(mm);
        this.pickerEl.value = date.toISOString();
        this.pickerEl.date = date;
        this.refresh();
    }

    getDateForOutput(): string {
        if (this.value == null || this.value.trim() == '') {
            return '';
        }
        let v1 = this.kupManager.dates.format(this.value);
        return v1;
    }

    recalcPosition() {
        if (this.pickerContainerEl != null && this.textfieldEl != null) {
            this.kupManager.dynamicPosition.register(
                this.pickerContainerEl as KupDynamicPositionElement,
                this.textfieldEl
            );
        }
    }

    /*-------------------------------------------------*/
    /*          L i f e c y c l e   H o o k s          */
    /*-------------------------------------------------*/

    componentWillLoad() {
        this.kupManager.debug.logLoad(this, false);
        this.kupManager.theme.register(this);
        this.watchFirstDayIndex();
        this.value = this.initialValue;
        if (!this.data) {
            this.data = {
                'kup-text-field': {},
            };
        }
    }

    componentDidLoad() {
        this.kupManager.debug.logLoad(this, true);
    }

    componentWillRender() {
        this.kupManager.debug.logRender(this, false);
    }

    componentDidRender() {
        this.recalcPosition();
        this.kupManager.debug.logRender(this, true);
    }

    render() {
        let hostClass: Record<string, boolean> = {};

        if (
            this.data &&
            this.data['kup-text-field'] &&
            this.data['kup-text-field']['className'] &&
            this.data['kup-text-field']['className'].indexOf(
                'kup-full-height'
            ) > -1
        ) {
            hostClass['kup-full-height'] = true;
        }

        if (
            this.data &&
            this.data['kup-text-field'] &&
            this.data['kup-text-field']['fullWidth']
        ) {
            hostClass['kup-full-width'] = true;
        }

        const customStyle: string = this.kupManager.theme.setCustomStyle(
            this.rootElement as KupComponent
        );

        return (
            <Host class={hostClass} onBlur={() => this.onKupBlur()}>
                {customStyle ? <style>{customStyle}</style> : null}
                <div id={componentWrapperId}>
                    {this.prepDateTextfield()}
                    {this.prepDatePicker()}
                </div>
            </Host>
        );
    }

    disconnectedCallback() {
        this.kupManager.theme.unregister(this);
        const dynamicPositionElements: NodeListOf<KupDynamicPositionElement> =
            this.rootElement.shadowRoot.querySelectorAll(
                '[' + kupDynamicPositionAttribute + ']'
            );
        if (dynamicPositionElements.length > 0) {
            this.kupManager.dynamicPosition.unregister(
                Array.prototype.slice.call(dynamicPositionElements)
            );
        }
    }
}
