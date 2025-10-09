// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


const { validator } = require('./index.js')



const data = {
    aa: '123a',
    bb: 'test',
    cc: {zz: 11, yy: 'hello'},
    dd: {
        xx: 'world',
        yy: 456
    },
    zz: 'extra'
}

const aa = validator.objectIterate(data, {
    aa: () => validator.number().required().toString(),
    bb: () => validator.string().required(),
    dd: {
        xx: () => validator.number().required(),
        yy: () => validator.string().required()
    },
    cc: () => validator.boolean().required(),
    req: () => validator.string()
    }, {
        softFail: true,
        entryValidationMode: 'strict',
        stripUnknown: false
    })

console.log(aa)


// const data = [ 123, 'test', 456, 1.34]

// const bb = validator.arrayIterate(data, () => validator.string().toString().required(), { itemValidationMode: 'any', softFail: true, abortEarly: true })


// console.log(bb)

