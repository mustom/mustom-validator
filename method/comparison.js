// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

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
