// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { errorHandler } = require('../util/error-handler')


const comparison = {
    is: function (expected) {
        if (this.input === undefined) {
            return this
        }

        if (this.input !== expected) {
            errorHandler(this, 'ValidationError', `The value should be '${expected}'`)
        }

        return this
    },
    isNot: function (expected) {
        if (this.input === undefined) {
            return this
        }

        if (this.input === expected) {
            errorHandler(this, 'ValidationError', `The value should not be '${expected}'`)
        }

        return this
    },
    minValue: function (limit) {
        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'number') {
            errorHandler(this, 'ValidationError', `The value should be a number.`)
        }

        if (typeof limit !== 'number') {
            errorHandler(this, 'ValidationError', `The limit should be a number.`)
        }

        if (this.input < limit) {
            errorHandler(this, 'ValidationError', `The value should be equal or greater than '${limit}'`)
        }

        return this
    },
    maxValue: function (limit) {
        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'number') {
            errorHandler(this, 'ValidationError', `The value should be a number.`)
        }

        if (typeof limit !== 'number') {
            errorHandler(this, 'ValidationError', `The limit should be a number.`)
        }

        if (this.input > limit) {
            errorHandler(this, 'ValidationError', `The value should be equal or less than '${limit}'`)
        }

        return this
    },
    in: function (comparison) {
        // Since this is an usage error (not a validation error), the error will not be handled, even if 'softFail' is set to true.
        if (!Array.isArray(comparison)) {
            errorHandler(this, 'UsageError', `The type of '${expected}' should be an Array.`)
        }

        if (this.dataType === 'array') {
            for (const item of this.input) {
                if (!comparison.includes(item)) {
                    errorHandler(this, 'ValidationError', `The value '${item}' is not in the list.`)
                }
            }
        }

        if (!comparison.includes(this.input)) {
            errorHandler(this, 'ValidationError', `The value '${this.input}' is not in the list.`)
        }

        return this
    },
    notIn: function (comparison) {
        // Since this is an usage error (not a validation error), the error will not be handled, even if 'softFail' is set to true.
        if (!Array.isArray(comparison)) {
            errorHandler(this, 'UsageError', `The type of '${comparison}' should be an Array.`)
        }

        if (this.dataType === 'array') {
            for (const item of this.input) {
                if (comparison.includes(item)) {
                    errorHandler(this, 'ValidationError', `The value '${item}' is not in the list.`)
                }
            }
        }

        if (comparison.includes(this.input)) {
            errorHandler(this, 'ValidationError', `The value '${this.input}' is not in the list.`)
        }

        return this
    },
    exactLength: function (expected) {
        if (this.input === undefined) {
            return this
        }

        if (typeof expected !== 'number') {
            errorHandler(this, 'UsageError', `The expected length '${expected}' should be a number.`)
        }

        const length = calculateLength(this.input, this.dataType)
       
        if (expected !== length) {
            errorHandler(this, 'ValidationError', `The length of the value should be ${expected}.`)
        }

        return this
    },
    minLength: function (expected) {
        if (this.input === undefined) {
            return this
        }

        if (typeof expected !== 'number') {
            errorHandler(this, 'UsageError', `The expected length '${expected}' should be a number.`)
        }

        const length = calculateLength(this.input, this.dataType)

        if (expected > length) {
            errorHandler(this, 'ValidationError', `The length of the value should be equal or greater than ${expected}.`)
        }

        return this
    },
    maxLength: function (expected) {
        if (this.input === undefined) {
            return this
        }

        if (typeof expected !== 'number') {
            errorHandler(this, 'UsageError', `The expected length '${expected}' should be a number.`)
        }

        const length = calculateLength(this.input, this.dataType)

        if (expected < length) {
            errorHandler(this, 'ValidationError', `The length of the value should be equal or less than ${expected}.`)
        }

        return this
    }
}


const calculateLength = (input, dataType) => {
    if (['string', 'array'].includes(dataType)) {
        return input.length
    }
    
    if (['set', 'map'].includes(dataType)) {
        return input.length
    }

    if (dataType === 'object') {
        return Object.keys(input).length
    }

    if (dataType === 'number') {
        return input.toString().length
    }
    
    errorHandler(this, 'ValidationError', `The length of the data type '${dataType}' cannot be calculated.`)
}

module.exports = comparison
