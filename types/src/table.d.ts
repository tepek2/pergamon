export = Table;
declare class Table {
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
     * @template T
     * @param {number} id - item id
     * @returns {Promise<T|null>}
     */
    get<T>(id: number): Promise<T | null>;
    /**
     * Return items matching filter function
     * @template T
     * @param {(item: T) => boolean} filterFc - filter function
     * @returns {Promise<T[]>}
     */
    filter<T_2>(filterFc: (item: T_2) => boolean): Promise<T_2[]>;
    /**
     * Update item with data
     * @template T
     * @param {number} id - id of the item to update
     * @param {T} data - data to update
     * @returns {Promise<void>}
     */
    update<T_4>(id: number, data: T_4): Promise<void>;
    /**
     * Set data fo the item
     * @template T
     * @param {number} id - id fo the item to set
     * @param {T} data - data to set
     * @returns {Promise<void>}
     */
    set<T_5>(id: number, data: T_5): Promise<void>;
    /**
     * Delete item by id
     * @param {number} id - id of the item
     * @returns {Promise<void>}
     */
    delete(id: number): Promise<void>;
    /**
     * Insert data into table and returns id of the new item
     * @template T
     * @param {T} data - data
     * @returns {Promise<number>}
     */
    insert<T_6>(data: T_6): Promise<number>;
    /**
     * Return path to table file
     * @returns {string}
    */
    getTablePath(): string;
    /**
     * Delete table
     * @returns {Promise<void>}
     */
    deleteTable(): Promise<void>;
}
