// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')
const { errorHandler } = require('../util/error-handler.js')

const comparison = {
    is: function (expected) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input !== expected) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be '${expected}'`)
        }

        return this
    },
    isNot: function (expected) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input === expected) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be '${expected}'`)
        }

        return this
    },
    minValue: function (limit) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (isNaN(+this.input)) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a number.`)
        }

        if (this.input < limit) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be equal or greater than '${limit}'`)
        }

        return this
    },
    maxValue: function (limit) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (isNaN(+this.input)) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a number.`)
        }

        if (this.input > limit) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be equal or less than '${limit}'`)
        }

        return this
    },
    in: function (comparison) {
        // Since this is a usage error (not a validation error), the error will not be handled, even if 'softFail' is set to true.
        if (!Array.isArray(comparison)) {
            throw new UsageError(
                'internal-error',
                `The type of '${expected}' should be an Array.`
            )
        }

        if (Array.isArray(this.input)) {
            for (const item of this.input) {
                if (!comparison.includes(item)) {
                    errorHandler(this, 'DataTypeError', `The value '${item}' is not in the list.`)
                }
            }
        }

        if (!comparison.includes(this.input)) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' is not in the list.`)
        }

        return this
    },
    notIn: function (comparison) {
        // Since this is a usage error (not a validation error), the error will not be handled, even if 'softFail' is set to true.
        if (!Array.isArray(comparison)) {
            throw new UsageError(
                'internal-error',
                `The type of '${expected}' should be an Array.`
            )
        }

        if (Array.isArray(this.input)) {
            for (const item of this.input) {
                if (comparison.includes(item)) {
                    errorHandler(this, 'DataTypeError', `The value '${item}' is not in the list.`)
                }
            }
        }

        if (comparison.includes(this.input)) {
            errorHandler(this, 'DataTypeError', `The value '${item}' is not in the list.`)
        }

        return this
    },
    exactLength: function (expected) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        let length = 0

        if (Array.isArray(this.input) || typeof this.input === 'string') {
            length = this.input.length
        }

        if (typeof this.input === 'number') {
            if (!isNaN(myNum)) {
                console.log("이것은 유효한 숫자입니다.");
            }
        }




        Object.keys(obj).length

        if (expected !== length) {
            errorHandler(this, 'DataTypeError', `The length of '${this.input}' should be ${expected}.`)
        }

        return this
    },
    minLength: function (expected) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const length = this.input.length

        if (expected > length) {
            errorHandler(this, 'DataTypeError', `The length of '${this.input}' should be equal or greater than ${expected}.`)
        }

        return this
    },
    maxLength: function (expected) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const length = this.input.length

        if (expected < length) {
            errorHandler(this, 'DataTypeError', `The length of '${this.input}' should be equal or less than ${expected}.`)
        }

        return this
    }
}

module.exports = comparison
