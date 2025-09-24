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

    const inputDataType = dataTypeChecker(input)
    const ruleDataType = dataTypeChecker(rule)

    if (!input) {
        errorHandler(this, 'UsageError', `The input value is required.`)
    }

    if (!rule) {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }

    if (inputDataType !== 'object') {
        errorHandler(this, 'UsageError', `'objectIterate' method requires an object.`)
    }

    if (ruleDataType !== 'object') {
        errorHandler(this, 'UsageError', `'objectIterate' method requires an object.`)
    }

    if (!Object.keys(input).length) {
        errorHandler(this, 'UsageError', `The input object should not be empty.`)
    }

    if (!Object.keys(rule).length) {
        errorHandler(this, 'UsageError', `The rule object should not be empty.`)
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = 'object'

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

    const inputDataType = dataTypeChecker(input)
    const ruleDataType = dataTypeChecker(rule)

    if (!input) {
        errorHandler(this, 'UsageError', `The input value is required.`)
    }

    if (!rule) {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }

    if (inputDataType !== 'array') {
        errorHandler(this, 'UsageError', `'arrayObjectIterate' method requires an array.`)
    }
    
    if (ruleDataType !== 'object') {
        errorHandler(this, 'UsageError', `'arrayObjectIterate' method requires an object as a rule.`)
    }

    if (!input.length) {
        errorHandler(this, 'UsageError', `The input array should not be empty.`)
    }

    if (!Object.keys(rule).length) {
        errorHandler(this, 'UsageError', `The rule object should not be empty.`)
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = 'arrayObject'

    for (const item of input) {
        this.objectIterate(item, rule, this.option)
    }

    return this
}


// validator.arrayIterate(['a', 'b', 'c'], () => validator.string().minLength(1), { itemValdationMode: 'all' })

validator.prototype.arrayIterate = function (input, rule, option = {}) {

    const inputDataType = dataTypeChecker(input)
    const ruleDataType = dataTypeChecker(rule)

    if (!input) {
        errorHandler(this, 'UsageError', `The input value is required.`)
    }
    
    if (!rule) {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }    

    if (inputDataType !== 'array') {
        errorHandler(this, 'UsageError', `'arrayIterate' method requires an array.`)
    }

    if (ruleDataType !== 'function') {
        errorHandler(this, 'UsageError', `'arrayIterate' method requires a function as a rule.`)
    }

    if (!input.length) {
        errorHandler(this, 'UsageError', `The input array should not be empty.`)
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = 'array'

    // 아래는 GTP가 한거다 믿지 말자

    const results = input.map((item) => {
        this.input = item
        const prevRefinement = this.refinement
        this.refinement = item
        rule()
        const result = {
            isValid: this.isValid,
            errors: this.errors,
            refinement: this.refinement
        }
        this.isValid = true
        this.errors = []
        this.refinement = prevRefinement
        return result
    })

    const validItems = results.filter(result => result.isValid).map(result => result.refinement)
    const invalidItems = results.filter(result => !result.isValid)

    switch (this.option.itemValidationMode) {
        case 'all':
            if (invalidItems.length) {
                this.isValid = false
                this.errors = invalidItems.flatMap(item => item.errors)
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = validItems
            break
        case 'some':
            if (validItems.length === 0) {
                this.isValid = false
                this.errors = invalidItems.flatMap(item => item.errors)
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = validItems
            break
        case 'none':
            if (invalidItems.length === 0) {
                this.isValid = false
                this.errors.push({ type: 'itemValidationMode', message: 'No items should pass the validation.' })
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = []
            break
        case 'one':
            if (validItems.length !== 1) {
                this.isValid = false
                this.errors.push({ type: 'itemValidationMode', message: 'Exactly one item should pass the validation.' })
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = validItems
            break
        case 'any':
            if (validItems.length === 0) {
                this.isValid = false
                this.errors = invalidItems.flatMap(item => item.errors)
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = validItems
            break
        default:
            errorHandler(this, 'UsageError', `Invalid itemValidationMode: ${this.option.itemValidationMode}`)
    }


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

