(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ObjectExtender = function() {
    for (var i = 1; i < arguments.length; i++) {
        for (var key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) {
                arguments[0][key] = arguments[i][key];
            }
        }
    }
    return arguments[0];
};

module.exports = ObjectExtender;
},{}],2:[function(require,module,exports){
var ValidationRule = function (rule) {
    return {
        validate: rule,
        withParam: false,
        objectParam: false
    };
};

module.exports = ValidationRule;
},{}],3:[function(require,module,exports){
var ObjectExtender = require('./ObjectExtender');
var ValidationRule = require('./ValidationRule');

var Validator = function () {
    var This = {
        required: ObjectExtender({}, ValidationRule(function (value) {
                return typeof value !== 'undefined' && value !== '';
            })
        ),

        requiredBy: ObjectExtender({}, ValidationRule(function (value, $param) {
                return $param.length === 0 || $param.val() === '' || (typeof value !== 'undefined' && value !== '');
            }), {
                withParam: true,
                objectParam: true
            }
        ),

        numeric: ObjectExtender({}, ValidationRule(function (value) {
                return typeof value !== 'undefined' && /^\d+$/.test(value);
            }), {
                cleanVal: function (value) {
                    return value.replace(/[^\w]/gi, '');
                }
            }
        ),

        integer: ObjectExtender({}, ValidationRule(function (value) {
                return value == parseInt(value);
            }), {
                cleanVal: function (value) {
                    return value.replace(/[^\w\-]/gi, '');
                }
            }
        ),

        min: ObjectExtender({}, ValidationRule(function (value, param) {
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

        max: ObjectExtender({}, ValidationRule(function (value, param) {
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

        range: ObjectExtender({}, ValidationRule(function (value, param) {
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

        number: ObjectExtender({}, ValidationRule(function (value) {
                return /^[\-]?[\d]+((,|\.)[\d]+)?$/.test(value) || // no thousands separator, optional fraction
                    /^[\-]?[\d]{1,3}(,[\d]{3})*(\.[\d]+)?$/.test(value) || // comma-separated thousands, dot-fraction
                    /^[\-]?[\d]{1,3}(\.[\d]{3})*(,[\d]+)?$/.test(value); // dot-separated thousands, comma-fraction
            }), {
                cleanVal: function (value) {
                    return value.replace(/[^\w\.\,\-]/gi, '');
                }
            }
        ),

        minLength: ObjectExtender({}, ValidationRule(function (value, param) {
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

        maxLength: ObjectExtender({}, ValidationRule(function (value, param) {
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

        email: ObjectExtender({}, ValidationRule(function (value) {
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

module.exports = Validator();
},{"./ObjectExtender":1,"./ValidationRule":2}],4:[function(require,module,exports){
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


    $(window).load(function () {
        $('body').on('blur', '[data-validate]', function () {
            $(this).validateInput();
        });
    });

})(jQuery);

},{"./modules/Validator":3}]},{},[4]);
