// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const { errorHandler } = require('../util/error-handler.js')

const dataType = {
    object: function () {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input.constructor !== Object) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be an object.`)
        }

        return this
    },
    arrayOfObject: function () {
        return this
    },
    array: function (rule = 'all') {
        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (!Array.isArray(this.input)) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be an array.`)
        }

        return this
    },

    /**
     * Validate the value is a string. If the value is null, undefined or empty string, it will be ignored.
     * @example
     * validator.single('hello').string() // Passes
     * validator.single(1).string() // Throws an error
     * validator.single(true).string() // Throws an error
     */
    string: function () {
        console.log(this.input)

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (typeof this.input !== 'string') {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a string.`)
        }

        return this
    },

    /**
     * Validate the value is a boolean. If the value is null, undefined or empty string, it will be ignored.
     * @example
     * validator.single(true).boolean() // Passes
     * validator.single(1).boolean() // Throws an error
     * validator.single('true').boolean() // Throws an error
     */
    boolean: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (typeof this.input !== 'boolean') {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a boolean.`)
        }

        return this
    },

    /**
     * Validate the value is a number. If the value is null, undefined or empty string, it will be ignored.
     * @example
     * validator.single(1).number() // Passes
     * validator.single(1.1).number() // Passes
     * validator.single('1').number() // Throws an error
     * validator.single('mustom').number() // Throws an error
     */
    number: function () {

        if (['array'].includes(this.dataType)) {
            for (const item of this.input) {
                if (isNaN(item)) {
                    errorHandler(this, 'DataTypeError', `The value '${item}' should be a number.`)
                }
            }
            // Empty array is allowed. If you want to check the empty array, use 'notEmpty' method.
            return this
        }

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (isNaN(this.input)) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a number.`
            )
        }

        return this
    },

    /**
     * Validate the value is a non-negative number. It can be a fraction or zero.
     * Allowed : 0, 1, 2, 3, 1.1, 2.2, 3.3, ...
     * @example
     * validator.single(0).nonNegativeNumber() // Passes
     * validator.single(1).nonNegativeNumber() // Passes
     * validator.single(1.1).nonNegativeNumber() // Passes
     * validator.single(-1).nonNegativeNumber() // Throws an error
     */
    nonNegativeNumber: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (isNaN(this.input) || this.input < 0) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a non-negative number.`
            )
        }

        return this
    },

    /**
     * Validate the value is a positive number which is not negative and not zero. It can be a fraction.
     * Allowed : 1, 2, 3, 1.1, 2.2, 3.3, ...
     * @example
     * validator.single(1).positiveNumber() // Passes
     * validator.single(1.1).positiveNumber() // Passes
     * validator.single(-1).positiveNumber() // Throws an error
     * validator.single(0).positiveNumber() // Throws an error
     */
    positiveNumber: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (isNaN(this.input) || this.input <= 0) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a positive number.`
            )
        }

        return this
    },

    /**
     * Validate the value is a natural number which is not negative and not a fraction, and not zero.
     * Allowed : 1, 2, 3, 4, 5, ...
     * @example
     * validator.single(1).naturalNumber() // Passes
     * validator.single(1.1).naturalNumber() // Throws an error
     * validator.single(-1).naturalNumber() // Throws an error
     * validator.single(0).naturalNumber() // Throws an error
     */
    naturalNumber: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input % 1 !== 0 || this.input <= 0 || isNaN(this.input)) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a natural number.`
            )
        }

        return this
    },

    /**
     * Validate the value is a whole number which is not negative and not a fraction.
     * Allowed : 0, 1, 2, 3, 4, 5, ...
     * @example
     * validator.single(0).wholeNumber() // Passes
     * validator.single(1).wholeNumber() // Passes
     * validator.single(1.1).wholeNumber() // Throws an error
     * validator.single(-1).wholeNumber() // Throws an error
     */
    wholeNumber: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input % 1 !== 0 || !this.input < 0 || isNaN(this.input)) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a whole number.`
            )
        }

        return this
    },

    /**
     * Validate the value is an integer. It can be a negative number, zero or positive number.
     * Allowed : -3, -2, -1, 0, 1, 2, 3, ...
     * @example
     * validator.single(0).integer() // Passes
     * validator.single(1).integer() // Passes
     * validator.single(-1).integer() // Passes
     * validator.single(1.1).integer() // Throws an error
     */
    integer: function () {
        this.dataType = [...this.dataType, 'integer']

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input % 1 !== 0 || isNaN(this.input)) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be an integer.`
            )
        }

        return this
    },

    /**
     * Validate the value is a negative integer which is not a fraction, and less than zero.
     * Allowed : -3, -2, -1
     * @example
     * validator.single(-1).negativeInteger() // Passes
     * validator.single(-1.1).negativeInteger() // Throws an error
     * validator.single(1).negativeInteger() // Throws an error
     * validator.single(0).negativeInteger() // Throws an error
     */
    negativeInteger: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input % 1 !== 0 || !this.input >= 0 || isNaN(this.input)) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a negative integer.`
            )
        }

        return this
    },

    /**
     * Validate the value is an email format. If the value is null, undefined or empty string, it will be ignored.
     * @example
     * validator.single('mustom@email.com').email() // Passes
     * validator.single('mustom').email() // Throws an error
     */
    email: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex =
            /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a correct email format.`)
        }

        return this
    },

    /**
     * Validate the value is a URL format. It should be start with http:// or https://.
     * @example
     * validator.single('http://mustom.com').url() // Passes
     * validator.single('https://mustom.com').url() // Passes
     * validator.single('mustom.com').url() // Throws an error
     * validator.single('ftp://mustom.com').url() // Throws an error
     */
    url: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^http[s]?:\/\//
        const isPassed = regex.test(this.input)
        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a valid URL format.`)
        }

        return this
    },

    /**
     * Validate the value is a IP format. It should be IPv4 or IPv6.
     * @example
     * validator.single('192.168.0.1').ip() // Passes
     * validator.single('2001:0db8:85a3:0000:0000:8a2e:0370:7334').ip() // Passes
     * validator.single('::ffff:192.168.0.1').ip() // Passes
     * validator.single('mustom.com').ip() // Throws an error
     */
    ip: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex =
            /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a valid IP format.`)
        }

        return this
    },

    /**
     * Validate the value is a code format that is used in Mustom.
     * It should be start with alphabet and contain only number, alphabet, underscore, and hyphen.
     * Max length is 50 characters.
     * @example
     * validator.single('mustom-123').code() // Passes
     * validator.single('mustom@123').code() // Throws an error
     * validator.single('123-mustom').code() // Throws an error
     */

    code: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        if (this.input.length < 50) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be less than 50 characters.`
            )
        }

        const regex = /^[A-Za-z][A-Za-z0-9_-]*$/
        const isPassed = regex.test(this.input)
        if (!isPassed) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' shoude be start with alphabet, and should be contain only number, alphabet, underscore, and hyphen.`
            )
        }

        return this
    },

    // Example : 'privacy_policy_02'
    path: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^[A-Za-z0-9_-]*$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be contain only number, alphabet, underscore, and hyphen.`
            )
        }

        return this
    },

    /**
     * Validate the value is an injection safe string.
     * It should be contain only number, alphabet, underscore, dot, 골뱅이 and hyphen.
     * It used for admin username.
     * @example
     * validator.single('mustom-123').code() // Passes
     * validator.single('mustom@123').code() // Passes
     * validator.single('mus/tom').code() // Throws an error
     */
    injectionSafeString: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^[A-Za-z0-9_.@-]*$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be contain only number, alphabet, underscore, dot, at sign, and hyphen.`
            )
        }

        return this
    },

    /**
     * Validate the value is an alphabet.
     * It should be contain only alphabet characters (A-Z, a-z).
     * @example
     * validator.single('mustom').alphabet() // Passes
     * validator.single('MUSTOM').alphabet() // Passes
     * validator.single('mustom123').alphabet() // Throws an error
     * validator.single('mustom@').alphabet() // Throws an error
     */
    alphabet: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^[A-Za-z]*$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be an alphabet.`)
        }

        return this
    },

    /**
     * Validate the value is a capital letter.
     * It should be contain only capital letters (A-Z).
     * @example
     * validator.single('MUSTOM').uppercase() // Passes
     * validator.single('mustom').uppercase() // Throws an error
     * validator.single('MUSTOM123').uppercase() // Throws an error
     * validator.single('MUSTOM@').uppercase() // Throws an error
     */
    uppercase: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^[A-Z]*$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a capital letter.`)
        }

        return this
    },

    /**
     * Validate the value is a lowercase letter.
     * It should be contain only lowercase letters (a-z).
     * @example
     * validator.single('mustom').lowercase() // Passes
     * validator.single('MUSTOM').lowercase() // Throws an error
     * validator.single('mustom123').lowercase() // Throws an error
     * validator.single('mustom@').lowercase() // Throws an error
     */
    lowercase: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^[a-z]*$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a lowercase.`)
        }

        return this
    },

    /**
     * Validate the value is an alphanumeric string.
     * It should be contain only number and alphabet characters (A-Z, a-z, 0-9).
     * @example
     * validator.single('mustom').alphaNumeric() // Passes
     * validator.single('MUSTOM123').alphaNumeric() // Passes
     * validator.single('mustom@123').alphaNumeric() // Throws an error
     * validator.single('mustom-123').alphaNumeric() // Throws an error
     */
    alphaNumeric: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /^[A-Za-z0-9]*$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(
                this,
                'DataTypeError',
                `The value '${this.input}' should be a number and alphabet.`
            )
        }

        return this
    },

    password: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        // Minimum eight characters, at least one letter, one number and one special character
        const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
        const isPassed = regex.test(this.input)

        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a valid password format.`)
        }

        return this
    },

    /**
     * Validate the value is an image file format.
     * It should be end with one of the following extensions: jpg, jpeg, png, gif, bmp, tiff, tif, svg, webp.
     * If the value is null, undefined or empty string, it will be ignored.
     * @example
     * validator.single('image.jpg').imageFile() // Passes
     * validator.single('image.png').imageFile() // Passes
     * validator.single('image.txt').imageFile() // Throws an error
     * validator.single('image').imageFile() // Throws an error
     */
    imageFile: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        const regex = /[^\s]+(.*?).(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp)$/

        if (Array.isArray(this.input)) {
            for (const item of this.input) {
                const valueToLowerCase = item.toLowerCase()
                if (!regex.test(valueToLowerCase)) {
                    errorHandler(this, 'DataTypeError', `The value '${item}' should be a valid image file format.`)
                }
            }

            return this
        }

        const valueToLowerCase = this.input.toLowerCase()
        const isPassed = regex.test(valueToLowerCase)
        if (!isPassed) {
            errorHandler(this, 'DataTypeError', `The value '${this.input}' should be a valid image file format.`)
        }

        return this
    },

    dateTime: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        return this
    },

    dateOnly: function () {

        if (this.input === null || this.input === undefined || this.input === '') {
            return this
        }

        return this
    }
}

module.exports = dataType