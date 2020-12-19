'use strict';

const { createFile, deleteFile } = require('utils-helpers').fs;
const { getItem, filterItems, updateItem, deleteItem, insertItem, setItem } = require('./data-functions');

/**
 * @template T
 */
class Table {
    /**
     * @constructor
     * @param {string} path - path to table file
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
     * Get item by id
     * @param {number} id - item id
     * @returns {Promise<T|null>}
     */
    get (id) {
        return getItem(this.path, id);
    }

    /**
     * Return items matching filter function
     * @param {(item: T) => boolean} filterFc - filter function
     * @returns {Promise<T[]>}
     */
    filter (filterFc) {
        return filterItems(this.path, filterFc);
    }

    /**
     * Update item with data
     * @param {number} id - id of the item to update
     * @param {T} data - data to update
     * @returns {Promise<void>}
     */
    update (id, data) {
        return updateItem(this.path, id, data);
    }

    /**
     * Set data fo the item
     * @param {number} id - id fo the item to set
     * @param {T} data - data to set
     * @returns {Promise<void>}
     */
    set (id, data) {
        return setItem(this.path, id, data);
    }

    /**
     * Delete item by id
     * @param {number} id - id of the item
     * @returns {Promise<void>}
     */
    delete (id) {
        return deleteItem(this.path, id);
    }

    /**
     * Insert data into table and returns id of the new item
     * @param {T} data - data
     * @returns {Promise<number>}
     */
    insert (data) {
        return insertItem(this.path, data);
    }

    /**
     * Return path to table file
     * @returns {string}
    */
    getTablePath () {
        return this.path;
    }

    /**
     * Delete table
     * @returns {Promise<void>}
     */
    drop () {
        deleteFile(this.path);
    }

    /**
     * Check if file name could be name of a table file
     * @param {string} name - table name
     */
    static isTableFileName (name) {
        return RegExp(/^[a-zA-Z0-9/_/-]+\.db\.txt$/).test(name);
    }

    /**
     * Extract table name from file name
     * @param {string} fileName - table file name
     * @returns {string}
     */
    static getTableNameFromFileName (fileName) {
        return fileName.split('.')[0];
    }
}

module.exports = Table;
