'use strict';

const Path = require('path');
const { createPath, getFilsesNames, deleteFile, deleteFolder } = require('./utils/fs-utils');
const Table = require('./table');
const { ERROR_TABLE_NAME } = require('./errors');

/**
 * Create path for table file
 *
 * @param {string} tableName - table name
 * @param {*} dbPath - path to db folder
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
 * Return object with all tables
 *
 * @async
 * @param {string} path - path to db folder
 * @returns {Promise<Object.<string, Table>>}
 */
const getTables = async (path) => {
    const filesNames = await getFilsesNames(path);
    return filesNames.reduce(async (tables, fileName) => {
        if (Table.isTableFileName(fileName)) {
            const tableName = Table.getTableNameFromFileName(fileName);
            const table = new Table(Path.join(path, fileName));
            await table.init();
            return {
                ...tables,
                [tableName]: table
            };
        }
        return tables;
    }, {});
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
        this.tables = getTables(this.path);
    }

    /**
     * Create new table
     * @param {string} name - table name
     * @returns {Table}
     */
    createTable (name) {
        const table = new Table(tablePath(name, this.path));
        table.init().then();
        this.tables[name] = table;
        return table;
    }

    /**
     * Delete table
     * @async
     * @param {string} name - table name
     * @returns {Promise<void>}
     */
    async dropTable (name) {
        await deleteFile(this.tables[name].getTablePath());
        delete this.tables[name];
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
