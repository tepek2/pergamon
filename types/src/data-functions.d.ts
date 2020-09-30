/**
 * Get item from file by id
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {number} id - item id
 * @returns {Promise<T|null>}
 */
export function getItem<T>(path: string, id: number): Promise<T | null>;
/**
 * Returns items matching filter function
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {(item: T) => boolean} filterFc - filter function
 * @returns {Promise<T[]>}
 */
export function filterItems<T>(path: string, filterFc: (item: T) => boolean): Promise<T[]>;
/**
 * Update item
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {number} id - number of the line (id of the item)
 * @param {T} item - data to update
 */
export function updateItem<T>(path: string, id: number, item: T): Promise<void>;
/**
 * Set item to
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {number} id - number of the line (id of the item)
 * @param {T} item - new data to set
 */
export function setItem<T>(path: string, id: number, item: T): Promise<void>;
/**
 * Delete item (set line to null)
 *
 * @async
 * @param {string} path - path to file
 * @param {number} id - number of the line (id of the item)
 */
export function deleteItem(path: string, id: number): Promise<void>;
/**
 * Insert new item
 *
 * @async
 * @template T
 * @param {string} path - path to file
 * @param {T} item - new item
 * @returns {Promise<number>}
 */
export function insertItem<T>(path: string, item: T): Promise<number>;
