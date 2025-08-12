// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const handleError = (thisObj, errorCode, errorMessage) => {

    if (thisObj.option.noError) {
        thisObj.isValid = false
        thisObj.errors.push({
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

module.exports = handleError