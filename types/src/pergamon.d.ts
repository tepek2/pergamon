export = createPergamon;
/**
 * Create new Db
 *
 * @param {string} path - path to db folder
 */
declare function createPergamon(path: string): Pergamon;
declare namespace createPergamon {
    export { Pergamon };
}
declare class Pergamon {
    /**
     * @param {string} path - path to db folder
     */
    constructor(path: string);
    path: string;
    /** @type {Object.<string, Table>} - tables in db */
    tables: {
        [x: string]: import("./table")<any>;
    };
    /**
     * @async
     */
    init(): Promise<void>;
    /**
     * Create new json
     * @param {string} name - json name
     * @returns {Json}
     */
    createJson(name: string): import("./json")<any>;
    /**
     * Create new table
     * @param {string} name - table name
     * @returns {Table}
     */
    createTable(name: string): import("./table")<any>;
    /**
     * Delete all tables
     * @returns {Promise<void>}
     */
    deleteDb(): Promise<void>;
}
