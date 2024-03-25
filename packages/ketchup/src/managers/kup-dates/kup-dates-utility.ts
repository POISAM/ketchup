import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/pl';
import 'dayjs/locale/ru';
import 'dayjs/locale/zh';
import { KupDatesLocales } from './kup-dates-declarations';

export const datesToDate = (
    input: dayjs.ConfigType,
    locale: KupDatesLocales,
    format?: string
): Date => {
    const _dayjs = dayjs;
    _dayjs.extend(customParseFormat);
    _dayjs.extend(localizedFormat);
    _dayjs.extend(minMax);
    _dayjs.locale(locale);
    if (format && format != null) {
        return _dayjs(input, format).toDate();
    } else {
        return _dayjs(input).toDate();
    }
};

export const datesFormat = (
    input: dayjs.ConfigType,
    locale: KupDatesLocales,
    format?: string
): string => {
    const _dayjs = dayjs;
    _dayjs.extend(customParseFormat);
    _dayjs.extend(localizedFormat);
    _dayjs.extend(minMax);
    _dayjs.locale(locale);
    if (!format) {
        format = 'L'; // MM/DD/YYYY, DD/MM/YYYY depending on locale
    }
    return _dayjs(input).format(format);
};
