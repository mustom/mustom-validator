// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const validator = require('../validator')
const { UsageError } = require('../error/custom-error')

const validationFactories = {
    naturalNumber: (value) => validator.single(value).naturalNumber().required(),
    string: (value) => validator.single(value).string().notEmpty().required(),
    object: (value) => validator.single(value).object().notEmpty().required(),
    array: (value) => validator.single(value).array().notEmpty().required(),
    objects: (value) => validator.single(value).arrayOfObject().notEmpty().required(),
    // 추가 필요
    naturalNumbers: (value) => validator.single(value).array(),
    gridOptions: (value) => validator.single(value).object().gridOptions().required()
}

// This higher-order function wraps a controller function with validation logic.
const withValidation = (validationRules) => {
    return (controllerFunction) => {
        return async (...args) => {
            // Apply validation rules to arguments
            for (const [ index, ruleName ] of validationRules.entries()) {

                const ruleFactory = validationFactories[ruleName]

                if (!ruleFactory) {
                    throw new UsageError('UsageError', `Unknown validation rule: ${ruleName}`)
                }

                ruleFactory(args[index])
            }

            // Execute the controller function
            return await controllerFunction(...args)
        }
    }
}

module.exports = { withValidation }
