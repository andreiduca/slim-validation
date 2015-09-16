// shadow input to test against
var $input = $("<input>");
$input.attr('type', "text").attr('data-error', "default error message");

// set attributes to assert
$input.on('validation:end', function (event, $element, value, isValid, errorMessage) {
    $(this).data('validation-result', isValid);
    $(this).data('validation-error', errorMessage);
});

function resetInputValidation() {
    $input.data('validation-result', "-1");
    $input.data('validation-error', "-1");
}

resetInputValidation();

/**
 * Begin testing validation rules
 **/
QUnit.test("rule: skip", function (assert) {
    $input.attr('data-validate', "skip required minLength 3 maxLength 6");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === true, "Skipped all validation rules.");
    resetInputValidation();
});

QUnit.test("rule: optional", function (assert) {
    $input.attr('data-validate', "optional minLength 3");

    // empty optional value
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === true, "Empty optional value passed.");
    resetInputValidation();

    // not empty optional value
    $input.val('as').validateInput();
    assert.ok($input.data('validation-result') === false, "Not empty optional value checks other rules.");
    resetInputValidation();
});

QUnit.test("rule: required", function (assert) {
    $input.attr('data-validate', "required");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    // not empty value must be valid
    $input.val('Hello').validateInput();
    assert.ok($input.data('validation-result') === true, "Not empty value passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-required', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-required');
    resetInputValidation();
});

QUnit.test("rule: numeric", function (assert) {
    $input.attr('data-validate', "numeric");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    // numeric value must be valid
    $input.val('123').validateInput();
    assert.ok($input.data('validation-result') === true, "Numeric value passed.");
    resetInputValidation();

    // non-trimmed numeric value must be valid
    $input.val(' 123 ').validateInput();
    assert.ok($input.data('validation-result') === true, "Non-trimmed numeric value passed.");
    resetInputValidation();

    // alphanumeric value must be invalid
    $input.val('a1b2c3d').validateInput();
    assert.ok($input.data('validation-result') === false, "Alphanumeric value detected.");
    resetInputValidation();

    // random characters value must be invalid
    $input.val('~!@#$%^&*()_+').validateInput();
    assert.ok($input.data('validation-result') === false, "Alphanumeric value detected.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-numeric', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-numeric');
    resetInputValidation();
});

QUnit.test("rule: min", function (assert) {
    $input.attr('data-validate', "min 3");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    // a value lower than the one required fails
    $input.val('1').validateInput();
    assert.ok($input.data('validation-result') === false, "Lower value detected.");
    resetInputValidation();

    // a value higher than the one required passes
    $input.val('10').validateInput();
    assert.ok($input.data('validation-result') === true, "Higher value passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-min', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-min');
    resetInputValidation();

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "min abc");
    var e = false;
    try {
        // value is irrelevant because the validation rule is badly defined
        $input.validateInput();
    }
    catch (ex) {
        e = ex;
    }

    assert.ok(e !== false, "Invalid parameter passed for 'min': " + e);
    resetInputValidation();
});

QUnit.test("rule: max", function (assert) {
    $input.attr('data-validate', "max 3");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    // a value higher than the one required fails
    $input.val('10').validateInput();
    assert.ok($input.data('validation-result') === false, "Higher value detected.");
    resetInputValidation();

    // a value lower than the one required passes
    $input.val('1').validateInput();
    assert.ok($input.data('validation-result') === true, "Lower value passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-max', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-max');
    resetInputValidation();

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "max abc");
    var e = false;
    try {
        // value is irrelevant because the validation rule is badly defined
        $input.validateInput();
    }
    catch (ex) {
        e = ex;
    }

    assert.ok(e !== false, "Invalid parameter passed for 'max': " + e);
    resetInputValidation();
});

QUnit.test("rule: range", function (assert) {
    $input.attr('data-validate', "range 5..10");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    // a value lower than the one required fails
    $input.val('1').validateInput();
    assert.ok($input.data('validation-result') === false, "Lower value detected.");
    resetInputValidation();

    // a value higher than the one required fails
    $input.val('100').validateInput();
    assert.ok($input.data('validation-result') === false, "Higher value detected.");
    resetInputValidation();

    // a value inside the range passes
    $input.val('7').validateInput();
    assert.ok($input.data('validation-result') === true, "In range value passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-range', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-range');
    resetInputValidation();

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "range abc");
    var e = false;
    try {
        // value is irrelevant because the validation rule is badly defined
        $input.validateInput();
    }
    catch (ex) {
        e = ex;
    }

    assert.ok(e !== false, "Invalid parameter passed for 'range': " + e);
    resetInputValidation();
});

QUnit.test("rule: number", function (assert) {
    $input.attr('data-validate', "number");

    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    $input.val('0').validateInput();
    assert.ok($input.data('validation-result') === true, "Zero number passed.");
    resetInputValidation();

    $input.val('123456').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple number passed.");
    resetInputValidation();

    $input.val('-123456').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple negative number passed.");
    resetInputValidation();

    $input.val('123456.98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple number w/ dot-fraction passed.");
    resetInputValidation();

    $input.val('-123456.98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple negative number w/ dot-fraction passed.");
    resetInputValidation();

    $input.val('123456,98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple number w/ comma-fraction passed.");
    resetInputValidation();

    $input.val('-123456,98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple negative number w/ comma-fraction passed.");
    resetInputValidation();

    $input.val('12,345,678.98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Comma separated thousands w/ dot-fraction passed.");
    resetInputValidation();

    $input.val('12,345,678').validateInput();
    assert.ok($input.data('validation-result') === true, "Comma separated thousands, no fraction passed.");
    resetInputValidation();

    $input.val('-12,345,678.98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Negative comma separated thousands w/ dot-fraction passed.");
    resetInputValidation();

    $input.val('12.345.678,98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Dot separated thousands w/ comma-fraction passed.");
    resetInputValidation();

    $input.val('12.345.678').validateInput();
    assert.ok($input.data('validation-result') === true, "Dot separated thousands, no fraction passed.");
    resetInputValidation();

    $input.val('-12.345.678,98765').validateInput();
    assert.ok($input.data('validation-result') === true, "Negative dot separated thousands w/ comma-fraction passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-number', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-number');
    resetInputValidation();
});

QUnit.test("rule: minLength", function (assert) {
    $input.attr('data-validate', "minLength 5");

    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");
    resetInputValidation();

    $input.val('asd').validateInput();
    assert.ok($input.data('validation-result') === false, "Too few characters detected.");
    resetInputValidation();

    $input.val('asdfgh').validateInput();
    assert.ok($input.data('validation-result') === true, "Minimum characters passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-minLength', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-minLength');
    resetInputValidation();

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "minLength abc");
    var e = false;
    try {
        // value is irrelevant because the validation rule is badly defined
        $input.validateInput();
    }
    catch (ex) {
        e = ex;
    }

    assert.ok(e !== false, "Invalid parameter passed for 'range': " + e);
    resetInputValidation();
});

QUnit.test("rule: maxLength", function (assert) {
    $input.attr('data-validate', "maxLength 5");

    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === true, "Empty value passed.");
    resetInputValidation();

    $input.val('asd').validateInput();
    assert.ok($input.data('validation-result') === true, "Fewer characters passed.");
    resetInputValidation();

    $input.val('asdfgh').validateInput();
    assert.ok($input.data('validation-result') === false, "Too many characters detected.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('asdfgh').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('asdfgh').attr('data-error-maxLength', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-maxLength');
    resetInputValidation();

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "maxLength abc");
    var e = false;
    try {
        // value is irrelevant because the validation rule is badly defined
        $input.validateInput();
    }
    catch (ex) {
        e = ex;
    }

    assert.ok(e !== false, "Invalid parameter passed for 'range': " + e);
    resetInputValidation();
});

QUnit.test("rule: email", function (assert) {
    $input.attr('data-validate', "email");

    // http://blogs.msdn.com/b/testing123/archive/2009/02/05/email-address-test-cases.aspx
    var validEmails = [
        'email@domain.com',                 // Valid email
        'firstname.lastname@domain.com',    // Email contains dot in the address field
        'email@subdomain.domain.com',       // Email contains dot with subdomain
        'firstname+lastname@domain.com',    // Plus sign is considered valid character
        'email@123.123.123.123',            // Domain is valid IP address
        // skipped 2 due to complexity:
        //'email@[123.123.123.123]',          // Square bracket around IP address is considered valid
        //'"email"@domain.com',               // Quotes around email is considered valid
        '1234567890@domain.com',            // Digits in address are valid
        'email@domain-one.com',             // Dash in domain name is valid
        '_______@domain.com',               // Underscore in the address field is valid
        'email@domain.name',                // .name is valid Top Level Domain name
        'email@domain.co.jp',               // Dot in Top Level Domain name also considered valid (use co.jp as example here)
        'firstname-lastname@domain.com'     // Dash in address field is valid
    ];
    var invalidEmails = [
        'plainaddress',                 // Missing @ sign and domain
        '#@%^%#$@#$@#.com',             // Garbage
        '@domain.com',                  // Missing username
        'Joe Smith <email@domain.com>', // Encoded html within email is invalid
        'email.domain.com',             // Missing @
        'email@domain@domain.com',      // Two @ sign
        '.email@domain.com',            // Leading dot in address is not allowed
        'email.@domain.com',            // Trailing dot in address is not allowed
        'email..email@domain.com',      // Multiple dots
        'あいうえお@domain.com',         // Unicode char as address
        'email@domain.com (Joe Smith)', // Text followed email is not allowed
        'email@domain',                 // Missing top level domain (.com/.net/.org/etc)
        'email@-domain.com',            // Leading dash in front of domain is invalid
        'email@domain..com'             // Multiple dot in the domain portion is invalid
    ];


    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value is not a valid email.");
    resetInputValidation();

    for (i = 0; i < validEmails.length; i++) {
        $input.val(validEmails[i]).validateInput();
        assert.ok($input.data('validation-result') === true, validEmails[i] + " - Valid email address passed.");
        resetInputValidation();
    }

    for (i = 0; i < invalidEmails.length; i++) {
        $input.val(invalidEmails[i]).validateInput();
        assert.ok($input.data('validation-result') === false, invalidEmails[i] + " - Invalid email address detected.");
        resetInputValidation();
    }

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-email', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-email');
    resetInputValidation();
});

// TODO: move this test in another test file
QUnit.test("Plugin bootstrapping", function (assert) {
    var $otherInput = $input.clone();
    $otherInput.attr('data-validate', "required");

    $('body').append($otherInput);
    $(window).trigger('load');

    $otherInput.val('');

    $otherInput.blur();
    assert.ok($otherInput.data('validation-result') !== -1, "Plugin initialised on window.load for blur event.");

    $otherInput.remove();
});
