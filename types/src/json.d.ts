export = Json;
/**
 * @template T
 */
declare class Json<T> {
    /**
     * Check if file name could be name of a json file
     * @param {string} name - table name
     */
    static isJsonFileName(name: string): boolean;
    /**
     * @constructor
     * @param {string} path - path to json file
     */
    constructor(path: string);
    path: string;
    init(): void;
    /**
     * Save data
     * @returns {Promise<void>}
     */
    save(): Promise<void>;
    /**
     * Load data from file (!!Clear all unsaved changes!!)
     * @async
     * @returns {Promise<T>}
     */
    load(): Promise<T>;
    /**
     * @type {T}
     */
    data: T | undefined;
}
