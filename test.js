// MUSTOM, More Than Custom, https://mustom.com
// Copyright © Ryu Woosik. All rights reserved.


const { validator } = require('./index.js')



console.log('TEST')
const aa = validator.single('test11').string()

console.log(aa)

console.log('TEST2')
const bb = validator.single('test22').number()
console.log(bb)

