# slim-validation
Lightweight jQuery validation plugin.

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
$('body').on('validation:end', '[data-validate]', function(event, input, value, isValid, errorMessage) {
    // ... yout code goes here
});
```

Notice the parameters you can use at your own disposal. Use your imagination!

In the demo HTML I only added a colored border and error message after each input to highlight the status:

```
input.next('span').remove();

if (!isValid) {
    input.after('<span style="color:red;">' + errorMessage + '</span>');
    input.css({"border": "1px solid red"});
}
else {
    input.after('<span style="color:green;">data is valid</span>');
    input.css({"border": "1px solid green"});
}
```

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

- (`required`): the value must not be an empty string;
- (`requiredBy`): the value must not be empty **only if** a related input is completed;
- (`minLength`): the value must be more or equal in length than the provided ammount;
- (`maxLength`): the value must be less or equal in length than the provided ammount;
- (`email`): the value must match an email regex (not implemented yet);
- (`phone`): (not implemented yet; different countries have different formats).
