// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')
const { errorHandler } = require('../util/error-handler.js')

const condition = {
    /**
     * Throws an error if the input is undefined.
     * Please note that `null` is a valid value. If you want to check for null, use `notEmpty`.
     */
    required: function () {
        if (this.input === undefined) {
            errorHandler(
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
            errorHandler(this, 'DataTypeError', `The value is empty.`)
        }

        if (['array'].includes(this.dataTypes)) {
            if (!this.input.length) {
                errorHandler(this, 'DataTypeError', `The value of array is empty.`)
            }
        }

        if (['object'].includes(this.dataTypes)) {
            if (!Object.keys(this.input).length) {
                errorHandler(this, 'DataTypeError', `The value of object is empty.`)
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
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should not contain whitespace.`)
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
            errorHandler(this, 'UsageError', `'notDuplicate' method is only available for array type.`)
        }

        const uniqueItems = new Set(this.input)
        if (uniqueItems.size !== this.input.length) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' has duplicate items.`)
        }

        return this
    }
}

module.exports = condition
