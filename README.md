# slim-validation
Lightweight jQuery validation plugin.

[![devDependency Status](https://david-dm.org/andreiduca/slim-validation/dev-status.svg)](https://david-dm.org/andreiduca/slim-validation#info=devDependencies)
[![codecov.io](http://codecov.io/github/andreiduca/slim-validation/coverage.svg?branch=master)](http://codecov.io/github/andreiduca/slim-validation?branch=master)
[![Build Status](https://travis-ci.org/andreiduca/slim-validation.svg?branch=master)](https://travis-ci.org/andreiduca/slim-validation)

### Instalation
**node:** `npm install slim-validation` :sparkling_heart:

**git:** `git clone https://github.com/andreiduca/slim-validation.git`

or download the ZIP archive, extract and use the files from the `/src` folder. See `/demo/index.html` for a quick implementation.

## Usage
HTML-only setup required. Just set the "data-validate" custom attribute on your inputs and you're ready to go:

```
<input type="text" data-validate="required" />
```

Chain multiple validation rules using the empty space as a delimiter:

```
<input type="text" data-validate="required email" />
```

## Validation behavior
The validation action is triggered by default on the "blur" event on each input.

After each validation, a custom event is triggered so you can bind your own behavior to it, like this:

```
$('body').on('validation:end', '[data-validate]', function(event, $input, value, isValid, errorMessage) {
    // ... your code goes here
});
```

Notice the parameters you can use at your own disposal. Use your imagination!

In the demo HTML I only added a colored border and error message after each input to highlight its status:

```
$('body').on('validation:end', '[data-validate]', function(event, $input, value, isValid, errorMessage) {

    $input.next('span').remove();

    if (!isValid) {
        $input.after('<span style="color:red;">' + errorMessage + '</span>');
        $input.css({"border": "1px solid red"});
    }
    else {
        $input.after('<span style="color:green;">data is valid</span>');
        $input.css({"border": "1px solid green"});
    }
});
```

**Note:** `$input` is a jQuery wrapper of the actual input being validated.

## Form validation
You can also validate an entire form at once.
 
```
$("#testForm").validateForm();
```

When a form is validated, all containing HTML elements having the `data-validate` attribute will be validated.

In the end, another custom event is triggered:

```
$('body').on('validation:form', '#testForm', function(event, $form, isValid, $firstErrorInput) {
    // ... your code goes here
});
 ```
 
You can see if the `$form` has errors or not with the `isValid` parameter and you can, for example, scroll to the `$firstErrorInput` and focus it.

## Error messages
Error messages are also defined with custom "data-" attributes:

```
<input type="text" data-validate="required" data-error="invalid data" />
```

Custom error messages for each validation rule can also be defined:

```
<input type="text" data-validate="required email"
        data-error="generic error"
        data-error-email="Invalid email" />
```

This is great for internationalized websites where you need translated error messages, and works best with template engines such as smarty or twig. Yes: no more javascript files filled with translated messages!

## Advanced validation rules
Some rules require a configurable parameter, like a number to compare against. It's simple: just add the number after that rule:

```
<input type="text" data-validate="minLength 3" />
```

More rules for the same input? Just chain them as usual.


## Validations rules reference:
(This is a work in progress)

- `required`: the value must not be an empty string;
- `requiredBy`: the value must not be empty **only if** a related input is not empty;
- `numeric`: the value must contain only digits;
- `integer`: the value must be a valid integer (negative values allowed);
- `min`: the value must be an integer greater than or equal to the provided parameter;
- `max`: the value must be an integer lower than or equal to the provided parameter;
- `range`: the value must be an integer in the range provided using the format `1..10`;
- `number`: the value must match one of the following number formats: `-12345.6789`, `-12345,6789`, `-12,345.6789`, `-12.345,6789` (the negative sign and the fractional part are optional);
- `minLength`: the value's length must be more than or equal to the provided parameter;
- `maxLength`: the value's length must be less than or equal to the provided parameter;
- `email`: the value must match a "practical RFC 5322" regex: (see http://www.regular-expressions.info/email.html)
