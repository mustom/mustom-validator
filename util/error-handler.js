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

    // Abort early if configured to do so
    if (thisObject.option.softFail && thisObject.option.abortEarly && thisObject.errors.length > 0) {
        return
    }

    let errorMessageToSend = errorMessage || 'Validation Error'
    const inputToString = JSON.stringify(thisObject.input || '')
    const shortenedInput = inputToString.length > 20 ? `${inputToString.slice(0, 20)}...` : inputToString

    if (errorMessageToSend.includes('{{input}}')) {
        errorMessageToSend = errorMessageToSend.replace('{{input}}', shortenedInput)
    }

    if (thisObject.option.softFail) {
        thisObject.errors.push({
            index: thisObject.index || thisObject.index === 0 ? thisObject.index : null,
            key: thisObject.key || null,
            code: errorCode,
            message: errorMessageToSend,
            input: shortenedInput,
            criterion: thisObject.criterion || null
        })

        return
    }

    throw new ValidationError(errorCode, errorMessageToSend)
}

module.exports = { errorHandler }
