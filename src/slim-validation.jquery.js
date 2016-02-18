var Validator = require('./modules/Validator');

(function ($) {
    'use strict';

    $.fn.validateInput = function () {
        var $input = $(this);

        var rules = ($input.attr('data-validate') || '').trim().replace(/[\s]{2,}/g, ' ').split(' ');

        var inputName = $input.attr('id') || $input.attr('name');
        var inputValue = $input.val().trim();
        var isValid = true;
        var errorMessage = null;

        for (var i = 0; i < rules.length && isValid; i++) {
            var rule = rules[i];
            var param = (rules[i+1] ? rules[i+1] : null);

            if (rule === '' || rule === 'skip' || (rule === 'optional' && inputValue === '')) {
                // stop further processing
                break;
            }
            else if (rule === 'optional') {
                // go to the next rule
                continue;
            }

            // try either a plugin-defined validation rule or a custom global-scope validation rule
            var validationRule = Validator[rule] || null;

            if (validationRule === null) {
                if (typeof window[rule] === 'function') {
                    isValid = window[rule](inputValue);
                    continue;
                }

                if (console && console.warn) {
                    console.warn("Validation rule '" + rule + "' is not defined.");
                }
                continue;
            }

            // rule needs further cleanliness of value
            if (typeof validationRule.cleanVal === 'function') {
                inputValue = validationRule.cleanVal(inputValue, param);
            }

            // treat next rule as a parameter for current rule
            if (validationRule.withParam) {
                i++;
            }

            // send parameter as jQuery object wrapper
            if (validationRule.objectParam) {
                param = $(param);
            }

            // validate the input for current rule
            isValid = validationRule.validate(inputValue, param);

            if (!isValid) {
                errorMessage = ($input.attr('data-error-' + rule) || $input.attr('data-error') || '');
            }
        }

        $input.val(inputValue); // TODO: exclude select, checkbox, radio and password input fields from this
        $input.attr('data-is-valid', isValid);
        $input.trigger('validation:end', [$input, inputValue, isValid, errorMessage]);

        var dependent = $('[data-validate*="requiredBy #' + $input.attr('id') + '"]');
        if (dependent.length > 0 && (inputName !== dependent.attr('id') || dependent.attr('name'))) {
            dependent.validateInput();
        }

        return isValid;
    };


    $.fn.validateForm = function () {
        var $form = $(this);

        var isValid = true;
        var $firstErrorInput = null;

        // validate each field in current form
        $form.find('[data-validate]').each(function () {
            if (!$(this).validateInput()) {
                isValid = false;

                if ($firstErrorInput === null) {
                    $firstErrorInput = $(this);
                }
            }
        });

        $form.trigger('validation:form', [$form, isValid, $firstErrorInput]);

        return isValid;
    };

    $(window).load(function () {
        $('body').on('blur', '[data-validate]', function () {
            $(this).validateInput();
        });
    });

})(jQuery);
