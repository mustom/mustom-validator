<h4 align="center">MUSTOM, More Than Custom</h4>

> This version is NOT tested. Please do NOT use this library.

### About This Library
#:carrot:



This library is specifically designed for the Mustom project. Therefore, it's not a general-purpose validation library and might not be suitable for your project.



### Installation

Install via NPM
```
npm install @mustom/validator
```


### Usage Examples

To use the validator, import the `validator` instance and call the desired validation methods. Here is a simple example:

`
// Common JS
const { Validator } = require('@mustom/validator')



// ES Import
import { Validator } from '@mustom/validator'

`


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

- parseMode
- returnValue
- noError



### Type Checker



### Condition Checker



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

If input value is not passed validation rule(s), validator will thorow error if 'noError : true' option is not specified.
In this case, validator will ... in custom error object.


- `BaseError`
- `DataTypeError`
- `EmptyArgumentError`
- `UsageError`

These errors extend the built-in Error class and provide specific messages for different validation failures.

### License
This library is under AGPL v3 Licensed. (It is same as the license of Mustom)

### Git Repository
[GitHub] (https://github.com/mustom/validator)

### Mustom Project Website

[MUSTOM HQ] (https://mustom.com/)



