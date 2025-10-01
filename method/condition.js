// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { errorHandler } = require('../util/error-handler')

const condition = {
    /**
     * Throws an error if the input is undefined.
     * Please note that `null` is a valid value. If you want to check for null, use `notEmpty`.
     */
    required: function () {
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
     * Throws an error if the input is null, empty string, or undefined.
     * If input is an array, or an object, it checks if they are empty.
     */
    notEmpty: function () {
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


    empty: function () {
        if (this.input === null || this.input === '' || this.input === undefined) {
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
     * Checks if the string contains any whitespace characters (spaces, tabs, etc.).
     * It only works when the data type is 'string'.
     */
    noWhitespace: function () {
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
     * Checks if the array contains duplicate items.
     * It only works when the data type is 'array'.
     */
    notDuplicate: function () {
        if (this.input === undefined) {
            return this
        }

        if (this.dataType !== 'array') {
            errorHandler(this, 'ValidationError', `'notDuplicate' method is only available for array type.`)
        }

        const uniqueItems = new Set(this.input)
        
        if (uniqueItems.size !== this.input.length) {
            errorHandler(this, 'ValidationError', `The value has duplicate items.`)
        }

        return this
    }
}

module.exports = condition
