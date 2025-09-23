<h4 align="center">MUSTOM, More Than Custom</h4>

> This version is NOT tested. Please do NOT use this library.

### About This Library
This library was made specifically for the Mustom e-commerce platform. Because it's not a general-purpose validation library, it might not be a good fit for your project. You have lots of great options like Joi and Zod, so I'd recommend you skip this one if you're not working on a Mustom project.

### Installation
Install via NPM
```
npm install mustom-validator
```

### Usage Examples

To use the validator, import the `validator` instance and call the desired validation methods. Here is a simple example:


CommonJS
```
const { Validator } = require('mustom-validator')
```


ES Modules
```
import { Validator } from 'mustom-validator'
```

```
# Validate if the input value 23 is natural number, and not empty value.
validator.single(23).naturalNumber().notEmpty().required()
```

```
# Validation with options
validator.single(23, { }).string()
```

```
# Validate object
validator.objectIterate()
```

```
# Validate object with options. (In this case)

```

### Structure



### Action Types

Action type is how this validator ...
If

##### Single

```
# Validation without option
# It will validate if input value is a natural numer, not empty, and required.
validator.single().naturalNumber().notEmpty().required()

# Validation with options
validator.single({}).string()

```

> Array is iterable object in Javascript. But it does not support 'iterate' action type.
> Use single action instead.


##### ObjectIterate
 (Object, Array of Object)





##### ArrayObjectIterate





### Options

mode ('strict', 'flexible')
This option is only applied for objectIterable, and arrayObjectIterate. If it is 'strict' validator will throw error if there is unknown(undefined) key in the input. It is useful when you check the value of request body in an API. If it is set as 'flexible' validator will ignore it.


stripUnknown (true, false)
This option is only applied for objectIterable, and arrayObjectIterate. If it is set as true, validator will remove this element from the refinement. If it is set as false, this element still in the refinement.

softFail (true, false)
softFail opton is only apply for validation fail case. It will throw error if it is not a validation fail case, even if softFail option is set as true.
(e.g. empty argument, or )



### Methods


Data type check
- `object()`
- `arrayOfObject()`
- `array()`
- `string()`
- `boolean()`
- `number()`
- `nonNegativeNumber()`
- `positiveNumber()`
- `naturalNumber()`
- `wholeNumber()`
- `integer()`
- `negativeInteger()`
- `email()`
- `url()`
- `ip()`
- `code()`
- `path()`
- `injectionSafeString()`
- `alphabet()`
- `uppercase()`
- `lowercase()`
- `alphaNumeric()`
- `password()`
- `imageFile()`
- `dateTime()`
- `dateOnly()`

Comparison
- `is(expected)`
- `isNot()`
- `minValue(limit)`
- `maxValue(limit)`
- `in()`
- `notIn()`
- `exactLength(expected)`
- `minLength(expected)`
- `maxLength(expected)`

Condition
- `required()`
- `notEmpty()`
- `noWhitespace()`
- `notDuplicate()`

RegEx
- `regexTrue(regex)`
- `regexFalse(regex)`

Misc
- `gridOption()`
- `noRules()`


### Data Transformer
You can use data transformer, when you need to transform value.
The return value (output) will be changed if you add data transfomer.
And, if you add it in the middle of method, the value also changed. So, validation 

```
// Example 1 : Transform 'mustom' to 'MUSTOM'. It will pass validation. 
validator.single('mustom').string().toUpperCase().uppercase()
// output : 'MUSTOM'


// Example 2 : Change ' MUSTOM ' to lower case, and trim.
validator.single(' MUSTOM ').string().toLowerCase().trim()
// output : 'mustom'
```

- `trim` Trim string
- `toLowerCase` 
- `toUpperCase`
- `toString` Change to string. (Number, or array will)
- `toNumber` Change number (Only applied to )
- `toArray` 


### Return value


### Custom Error Object
The project includes custom error classes for better error handling:

If input value is not passed validation rule(s), validator will thorow error if 'softFail : true' option is not specified.
In this case, validator will ... in custom error object.


- `BaseError`
- `ValidationError`
- `UsageError`
- `UsageError`

These errors extend the built-in Error class and provide specific messages for different validation failures.


### Additional Utility
This module provide addtional utility 'dataTypeChecker'.


```
import { dataTypeChecker } from 'mustom-validator'

const input1 = 'foo'
const input2 = 12345
const input3 = { foo: 'abc', bar: 123 }
const input4 = [ 'foo', 'bar', 'baz' ]
const dataType1 = dataTypeChecker(input1)
const dataType2 = dataTypeChecker(input2)
const dataType3 = dataTypeChecker(input3)
const dataType3 = dataTypeChecker(input4)

console.log(dataType1) // Return 'string'
console.log(dataType2) // Return 'number'
console.log(dataType3) // Return 'object'
console.log(dataType4) // Return 'array'
```


Return values will be one of the following:

`null`, `string`, `boolean`, `number`, `undefined`, `nan`, `array`, `regexp`, `date`, `object`, `map`, `set`, `bigint`

Return `misc` (for any other types not covered above):

function, symbol, error, weakmap, weakset, etc.


### License
This library is under AGPL v3 Licensed. (It is same as the license of Mustom)

### Git Repository
[GitHub] (https://github.com/mustom/mustom-validator)

### Mustom Project Website
[MUSTOM HQ] (https://mustom.com/)



