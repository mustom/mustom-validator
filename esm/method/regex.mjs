// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

import { errorHandler } from '../error-handling/error-handler.mjs'
import { dataTypeChecker } from '../util/data-type-checker.mjs'

const regex = {
    /**
     * @description Validates the input value against the given regular expression.
     * @note If the input value matches the regex, it passes the validation.
     * @note If it does not match, a ValidationError is thrown.
     */
    regexTrue: function (regex) {

        this.criterion = 'regexTrue'
        this.argument = regex.toString()

        if (this.input === undefined) {
            return this
        }

        const argumentType = dataTypeChecker(regex)

        if (argumentType !== 'regexp') {
            errorHandler(this, 'UsageError', `The data type '${argumentType}' is not supported for regex validation.`)
        }

        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'ValidationError', `The value {{input}} is in the wrong format.`)
        }

        return this
    },
    /**
     * @description Validates the input value against the given regular expression.
     * @note If the input value does not match the regex, it passes the validation.
     * @note If it matches, a ValidationError is thrown.
     */
    regexFalse: function (regex) {
        this.criterion = 'regexFalse'
        this.argument = regex.toString()
        
        if (this.input === undefined) {
            return this
        }

        const argumentType = dataTypeChecker(regex)

        if (argumentType !== 'regexp') {
            errorHandler(this, 'UsageError', `The data type '${argumentType}' is not supported for regex validation.`)
        }

        const isPassed = regex.test(this.input)

        if (isPassed) {
            errorHandler(this, 'ValidationError', `The value {{input}} is in the wrong format.`)
        }

        return this
    }
}

export default regex
