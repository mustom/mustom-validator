// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

class BaseError extends Error {
    constructor(code, message, options = {}) {
        super(message)        

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }

        this.name = this.constructor.name
        this.code = code
        this.message = message

        if (options.details) {
            this.details = options.details
        }

        if (options.userMessage) {
            this.userMessage = options.userMessage
        }
        
        if (options.timestamp) {
            this.timestamp = options.timestamp
        }
    }
}

class DataTypeError extends BaseError {
    constructor(code, message, options = {}) {
        super(code, message, options)
        this.name = 'DataTypeError'
    }
}

class EmptyArgumentError extends BaseError {
    constructor(code, message, options = {}) {
        super(code, message, options)
        this.name = 'EmptyArgumentError'
    }
}

class UsageError extends BaseError {
    constructor(code, message, options = {}) {
        super(code, message, options)
        this.name = 'UsageError'
    }
}

module.exports = { 
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
 }
