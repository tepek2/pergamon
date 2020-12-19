'use strict';

const Path = require('path');
const { deleteFolder, exists, createTempFolder, createFsStructure } = require('utils-helpers').fs;
const { pergamonStructure } = require('./structure');
const Pergamon = require('../src/pergamon');

describe('test pergamon', () => {
    describe('test basic workflow with pergamon', () => {
        let tempFolder = '';
        beforeAll(async () => {
            tempFolder = await createTempFolder('pergamon');
            await createFsStructure(tempFolder, pergamonStructure);
        });

        afterAll(async () => {
            await deleteFolder(tempFolder);
        });

        it('should crate two databases', async () => {
            const db1 = Pergamon(Path.join(tempFolder, 'db1'));
            await db1.init();
            const db2 = Pergamon(Path.join(tempFolder, 'db2'));
            await db2.init();

            const db1Table1Data = { id: 0, data: 'db1_table1' };
            const db1Table1 = db1.createTable('table1');
            await db1Table1.insert(db1Table1Data);

            const db1Table2Data = { id: 0, data: 'db1_table2' };
            const db1Table2 = db1.createTable('table2');
            await db1Table2.insert(db1Table2Data);

            const db2Table1Data = { id: 0, data: 'db2_table1' };
            const db2Table1 = db2.createTable('table1');
            await db2Table1.insert(db2Table1Data);

            const db2Table2Data = { id: 0, data: 'db2_table2' };
            const db2Table2 = db2.createTable('table2');
            await db2Table2.insert(db2Table2Data);

            await db1Table1.drop();

            await db2.deleteDb();

            expect(await exists(db2Table1.getTablePath())).toBeFalsy();
            expect(await exists(db2Table2.getTablePath())).toBeFalsy();

            await db2Table1.insert(db2Table1Data);

            expect(await db2Table1.get(0)).toMatchObject(db2Table1Data);
        });

        it('should load database', async () => {
            const dbPath = Path.join(tempFolder, 'data', 'db');
            const data = { id: 0, data: 'data' };

            const db = Pergamon(dbPath);
            await db.init();

            const table = db.createTable('table');

            expect(await table.get(0)).toMatchObject(data);
        });
    });
});
