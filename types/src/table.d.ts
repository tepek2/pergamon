export = Table;
/**
 * @template T
 */
declare class Table<T> {
    /**
     * Check if file name could be name of a table file
     * @param {string} name - table name
     */
    static isTableFileName(name: string): boolean;
    /**
     * Extract table name from file name
     * @param {string} fileName - table file name
     * @returns {string}
     */
    static getTableNameFromFileName(fileName: string): string;
    /**
     * @constructor
     * @param {string} path - path to table file
     */
    constructor(path: string);
    path: string;
    /**
     * @async
     */
    init(): Promise<void>;
    /**
     * Get item by id
     * @param {number} id - item id
     * @returns {Promise<T|null>}
     */
    get(id: number): Promise<T | null>;
    /**
     * Return items matching filter function
     * @param {(item: T) => boolean} filterFc - filter function
     * @returns {Promise<T[]>}
     */
    filter(filterFc: (item: T) => boolean): Promise<T[]>;
    /**
     * Update item with data
     * @param {number} id - id of the item to update
     * @param {T} data - data to update
     * @returns {Promise<void>}
     */
    update(id: number, data: T): Promise<void>;
    /**
     * Set data fo the item
     * @param {number} id - id fo the item to set
     * @param {T} data - data to set
     * @returns {Promise<void>}
     */
    set(id: number, data: T): Promise<void>;
    /**
     * Delete item by id
     * @param {number} id - id of the item
     * @returns {Promise<void>}
     */
    delete(id: number): Promise<void>;
    /**
     * Insert data into table and returns id of the new item
     * @param {T} data - data
     * @returns {Promise<number>}
     */
    insert(data: T): Promise<number>;
    /**
     * Return path to table file
     * @returns {string}
    */
    getTablePath(): string;
    /**
     * Delete table
     * @returns {Promise<void>}
     */
    drop(): Promise<void>;
}
