'use strict';

const ERROR_NEGATIVE_ID = 'Pergamon: Id must be grater than 0.';
const ERROR_UPDATE = 'Pergamon: Trying to update nonexisting item.';
const ERROR_TABLE_NAME = 'Pergamon: Table name could have only alphanumerical symbols, dash and underscore.';
const ERROR_JSON_NAME = 'Pergamon: Json name could have only alphanumerical symbols, dash and underscore.';

module.exports = { ERROR_NEGATIVE_ID, ERROR_UPDATE, ERROR_TABLE_NAME, ERROR_JSON_NAME };
