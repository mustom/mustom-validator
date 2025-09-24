// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.

const { dataTypeChecker } = require('../util/data-type-checker')

const dataTransformation = {
    /**
     * Transform data by trimming whitespace from strings. 
     * If the data is an array, object, or Set, it will trim each string element.
     */
    trim: function () {

        if (this.refinement === null || this.refinement === undefined) {
            return this
        }

        const refinementType = dataTypeChecker(this.refinement)

        if (refinementType === 'string') {
            this.refinement = this.refinement.trim()
        }

        if (refinementType === 'array') {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item.trim()
                }

                return item
            })
        }

        if (refinementType === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'string') {
                    this.refinement[key] = this.refinement[key].trim()
                }
            }
        }
        
        if (refinementType === 'set') {
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

        if (this.refinement === null || this.refinement === undefined) {
            return this
        }

        const refinementType = dataTypeChecker(this.refinement)

        if (refinementType === 'string') {
            this.refinement = this.refinement.toLowerCase()
            return this
        }

        if (refinementType === 'array') {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item.toLowerCase()
                }

                return item
            })
        }

        if (refinementType === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'string') {
                    this.refinement[key] = this.refinement[key].toLowerCase()
                }
            }
        }

        if (refinementType === 'set') {
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

        if (this.refinement === null || this.refinement === undefined) {
            return this
        }

        const refinementType = dataTypeChecker(this.refinement)

        if (refinementType === 'string') {
            this.refinement = this.refinement.toUpperCase()
        }

        if (refinementType === 'array') {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item.toUpperCase()
                }

                return item
            })
        }

        if (refinementType === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'string') {
                    this.refinement[key] = this.refinement[key].toUpperCase()
                }
            }
        }

        if (refinementType === 'set') {
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

        
        if (this.refinement === null || this.refinement === undefined) {
            return this
        }

        const refinementType = dataTypeChecker(this.refinement)
        
        if ([ 'number', 'boolean', 'regexp', 'bigint', 'date' ].includes(refinementType)) {
            this.refinement = String(this.refinement)
            return this
        }

        if (refinementType === 'array') {
            return this.refinement.map(item => {
                if (typeof item === 'string') {
                    return item
                }

                return String(item)
            })
        }

        if (refinementType === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] !== 'string') {
                    this.refinement[key] = String(this.refinement[key])
                }
            }
        }

        if (refinementType === 'set') {
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

        if (this.refinement === null || this.refinement === undefined) {
            return this
        }

        const refinementType = dataTypeChecker(this.refinement)

        if (refinementType === 'string') {
            this.refinement = Number(this.refinement)
        }

        if (refinementType === 'array') {
            this.refinement = this.refinement.map(item => {
                if (typeof item === 'number') {
                    return item
                }

                return Number(item)
            })

            return this
        }

        if (refinementType === 'object') {
            for (const key in this.refinement) {
                if (typeof this.refinement[key] === 'number') {
                    continue
                }

                this.refinement[key] = Number(this.refinement[key])
            }
        }

        if (refinementType === 'set') {
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
     * If the data is a string, it will be split by commas into an array.
     * If the data is an object, it will convert the object's values into an array.
     * If the data is a Set, it will convert the Set into an array.
     */
    toArray: function () {

        if (this.refinement === null || this.refinement === undefined) {
            return this
        }

        const refinementType = dataTypeChecker(this.refinement)

        if (refinementType === 'string') {
            this.refinement = this.refinement.split(',')
        }

        if (refinementType === 'object') {
            this.refinement = Object.values(this.refinement)
        }

        if (refinementType === 'set') {
            this.refinement = Array.from(this.refinement)
        }

        return this
    }
}


module.exports = dataTransformation
