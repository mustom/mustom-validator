// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const {
    BaseError, 
    DataTypeError, 
    EmptyArgumentError,
    UsageError
} = require('../error/custom-error')

const errorHandler = require('../util/error-handler.js')


const dataTransformation = {
    /**
     * Transform data by trimming whitespace from strings. 
     * If the data is an array, object, or Set, it will trim each string element.
     */
    trim: function () {
        if (typeof this.refinement === 'string') {
            this.refinement = this.refinement.trim()
        }

        if (Array.isArray(this.refinement)) {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item.trim()
                }

                return item
            })
        }

        if (typeof this.refinement === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'string') {
                    this.refinement[key] = this.refinement[key].trim()
                }
            }
        }
        
        if (this.refinement instanceof Set) {
            this.refinement = new Set(Array.from(this.refinement).map(item => {
                if (typeof item === 'string') {
                    return item.trim()
                }

                return item
            }))
        }

        return this
    },
    /**
     * Transform data by converting a string element to lowercase.
     * If the data is an array, object, or Set, it will convert each string element to lowercase.
     * If the data is not a string, and it is not iterable, the refinement will remain unchanged.
     */
    toLowerCase: function () {
        if (typeof this.refinement === 'string') {
            this.refinement = this.refinement.toLowerCase()
            return this
        }

        if (Array.isArray(this.refinement)) {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item.toLowerCase()
                }

                return item
            })
        }

        if (typeof this.refinement === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'string') {
                    this.refinement[key] = this.refinement[key].toLowerCase()
                }
            }
        }

        if (this.refinement instanceof Set) {
            this.refinement = new Set(Array.from(this.refinement).map(item => {
                if (typeof item === 'string') {
                    return item.toLowerCase()
                }
                return item
            }))
        }

        return this
    },
    /**
     * Transform data by converting a string element to uppercase.
     * If the data is an array, object, or Set, it will convert each string element to uppercase.
     * If the data is not a string, and it is not iterable, the refinement will remain unchanged.
     */
    toUpperCase: function () {
        if (typeof this.refinement === 'string') {
            this.refinement = this.refinement.toUpperCase()
        }

        if (Array.isArray(this.refinement)) {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item.toUpperCase()
                }

                return item
            })
        }

        if (typeof this.refinement === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'string') {
                    this.refinement[key] = this.refinement[key].toUpperCase()
                }
            }
        }

        if (this.refinement instanceof Set) {
            this.refinement = new Set(Array.from(this.refinement).map(item => {
                if (typeof item === 'string') {
                    return item.toUpperCase()
                }
                return item
            }))
        }

        return this
    },
    /**
     * Transform data to a string if it is not already a string.
     * If the data is an array, object, or Set, it will convert each element to a string.
     */
    toString: function () {
        if (typeof this.refinement !== 'string' || Array.isArray(this.refinement) || typeof this.refinement === 'object') {
            this.refinement = String(this.refinement)
        }

        if (Array.isArray(this.refinement)) {
            return this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item
                }

                return String(item)
            })
        }

        if (typeof this.refinement === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] !== 'string') {
                    this.refinement[key] = String(this.refinement[key])
                }
            }
        }

        if (this.refinement instanceof Set) {
            this.refinement = new Set(Array.from(this.refinement).map(item => {
                if (typeof item === 'string') {
                    return item
                }

                return String(item)
            }))
        }

        return this
    },
    /**
     * Transform data to a number if it is not a number.
     * If the data is an array, object, or Set, it will convert each element to a number.
     * Please note that this method will convert non-numeric strings to NaN.
     */
    toNumber: function () {
        if (typeof this.refinement === 'string') {
            this.refinement = Number(this.refinement)
        }

        if (Array.isArray(this.refinement)) {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'number') {
                    return item
                }

                return Number(item)
            })

            return this
        }

        if (typeof this.refinement === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'number') {
                    continue
                }

                this.refinement[key] = Number(this.refinement[key])
            }
        }

        if (this.refinement instanceof Set) {
            this.refinement = new Set(Array.from(this.refinement).map(item => {
                if (typeof item === 'number') {
                    return item
                }

                return Number(item)
            }))
        }

        return this
    },
    /**
     * Transform data to an array if it is string, object, or Set.
     */
    toArray: function () {
        if (this.refinement instanceof Set) {
            this.refinement = Array.from(this.refinement)
        }

        if (typeof this.refinement === 'string') {
            this.refinement = this.refinement.split(',')
        }

        if (typeof this.refinement === 'object') {
            this.refinement = Object.values(this.refinement)
        }

        return this
    }
}


module.exports = dataTransformation
