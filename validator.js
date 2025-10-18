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
    this.argument = null
    this.refinement = null
    this.dataType = null
    this.errors = []
    this.isValid = true
    this.option = {
        itemValidationMode: 'all', // all, any, none, one, atLeast, atMost, exactly
        itemValidationThreshold: null, // Used for 'atLeast', 'atMost', 'exactly' modes
        entryValidationMode: 'strict', // strict, flexible
        stripUndefinedKey: false,
        softFail: false,
        abortEarly: false, // Stop validation on first error if true
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

    if (option.entryValidationMode && ![ 'strict', 'flexible' ].includes(option.entryValidationMode)) {
        errorHandler(this, 'UsageError', `Invalid entryValidationMode: ${option.entryValidationMode}`)
    }

    if (option.stripUndefinedKey !== undefined && dataTypeChecker(option.stripUndefinedKey) !== 'boolean') {
        errorHandler(this, 'UsageError', `stripUndefinedKey option should be a boolean.`)
    }

    this.option = { ...this.option, ...option }

    let newRefinements = {}

    for (const key in rule) {

        const target = input[key]
        const targetRule = rule[key]

        // Throw error if the key is not defined in the input
        if (!target) {
            errorHandler(this, 'ValidationError', `'${key}' is required.`)
            continue
        }
        
        this.input = input[key]
        this.dataType = dataTypeChecker(this.input)
        this.refinement = input[key]
        this.key = key

        const targetRuleDataType = dataTypeChecker(targetRule, { showMisc: true })
        
        if (targetRuleDataType === 'function') {
            const itemResult = targetRule()
            newRefinements = { ...newRefinements, [key]: itemResult.refinement }
            continue
        }

        if (targetRuleDataType === 'object') {
            const itemResult = this.objectIterate(this.input, targetRule)
            this.option = { ...this.option, ...option }
            newRefinements = { ...newRefinements, [key]: itemResult.refinement }
            continue
        } 
        
        if (targetRuleDataType === 'array' && dataTypeChecker(targetRule[0], { showMisc: true }) === 'function') {
            
            if (!targetRule[0] || dataTypeChecker(targetRule[0], { showMisc: true }) !== 'function') {
                errorHandler(this, 'UsageError', `The first element of the rule array should be a function.`)
            }

            if (targetRule[1] && dataTypeChecker(targetRule[1], { showMisc: true }) !== 'object') {
                errorHandler(this, 'UsageError', `The second element of the rule array should be an object.`)
            }

            const itemResult = this.arrayIterate(this.input, targetRule[0], targetRule[1] || {})
            this.option = { ...this.option, ...option }
            newRefinements = { ...newRefinements, [key]: itemResult.refinement }
            continue
        }

        if (targetRuleDataType === 'array' && dataTypeChecker(targetRule[0], { showMisc: true }) === 'object') {
            const itemResult = this.arrayObjectIterate(this.input, targetRule[0])
            this.option = { ...this.option, ...option }
            newRefinements = { ...newRefinements, [key]: itemResult.refinement }
            continue        
        }
        
        errorHandler(this, 'UsageError', `Invalid rule for key '${key}'.`)
    }

    // Check for extra keys in input that are not defined in the rule
    for (const key in input) {

        const targetRule = rule[key]

        if (!targetRule) {

            if (this.option.entryValidationMode === 'strict') {
                errorHandler(this, 'ValidationError', `'${key}' is unknown field.`)
            }

            if (this.option.stripUndefinedKey === false) {
                newRefinements = { ...newRefinements, [key]: input[key] }
            }
        }
    }

    // Remove unused properties after validation
    delete this.key
    delete this.criterion
    delete this.argument
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
    
    if (!input.length) {
        errorHandler(this, 'UsageError', `The input array should not be empty.`)
    }

    if (inputDataType !== 'array' || dataTypeChecker(input[0]) !== 'object') {
        errorHandler(this, 'UsageError', `'arrayObjectIterate' method requires an array of objects.`)
    }

    if (ruleDataType !== 'object') {
        errorHandler(
            this,
            'UsageError',
            `'arrayObjectIterate' method requires an object as a rule.`
        )
    }

    if (!Object.keys(rule).length) {
        errorHandler(this, 'UsageError', `The rule object should not be empty.`)
    }


    this.option = { ...this.option, ...option }
    let newRefinements = []

    for (const [index, item] of input.entries()) {
        this.index = index
        const result = this.objectIterate(item, rule, this.option)
        newRefinements.push(result.refinement)
    }

    // Remove unused properties after validation
    delete this.index
    delete this.criterion
    delete this.argument
    this.input = input
    this.dataType = 'arrayObject'
    this.refinement = newRefinements

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
        errorHandler(this, 'ValidationError', `Input should be an array.`)
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

    if ([ 'atLeast', 'atMost', 'exactly' ].includes(option.itemValidationMode) && dataTypeChecker(option.itemValidationThreshold) !== 'number') {
        errorHandler(this, 'UsageError', `Invalid itemValidationThreshold`)
    }

    const results = input.map((item, index) => {
        this.input = item
        this.refinement = item
        this.dataType = dataTypeChecker(item)
        this.index = index
        this.isValid = true
        this.option = { ...this.option, ...option }
        
        const result = rule()

        return { refinement: result.refinement, isValid: result.isValid, errors: result.errors }
    })

    const validItems = results.filter(result => result.isValid)
    const invalidItems = results.filter(result => !result.isValid)
    const newRefinement = results.map(item => item.refinement)

    switch (this.option.itemValidationMode) {
        case 'all':
            if (validItems.length === input.length) {
                this.errors = []
                this.isValid = true
            } else {
                this.errors = invalidItems.flatMap(item => item.errors)
            }
            break
        case 'any':
            if (validItems.length > 0) {
                this.errors = []
                this.isValid = true
            } else {
                this.errors = invalidItems.flatMap(item => item.errors)
            }
            break
        case 'none':
            if (invalidItems.length === 0) {
                this.errors = []
                this.isValid = true
            } else {
                this.errors = invalidItems.flatMap(item => item.errors)
            }
            break
        case 'one':
            if (validItems.length === 1) {
                this.errors = []
                this.isValid = true
            } else {
                this.errors = invalidItems.flatMap(item => item.errors)
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
                this.errors = []
                this.isValid = true
            } else {
                this.errors = invalidItems.flatMap(item => item.errors)
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
                this.errors = []
                this.isValid = true
            } else {
                this.errors = invalidItems.flatMap(item => item.errors)
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
                this.errors = []
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

    // Remove unused properties after validation
    delete this.index
    delete this.criterion
    delete this.argument
    this.input = input
    this.dataType = inputDataType
    this.refinement = newRefinement

    return this
}

/** Validate each item in a set against a specified rule.
 */
validator.prototype.setIterate = function (input, rule, option = {}) {

    const inputDataType = dataTypeChecker(input)
    const ruleDataType = dataTypeChecker(rule, { showMisc: true })

    if (!input) {
        errorHandler(this, 'UsageError', `The input value is required.`)
    }

    if (!rule) {
        errorHandler(this, 'UsageError', `Rule is required.`)
    }

    if (inputDataType !== 'set') {
        errorHandler(this, 'UsageError', `'setIterate' method requires a set.`)
    }

    if (ruleDataType !== 'function') {
        errorHandler(this, 'UsageError', `'setIterate' method requires a function as a rule.`)
    }

    if (!input.size) {
        errorHandler(this, 'UsageError', `The input set should not be empty.`)
    }
    
    if (option.itemValidationMode && ![ 'all', 'any', 'none', 'one', 'atLeast', 'atMost', 'exactly' ].includes(option.itemValidationMode)) {
        errorHandler(this, 'UsageError', `Invalid itemValidationMode: ${option.itemValidationMode}`)
    }

    if ([ 'atLeast', 'atMost', 'exactly' ].includes(option.itemValidationMode) && dataTypeChecker(option.itemValidationThreshold) !== 'number') {
        errorHandler(this, 'UsageError', `Invalid itemValidationThreshold`)
    }

    // Iterate through each item in the set
    const results = Array.from(input).map((item, index) => {
        this.input = item
        this.refinement = item
        this.dataType = dataTypeChecker(item)
        this.index = index
        this.isValid = true
        this.option = { ...this.option, ...option }

        const result = rule()

        console.log(result.refinement)

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
    
    // Remove unused properties after validation
    delete this.index
    delete this.criterion
    delete this.argument
    this.input = input
    this.dataType = inputDataType
    this.refinement = new Set(newRefinement)

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
