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
    assert.ok($input.data('validation-result') !== true, "Not empty optional value checks other rules.");
    resetInputValidation();
});

QUnit.test("rule: required", function (assert) {
    $input.attr('data-validate', "required");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') !== true, "Empty value detected.");
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
    resetInputValidation();
    $input.val('').removeAttr('data-error-required');
});

QUnit.test("rule: minLength", function (assert) {
    $input.attr('data-validate', "minLength 5");

    $input.val('').validateInput();
    assert.ok($input.data('validation-result') !== true, "Empty value detected.");
    resetInputValidation();

    $input.val('asd').validateInput();
    assert.ok($input.data('validation-result') !== true, "Too few characters detected.");
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
    resetInputValidation();
    $input.val('').removeAttr('data-error-minLength');
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
    assert.ok($input.data('validation-result') !== true, "Too many characters detected.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('asdfgh').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('asdfgh').attr('data-error-maxLength', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    resetInputValidation();
    $input.val('').removeAttr('data-error-maxLength');
});

QUnit.test("rule: email", function (assert) {

    $input.attr('data-validate', "email");

    $input.val('').validateInput();
    assert.ok($input.data('validation-result') !== true, "Empty value is not a valid email.");
    resetInputValidation();

    $input.val('simple@email.address').validateInput();
    assert.ok($input.data('validation-result') === true, "Simple email address passed.");
    resetInputValidation();

    $input.val('medium.complexity@email.address').validateInput();
    assert.ok($input.data('validation-result') === true, "Medium complexity email address passed.");
    resetInputValidation();

    $input.val('very_complex.emailaddress123@email.address.com').validateInput();
    assert.ok($input.data('validation-result') === true, "High complexity email address passed.");
    resetInputValidation();

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed.");
    resetInputValidation();

    // empty value must display custom error message
    $input.val('').attr('data-error-email', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed.");
    resetInputValidation();
    $input.val('').removeAttr('data-error-email');
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
