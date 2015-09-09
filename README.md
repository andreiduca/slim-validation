# slim-validation
Lightweight jQuery validation plugin.

[![devDependency Status](https://david-dm.org/andreiduca/slim-validation/dev-status.svg)](https://david-dm.org/andreiduca/slim-validation#info=devDependencies)
[![Build Status](https://travis-ci.org/andreiduca/slim-validation.svg?branch=master)](https://travis-ci.org/andreiduca/slim-validation)

## Usage
HTML-only setup required. Just set the "data-validate" custom attribute on your inputs and you're ready to go:

```
<input type="text" data-validate="required" />
```

Chain multiple validation rules using the empty space as a delimiter:

```
<input type="text" data-validate="required email" />
```

## Validation behaviour
The validation action is triggered by default on the "blur" event on each input.

After each validation, a custom event is triggered so you can bind your own behaviour to it, like this:

```
$('body').on('validation:end', '[data-validate]', function(event, $input, value, isValid, errorMessage) {
    // ... yout code goes here
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

This is great for internationalised websites where you need translated error messages, and works best with template engines such as smarty or twig. Yes: no more javascript files filled with translated messages!

## Advanced validation rules
Some rules require a configurable parameter, like a number to compare against. It's simple: just add the number after that rule:

```
<input type="text" data-validate="minLength 3" />
```

More rules for the same input? Just chain them as usual.


## Validations rules reference:
(This is a work in progress)

- `required`: the value must not be an empty string;
- `requiredBy`: the value must not be empty **only if** a related input is completed;
- `numeric`: the value must contain only digits;
- `min`: the value must be numeric and greater than or equal to the provided parameter;
- `max`: the value must be numeric and lower than or equal to the provided parameter;
- `range`: the value must be numeric and fall in the range provided using the format `1..10`;
- `number`: the value must match one of the following number formats: `-12345.6789`, `-12345,6789`, `-12,345.6789`, `-12.345,6789` (the negative sign and the fractional part are optional);
- `minLength`: the value's length must be more than or equal to the provided parameter;
- `maxLength`: the value's length must be less than or equal to the provided parameter;
- `email`: the value must match the W3C compliant email Regex (see http://www.w3.org/TR/html-markup/input.email.html#input.email.attrs.value.single);
- `phone`: (not implemented yet; different countries have different formats).
