// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')
const { handleError } = require('../utils/error-handler.js')

const condition = {
    /**
     * Throws an error if the input is undefined.
     * Please note that `null` is a valid value. If you want to check for null, use `notEmpty`.
     */
    required: function () {
        if (this.input === undefined) {
            handleError(
                this,
                'missing-required',
                `The value '${this.input}' is required.`
            )
        }

        return this
    },
    /**
     * Throws an error if the input is null, empty string, or undefined.
     * If input is an array, or an object, it checks if they are empty.
     */
    notEmpty: function () {
        if (this.input === null || this.input === '' || this.input === undefined) {
            throw new DataTypeError('invalid-value', `The value is empty.`)
        }

        if (['array'].includes(this.dataTypes)) {
            if (!this.input.length) {
                throw new DataTypeError('invalid-value', `The value of array is empty.`)
            }
        }

        if (['object'].includes(this.dataTypes)) {
            if (!Object.keys(this.input).length) {
                throw new DataTypeError('invalid-value', `The value of object is empty.`)
            }
        }

        return this
    },

    noWhitespace: function () {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /\s/
        const isPassed = regex.test(this.input)

        if (isPassed) {
            throw new DataTypeError(
                'invalid-value',
                `The value '${this.input}' should not contain whitespace.`
            )
        }

        return this
    },

    // Used only the datatype is 'array'
    notDuplicate: function () {
        if (
            this.input === null ||
            this.input === undefined ||
            (Array.isArray(this.input) && this.input.length === 0)
        ) {
            return this
        }

        if (!Array.isArray(this.input)) {
            throw new UsageError(
                'invalid-type',
                `'notDuplicate' method is only available for array type.`
            )
        }

        const uniqueItems = new Set(this.input)
        if (uniqueItems.size !== this.input.length) {
            throw new DataTypeError(
                'duplicate-value',
                `The value '${this.input}' has duplicate items.`
            )
        }

        return this
    }
}

module.exports = condition
