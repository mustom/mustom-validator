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
        itemValidationMode: 'all', // all, any, none, one, atLeast, atMost, exactly
        itemValidationThreshold: null, // Used for 'atLeast', 'atMost', 'exactly' modes
        entryValidationMode: 'strict', // strict, flexible ==> strict, flexible, forbidExtra, requireAllRules
        stripUndefinedKey: true,
        softFail: false,
        // ignoreUsageError: true,
        abortEarly: true, // Stop validation on first error if true
        strictDateValidation: false // Strict date validation (e.g., invalid dates like Feb 30)
    }

    // item : Used for indexed data structure (Array, Set)
    // entry : Userd for Key-value based data structure (Object, Map)
    return this
}

/** Validate a single input value against specified rules.
 */
validator.prototype.single = function (input, option = {}) {
    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
    this.dataType = dataTypeChecker(input)
    return this
}

/** Validate each property in an object against specified rules.
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

    if (option.entryValidationMode && ![ 'strict', 'flexible', 'forbidExtra', 'requireAllRules' ].includes(option.entryValidationMode)) {
        errorHandler(this, 'UsageError', `Invalid entryValidationMode: ${option.entryValidationMode}`)
    }

    if (option.stripUndefinedKey !== undefined && dataTypeChecker(option.stripUndefinedKey) !== 'boolean') {
        errorHandler(this, 'UsageError', `stripUndefinedKey option should be a boolean.`)
    }

    this.option = { ...this.option, ...option }
    this.dataType = inputDataType

    let newRefinements = {}

    for (const key in rule) {

        const target = input[key]
        const targetRule = rule[key]

        // Throw error if the key is not defined in the input
        if (!target) {
            if ([ 'strict', 'requireAllRules' ].includes(this.option.entryValidationMode)) {
                errorHandler(this, 'ValidationError', `'${key}' is required.`)
            }
        }
        
        this.input = input[key]
        this.dataType = dataTypeChecker(this.input)
        this.refinement = input[key]
        this.key = key

        const targetRuleDataType = dataTypeChecker(targetRule)

        if (targetRuleDataType === 'object') {
            this.objectIterate(this.input, targetRule)
        } else {
            const itemResult = targetRule()
            newRefinements = { ...newRefinements, [key]: itemResult.refinement }
        }
    }

    // Check for extra keys in input that are not defined in the rule
    for (const key in input) {

        const targetRule = rule[key]

        if (!targetRule) {

            if ([ 'strict', 'forbidExtra' ].includes(this.option.entryValidationMode)) {
                errorHandler(this, 'ValidationError', `'${key}' is unknown field.`)
            }

            if ([ 'flexible', 'requireAllRules' ].includes(this.option.entryValidationMode) && this.option.stripUndefinedKey === false) {
                newRefinements = { ...newRefinements, [key]: input[key] }
            }
        }
    }

    // Remove this.key, this.criterion after validation
    delete this.key
    delete this.criterion
    this.dataType = inputDataType
    this.input = input
    this.refinement = newRefinements

    return this
}

/** Validate each object in an array against a specified rule.
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

    const result = this.arrayIterate(input, () => {
        this.objectIterate(this.input, rule, this.option)
    })

    this.input = result.input
    this.refinement = result.refinement
    this.isValid = result.isValid
    this.errors = result.errors

    return this
}

/**
 * Validate each item in an array against a specified rule.
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

    if (option.itemValidationMode && ![ 'all', 'any', 'none', 'one', 'atLeast', 'atMost', 'exactly' ].includes(option.itemValidationMode)) {
        errorHandler(this, 'UsageError', `Invalid itemValidationMode: ${option.itemValidationMode}`)
    }

    if (option.itemValidationThreshold !== undefined && [ 'atLeast', 'atMost', 'exactly' ].includes(option.itemValidationMode) && dataTypeChecker(option.itemValidationThreshold) !== 'number') {
        errorHandler(this, 'UsageError', `itemValidationThreshold option should be a number.`)
    }

    const results = input.map((item, index) => {
        this.input = item
        this.refinement = item
        this.dataType = dataTypeChecker(item)
        this.index = index
        this.isValid = true
        this.option = { ...this.option, softFail: true, abortEarly: false, ...option }
        
        const result = rule()

        return { refinement: result.refinement, isValid: result.isValid, errors: result.errors }
    })

    const validItems = results.filter(result => result.isValid)
    const invalidItems = results.filter(result => !result.isValid)
    const newRefinement = results.map(item => item.refinement)

    switch (this.option.itemValidationMode) {
        case 'all':
            if (invalidItems.length === input.length) {
                this.isValid = true
            }
            break
        case 'any':
            if (validItems.length > 0) {
                this.isValid = true
            }
            break
        case 'none':
            if (invalidItems.length === 0) {
                this.isValid = true
            }
            break
        case 'one':
            if (validItems.length === 1) {
                this.isValid = true
            }
            break
        case 'atLeast':
            if (dataTypeChecker(this.option.itemValidationThreshold) !== 'number') {
                errorHandler(
                    this,
                    'UsageError',
                    `itemValidationThreshold option is required for 'atLeast' itemValidationMode, and should be a number.`
                )
            }
            if (validItems.length >= this.option.itemValidationThreshold) {
                this.isValid = true
            }
            break
        case 'atMost':
            if (dataTypeChecker(this.option.itemValidationThreshold) !== 'number') {
                errorHandler(
                    this,
                    'UsageError',
                    `itemValidationThreshold option is required for 'atMost' itemValidationMode, and should be a number.`
                )
            }
            if (validItems.length <= this.option.itemValidationThreshold) {
                this.isValid = true
            }
            break
        case 'exactly':
            if (dataTypeChecker(this.option.itemValidationThreshold) !== 'number') {
                errorHandler(
                    this,
                    'UsageError',
                    `itemValidationThreshold option is required for 'exactly' itemValidationMode, and should be a number.`
                )
            }
            if (validItems.length === this.option.itemValidationThreshold) {
                this.isValid = true
            }
            break
        default:
            errorHandler(
                this,
                'UsageError',
                `Invalid itemValidationMode: ${this.option.itemValidationMode}`
            )
    }
    
    // Remove this.index, this.criterion after validation
    delete this.index
    delete this.criterion
    this.input = input
    this.dataType = inputDataType
    this.refinement = newRefinement

    return this
}

/** Validate each item in a set against a specified rule.
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
    const results = Array.from(input).map((item, index) => {
        this.input = item
        this.isValid = true
        this.dataType = dataTypeChecker(item)
        this.refinement = item
        this.index = index
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
        this.key = key

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
