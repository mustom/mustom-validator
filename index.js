// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { DataTypeError } = require('./helper/custom-error')

const validator = function () {
    let input = null
    let output = null
    let dataTypes = []
    let option = {
        parseMode: 'definedOnly',
        returnValue: true,
        noError: false
    }
}

validator.prototype.single = function (input, option = {}) {
    if (!input && !option.noError) {
        throw new DataTypeError(
            '',
            `The input value is required.`
        )
    }

    if (!input && option.noError) {
        return false
    }

    this.input = input
    this.option = [ ...this.option, ...option ]
    return this
}

validator.prototype.objectIterate = function (input, rule, option = {}) {
    if (!input) {
        throw new DataTypeError(
            '',
            `The input value is required.`
        )
    }

    if (input.constructor !== Object) {
        throw new DataTypeError('invalid-type', `Not an object.`)
    }

    for (const key in input) {
        const targetRule = rule[key]

        // TODO : 테스트 해 봐야 함. 이게 아닐 수도 있음.
        if (!targetRule) {
            throw new DataTypeError('undefined-key', `Key '${key}' is undefined.`)
        }

        this.input = input[key]
        if (targetRule.constructor === Object) {
            this.objectIterate(this.input, targetRule)
        } else {
            targetRule()
        }
    }

    for (const key in rule) {
        if (!target[key]) {
            throw new DataTypeError('missing-required', `The value '${key}' is required.`)
        }
    }

    this.output = dataToReturn

    return this
}

validator.prototype.arrayObjectIterate = function (target, rule) {

    if (!Array.isArray(value)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an array.`
        )
    }

    for (const item of value) {
        this.objectIterate(item, rule, this.option)
    }

    return this
}

validator.prototype.object = function () {
    this.dataType = [...dataType, 'object']
    
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }
    
    if (this.input.constructor !== Object) {
        throw new DataTypeError('invalid-request', `Invalid Request`)
    }
    
    return this
}

validator.prototype.arrayOfObject = function (value, rule) {
    if (!Array.isArray(value)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an array.`
        )
    }

    for (const item of value) {
        this.object(item, rule)
    }

    return this
}

validator.prototype.array = function (rule = 'all') {
    this.dataTypes = [...this.dataTypes, 'array']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (!Array.isArray(this.input)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an array.`
        )
    }

    return this
}

/**
 * Validate the value is a string. If the value is null, undefined or empty string, it will be ignored.
 * @example
 * validator.single('hello').string() // Passes
 * validator.single(1).string() // Throws an error
 * validator.single(true).string() // Throws an error
 */
validator.prototype.string = function () {
    this.dataTypes = [...this.dataTypes, 'string']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (typeof this.input !== 'string') {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a string.`
        )
    }

    return this
}

/**
 * Validate the value is a boolean. If the value is null, undefined or empty string, it will be ignored.
 * @example
 * validator.single(true).boolean() // Passes
 * validator.single(1).boolean() // Throws an error
 * validator.single('true').boolean() // Throws an error
 */
validator.prototype.boolean = function () {
    this.dataTypes = [...this.dataTypes, 'boolean']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (typeof this.input !== 'boolean') {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a boolean.`
        )
    }

    return this
}

/**
 * Validate the value is a number. If the value is null, undefined or empty string, it will be ignored.
 * @example
 * validator.single(1).number() // Passes
 * validator.single(1.1).number() // Passes
 * validator.single('1').number() // Throws an error
 * validator.single('mustom').number() // Throws an error
 */
validator.prototype.number = function () {
    this.dataTypes = [...this.dataTypes, 'number']

    if (['array'].includes(dataType)) {
        for (const item of this.input) {
            if (isNaN(item)) {
                throw new DataTypeError(
                    'invalid-type',
                    `The value '${this.input}' should be a number.`
                )
            }
        }
        // Empty array is allowed. If you want to check the empty array, use 'notEmpty' method.
        return this
    }

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (isNaN(this.input)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a number.`
        )
    }

    return this
}

/**
 * Validate the value is a non-negative number. It can be a fraction or zero.
 * Allowed : 0, 1, 2, 3, 1.1, 2.2, 3.3, ...
 * @example
 * validator.single(0).nonNegativeNumber() // Passes
 * validator.single(1).nonNegativeNumber() // Passes
 * validator.single(1.1).nonNegativeNumber() // Passes
 * validator.single(-1).nonNegativeNumber() // Throws an error
 */
validator.prototype.nonNegativeNumber = function () {
    this.dataTypes = [...this.dataTypes, 'nonNegativeNumber']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (isNaN(this.input) || this.input < 0) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a positive number.`
        )
    }

    return this
}

/**
 * Validate the value is a positive number which is not negative and not zero. It can be a fraction.
 * Allowed : 1, 2, 3, 1.1, 2.2, 3.3, ...
 * @example
 * validator.single(1).positiveNumber() // Passes
 * validator.single(1.1).positiveNumber() // Passes
 * validator.single(-1).positiveNumber() // Throws an error
 * validator.single(0).positiveNumber() // Throws an error
 */
validator.prototype.positiveNumber = function () {
    this.dataTypes = [...this.dataTypes, 'positiveNumber']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (isNaN(this.input) || this.input <= 0) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a positive number.`
        )
    }

    return this
}

/**
 * Validate the value is a natural number which is not negative and not a fraction, and not zero.
 * Allowed : 1, 2, 3, 4, 5, ...
 * @example
 * validator.single(1).naturalNumber() // Passes
 * validator.single(1.1).naturalNumber() // Throws an error
 * validator.single(-1).naturalNumber() // Throws an error
 * validator.single(0).naturalNumber() // Throws an error
 */
validator.prototype.naturalNumber = function () {
    this.dataTypes = [...this.dataTypes, 'naturalNumber']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input % 1 !== 0 || this.input <= 0 || isNaN(this.input)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a natural number.`
        )
    }

    return this
}

/**
 * Validate the value is a whole number which is not negative and not a fraction.
 * Allowed : 0, 1, 2, 3, 4, 5, ...
 * @example
 * validator.single(0).wholeNumber() // Passes
 * validator.single(1).wholeNumber() // Passes
 * validator.single(1.1).wholeNumber() // Throws an error
 * validator.single(-1).wholeNumber() // Throws an error
 */
validator.prototype.wholeNumber = function () {
    this.dataTypes = [...this.dataTypes, 'wholeNumber']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input % 1 !== 0 || !this.input < 0 || isNaN(this.input)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a whole number.`
        )
    }

    return this
}

/**
 * Validate the value is an integer. It can be a negative number, zero or positive number.
 * Allowed : -3, -2, -1, 0, 1, 2, 3, ...
 * @example
 * validator.single(0).integer() // Passes
 * validator.single(1).integer() // Passes
 * validator.single(-1).integer() // Passes
 * validator.single(1.1).integer() // Throws an error
 */
validator.prototype.integer = function () {
    this.dataTypes = [...this.dataTypes, 'integer']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input % 1 !== 0 || isNaN(this.input)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an integer.`
        )
    }

    return this
}

/**
 * Validate the value is a negative integer which is not a fraction, and less than zero.
 * Allowed : -3, -2, -1
 * @example
 * validator.single(-1).negativeInteger() // Passes
 * validator.single(-1.1).negativeInteger() // Throws an error
 * validator.single(1).negativeInteger() // Throws an error
 * validator.single(0).negativeInteger() // Throws an error
 */
validator.prototype.negativeInteger = function () {
    this.dataTypes = [...this.dataTypes, 'negativeInteger']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input % 1 !== 0 || !this.input >= 0 || isNaN(this.input)) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an integer.`
        )
    }

    return this
}

/**
 * Validate the value is an email format. If the value is null, undefined or empty string, it will be ignored.
 * @example
 * validator.single('mustom@email.com').email() // Passes
 * validator.single('mustom').email() // Throws an error
 */ 
validator.prototype.email = function () {
    this.dataTypes = [...this.dataTypes, 'email']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex =
        /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a correct email format.`
        )
    }

    return this
}

/**
 * Validate the value is a URL format. It should be start with http:// or https://.
 * @example
 * validator.single('http://mustom.com').url() // Passes
 * validator.single('https://mustom.com').url() // Passes
 * validator.single('mustom.com').url() // Throws an error
 * validator.single('ftp://mustom.com').url() // Throws an error
 */
validator.prototype.url = function () {
    this.dataTypes = [...this.dataTypes, 'url']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^http[s]?:\/\//
    const isPassed = regex.test(this.input)
    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a URL format.`
        )
    }

    return this
}

/**
 * Validate the value is a IP format. It should be IPv4 or IPv6. 
 * @example
 * validator.single('192.168.0.1').ip() // Passes
 * validator.single('2001:0db8:85a3:0000:0000:8a2e:0370:7334').ip() // Passes
 * validator.single('::ffff:192.168.0.1').ip() // Passes
 * validator.single('mustom.com').ip() // Throws an error
 */
validator.prototype.ip = function () {
    this.dataTypes = [...this.dataTypes, 'ip']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex =
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)|(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]).){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a IP format.`
        )
    }

    return this
}

/**
 * Validate the value is a code format that is used in Mustom.
 * It should be start with alphabet and contain only number, alphabet, underscore, and hyphen.
 * Max length is 50 characters.
 * @example
 * validator.single('mustom-123').code() // Passes
 * validator.single('mustom@123').code() // Throws an error
 * validator.single('123-mustom').code() // Throws an error
 */

validator.prototype.code = function () {
    this.dataTypes = [...this.dataTypes, 'code']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input.length < 50) {
        throw new DataTypeError(
            'too-long',
            `The value '${this.input}' should be less than 50 characters.`
        )
    }

    const regex = /^[A-Za-z][A-Za-z0-9_-]*$/
    const isPassed = regex.test(this.input)
    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' shoude be start with alphabet, and should be contain only number, alphabet, underscore, and hyphen.`
        )
    }

    return this
}

// Example : 'privacy_policy_02'
validator.prototype.path = function () {
    this.dataTypes = [...this.dataTypes, 'path']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^[A-Za-z0-9_-]*$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be contain only number, alphabet, underscore, and hyphen.`
        )
    }

    return this
}

/**
 * Validate the value is an injection safe string.
 * It should be contain only number, alphabet, underscore, dot, 골뱅이 and hyphen.
 * It used for admin username.
 * @example
 * validator.single('mustom-123').code() // Passes
 * validator.single('mustom@123').code() // Passes
 * validator.single('mus/tom').code() // Throws an error
 */
validator.prototype.injectionSafeString = function () {
    this.dataTypes = [...this.dataTypes, 'injectionSafeString']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^[A-Za-z0-9_.@-]*$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be contain only number, alphabet, underscore, dot, 골뱅이이 and hyphen.`
        )
    }

    return this
}

validator.prototype.alphabet = function () {
    this.dataTypes = [...this.dataTypes, 'alphabet']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^[A-Za-z]*$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be an alphabet.`
        )
    }

    return this
}

validator.prototype.uppercase = function () {
    this.dataTypes = [...this.dataTypes, 'uppercase']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^[A-Z]*$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a capital letter.`
        )
    }

    return this
}

validator.prototype.lowercase = function () {
    this.dataTypes = [...this.dataTypes, 'lowercase']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^[a-z]*$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a lowercase.`
        )
    }

    return this
}

validator.prototype.alphaNumeric = function () {
    this.dataTypes = [...this.dataTypes, 'alphaNumeric']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /^[A-Za-z0-9]*$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a number and alphabet.`
        )
    }

    return this
}

validator.prototype.password = function () {
    this.dataTypes = [...this.dataTypes, 'password']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    // Minimum eight characters, at least one letter, one number and one special character
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a valid password format.`
        )
    }

    return this
}

// Example : some-image.jpg
validator.prototype.imageFile = function () {
    this.dataTypes = [...this.dataTypes, 'imageFile']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /[^\s]+(.*?).(jpg|jpeg|png|gif|bmp|tiff|tif|svg|webp)$/

    if (Array.isArray(this.input)) {
        for (const item of this.input) {
            const valueToLowerCase = item.toLowerCase()
            if (regex.test(valueToLowerCase)) {
                throw new DataTypeError(
                    'invalid-value',
                    `The value '${item}' is not in the list.`
                )
            }
        }

        return this
    }

    const valueToLowerCase = this.input.toLowerCase()
    const isPassed = regex.test(valueToLowerCase)
    if (!isPassed) {
        throw new DataTypeError(
            'invalid-type',
            `The value '${this.input}' should be a valid image file format.`
        )
    }

    return this
}

validator.prototype.dateTime = function () {
    this.dataTypes = [...this.dataTypes, 'dateTime']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    return this
}

validator.prototype.dateOnly = function () {
    this.dataTypes = [...this.dataTypes, 'dateOnly']

    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    return this
}

validator.prototype.is = function (expected) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input !== expected) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should be '${expected}'`
        )
    }

    return this
}

validator.prototype.isNot = function (expected) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (this.input === expected) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should not be '${expected}'`
        )
    }

    return this
}

validator.prototype.minValue = function (limit) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (isNaN(+this.input)) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should be a number.`
        )
    }

    if (this.input < limit) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should be equan or greater than '${expected}'`
        )
    }

    return this
}

validator.prototype.maxValue = function (limit) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    if (isNaN(+this.input)) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should be a number.`
        )
    }

    if (this.input > limit) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should be equal or less than '${limit}'`
        )
    }

    return this
}

validator.prototype.in = function (comparison) {
    if (!Array.isArray(comparison)) {
        throw new DataTypeError(
            'internal-error',
            `The type of '${expected}' should be an Array.`
        )
    }

    if (Array.isArray(this.input)) {
        for (const item of this.input) {
            if (!comparison.includes(item)) {
                throw new DataTypeError(
                    'invalid-value',
                    `The value '${item}' is not in the list.`
                )
            }
        }
    }

    if (!comparison.includes(this.input)) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' is not in the list.`
        )
    }

    return this
}

validator.prototype.notIn = function (comparison) {
    if (!Array.isArray(comparison)) {
        throw new DataTypeError(
            'internal-error',
            `The type of '${expected}' should be an Array.`
        )
    }

    if (Array.isArray(this.input)) {
        for (const item of this.input) {
            if (comparison.includes(item)) {
                throw new DataTypeError(
                    'invalid-value',
                    `The value '${item}' is not in the list.`
                )
            }
        }
    }

    if (comparison.includes(this.input)) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' is not in the list.`
        )
    }

    return this
}

validator.prototype.exactLength = function (expected) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const length = this.input.length

    if (expected !== length) {
        throw new DataTypeError(
            'invalid-length',
            `The length of '${this.input}' should be ${expected}.`
        )
    }

    return this
}

validator.prototype.minLength = function (expected) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const length = this.input.length

    if (expected > length) {
        throw new DataTypeError(
            'too-short',
            `The length of '${this.input}' should be equal or greater than ${expected}.`
        )
    }

    return this
}

validator.prototype.maxLength = function (expected) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const length = this.input.length

    if (expected < length) {
        throw new DataTypeError(
            'too-long',
            `The length of '${this.input}' should be equal or less than ${expected}.`
        )
    }

    return this
}

validator.prototype.required = function () {
    // Note : 'null' is a valid value. If you want to check the null value, use 'notEmpty'.
    if (this.input === undefined) {
        throw new DataTypeError(
            'missing-required',
            `The value '${this.input}' is required.`
        )
    }

    return this
}

validator.prototype.notEmpty = function () {
    // Note : 0 is considered as a valid value.
    if (this.input === null || this.input === '') {
        throw new DataTypeError('invalid-value', `The value is empty.`)
    }

    if (['array'].includes(dataType)) {
        if (!this.input.length) {
            throw new DataTypeError('invalid-value', `The value of array is empty.`)
        }
    }

    if (['object'].includes(dataType)) {
        if (!Object.keys(this.input).length) {
            throw new DataTypeError('invalid-value', `The value of object is empty.`)
        }
    }

    return this
}

validator.prototype.noWhitespace = function () {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const regex = /\s/
    const isPassed = regex.test(this.input)

    if (isPassed) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' should not contain whitespace.`
        )
    }

    return this
}

validator.prototype.regexTrue = function (regex) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const isPassed = regex.test(this.input)

    if (!isPassed) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' is wrong format.`
        )
    }

    return this
}

validator.prototype.regexFalse = function (regex) {
    if (this.input === null || this.input === undefined || this.input === '') {
        return this
    }

    const isPassed = regex.test(this.input)

    if (isPassed) {
        throw new DataTypeError(
            'invalid-value',
            `The value '${this.input}' is wrong format.`
        )
    }

    return this
}

// TODO : 배열등에서 체크할 때
validator.prototype.notDuplicate = function () {}

validator.prototype.gridOption = function () {}

validator.prototype.noRules = function () {
    return this
}

module.exports = {
    validator: new validator()
}
