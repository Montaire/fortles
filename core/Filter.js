const {__} = require('../addon/i18n');
module.exports = {
    DATE: /.+/,
    STRING:  /.+/,
    NUMBER:  /\d+/,
    BOOLEAN:  /[01]/,
    REQUIRE_ARRAY: 1,
    INVALID_MESSAGE: __("Invalid value"),
    EMPTY_MESSAGE: __("Field is required")
};