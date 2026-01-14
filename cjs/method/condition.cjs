// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { errorHandler } = require('../error-handling/error-handler.cjs')

const condition = {
    /**
     * @description Checks if the input is not undefined.
     * @note `null` and empty string are valid values. If you want to check for null or empty, use `notNull` or `notEmpty`.
     */
    required: function () {

        this.criterion = 'required'

        if (this.input === undefined) {
            errorHandler(
                this,
                'ValidationError',
                `The value {{input}} is required.`
            )
        }

        return this
    },
    /**
     * @description Checks if the input is not null.
     * @note `undefined` is a valid value. If you want to check for undefined, use `required`.
     */
    notNull: function () {
        this.criterion = 'notNull'

        if (this.input === null) {
            errorHandler(this, 'ValidationError', `The value {{input}} is empty.`)
        }

        return this
    },
    /**
     * @description Check if the input is not empty.
     * @note null, empty string, undefined, empty array, empty object, empty map, empty set are considered empty.
     */
    notEmpty: function () {
        this.criterion = 'notEmpty'

        if (this.input === null || this.input === '' || this.input === undefined) {
            errorHandler(this, 'ValidationError', `The value {{input}} is empty.`)
        }

        if (this.dataType === 'string' && this.input.trim() === '') {
            errorHandler(this, 'ValidationError', `The value {{input}} is empty.`)
        }

        if (this.dataType === 'array' && !this.input.length) {
            errorHandler(this, 'ValidationError', `The value of array {{input}} is empty.`)
        }

        if (this.dataType === 'object' && !Object.keys(this.input).length) {
            errorHandler(this, 'ValidationError', `The value of object {{input}} is empty.`)
        }

        if (this.dataType === 'map' && !this.input.size) {
            errorHandler(this, 'ValidationError', `The value of map {{input}} is empty.`)
        }

        if (this.dataType === 'set' && !this.input.size) {
            errorHandler(this, 'ValidationError', `The value of set {{input}} is empty.`)
        }

        return this
    },
    /**
     * @description Check if the input is empty. (If not, throws an error)
     * @note null, empty string, undefined, empty array, empty object, empty map, empty set are considered empty.
     */
    empty: function () {

        this.criterion = 'empty'

        if (this.input === null || this.input === undefined) {
            errorHandler(this, 'ValidationError', `The value {{input}} is not empty.`)
        }

        if (this.dataType === 'string' && this.input.trim() !== '') {
            errorHandler(this, 'ValidationError', `The value {{input}} is not empty.`)
        }

        if (this.dataType === 'array' && this.input.length) {
            errorHandler(this, 'ValidationError', `The value of array {{input}} is not empty.`)
        }

        if (this.dataType === 'object' && Object.keys(this.input).length) {
            errorHandler(this, 'ValidationError', `The value of object {{input}} is not empty.`)
        }

        if (this.dataType === 'map' && this.input.size) {
            errorHandler(this, 'ValidationError', `The value of map {{input}} is not empty.`)
        }

        if (this.dataType === 'set' && this.input.size) {
            errorHandler(this, 'ValidationError', `The value of set {{input}} is not empty.`)
        }

        return this
    },
    /**
     * @description Checks if the string contains any whitespace characters (spaces, tabs, etc.).
     * @note It only works when the data type is 'string'.
     */
    noWhitespace: function () {

        this.criterion = 'noWhitespace'

        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'string') {
            return this
        }

        const regex = /\s/
        const isPassed = regex.test(this.input)

        if (isPassed) {
            errorHandler(this, 'ValidationError', `The value {{input}} should not contain whitespace.`)
        }

        return this
    },
    /**
     * @description Checks if the array contains duplicate items.
     * @note It only works when the data type is 'array'.
     */
    notDuplicated: function () {

        this.criterion = 'notDuplicated'
        
        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'array') {
            errorHandler(this, 'ValidationError', `'notDuplicated' method is only available for array type.`)
        }

        const uniqueItems = new Set(this.input)
        
        if (uniqueItems.size !== this.input.length) {
            errorHandler(this, 'ValidationError', `The value has duplicated items.`)
        }

        return this
    }
}

module.exports = condition
