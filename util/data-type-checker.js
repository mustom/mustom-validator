// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError,
    DataTypeError,
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const dataTypeChecker = input => {
    if (input === null) {
        return 'null'
    }

    // 2. typeof로 원시 타입(Primitive Type) 처리 (가장 빠르고 정확함)
    const type = typeof input

    if (type === 'string' || type === 'boolean' || type === 'number' || type === 'undefined') {
        // 단, NaN도 'number'로 나오므로 따로 처리
        if (type === 'number' && isNaN(input)) {
            return 'nan'
        }
        return type
    }

    // 3. Object.prototype.toString.call()을 사용해 복합 타입 처리
    // 예: "[object Array]", "[object RegExp]", "[object Date]", "[object Object]"
    const classType = Object.prototype.toString.call(input)

    // 대괄호와 'object '를 제거하고 소문자만 추출
    // "[object Array]" -> "Array" -> "array"
    return classType.slice(8, -1).toLowerCase()


    // Return valuse can be:
    // 'null'
    // 'string'
    // 'boolean'
    // 'number'
    // 'undefined'
    // 'nan'
    // 'array'
    // 'regexp'
    // 'date'
    // 'object'
    // 'function'
    // 'error'
    // 'map'
    // 'set'
    // 'weakmap'
    // 'weakset'
    // 'symbol'
    // 'bigint'
}

module.exports = { dataTypeChecker }
