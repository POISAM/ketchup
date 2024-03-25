import numeral from 'numeral';
import 'numeral/locales/chs';
import 'numeral/locales/es';
import 'numeral/locales/fr';
import 'numeral/locales/it';
import 'numeral/locales/pl';
import 'numeral/locales/ru';
import { getRegExpFromString } from '../../utils/utils';
import { KupMathLocales } from './kup-math-declarations';

export const mathNumberStringToFormattedString = (
    input: string,
    decimals: number,
    type: string,
    locale: KupMathLocales,
    decSeparator?: string
): string => {
    let value = mathNumberToFormattedString(
        mathNumberifySafe(input, locale),
        decimals,
        type,
        locale
    );

    if (!decSeparator) {
        return value;
    }
    const browserDecSeparator = mathDecimalSeparator(locale);
    if (browserDecSeparator == decSeparator) {
        return value;
    }
    const browserGroupSeparator = mathGroupSeparator(locale);
    value = value.replace(getRegExpFromString(browserGroupSeparator, 'g'), '');
    value = value.replace(
        getRegExpFromString(browserDecSeparator, 'g'),
        decSeparator
    );

    return value;
};

export const mathNumberToFormattedString = (
    input: number,
    decimals: number,
    type: string,
    locale: KupMathLocales
): string => {
    if (input == null || isNaN(input)) {
        return '';
    }
    if (decimals == null || decimals == -1) {
        decimals = mathCountDecimals(input);
    }
    let nstr = mathFormat(
        input,
        locale,
        mathCreateFormatPattern(true, decimals)
    );
    nstr = nstr + mathGetNumericValueSuffix(type);
    return nstr;
};

export const mathNumberify = (
    input: string | String | number,
    locale: KupMathLocales,
    inputIsLocalized?: boolean,
    type?: string,
    decFmt?: string
): number => {
    if (typeof input != 'number') {
        if (type) {
            let suffix = mathGetNumericValueSuffix(type);
            if (suffix != '') {
                input = input.replace(getRegExpFromString(suffix, 'g'), '');
            }
        }
        if (!decFmt) {
            decFmt = inputIsLocalized ? mathDecimalSeparator(locale) : '.';
        }
        const groupSeparator = decFmt == '.' ? ',' : '.';
        input = input.replace(getRegExpFromString(groupSeparator, 'g'), '');
        if (decFmt != '.') {
            input = input.replace(getRegExpFromString(decFmt, 'g'), '.');
        }
    }

    let n = NaN;

    const _numeral = numeral;
    _numeral.locale(KupMathLocales.en);
    n = numeral(input).value();
    if (n === null) {
        return NaN;
    }
    return n;
};

export const mathNumberifySafe = (
    input: string,
    locale: KupMathLocales,
    inputIsLocalized?: boolean,
    type?: string,
    decFmt?: string
): number => {
    if (!input || input == null || input.trim() == '') {
        input = '0';
    }
    return mathNumberify(input, locale, inputIsLocalized, type, decFmt);
};

export const mathDecimalSeparator = (locale: KupMathLocales): string => {
    const numberWithGroupAndDecimalSeparator = 1000.1;
    return Intl.NumberFormat(locale)
        .formatToParts(numberWithGroupAndDecimalSeparator)
        .find((part) => part.type === 'decimal').value;
};

export const mathGroupSeparator = (locale: KupMathLocales): string => {
    const numberWithGroupAndDecimalSeparator = 1000.1;
    return Intl.NumberFormat(locale)
        .formatToParts(numberWithGroupAndDecimalSeparator)
        .find((part) => part.type === 'group').value;
};

export const mathCountDecimals = (value: number): number => {
    if (Math.floor(value) === value) return 0;
    let stringValue = value.toString().split('.')[1];
    if (stringValue) {
        return stringValue.length ?? 0;
    } else {
        return 0;
    }
};

export const mathCreateFormatPattern = (
    thousandPoint?: boolean,
    decimals?: number
): string => {
    var format = '0';
    if (thousandPoint) {
        format += ',0';
    }
    if (decimals && decimals > 0) {
        format += '.';
        for (let i = 0; i < decimals; i++) {
            format += '0';
        }
    }
    return format;
};

export const mathGetNumericValueSuffix = (type: string): string => {
    type = type.toUpperCase();
    let nstr = '';
    if (type == 'P') {
        nstr = ' %';
    } else if (type == 'VE') {
        nstr = ' €';
    } else if (type == 'VL') {
        nstr = ' £';
    } else if (type == 'VV') {
        nstr = ' $';
    }
    return nstr;
};

export const mathFormat = (
    input: string | String | number,
    locale: KupMathLocales,
    format?: string,
    inputIsLocalized?: boolean
): string => {
    const n = mathNumberify(input, locale, inputIsLocalized);
    if (!format) {
        const positiveN = Math.abs(n);
        const decimals = positiveN - Math.floor(positiveN);
        if (decimals) {
            format = '0,0.00';
        } else {
            format = '0,0';
        }
    }
    const _numeral = numeral;
    _numeral.locale(locale);

    return _numeral(n).format(format);
};

export const mathFormattedStringToNumberString = (
    input: string,
    type: string,
    locale: KupMathLocales,
    decSeparator?: string
): string => {
    return numberStringToNumberString(input, type, decSeparator, locale);

    function numberStringToNumberString(
        input: string,
        type: string,
        decFmt: string,
        locale: KupMathLocales
    ): string {
        if (!input || input == null || input.trim() == '') {
            return '';
        }
        let unf: number = mathNumberifySafe(
            input,
            locale,
            !decFmt || decFmt != '.',
            type,
            decFmt
        );
        if (unf == null || isNaN(unf)) {
            return input;
        }

        return numberToString(unf, -1, 'en-US');
    }

    function numberToString(
        input: number,
        decimals: number,
        locale: string
    ): string {
        if (input == null) {
            input = 0;
        }
        if (decimals == null || decimals == -1) {
            decimals = mathCountDecimals(input);
        }
        let n: Number = Number(input);
        let f: Intl.NumberFormatOptions =
            decimals > -1
                ? {
                      minimumFractionDigits: decimals,
                      maximumFractionDigits: decimals,
                      useGrouping: false,
                  }
                : { useGrouping: false };
        return n.toLocaleString(locale, f);
    }
};

export const mathIsStringNumber = (
    value: string,
    type: string,
    locale: KupMathLocales
): boolean => {
    if (value == null || value.trim() == '') {
        return false;
    }

    let tmpStr = mathFormattedStringToNumberString(value, type, locale);

    if (mathIsNumber(tmpStr)) {
        return true;
    }
    return false;
};

export const mathIsNumber = (value: any): boolean => {
    //return typeof value === 'number';
    return !isNaN(value);
};
