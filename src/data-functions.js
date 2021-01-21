'use strict';

const { getLine, readLines, updateLine, getLineCount, appendFile, checkENOENT } = require('utils-helpers/src/fs');
const { ERROR_UPDATE, ERROR_NEGATIVE_ID } = require('./errors');

/**
 * Get item from file by id
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {number} id - item id
 * @returns {Promise<T|null>}
 */
const getItem = async (path, id) => {
    if (id < 0) {
        throw new Error(ERROR_NEGATIVE_ID);
    }
    const strItem = await getLine(path, id);
    return JSON.parse(strItem);
};

/**
 * Returns items matching filter function
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {(item: T) => boolean} filterFc - filter function
 * @returns {Promise<T[]>}
 */
const filterItems = async (path, filterFc) => {
    const { lines } = readLines(path);

    const result = [];
    for await (const line of lines) {
        const item = JSON.parse(line);

        try {
            if (filterFc(item)) {
                result.push(item);
            }
        } catch (err) {
            // pass
        }
    }

    return result;
};

/**
 * Update item
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {number} id - number of the line (id of the item)
 * @param {T} item - data to update
 */
const updateItem = async (path, id, item) => {
    delete item.id;

    const oldItem = await getItem(path, id);
    if (oldItem === null) {
        throw new Error(ERROR_UPDATE);
    }
    const strItem = JSON.stringify({ ...oldItem, ...item });
    await updateLine(path, id, strItem);
};

/**
 * Set item to
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {number} id - number of the line (id of the item)
 * @param {T} item - new data to set
 */
const setItem = async (path, id, item) => {
    item.id = id;
    const strItem = JSON.stringify(item);
    await updateLine(path, id, strItem);
};

/**
 * Delete item (set line to null)
 *
 * @async
 * @param {string} path - path to file
 * @param {number} id - number of the line (id of the item)
 */
const deleteItem = async (path, id) => {
    await updateLine(path, id, 'null');
};

/**
 * Generate new id (new line number)
 *
 * @async
 * @param {string} path - path to file
 * @returns {Promise<number>}
 */
const getNewId = async (path) => {
    try {
        return await getLineCount(path);
    } catch (err) {
        checkENOENT(err);
        return 0;
    }
};

/**
 * Insert new item
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {T} item - new item
 * @returns {Promise<number>}
 */
const insertItem = async (path, item) => {
    const id = await getNewId(path);

    const strItem = JSON.stringify({ ...item, id });

    await appendFile(path, `${strItem}\n`);
    return id;
};

module.exports = {
    getItem,
    filterItems,
    updateItem,
    setItem,
    deleteItem,
    insertItem
};
