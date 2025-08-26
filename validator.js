// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const comparison = require('./method/comparison.js')
const condition = require('./method/condition.js')
const dataType = require('./method/data-type.js')
const regex = require('./method/regex.js')
const dataTransformation = require('./method/data-transformation.js')
const misc = require('./method/misc.js')
const errorHandler = require('./util/error-handler.js')
const { dataTypeChecker } = require('./util/data-type-checker.js')
const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('./error/custom-error')


// TODO : typeof aa === 'object' && aa !== null && !Array.isArray(aa) 가 객체를 판별하는 가장 이상적인 방법이라고 한다.
// 특히 Date 등은 typeof로 판별이 안되기 때문에 주의해야 한다고 함.

const validator = function () {
    this.input = null
    this.refinement = null
    // this.dataTypes = []
    this.dataType = null
    this.errors = []
    this.isValid = true
    this.option = {
        itemValdationMode: 'all', // all(전부 조건), some (하나라도 조건), none, one, any
        entryValidationMode: 'strict',
        stripUnknown: 'true',
        softFail: false
    }

    // item : Used for indexed data structure (Array, Set)
    // entry : Userd for Key-value based data structure (Object, Map)

    return this
}

validator.prototype.single = function (input, option = {}) {
    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = dataTypeChecker(input)

    return this
}

validator.prototype.objectIterate = function (input, rule, option = {}) {
    if (!input || !Object.keys(rule).length) {
        throw new EmptyArgumentError(
            'EmptyArgumentError',
            `The input value is required.`
        )
    }

    if (!rule || !Object.keys(rule).length) {
        throw new EmptyArgumentError(
            'EmptyArgumentError',
            `Rule is required.`
        )
    }

    if (input.constructor !== Object) {
        throw new EmptyArgumentError(
            'invalid-type',
            `'objectIterate' method requires an object.`
        )
    }

    if (rule.constructor !== Object) {
        throw new EmptyArgumentError(
            'EmptyArgumentError',
            `'objectIterate' method requires an object.`
        )
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }

    for (const key in input) {
        const targetRule = rule[key]

        // Throw error if the key is not defined in the rule
        if (mode === 'strict' && !targetRule) {
            if (this.option.softFail) {
                this.errors.push(new UsageError('undefined-key', `Key '${key}' is undefined.`))
                this.isValid = false
                continue
            }

            throw new DataTypeError('undefined-key', `Key '${key}' is undefined.`)
        }

        // If the key is not defined in the rule, and the option 'stripUnknown' is true, remove it from refinement
        if (!targetRule && this.option.stripUnknown) {
            delete this.refinement[key]
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


    return this
}

validator.prototype.arrayObjectIterate = function (input, rule, option = {}) {
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


// validator.arrayIterate(['a', 'b', 'c'], () => validator.string().minLength(1), { itemValdationMode: 'all' })

validator.prototype.arrayIterate = function (input, rule, option = {}) {

    this.dataType = dataTypeChecker(input)

    if (this.dataType !== 'array' || !input.length) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an array and not empty.`
        )
    }

    if (!rule || typeof rule !== 'function') {
        throw new EmptyArgumentError(
            'EmptyArgumentError',
            `Rule is required.`
        )
    }

    if (typeof option !== 'object') {
        throw new EmptyArgumentError(
            'EmptyArgumentError',
            `Option should be an object.`
        )
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }


    // const results = input.map((item) => {
    //     const v = new validator()
    //     rule.call(v, item)
    //     return v
    // })

    return this
}

validator.prototype.setIterate = function () {
    
}

validator.prototype.mapIterate = function () {

}

Object.assign(validator.prototype, comparison)
Object.assign(validator.prototype, condition)
Object.assign(validator.prototype, dataType)
Object.assign(validator.prototype, regex)
Object.assign(validator.prototype, dataTransformation)
Object.assign(validator.prototype, misc)

module.exports = {
    validator: new validator()
}

