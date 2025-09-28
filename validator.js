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
        abortEarly: true, // Stop validation on first error if true
        strictDateValidation: false // Strict date validation (e.g., invalid dates like Feb 30)
    }

    // item : Used for indexed data structure (Array, Set)
    // entry : Userd for Key-value based data structure (Object, Map)
    return this
}

/** Validate a single input value against specified rules.
 * @example
 * validator.single('test').string().minLength(1).notEmpty()
 */
validator.prototype.single = function (input, option = {}) {
    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = dataTypeChecker(input)

    return this
}

/** Validate each property in an object against specified rules.
 * @example
 * validator.objectIterate(
 *  { 
 *      name: 'Alice',
 *      age: 30},
 *  },
 *  {
 *      name: () => validator.string().minLength(1),
 *      age: () => validator.number().min(0)
 *  },
 *  { entryValidationMode: 'strict' })
 */
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

    // this.input = input
    // this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = inputDataType

    let newInput = {}
    let newRefinement = {}

    for (const key in input) {
        const targetRule = rule[key]

        // Throw error if the key is not defined in the rule
        if (this.option.entryValidationMode === 'strict' && !targetRule) {
            errorHandler(this, 'UsageError', `Key '${key}' is undefined.`)
        }

        // If the key is not defined in the rule, and the option 'stripUnknown' is true, remove it from refinement
        if (!targetRule && this.option.stripUnknown) {
            delete this.refinement[key]
        }

        this.input = input[key]
        this.refinement = input[key]

        if (targetRule.constructor === Object) {
            this.objectIterate(this.input, targetRule)
        } else {
            const itemResult = targetRule()
            newInput = { ...newInput, [key]: itemResult.input }
            newRefinement = { ...newRefinement, [key]: itemResult.refinement }
        }
    }

    this.input = newInput
    this.refinement = newRefinement

    for (const key in rule) {
        if (!input[key]) {
            errorHandler(this, 'ValidationError', `The value '${key}' is required.`)
        }
    }

    return this
}

/** Validate each object in an array against a specified rule.
 * @example
 * validator.arrayObjectIterate(
 *  [{ name: 'Alice' }, { name: 'Bob' }],
 *  { name: () => validator.string().minLength(1) },
 *  { itemValidationMode: 'all' })
 */
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
        errorHandler(
            this,
            'UsageError',
            `'arrayObjectIterate' method requires an object as a rule.`
        )
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

/**
 * Validate each item in an array against a specified rule.
 * @example
 * validator.arrayIterate(['a', 'b', 'c'], () => validator.string().minLength(1), { itemValidationMode: 'all' })
 */
validator.prototype.arrayIterate = function (input, rule, option = {}) {
    const inputDataType = dataTypeChecker(input)
    const ruleDataType = dataTypeChecker(rule, { showMisc: true })

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
    this.option = { ...this.option, ...option }
    this.dataType = 'array'

    const results = input.map(item => {
        this.input = item
        this.refinement = item
        this.isValid = true
        this.dataType = dataTypeChecker(item)
        this.option = { ...this.option, softFail: true, abortEarly: false }
        rule()

        return { refinement: this.refinement, isValid: this.isValid, errors: this.errors }
    })

    const validItems = results.filter(result => result.isValid)
    const invalidItems = results.filter(result => !result.isValid)
    const newRefinement = results.map(item => item.refinement)

    switch (this.option.itemValidationMode) {
        case 'all':
            if (invalidItems.length < input.length) {
                this.isValid = false
            }
            break
        case 'some':
            if (validItems.length === 0) {
                this.isValid = false
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = validItems
            break
        case 'none':
            if (invalidItems.length === 0) {
                this.isValid = true
            }
            break
        case 'one':
            if (validItems.length !== 1) {
                this.isValid = false
            }
            break
        case 'any':
            if (validItems.length === 0) {
                this.isValid = false
            }
            break
        default:
            errorHandler(
                this,
                'UsageError',
                `Invalid itemValidationMode: ${this.option.itemValidationMode}`
            )
    }

    this.refinement = newRefinement

    return this
}

/** Validate each item in a set against a specified rule.
 * @example
 * validator.setIterate(new Set(['a', 'b', 'c']), () => validator.string().minLength(1), { itemValidationMode: 'all' })
 */
validator.prototype.setIterate = function (input, rule, option = {}) {
    this.dataType = dataTypeChecker(input)

    if (this.dataType !== 'set' || !input.size) {
        errorHandler(
            this,
            'ValidationError',
            `The value '${this.input}' should be a set and not empty.`
        )
    }

    this.refinement = new Set(input)
    this.input = input
    this.dataType = 'set'

    // Iterate through each item in the set
    const results = Array.from(input).map(item => {
        this.input = item
        this.isValid = true
        this.dataType = dataTypeChecker(item)
        this.refinement = item
        this.option = { softFail: true, abortEarly: false }

        rule()

        return { refinement: this.refinement, isValid: this.isValid, errors: this.errors }
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
            this.refinement = new Set(validItems)
            break
        case 'some':
            if (validItems.length === 0) {
                this.isValid = false
                this.errors = invalidItems.flatMap(item => item.errors)
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = new Set(validItems)
            break
        case 'none':
            if (invalidItems.length === 0) {
                this.isValid = false
                this.errors.push({
                    type: 'itemValidationMode',
                    message: 'No items should pass the validation.'
                })
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = new Set()
            break
        case 'one':
            if (validItems.length !== 1) {
                this.isValid = false
                this.errors.push({
                    type: 'itemValidationMode',
                    message: 'Exactly one item should pass the validation.'
                })
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = new Set(validItems)
            break
        case 'any':
            if (validItems.length === 0) {
                this.isValid = false
                this.errors = invalidItems.flatMap(item => item.errors)
                if (this.option.abortEarly && this.errors.length) return this
            }
            this.refinement = new Set(validItems)
            break
        default:
            errorHandler(
                this,
                'UsageError',
                `Invalid itemValidationMode: ${this.option.itemValidationMode}`
            )
    }

    return this
}

/** Validate each entry in a map against specified rules.
 * @example
 * validator.mapIterate(
 *  new Map([
 *      ['name', 'Alice'],
 *      ['age', 30]
 *  ]),
 *  {
 *      name: () => validator.string().minLength(1),
 *      age: () => validator.number().min(0)
 *  },
 *  { entryValidationMode: 'strict' })
 */
validator.prototype.mapIterate = function (input, rule, option = {}) {

    const inputDataType = dataTypeChecker(input)
    const ruleDataType = dataTypeChecker(rule)

    if (!input) {
        errorHandler(this, 'UsageError', `The input value is required.`)
    }

    if (!rule) {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }

    if (inputDataType !== 'map') {
        errorHandler(this, 'UsageError', `'mapIterate' method requires a map.`)
    }

    if (ruleDataType !== 'object') {
        errorHandler(this, 'UsageError', `'mapIterate' method requires an object as a rule.`)
    }

    if (!input.size) {
        errorHandler(this, 'UsageError', `The input map should not be empty.`)
    }

    if (!Object.keys(rule).length) {
        errorHandler(this, 'UsageError', `The rule object should not be empty.`)
    }

    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = 'map'

    for (const [key, value] of input) {
        const targetRule = rule[key]

        // Throw error if the key is not defined in the rule
        if (this.option.entryValidationMode === 'strict' && !targetRule) {
            errorHandler(this, 'ValidationError', `Key '${key}' is undefined.`)
        }

        // If the key is not defined in the rule, and the option 'stripUnknown' is true, remove it from refinement
        if (!targetRule && this.option.stripUnknown) {
            this.refinement.delete(key)
        }

        this.input = value

        if (targetRule.constructor === Object) {
            this.setIterate(this.input, targetRule)
        } else {
            targetRule()
        }
    }

    for (const key in rule) {
        if (!input.has(key)) {
            errorHandler(this, 'ValidationError', `The value '${key}' is required.`)
        }
    }

    return this
}

// Mixin methods from other modules
Object.assign(validator.prototype, comparison)
Object.assign(validator.prototype, condition)
Object.assign(validator.prototype, dataType)
Object.assign(validator.prototype, regex)
Object.assign(validator.prototype, dataTransformation)
Object.assign(validator.prototype, misc)

module.exports = {
    validator: new validator()
}
