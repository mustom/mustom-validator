<h4 align="center">MUSTOM, More Than Custom</h4>

> This version is NOT tested. Please do NOT use this library.

## About This Library
This library is specifically designed for the Mustom project. Therefore, it's not a general-purpose validation library and might not be suitable for your project.


## How to Use

Install via NPM
```
npm install @mustom/validator
```

Usage Examples
```
# Validate if the input value 23 is natural number, and not empty value.
validator.single(23).naturalNumber().notEmpty().required()

# Validation with options
validator.single(23, { }).string()

# Validate object
validator.objectIterate()

# Validate object with options. (In this case)


```


### Action Types

#### Single


```
# Validation without option
# It will validate if input value is a natural numer, not empty, and required.
validator.single().naturalNumber().notEmpty().required()

# Validation with options
validator.single({}).string()

```

> Array is iterable object in Javascript. But it does not support 'iterate' action type.
> Use single action instead.


#### ObjectIterate
 (Object, Array of Object)





#### ArrayObjectIterate







### Options

#### parseMode

#### returnValue

#### noError





### Custom Error Object
If input value is not passed validation rule(s), validator will thorow error if 'noError : true' option is not specified.
In this case, validator will ... in custom error object.

### License
This library is under AGPL v3 Licensed. (It is same as the license of Mustom)


### Git Repository
[GitHub] (https://github.com/mustom/validator)

### Project website

[MUSTOM HQ] (https://mustom.com/)



