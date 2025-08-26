// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError,
    DataTypeError,
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const errorHandler = (thisObject, errorCode, errorMessage) => {
    
    if (thisObject.option.softFail) {
        thisObject.isValid = false
        thisObject.errors.push({
            code: errorCode,
            message: errorMessage
        })

        return
    }

    switch (errorCode) {
        case 'DataTypeError':
            throw new DataTypeError(errorCode, errorMessage)
        case 'EmptyArgumentError':
            throw new EmptyArgumentError(errorCode, errorMessage)
        case 'UsageError':
            throw new UsageError(errorCode, errorMessage)
        default:
            throw new BaseError(errorCode, errorMessage)
    }
}

module.exports = { errorHandler }
