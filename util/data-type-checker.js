// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


// This function checks the data type of the input value and returns it as a string.
// 1. Return values will be one of the following:
//    'null', 'string', 'boolean', 'number', 'undefined', 'nan', 'array', 'regexp', 'date', 'object', 'map', 'set', 'bigint'
// 2. Return 'misc' (for any other types not covered above):
//    'function', 'symbol', 'error', 'weakmap', 'weakset', etc.

const dataTypeChecker = input => {
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
    
    return 'misc'
}


module.exports = { dataTypeChecker }
