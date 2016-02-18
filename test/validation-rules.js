// Custom validation function
function foo(value) {
    return value == "bar";
}

// shadow input to test against
var $input = $("<input>");
$input.attr('type', "text").attr('data-error', "default error message");

// set attributes to assert
$input.on('validation:end', function (event, $element, value, isValid, errorMessage) {
    $(this).data('validation-result', isValid);
    $(this).data('validation-error', errorMessage);
});

function resetInputValidation(input) {
    input.data('validation-result', "-1");
    input.data('validation-error', "-1");
}

resetInputValidation($input);

/**
 * Begin testing validation rules
 **/
QUnit.test("rule: skip", function (assert) {
    $input.attr('data-validate', "skip required minLength 3 maxLength 6");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Skipped all validation rules.");
    resetInputValidation($input);
});

QUnit.test("rule: optional", function (assert) {
    $input.attr('data-validate', "optional minLength 3");

    // empty optional value
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Empty optional value passed.");
    resetInputValidation($input);

    // not empty optional value
    $input.val('as').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Not empty optional value checks other rules.");
    resetInputValidation($input);
});

QUnit.test("rule: required", function (assert) {
    $input.attr('data-validate', "required");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    // not empty value must be valid
    $input.val('Hello').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Not empty value passed.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-required', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-required');
    resetInputValidation($input);
});

QUnit.test("rule: numeric", function (assert) {
    $input.attr('data-validate', "numeric");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    // numeric value must be valid
    $input.val('123').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Numeric value passed.");
    resetInputValidation($input);

    // non-trimmed numeric value must be valid
    $input.val(' 123 ').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Non-trimmed numeric value passed.");
    resetInputValidation($input);

    // alphanumeric value must be invalid
    $input.val('a1b2c3d').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Alphanumeric value detected.");
    resetInputValidation($input);

    // random characters value must be invalid
    $input.val('~!@#$%^&*()_+').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Alphanumeric value detected.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-numeric', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-numeric');
    resetInputValidation($input);
});

QUnit.test("rule: min", function (assert) {
    $input.attr('data-validate', "min 3");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    // a value lower than the one required fails
    $input.val('1').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Lower value detected.");
    resetInputValidation($input);

    // a value higher than the one required passes
    $input.val('10').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Higher value passed.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-min', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-min');
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "min abc");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'min': abc");
    resetInputValidation($input);
});

QUnit.test("rule: max", function (assert) {
    $input.attr('data-validate', "max 3");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    // a value higher than the one required fails
    $input.val('10').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Higher value detected.");
    resetInputValidation($input);

    // a value lower than the one required passes
    $input.val('1').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Lower value passed.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-max', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-max');
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "max abc");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'max': abc");
    resetInputValidation($input);
});

QUnit.test("rule: range", function (assert) {
    $input.attr('data-validate', "range 5..10");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    // a value lower than the one required fails
    $input.val('1').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Lower value detected.");
    resetInputValidation($input);

    // a value higher than the one required fails
    $input.val('100').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Higher value detected.");
    resetInputValidation($input);

    // a value inside the range passes
    $input.val('7').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "In range value passed.");
    resetInputValidation($input);

    $input.attr('data-validate', "range -10..-1");
    $input.val('-7').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "In range negative value passed.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-range', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-range');
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "range abc");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'range': abc");
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "range 1..x");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'range': 1..x");
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "range x..10");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'range': x..10");
    resetInputValidation($input);
});

QUnit.test("rule: number", function (assert) {
    $input.attr('data-validate', "number");

    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    $input.val('0').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Zero number passed.");
    resetInputValidation($input);

    $input.val('123456').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Simple number passed.");
    resetInputValidation($input);

    $input.val('-123456').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Simple negative number passed.");
    resetInputValidation($input);

    $input.val('123456.98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Simple number w/ dot-fraction passed.");
    resetInputValidation($input);

    $input.val('-123456.98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Simple negative number w/ dot-fraction passed.");
    resetInputValidation($input);

    $input.val('123456,98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Simple number w/ comma-fraction passed.");
    resetInputValidation($input);

    $input.val('-123456,98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Simple negative number w/ comma-fraction passed.");
    resetInputValidation($input);

    $input.val('12,345,678.98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Comma separated thousands w/ dot-fraction passed.");
    resetInputValidation($input);

    $input.val('12,345,678').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Comma separated thousands, no fraction passed.");
    resetInputValidation($input);

    $input.val('-12,345,678.98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Negative comma separated thousands w/ dot-fraction passed.");
    resetInputValidation($input);

    $input.val('12.345.678,98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Dot separated thousands w/ comma-fraction passed.");
    resetInputValidation($input);

    $input.val('12.345.678').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Dot separated thousands, no fraction passed.");
    resetInputValidation($input);

    $input.val('-12.345.678,98765').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Negative dot separated thousands w/ comma-fraction passed.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-number', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-number');
    resetInputValidation($input);
});

QUnit.test("rule: minLength", function (assert) {
    $input.attr('data-validate', "minLength 5");

    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value detected.");
    resetInputValidation($input);

    $input.val('asd').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Too few characters detected.");
    resetInputValidation($input);

    $input.val('asdfgh').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Minimum characters passed.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-minLength', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-minLength');
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "minLength abc");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'minLength': abc");
    resetInputValidation($input);
});

QUnit.test("rule: maxLength", function (assert) {
    $input.attr('data-validate', "maxLength 5");

    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Empty value passed.");
    resetInputValidation($input);

    $input.val('asd').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Fewer characters passed.");
    resetInputValidation($input);

    $input.val('asdfgh').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Too many characters detected.");
    resetInputValidation($input);

    // empty value must display fallback error message
    $input.val('asdfgh').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('asdfgh').attr('data-error-maxLength', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-maxLength');
    resetInputValidation($input);

    // try to catch invalid parameter for current rule
    $input.attr('data-validate', "maxLength abc");
    assert.throws(function() { $input.validateInput(); }, "Invalid parameter passed for 'maxLength': abc");
    resetInputValidation($input);
});

QUnit.test("rule: email", function (assert) {
    $input.attr('data-validate', "email");

    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Empty value is not a valid email.");
    resetInputValidation($input);

    // from http://blogs.msdn.com/b/testing123/archive/2009/02/05/email-address-test-cases.aspx
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

    for (var i = 0; i < validEmails.length; i++) {
        $input.val(validEmails[i]).validateInput();
        assert.strictEqual($input.data('validation-result'), true, validEmails[i] + " - Valid email address passed.");
        resetInputValidation($input);
    }

    for (i = 0; i < invalidEmails.length; i++) {
        $input.val(invalidEmails[i]).validateInput();
        assert.strictEqual($input.data('validation-result'), false, invalidEmails[i] + " - Invalid email address detected.");
        resetInputValidation($input);
    }

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.equal($input.data('validation-error'), "default error message", "Default error message displayed.");
    resetInputValidation($input);

    // empty value must display custom error message
    $input.val('').attr('data-error-email', 'custom error message').validateInput();
    assert.equal($input.data('validation-error'), "custom error message", "Custom error message displayed.");
    $input.removeAttr('data-error-email');
    resetInputValidation($input);
});

QUnit.test("Custom validation rules", function (assert) {
    $input.attr('data-validate', "foo");

    $input.val('').validateInput();
    assert.strictEqual($input.data('validation-result'), false, "Custom rule invalidation detected.");
    resetInputValidation($input);

    $input.val('bar').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Custom rule validation passed.");
    resetInputValidation($input);
});

QUnit.test("Invalid validation rules", function (assert) {
    $input.attr('data-validate', "baz foo");

    // override console.warn() behavior to capture warnings
    var warnings = [];
    var qwarn = console.warn;

    console.warn = function() {
        warnings.push(arguments);
        qwarn.apply(console, arguments);
    };

    $input.val('bar').validateInput();
    assert.strictEqual($input.data('validation-result'), true, "Invalid rule gracefully skipped..");
    resetInputValidation($input);

    assert.equal(warnings.length, 1, "Console warning message thrown successfully.");

    // reset console.warn to original implementation
    console.warn = qwarn;
    qwarn = null;
});

QUnit.test("Entire Form validation", function (assert) {
    // add the input to a form
    var $form = $("<form>");
    $form.append($input);

    $input.attr('data-validate', "required");

    // empty value in input means form is invalid
    $input.val('');
    // validate the form instead of the input
    $form.validateForm();
    assert.strictEqual($input.data('validation-result'), false, "Invalid input detected in Form.");
    resetInputValidation($input);

    // not empty value in input means form is valid
    $input.val('Hello');
    // validate the form instead of the input
    $form.validateForm();
    assert.strictEqual($input.data('validation-result'), true, "No invalid inputs detected in Form.");
    resetInputValidation($input);
});

// TODO: move this test in another test file
QUnit.test("Plugin bootstrapping", function (assert) {
    var $DOMInput = $input.clone();

    $('body').append($DOMInput);

    var validations = 0;
    $DOMInput.on('validation:end', function () {
        validations++;
    });

    $DOMInput.attr('data-validate', "required").val('').blur();
    assert.equal($DOMInput.attr('data-is-valid'), "false", "Post-initialisation error detected.");

    $DOMInput.val('some value').blur();
    assert.equal($DOMInput.attr('data-is-valid'), "true", "Post-initialisation successful validation.");

    assert.equal(validations, 2, "Custom event fired every time.");

    $DOMInput.remove();
});
