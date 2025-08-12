// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


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

// Used only the datatype is 'array'
validator.prototype.notDuplicate = function () {

    if (this.input === null || this.input === undefined || (Array.isArray(this.input) && this.input.length === 0)) {
        return this
    }

    if (!Array.isArray(this.input)) {
        throw new UsageError(
            'invalid-type',
            `'notDuplicate' method is only available for array type.`
        )
    }

    const uniqueItems = new Set(this.input)
    if (uniqueItems.size !== this.input.length) {
        throw new DataTypeError(
            'duplicate-value',
            `The value '${this.input}' has duplicate items.`
        )
    }

    return this
}
