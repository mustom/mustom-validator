// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { errorHandler } = require('../util/error-handler')
const { dataTypeChecker } = require('../util/data-type-checker')

const regex = {
    /**
     * Validate the input value with the given regular expression.
     * If the input value matches the regex, it passes the validation.
     * If it does not match, a ValidationError is thrown.
     */
    regexTrue: function (regex) {
        if (this.input === undefined) {
            return this
        }

        const argumentType = dataTypeChecker(regex)

        if (argumentType !== 'regexp') {
            errorHandler(this, 'UsageError', `The data type '${argumentType}' is not supported for regex validation.`)
        }

        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'ValidationError', `The value is in the wrong format.`)
        }

        return this
    },
    /**
     * Validate the input value with the given regular expression.
     * If the input value does not match the regex, it passes the validation.
     * If it matches, a ValidationError is thrown.
     */
    regexFalse: function (regex) {
        if (this.input === undefined) {
            return this
        }

        const argumentType = dataTypeChecker(regex)

        if (argumentType !== 'regexp') {
            errorHandler(this, 'UsageError', `The data type '${argumentType}' is not supported for regex validation.`)
        }

        const isPassed = regex.test(this.input)

        if (isPassed) {
            errorHandler(this, 'ValidationError', `The value is in the wrong format.`)
        }

        return this
    }
}

module.exports = regex
