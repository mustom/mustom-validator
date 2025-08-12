// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


const misc = require('./method/misc.js')


const validator = function () {
    let input = null
    let output = null
    let dataTypes = []
    let isValid = true
    let option = {
        parseMode: 'definedOnly',
        returnValue: true,
        noError: false
    }
}

validator.prototype.single = function (input, option = {}) {
    if (!input && !option.noError) {
        throw new EmptyArgumentError(
            '',
            `The input value is required.`
        )
    }

    if (!input && option.noError) {
        return false
    }

    this.input = input
    this.option = [ ...this.option, ...option ]
    return this
}

validator.prototype.objectIterate = function (input, rule, option = {}) {
    if (!input) {
        throw new EmptyArgumentError(
            '',
            `The input value is required.`
        )
    }

    if (input.constructor !== Object) {
        throw new DataTypeError('invalid-type', `'objectIterate' method requires an object.`)
    }

    for (const key in input) {
        const targetRule = rule[key]

        // TODO : 테스트 해 봐야 함. 이게 아닐 수도 있음.
        if (!targetRule) {
            throw new DataTypeError('undefined-key', `Key '${key}' is undefined.`)
        }

        this.input = input[key]
        if (targetRule.constructor === Object) {
            this.objectIterate(this.input, targetRule)
        } else {
            targetRule()
        }
    }

    for (const key in rule) {
        if (!target[key]) {
            throw new DataTypeError('missing-required', `The value '${key}' is required.`)
        }
    }

    this.output = dataToReturn

    return this
}

validator.prototype.arrayObjectIterate = function (target, rule) {

    if (!Array.isArray(value)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an array.`
        )
    }

    for (const item of value) {
        this.objectIterate(item, rule, this.option)
    }

    return this
}


Object.assign(validator.prototype, misc)



module.exports = {
    validator: new validator()
}

