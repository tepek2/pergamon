'use strict';

const { createFile, readFile, rewriteFile } = require('utils-helpers').fs;

/**
 * @template T
 */
class Json {
    /**
     * @constructor
     * @param {string} path - path to json file
     */
    constructor (path) {
        this.path = path;
    }

    /**
     * @async
     */
    async init () {
        await createFile(this.path);
    }

    /**
     * Save data
     * @returns {Promise<void>}
     */
    save () {
        return rewriteFile(this.path, JSON.stringify(this.data));
    }

    /**
     * Load data from file (!!Clear all unsaved changes!!)
     * @async
     * @returns {Promise<T>}
     */
    async load () {
        /**
         * @type {T}
         */
        this.data = JSON.parse(await readFile(this.path));
        return this.data;
    }

    /**
     * Check if file name could be name of a json file
     * @param {string} name - table name
     */
    static isJsonFileName (name) {
        return RegExp(/^[a-zA-Z0-9/_/-]+\.db\.json$/).test(name);
    }
}

module.exports = Json;
