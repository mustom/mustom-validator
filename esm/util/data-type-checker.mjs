// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

/**
 * @description This function checks the data type of the input value and returns it as a string.
 * @param {*} input - The value to be checked.
 * @param {Object} [option={}] - Optional settings.
 * @param {boolean} [option.showMisc=false] - If true, returns the specific type for miscellaneous types instead of 'misc'.
 * @returns {string} - The data type of the input value as a string.
 ** @note Return values will be one of the following:
 *    'null', 'string', 'boolean', 'number', 'undefined', 'nan', 'array', 'regexp', 'date', 'object', 'map', 'set', 'bigint'
 ** @note Return 'misc' (for any other types not covered above):
 *    'function', 'symbol', 'error', 'weakmap', 'weakset', etc.
 */
export const dataTypeChecker = (input, option = {}) => {

    if (input === null) { return 'null' }

    const type = typeof input

    if (type === 'string' || type === 'boolean' || type === 'number' || type === 'undefined') {

        // Special case for NaN. typeof NaN is 'number', but mustom-validator will handle it as 'nan' type.
        if (type === 'number' && isNaN(input)) {
            return 'nan'
        }

        return type
    }

    const prototypeValue = Object.prototype.toString.call(input)
    const secondNature = prototypeValue.slice(8, -1).toLowerCase()

    if ([ 'array', 'regexp', 'date', 'object', 'map', 'set', 'bigint' ].includes(secondNature)) {
        return secondNature
    }

    if (option.showMisc) {
        return secondNature
    }

    // For any other types not covered above, return 'misc'.
    return 'misc'
}