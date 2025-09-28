// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


const { validator } = require('./index.js')



// const data = {
//     aa: '123a',
//     bb: 'test',
//     cc: {zz: 11, yy: 'hello'},
//     dd: [1,2,3],
//     zz: {
//         xx: 'world',
//         yy: 456
//     }
// }

// const aa = validator.objectIterate(data, {
//     aa: () => validator.number().required().toString(),
//     bb: () => validator.string().required(),
//     cc: () => validator.boolean().required(),
//     dd: {
//         xx: () => validator.number().required(),
//         yy: () => validator.string().required()
//     }
//     }, { softFail: true })



const data = [ 123, 'test', 456, 1.34]

const aa = validator.arrayIterate(data, () => validator.string().required(), { itemValidationMode: 'any' })

console.log(aa)

