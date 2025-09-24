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
   
    if (thisObject.option.softFail) {
        thisObject.errors.push({
            code: errorCode,
            message: errorMessage
        })

        return
    }

    throw new ValidationError(errorCode, errorMessage)
}

module.exports = { errorHandler }
