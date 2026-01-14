// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

/**
 * @description Custom error class
 */
export class BaseError extends Error {
    constructor(code, message, options = {}) {
        super(message)        

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }

        this.name = this.constructor.name
        this.code = code
        this.message = message

        if (options.statusCode) {
            this.statusCode = options.statusCode
        }

        if (options.details) {
            this.details = options.details
        }
        
        if (options.timestamp) {
            this.timestamp = options.timestamp
        }
    }
}
export class ValidationError extends BaseError {
    constructor(code, message, options = {}) {
        super(code, message, options)
        this.name = 'ValidationError'
        this.statusCode = 422
    }
}

export class UsageError extends BaseError {
    constructor(code, message, options = {}) {
        super(code, message, options)
        this.name = 'UsageError'
    }
}