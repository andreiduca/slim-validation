var ValidationRule = function (rule) {
    return {
        validate: rule,
        withParam: false,
        objectParam: false
    };
};

module.exports = ValidationRule;