(function ($) {

    $.fn.ValidationRule = function (rule) {
        return {
            validate: rule
        };
    };

    $.fn.Validator = function () {
        var This = {
            required: new $.fn.ValidationRule(function (value) {
                return typeof value !== 'undefined' && value !== '';
            }),

            requiredBy: $.extend(new $.fn.ValidationRule(function (value, param) {
                    return $(param).length === 0 || $(param).val() === '' || (typeof value !== 'undefined' && value !== '');
                }), {
                    withParam: true
                }
            ),

            numeric: $.extend(new $.fn.ValidationRule(function (value) {
                    return typeof value !== 'undefined' && /^\d+$/.test(value);
                }), {
                    cleanVal: function (value) {
                        return value.replace(/[^\w]/gi, '');
                    }
                }
            ),

            min: $.extend(new $.fn.ValidationRule(function (value, param) {
                    if (!This.numeric.validate(param)) {
                        throw new Error("Parameter '" + param + "' for validation rule 'min' is not a valid integer");
                    }
                    return This.numeric.validate(value) && parseInt(value) >= parseInt(param);
                }), {
                    withParam: true,
                    cleanVal: function (value) {
                        return This.numeric.cleanVal(value);
                    }
                }
            ),

            max: $.extend(new $.fn.ValidationRule(function (value, param) {
                    if (!This.numeric.validate(param)) {
                        throw new Error("Parameter " + param + " for validation rule 'max' is not a valid integer");
                    }
                    return This.numeric.validate(value) && value <= parseInt(param);
                }), {
                    withParam: true,
                    cleanVal: function (value) {
                        return This.numeric.cleanVal(value);
                    }
                }
            ),

            range: $.extend(new $.fn.ValidationRule(function (value, param) {
                    var ranges = param.split('..');
                    if (ranges.length != 2 || !This.numeric.validate(ranges[0]) || !This.numeric.validate(ranges[0])) {
                        throw new Error("Parameter '" + param + "' for validation rule 'range' is not a valid range format: 1..10");
                    }
                    return This.numeric.validate(value) && This.min.validate(value, ranges[0]) && This.max.validate(value, ranges[1]);
                }), {
                    withParam: true,
                    cleanVal: function (value) {
                        return This.numeric.cleanVal(value);
                    }
                }
            ),

            number: $.extend(new $.fn.ValidationRule(function (value) {
                    return /^[\-]?[\d]+(,|\.[\d]+)?$/.test(value) // no thousands separator
                        || /^[\-]?[\d]{1,3}(,[\d]{3})*(\.[\d]+)?$/.test(value) // comma-separated thousands
                        || /^[\-]?[\d]{1,3}(\.[\d]{3})*(,[\d]+)?$/.test(value); // dot-separated thousands
                }), {
                    cleanVal: function (value) {
                        return value.replace(/[^\w\.\,\-]/gi, '');
                    }
                }
            ),

            minLength: $.extend(new $.fn.ValidationRule(function (value, param) {
                    if (!This.numeric.validate(param)) {
                        throw new Error("Parameter " + param + " for validation rule 'minLength' is not a valid integer!");
                    }
                    return typeof value !== 'undefined' && value.length >= parseInt(param);
                }), {
                    withParam: true
                }
            ),

            maxLength: $.extend(new $.fn.ValidationRule(function (value, param) {
                    if (!This.numeric.validate(param)) {
                        throw new Error("Parameter " + param + " for validation rule 'maxLength' is not a valid integer!");
                    }
                    return typeof value !== 'undefined' && value.length <= parseInt(param);
                }), {
                    withParam: true
                }
            ),

            email: $.extend(new $.fn.ValidationRule(function (value) {
                    // W3C compliant: http://www.w3.org/TR/html-markup/input.email.html
                    var emailRegex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
                    return typeof value !== 'undefined' && emailRegex.test(value);
                }), {
                    cleanVal: function (value) {
                        return value.trim();
                    }
                }
            ),

            telephone: $.extend(new $.fn.ValidationRule(function (value) {
                    // TODO: implement logic here
                    return false;
                }), {
                    cleanVal: function (value) {
                        return value.replace(/[\+\-\.\s\(\),#:]/gi, '');
                    }
                }
            )
        };

        return This;
    };

    $.fn.validateInput = function () {
        var $input = $(this);

        var rules = ($input.attr('data-validate') || '').trim().replace(/[\s]{2,}/g, ' ').split(' ');

        var inputName = $input.attr('id') || $input.attr('name');
        var inputValue = $input.val().trim();
        var isValid = true;
        var errorMessage = null;
        var Validator = new $.fn.Validator();

        for (var i = 0; i < rules.length && isValid; i++) {
            var rule = rules[i], param;

            // stop further processing
            if (rule === '' || rule === 'skip' || (rule === 'optional' && inputValue === '')) {
                break;
            }

            if (typeof Validator[rule] !== 'undefined') {

                // rule needs further cleanliness of value
                if (typeof Validator[rule].cleanVal === 'function') {
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
        if (dependent.length > 0 && (inputName !== dependent.attr('id') || dependent.attr('name'))) {
            dependent.validateInput();
        }

        return isValid;
    };


    $(window).load(function () {
        $('body').on('blur', '[data-validate]', function () {
            $(this).validateInput();
        });
    });

})(jQuery);
