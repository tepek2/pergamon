'use strict';

const Path = require('path');
const { createPath, deleteFolder } = require('utils-helpers').fs;
const Table = require('./table');
const Json = require('./json');
const { ERROR_TABLE_NAME, ERROR_JSON_NAME } = require('./errors');

/**
 * Create path for table file
 *
 * @param {string} tableName - table name
 * @param {string} dbPath - path to db folder
 * @returns {string}
 */
const tablePath = (tableName, dbPath) => {
    const tableFileName = `${tableName}.db.txt`;
    if (!Table.isTableFileName(tableFileName)) {
        throw new Error(ERROR_TABLE_NAME);
    }
    return Path.join(dbPath, tableFileName);
};

/**
 * Create path for json file
 *
 * @param {string} name - json name
 * @param {string} dbPath - path to db folder
 * @returns {string}
 */
const jsonPath = (name, dbPath) => {
    const jsonFileName = `${name}.db.json`;
    if (!Json.isJsonFileName(jsonFileName)) {
        throw new Error(ERROR_JSON_NAME);
    }
    return Path.join(dbPath, jsonFileName);
};

class Pergamon {
    /**
     * @param {string} path - path to db folder
     */
    constructor (path) {
        this.path = path;
        /** @type {Object.<string, Table>} - tables in db */
        this.tables = {};
    }

    /**
     * @async
     */
    async init () {
        await createPath(this.path);
    }

    /**
     * Create new json
     * @param {string} name - json name
     * @returns {Json}
     */
    createJson (name) {
        const json = new Json(jsonPath(name, this.path));
        json.init().then();
        return json;
    }

    /**
     * Create new table
     * @param {string} name - table name
     * @returns {Table}
     */
    createTable (name) {
        const table = new Table(tablePath(name, this.path));
        table.init().then();
        return table;
    }

    /**
     * Delete all tables
     * @returns {Promise<void>}
     */
    deleteDb () {
        return deleteFolder(this.path);
    }
}

/**
 * Create new Db
 *
 * @param {string} path - path to db folder
 */
const createPergamon = (path) => {
    return new Pergamon(path);
};

module.exports = createPergamon;
module.exports.Pergamon = Pergamon;
