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

            integer: $.extend(new $.fn.ValidationRule(function (value) {
                    return value == parseInt(value);
                }), {
                    cleanVal: function (value) {
                        return value.replace(/[^\w\-]/gi, '');
                    }
                }
            ),

            min: $.extend(new $.fn.ValidationRule(function (value, param) {
                    return This.integer.validate(value) && parseInt(value) >= parseInt(param);
                }), {
                    withParam: true,
                    cleanVal: function (value, param) {
                        if (typeof param != 'undefined' && !This.integer.validate(param)) {
                            throw new Error("Parameter '" + param + "' for validation rule 'min' is not a valid integer.");
                        }
                        return This.integer.cleanVal(value);
                    }
                }
            ),

            max: $.extend(new $.fn.ValidationRule(function (value, param) {
                    return This.integer.validate(value) && parseInt(value) <= parseInt(param);
                }), {
                    withParam: true,
                    cleanVal: function (value, param) {
                        if (typeof param != 'undefined' && !This.integer.validate(param)) {
                            throw new Error("Parameter " + param + " for validation rule 'max' is not a valid integer.");
                        }
                        return This.integer.cleanVal(value);
                    }
                }
            ),

            range: $.extend(new $.fn.ValidationRule(function (value, param) {
                    var ranges = param.split('..');
                    return This.integer.validate(value) && This.min.validate(value, ranges[0]) && This.max.validate(value, ranges[1]);
                }), {
                    withParam: true,
                    cleanVal: function (value, param) {
                        if (typeof param != 'undefined' && param) {
                            var ranges = param.split('..');
                            if (ranges.length != 2 || !This.integer.validate(ranges[0]) || !This.integer.validate(ranges[1])) {
                                throw new Error("Parameter '" + param + "' for validation rule 'range' is not a valid range format: 1..10");
                            }
                        }
                        return This.integer.cleanVal(value);
                    }
                }
            ),

            number: $.extend(new $.fn.ValidationRule(function (value) {
                    return /^[\-]?[\d]+((,|\.)[\d]+)?$/.test(value) || // no thousands separator, optional fraction
                        /^[\-]?[\d]{1,3}(,[\d]{3})*(\.[\d]+)?$/.test(value) || // comma-separated thousands, dot-fraction
                        /^[\-]?[\d]{1,3}(\.[\d]{3})*(,[\d]+)?$/.test(value); // dot-separated thousands, comma-fraction
                }), {
                    cleanVal: function (value) {
                        return value.replace(/[^\w\.\,\-]/gi, '');
                    }
                }
            ),

            minLength: $.extend(new $.fn.ValidationRule(function (value, param) {
                    return typeof value !== 'undefined' && value.length >= parseInt(param);
                }), {
                    withParam: true,
                    cleanVal: function (value, param) {
                        if (typeof param != 'undefined' && !This.integer.validate(param)) {
                            throw new Error("Parameter " + param + " for validation rule 'minLength' is not a valid integer.");
                        }
                        return value.trim();
                    }
                }
            ),

            maxLength: $.extend(new $.fn.ValidationRule(function (value, param) {
                    return typeof value !== 'undefined' && value.length <= parseInt(param);
                }), {
                    withParam: true,
                    cleanVal: function (value, param) {
                        if (typeof param != 'undefined' && !This.integer.validate(param)) {
                            throw new Error("Parameter " + param + " for validation rule 'maxLength' is not a valid integer.");
                        }
                        return value.trim();
                    }
                }
            ),

            email: $.extend(new $.fn.ValidationRule(function (value) {
                    // "practical implementation of RFC 5322": http://www.regular-expressions.info/email.html
                    var emailRegex = new RegExp(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
                    return typeof value !== 'undefined' && emailRegex.test(value);
                }), {
                    cleanVal: function (value) {
                        return value.trim();
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
            var validationRule = Validator[rule] || window[rule] || null;

            if (validationRule === null) {
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
            if (validationRule.withParam === true) {
                i++;
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


    $(window).load(function () {
        $('body').on('blur', '[data-validate]', function () {
            $(this).validateInput();
        });
    });

})(jQuery);
