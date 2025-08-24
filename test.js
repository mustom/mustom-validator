// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


const { validator } = require('./index.js')



console.log('TEST')
const aa = validator.single('s1234', {softFail: true}).number()

console.log(aa.refinement)

// console.log('TEST2')
// const bb = validator.single('test22').number()
// console.log(bb)

