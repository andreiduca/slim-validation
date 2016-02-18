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