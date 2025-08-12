// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


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

