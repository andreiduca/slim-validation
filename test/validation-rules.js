// shadow input to test against
var $input = $("<input>");
$input.attr('type', "text").attr('data-error', "default error message");

// set attributes to assert
$input.on('validation:end', function (event, $element, value, isValid, errorMessage) {
    $(this).data('validation-result', isValid);
    $(this).data('validation-error', errorMessage);
});


QUnit.test("rule: skip", function (assert) {
    $input.attr('data-validate', "skip required minLength 3 maxLength 6");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === true, "Skipped all validation rules.");

});

QUnit.test("rule: optional", function (assert) {
    $input.attr('data-validate', "optional minLength 3 maxLength 6");

    // empty optional value
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === true, "Empty optional value passed.");

    // not empty optional value
    $input.val('as').validateInput();
    assert.ok($input.data('validation-result') === false, "Not empty optional value checks other rules.");

});

QUnit.test("rule: required", function (assert) {

    $input.attr('data-validate', "required");

    // empty value must be invalid
    $input.val('').validateInput();
    assert.ok($input.data('validation-result') === false, "Empty value detected.");

    // not empty value must be valid
    $input.val('Hello').validateInput();
    assert.ok($input.data('validation-result') === true, "Not empty value passed");

    // empty value must display fallback error message
    $input.val('').validateInput();
    assert.ok($input.data('validation-error') === "default error message", "Default error message displayed");

    // empty value must display custom error message
    $input.val('').attr('data-error-required', 'custom error message').validateInput();
    assert.ok($input.data('validation-error') === "custom error message", "Custom error message displayed");
});