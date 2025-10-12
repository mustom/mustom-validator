<h4 align="center">MUSTOM, More Than Custom</h4>

> This version is NOT tested. Please do NOT use this library.

## About This Library
This library was made specifically for the Mustom e-commerce platform. Because it's not a general-purpose validation library, it might not be a good fit for your project. You have lots of great options like Joi and Zod, so I'd recommend you skip this one if you're not working on a Mustom project.

## Installation
Install via NPM

```
npm install mustom-validator
```

## Usage Examples
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
# Validate single value
validator.single(23).naturalNumber().maxValue(100).notEmpty()
```

```
# Validate single value with options
validator.single(23, { softFail: true }).string().required()
```

```
# Validate object
validator.objectIterate({
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com'
}, {
    name: () => validator.string().minLength(3).maxLength(50).notEmpty().required(),
    age: () => validator.naturalNumber().minValue(0).maxValue(120).required(),
    email: () => validator.email().notEmpty().required()
}, { mode: 'strict', stripUnknown: true })
```


## Action Types
Action types define how the validator processes the input data. There are six action types:
single, objectIterate, arrayObjectIterate, arrayIterate, setIterate, mapIterate.


##### Single
This action type is used to validate a single value.

```
validator.single(value, options)
```


##### ObjectIterate
This action type is used to validate each property of an object against specified rules.

```
validator.objectIterate(object, rules, options)
```

##### ArrayObjectIterate
This action type is used to validate each object in an array against specified rules.

```
validator.arrayObjectIterate(arrayOfObjects, rules, options)
```

##### ArrayIterate
This action type is used to validate each item in an array against a specified rule.
```
validator.arrayIterate(array, rule, options)
```

##### SetIterate
This action type is used to validate each item in a set against a specified rule.
```
validator.setIterate(set, rule, options)
```

##### MapIterate
This action type is used to validate each value in a map against specified rules.
This method is under development and not available yet.
```validator.mapIterate(map, rules, options)
```

## Options
There are many options you can use in the validator.

#### itemValidationMode ('all', 'any', 'none', 'one', 'atLeast', 'atMost', 'exactly')

This option is only applied for arrayIterate, setIterate. It defines how many items in the array or set should pass the validation rule. The default value is 'all'.

- `all` : All items must pass the validation rule.
- `any` : At least one item must pass the validation rule.
- `none` : No items should pass the validation rule.
- `one` : Exactly one item must pass the validation rule.
- `atLeast` : At least a specified number of items must pass the validation rule. (You need to specify the number using 'itemValidationThreshold' option.)
- `atMost` : At most a specified number of items can pass the validation rule. (You need to specify the number using 'itemValidationThreshold' option.)
- `exactly` : Exactly a specified number of items must pass the validation rule. (You need to specify the number using 'itemValidationThreshold' option.)

#### itemValidationThreshold (number)
This option is only applied for arrayIterate, setIterate when 'itemValidationMode' is set to 'atLeast', 'atMost', or 'exactly'. It defines the threshold number of items that must pass the validation rule. The default value is 1.

#### entryValidationMode ('strict', 'flexible')
This option is only applied for objectIterable, mapIterate, and arrayObjectIterate. If it is 'strict', validator will throw error if there is any undefined key. If it is 'flexible', validator will ignore it. The default value is 'strict'.

#### stripUndefinedKey (true, false)
This option is only applied for objectIterable, mapIterate, and arrayObjectIterate. If it is set as true, validator will remove undefined keys from the refinement. If it is set as false, this element still in the refinement. The default value is false.

#### softFail (true, false)
This option is applied for all action types. If it is set as true, validator will not throw error even if validation fails. The default value is false.
> This option will not work if error type is 'UsageError'. Because it is thrown when there is a problem with how the validator is used, not with the input data itself.

#### abortEarly (true, false)
This option is applied for all action types. If it is set as true, validator will stop validation on the first error encountered. The default value is false.
> This option will not work if 'softFail' option is set to false. Because in this case, validator will throw error immediately when validation fails.

#### strictDateValidation (true, false)
This option is for date validation methods (dateTime, dateOnly). If it is set as true, validator will perform strict date validation, meaning it will reject invalid dates like February 30. The default value is false.


## Methods

#### Data Type Validation
- `any()`
- `null()`
- `undefined()`
- `nan()`
- `map()`
- `set()`
- `bigInt()`
- `function()`
- `symbol()`
- `regexp()`
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

#### Comparational Validation
- `is(expected)`
- `isNot(expected)`
- `minValue(limit)`
- `maxValue(limit)`
- `in(list)`
- `notIn(list)`
- `exactLength(expected)`
- `minLength(expected)`
- `maxLength(expected)`

#### Conditional Validation
- `required()`
- `notEmpty()`
- `noWhitespace()`
- `notDuplicate()`

#### RegEx Validation
- `regexTrue(regex)`
- `regexFalse(regex)`

#### Misc
- `gridOption()`
- `noRules()`


## Data Transformer
The validator includes data transformer methods that allow you to transform the input value during the validation process.
You can use data transformer, when you need to transform value.
The 'refinement' in return value will be changed if you add data transfomer.
And, if you add it in the middle of method, the value also changed. So, validation methods after the transformer will be applied to the transformed value.

```
// Example 1 : Transform 'mustom' to 'MUSTOM'. It will pass validation. 
validator.single('mustom').string().toUpperCase().uppercase()
// output : 'MUSTOM'


// Example 2 : Change ' MUSTOM ' to lower case, and trim.
validator.single(' MUSTOM ').string().toLowerCase().trim()
// output : 'mustom'
```

- `trim()` Trim string
- `toLowerCase()` 
- `toUpperCase()`
- `toString()` Change to string. (Number, or array will)
- `toNumber()` Change number (Only applied to )
- `toArray()` 


## Return value


## Custom Error Object
The validator provides a custom error object that contains detailed information about validation failures.
If input value is not passed validation rule(s), validator will thorow error if 'softFail : true' option is not specified.
In this case, validator will include the failed validation rules in the custom error object.

- `BaseError`
- `ValidationError`
- `UsageError`

These errors extend the built-in Error class and provide specific messages for different validation failures.


## Additional Utility - Data type checker
This utility function checks the data type of the input value and returns it as a string.

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

> If you set the option 'showMisc' as true, it will return exact type of 'misc'.

### License
This library is under AGPL v3 Licensed. (It is same as the license of Mustom)

### Git Repository
[GitHub] (https://github.com/mustom/mustom-validator)

### Mustom Project Website
[MUSTOM HQ] (https://mustom.com/)



