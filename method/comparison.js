// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { errorHandler } = require('../util/error-handler')


const comparison = {
    /**
     * Checks if the input is equal to the expected value.
     * @param {*} expected - The expected value.
     */
    is: function (expected) {

        this.criterion = 'is'
        this.argument = expected

        if (this.input === undefined) {
            return this
        }

        if (this.input !== expected) {
            errorHandler(this, 'ValidationError', `The value {{input}} should be '${expected}'`)
        }

        return this
    },
    /**
     * Checks if the input is not equal to the expected value.
     * @param {*} expected - The expected value.
     */
    isNot: function (expected) {

        this.criterion = 'isNot'
        this.argument = expected

        if (this.input === undefined) {
            return this
        }

        if (this.input === expected) {
            errorHandler(this, 'ValidationError', `The value {{input}} should not be '${expected}'`)
        }

        return this
    },
    /**
     * Checks if the input is greater than or equal to the limit.
     * @param {number} limit - The minimum value.
     */
    minValue: function (limit) {

        this.criterion = 'minValue'
        this.argument = limit

        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'number') {
            errorHandler(this, 'ValidationError', `The value {{input}} should be a number.`)
        }

        if (typeof limit !== 'number') {
            errorHandler(this, 'ValidationError', `The limit {{input}} should be a number.`)
        }

        if (this.input < limit) {
            errorHandler(this, 'ValidationError', `The value {{input}} should be equal or greater than '${limit}'`)
        }

        return this
    },
    /**
     * Checks if the input is less than or equal to the limit.
     * @param {number} limit - The maximum value.
     */
    maxValue: function (limit) {

        this.criterion = 'maxValue'
        this.argument = limit

        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'number') {
            errorHandler(this, 'ValidationError', `The value {{input}} should be a number.`)
        }

        if (typeof limit !== 'number') {
            errorHandler(this, 'ValidationError', `The limit {{input}} should be a number.`)
        }

        if (this.input > limit) {
            errorHandler(this, 'ValidationError', `The value {{input}} should be equal or less than '${limit}'`)
        }

        return this
    },
    /**
     * Checks if the input is included in the list array.
     * @param {Array} list - The array to compare against.
     */
    in: function (list) {

        this.criterion = 'in'
        this.argument = list

        // Since this is an usage error (not a validation error), the error will not be handled, even if 'softFail' is set to true.
        if (!Array.isArray(list)) {
            errorHandler(this, 'UsageError', `The type of '${expected}' should be an Array.`)
        }

        if (this.dataType === 'array') {
            for (const item of this.input) {
                if (!list.includes(item)) {
                    errorHandler(this, 'ValidationError', `The value '${item}' is not in the list.`)
                }
            }
        }

        if (!list.includes(this.input)) {
            errorHandler(this, 'ValidationError', `The value {{input}} is not in the list.`)
        }

        return this
    },
    /**
     * Checks if the input is not included in the list array.
     * @param {Array} list - The array to compare against.
     */
    notIn: function (list) {

        this.criterion = 'notIn'
        this.argument = list

        // Since this is an usage error (not a validation error), the error will not be handled, even if 'softFail' is set to true.
        if (!Array.isArray(list)) {
            errorHandler(this, 'UsageError', `The type of '${list}' should be an Array.`)
        }

        if (this.dataType === 'array') {
            for (const item of this.input) {
                if (list.includes(item)) {
                    errorHandler(this, 'ValidationError', `The value '${item}' is not in the list.`)
                }
            }
        }

        if (comparison.includes(this.input)) {
            errorHandler(this, 'ValidationError', `The value {{input}} is not in the list.`)
        }

        return this
    },
    /**
     * Checks if the length of the input is exactly equal to the expected length.
     * @param {number} expected - The expected length.
     */
    exactLength: function (expected) {

        this.criterion = 'exactLength'
        this.argument = expected

        if (this.input === undefined) {
            return this
        }

        if (typeof expected !== 'number') {
            errorHandler(this, 'UsageError', `The expected length '${expected}' should be a number.`)
        }

        const length = calculateLength(this.input, this.dataType)
       
        if (expected !== length) {
            errorHandler(this, 'ValidationError', `The length of the value {{input}} should be ${expected}.`)
        }

        return this
    },
    /**
     * Checks if the length of the input is greater than or equal to the expected length.
     * @param {number} expected - The expected minimum length.
     */
    minLength: function (expected) {

        this.criterion = 'minLength'
        this.argument = expected

        if (this.input === undefined) {
            return this
        }

        if (typeof expected !== 'number') {
            errorHandler(this, 'UsageError', `The expected length '${expected}' should be a number.`)
        }

        const length = calculateLength(this.input, this.dataType)

        if (expected > length) {
            errorHandler(this, 'ValidationError', `The length of the value {{input}} should be equal or greater than ${expected}.`)
        }

        return this
    },
    /**
     * Checks if the length of the input is less than or equal to the expected length.
     * @param {number} expected - The expected maximum length.
     */
    maxLength: function (expected) {

        this.criterion = 'maxLength'
        this.argument = expected
        
        if (this.input === undefined) {
            return this
        }

        if (typeof expected !== 'number') {
            errorHandler(this, 'UsageError', `The expected length '${expected}' should be a number.`)
        }

        const length = calculateLength(this.input, this.dataType)

        if (expected < length) {
            errorHandler(this, 'ValidationError', `The length of the value {{input}} should be equal or less than ${expected}.`)
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
