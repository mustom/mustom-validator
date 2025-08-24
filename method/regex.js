// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const errorHandler = require('../utils/error-handler.js')

const regex = {
    regexTrue: function (regex) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const isPassed = regex.test(this.input)

        if (!isPassed) {
            throw new DataTypeError('invalid-value', `The value '${this.input}' is wrong format.`)
        }

        return this
    },
    regexFalse: function (regex) {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const isPassed = regex.test(this.input)

        if (isPassed) {
            throw new DataTypeError('invalid-value', `The value '${this.input}' is wrong format.`)
        }

        return this
    }
}

module.exports = regex
