$.fn.ValidationRule = function (rule) {
    return {
        validate: rule
    }
};

$.fn.Validator = function () {
    return {
        skip: new $.fn.ValidationRule(function () {
            return true;
        }),

        required: new $.fn.ValidationRule(function (value) {
            return typeof value != 'undefined' && value != '';
        }),

        requiredBy: $.extend(new $.fn.ValidationRule(function (value, param) {
                return $(param).length == 0 || $(param).val() == '' || (typeof value != 'undefined' && value != '');
            }), {
                withParam: true
            }
        ),

        minLength: $.extend(new $.fn.ValidationRule(function (value, param) {
                return typeof value != 'undefined' && value.length >= parseInt(param);
            }), {
                withParam: true
            }
        ),

        maxLength: $.extend(new $.fn.ValidationRule(function (value, param) {
                return typeof value != 'undefined' && value.length <= parseInt(param);
            }), {
                withParam: true
            }
        ),

        email: new $.fn.ValidationRule(function (value) {
            // TODO: implement logic here
            return false;
        }),

        telephone: $.extend(new $.fn.ValidationRule(function (value) {
                // TODO: implement logic here
                return false;
            }), {
                cleanVal: function (value) {
                    return value.replace(/[\+\-\.\s\(\),#:]/gi, '')
                }
            }
        )
    };
};

$.fn.validateInput = function () {
    var $input = $(this);

    var rules = ($input.attr('data-validate') || '').trim().replace(/[\s]{2,}/g, ' ').split(' ');

    // stop further processing
    if (rules[0] == '' || rules[0] == 'skip') {
        return true;
    }

    var inputName = $input.attr('id') || $input.attr('name');
    var inputValue = $input.val().trim();
    var isValid = true;
    var errorMessage = null;
    var Validator = new $.fn.Validator();

    for (var i = 0; i < rules.length && isValid; i++) {
        var rule = rules[i], param;

        if (rule == 'optional' && inputValue == '') {
            break;
        }

        if (typeof Validator[rule] != 'undefined') {

            // rule needs further cleanliness of value
            if (typeof Validator[rule].cleanVal == 'function') {
                inputValue = Validator[rule].cleanVal(inputValue);
            }

            // treat next rule as a parameter for current rule
            if (Validator[rule].withParam) {
                param = rules[++i];
            }

            // validate the input for current rule
            if (!Validator[rule].validate(inputValue, param)) {
                isValid = false;
                errorMessage = ($input.attr('data-error-' + rule) || $input.attr('data-error') || '');
            }
        }
    }

    $input.val(inputValue);
    $input.attr('data-is-valid', isValid);
    $input.trigger('validation:end', [$input, inputValue, isValid, errorMessage]);

    var dependent = $('[data-validate*="requiredBy #' + $input.attr('id') + '"]');
    if (dependent.length > 0 && (inputName != dependent.attr('id') || dependent.attr('name'))) {
        dependent.validateInput();
    }

    return isValid;
};


$(window).load(function () {
    $('body').on('blur', '[data-validate]', function() {
        $(this).validateInput();
    });

    /**
     * Dummy behaviour on validation
     */
    $('body').on('validation:end', '[data-validate]', function(event, input, value, isValid, errorMessage) {
        input.next('span').remove();

        if (!isValid) {
            input.after('<span style="color:red;">' + errorMessage + '</span>');
            input.css({"border": "1px solid red"});
        }
        else {
            input.after('<span style="color:green;">data is valid</span>');
            input.css({"border": "1px solid green"});
        }
    });
});