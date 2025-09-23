// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const comparison = require('./method/comparison.js')
const condition = require('./method/condition.js')
const dataType = require('./method/data-type.js')
const regex = require('./method/regex.js')
const dataTransformation = require('./method/data-transformation.js')
const misc = require('./method/misc.js')
const { errorHandler } = require('./util/error-handler.js')
const { dataTypeChecker } = require('./util/data-type-checker.js')
const {
    BaseError, 
    ValidationError, 
    UsageError
} = require('./error/custom-error')


const validator = function () {
    this.input = null
    this.refinement = null
    this.dataType = null
    this.errors = []
    this.isValid = true
    this.option = {
        itemValidationMode: 'all', // all(전부 조건), some (하나라도 조건), none, one, any
        entryValidationMode: 'strict',
        stripUnknown: true,
        softFail: false,
        ignoreUsageError: true,
        abortEarly: false, // Stop validation on first error
        strictDateValidation: false, // Strict date validation (e.g., invalid dates like Feb 30)
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
    if (!input || !Object.keys(input).length) {
        errorHandler(this, 'UsageError', `The input value is required.`)
    }

    if (!rule || !Object.keys(rule).length) {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }

    if (input.constructor !== Object) {
        errorHandler(this, 'UsageError', `'objectIterate' method requires an object.`)
    }

    if (rule.constructor !== Object) {
        errorHandler(this, 'UsageError', `'objectIterate' method requires an object.`)
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }

    for (const key in input) {
        const targetRule = rule[key]

        // Throw error if the key is not defined in the rule
        if (mode === 'strict' && !targetRule) {
            errorHandler(this, 'ValidationError', `Key '${key}' is undefined.`)
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
            errorHandler(this, 'ValidationError', `The value '${key}' is required.`)
        }
    }


    return this
}

validator.prototype.arrayObjectIterate = function (input, rule, option = {}) {
    if (!Array.isArray(value)) {
        errorHandler(this, 'UsageError', `The input value should be an array.`)
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
        errorHandler(this, 'ValidationError', `The value '${this.input}' should be an array and not empty.`)
    }

    if (!rule || typeof rule !== 'function') {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }

    if (typeof option !== 'object') {
        errorHandler(this, 'UsageError', `Option should be an object.`)
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
    this.dataType = dataTypeChecker(input)

    if (this.dataType !== 'set' || !input.size) {
        errorHandler(this, 'ValidationError', `The value '${this.input}' should be a set and not empty.`)
    }
    
}

validator.prototype.mapIterate = function () {
    this.dataType = dataTypeChecker(input)

    if (this.dataType !== 'map' || !input.size) {
        errorHandler(this, 'ValidationError', `The value '${this.input}' should be a map and not empty.`)
    }

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

