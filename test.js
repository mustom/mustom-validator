// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


const { validator } = require('./index.js')


// TEST objectIterate
// const data = {
//     aa: '123a',
//     bb: [1, 2, 3],
//     cc: {zz: 11, yy: 'hello'},
//     dd: {
//         xx: 'world',
//         yy: 456
//     },
//     zz: 'extra'
// }

// const aa = validator.objectIterate(data, {
//     aa: () => validator.number().required().toString(),
//     bb: [ () => validator.string().toString().required(), { itemValidationMode: 'any', softFail: true, abortEarly: true }],
//     dd: {
//         xx: () => validator.number().required(),
//         yy: () => validator.string().required()
//     },
//     cc: () => validator.boolean().required(),
//     req: () => validator.string().required()
//     }, {
//         softFail: true,
//         abortEarly: false,
//         entryValidationMode: 'flexible',
//         stripUndefinedKey: false
//     })

// console.log(aa)



// TEST arrayIterate
const data = [ 123, 'test', 456, 1.34]
const bb = validator.arrayIterate(data, () => validator.string().minLength(100).toString(), { itemValidationMode: 'all', softFail: true, abortEarly: false })
console.log(bb)



// TEST setIterate
// const data = new Set([ 123, 'test', 456, 1.34])
// const bb = validator.setIterate(data, () => validator.string().toString().required(), { itemValidationMode: 'one', itemValidationThreshold: 2, softFail: true, abortEarly: true })
// console.log(bb)


// TEST arrayObjectIterate
// const data = [{
//     aa: '123a',
//     bb: [1, 2, 3],
//     cc: {zz: 11, yy: 'hello'},
//     dd: {
//         xx: 'world',
//         yy: 456
//     },
//     zz: 'extra'
// },{
//     aa: 12345,
//     bb: [1, 2, 3],
//     cc: {zz: 11, yy: 'hello'},
//     dd: {
//         xx: 'world',
//         yy: 456
//     },
//     zz: 'extra'
// },{
//     aa: '123a',
//     bb: [1, 2, 3],
//     cc: {zz: 11, yy: 'hello'},
//     dd: {
//         xx: 'world',
//         yy: 456
//     },
//     zz: 'extra'
// }
// ]

// const aa = validator.arrayObjectIterate(data, {
//     aa: () => validator.number().required().toString(),
//     bb: [ () => validator.string().toString().required(), { itemValidationMode: 'any', softFail: true, abortEarly: true }],
//     dd: {
//         xx: () => validator.number().required(),
//         yy: () => validator.string().required()
//     },
//     cc: () => validator.boolean().required(),
//     req: () => validator.string()
//     }, {
//         softFail: true,
//         entryValidationMode: 'flexible',
//         stripUndefinedKey: false
//     })

// console.log(aa)


