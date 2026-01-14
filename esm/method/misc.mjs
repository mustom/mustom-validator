// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

import { errorHandler } from '../error-handling/error-handler.mjs'
import { dataTypeChecker } from '../util/data-type-checker.mjs'

const misc = {
    /**
     * @description Validates grid options for data retrieval.
     * @note Special validation method dedicated to the Mustom admin panel.
     */
    gridOption: function () {

        this.criterion = 'gridOption'
        
        if (dataTypeChecker(this.input) !== 'object') {
            errorHandler(this, 'ValidationError', 'The input for gridOption() must be an object.')
        }

        for (const key in this.input) {

            // Uncomment the following lines to enforce strict key checking (Disallow undefined keys)
            // if (!validKeys.includes(key)) {
            //     errorHandler(this, 'ValidationError', `The key '${key}' is not allowed in gridOption(). Allowed keys are: ${validKeys.join(', ')}`)
            // }

            const value = this.input[key]

            const dataType = dataTypeChecker(value)

            switch (key) {
                case 'menu':
                    if (dataType !== 'string') {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be a string.`)
                    }
                    break
                case 'limit':
                    if (dataType !== 'number' || value % 1 !== 0 || value < 1) {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be a positive integer.`)
                    }
                    break
                case 'orderDirection':
                    if (value !== 'asc' && value !== 'desc') {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be either 'asc' or 'desc'.`)
                    }
                    break
                case 'orderBy':
                    if (dataType !== 'string') {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be a string.`)
                    }
                    break
                case 'searchBy':
                    if (dataType !== 'string') {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be a string.`)
                    }
                    break
                case 'offset':
                    if (dataType !== 'number' || value % 1 !== 0 || value < 0) {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be a non-negative integer.`)
                    }
                    break
                case 'attributes':
                    if (dataType !== 'array') {
                        errorHandler(this, 'ValidationError', `The key '${key}' must be an array.`)
                    }
                    break
                default:
                    // Do nothing. Undefined keys can be allowed by default.
                    break
            }
        }

        return this
    },
    /**
     * @description Specifies that no validation rules are applied to the input data.
     */
    noRules: function () {
        return this
    },
    /**
     * @description Force-sets a specific value.
     */
    setValue: function (value) {

        const valueDataType = dataTypeChecker(value)

        if (valueDataType === 'undefined') {
            errorHandler(this, 'UsageError', `The value is missing.`)
        }

        this.refinement = value
        return this
    },
    /**
     * @description Force-sets specific value if given value is undefined.
     */
    setValueForUndefined: function (value) {

        const valueDataType = dataTypeChecker(value)

        if (valueDataType === 'undefined') {
            this.refinement = value
        }

        return this
    }
}

export default misc
