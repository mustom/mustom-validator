// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const comparison = require('./method/comparison.js')
const condition = require('./method/condition.js')
const dataType = require('./method/data-type.js')
const regex = require('./method/regex.js')
const dataTransformation = require('./method/data-transformation.js')
const misc = require('./method/misc.js')
const errorHandler = require('./utils/error-handler.js')
const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('./error/custom-error')

const validator = function () {
    this.input = null
    this.refinement = null
    this.dataTypes = []
    this.errors = []
    this.isValid = true
    this.option = {
        mode: 'strict',
        stripUnknown: 'true',
        softFail: false
    }

    return this
}

// mode: strict (정의 안된 건 다 에러), flexible (정의 안되면 스킵)

validator.prototype.single = function (input, option = {}) {
    this.input = input
    this.refinement = input
    this.option = { ...this.option, ...option }
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

Object.assign(validator.prototype, comparison)
Object.assign(validator.prototype, condition)
Object.assign(validator.prototype, dataType)
Object.assign(validator.prototype, regex)
Object.assign(validator.prototype, dataTransformation)
Object.assign(validator.prototype, misc)


// const Validator = new validator()

// export default Validator

module.exports = {
    validator: new validator()
}

