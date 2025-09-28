// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError,
    ValidationError,
    UsageError
} = require('../error/custom-error')

const errorHandler = (thisObject, errorCode, errorMessage) => {

    thisObject.isValid = false

    if (errorCode === 'UsageError') {
        throw new UsageError(errorCode, errorMessage)
    }

    if (errorCode !== 'ValidationError') {
        throw new BaseError(errorCode, errorMessage)
    }

    let errorMessageToSend = errorMessage || 'Validation Error'

    if (errorMessageToSend.includes('{{input}}')) {
        const inputToString = JSON.stringify(thisObject.input)
        const shortenedInput = inputToString.length > 20 ? `${inputToString.slice(0, 20)}...` : inputToString
        errorMessageToSend = errorMessageToSend.replace('{{input}}', shortenedInput)
    }

    if (thisObject.option.softFail) {
        thisObject.errors.push({
            code: errorCode,
            message: errorMessageToSend
        })

        return
    }

    throw new ValidationError(errorCode, errorMessageToSend)
}

module.exports = { errorHandler }
