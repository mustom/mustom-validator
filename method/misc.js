// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const errorHandler = require('../util/error-handler.js')

const misc = {
    gridOption: function () {
        return this
    },
    noRules: function () {
        return this
    }
}

module.exports = misc
