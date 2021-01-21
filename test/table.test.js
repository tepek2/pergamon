'use strict';

const Path = require('path');
const { exists, createTempFolder, deleteFolder, createFsStructure } = require('utils-helpers/src/fs');

const { dataFunctionsStructure } = require('./structure');
const Table = require('../src/table');

describe('test table functionality', () => {
    describe('test createTable', () => {
        let tempFolder = '';

        beforeAll(async () => {
            tempFolder = await createTempFolder('table');
            await createFsStructure(tempFolder, dataFunctionsStructure);
        });

        afterAll(async () => {
            await deleteFolder(tempFolder);
        });

        it('should create table, do operations with data and delete table', async () => {
            const newTable = Path.join(tempFolder, 'new-table.txt');
            const testData = { data: 'something' };

            const table = new Table(newTable);
            await table.init();
            expect(await exists(newTable)).toBeTruthy();

            const id = await table.insert(testData);
            expect(await table.get(id)).toMatchObject({ ...testData, id });

            const newData = { data: 'somethingNew' };
            await table.update(id, newData);
            expect(await table.get(id)).toMatchObject({ ...newData, id });

            await table.drop();
            expect(await exists(table.path)).toBeFalsy();

            const newTableId = await table.insert(testData);
            expect(newTableId).toBe(id);
            expect(await table.get(newTableId)).toMatchObject({ ...testData, id: newTableId });
        });

        it('should filter items', async () => {
            const table = new Table(Path.join(tempFolder, 'data', 'data-functions.txt'));
            await table.init();

            const items = await table.filter((item) => item.id >= 0);
            expect(items).toHaveLength(4);

            const items2 = await table.filter((item) => item.data === 'test');
            expect(items2).toHaveLength(2);
        });

        it('should return path to table file', async () => {
            const dataFilePath = Path.join(tempFolder, 'data', 'data-functions.txt');
            const table = new Table(dataFilePath);
            await table.init();

            expect(table.getTablePath()).toMatch(dataFilePath);
        });
    });

    describe('test isTableFileName', () => {
        it('should check if name is possible for table name', () => {
            expect(Table.isTableFileName('abcd.db.txt')).toBeTruthy();
            expect(Table.isTableFileName('ABcd.db.txt')).toBeTruthy();
            expect(Table.isTableFileName('AB-cd.db.txt')).toBeTruthy();
            expect(Table.isTableFileName('AB_cd.db.txt')).toBeTruthy();
            expect(Table.isTableFileName('AB_cd2.db.txt')).toBeTruthy();
            expect(Table.isTableFileName('0AB_cd2.db.txt')).toBeTruthy();
            expect(Table.isTableFileName('0AB_cd-2.db.txt')).toBeTruthy();

            expect(Table.isTableFileName('abcd')).toBeFalsy();
            expect(Table.isTableFileName('abcd.txt')).toBeFalsy();
            expect(Table.isTableFileName('abcd.db')).toBeFalsy();
            expect(Table.isTableFileName('abcd.db.txt.cd')).toBeFalsy();
            expect(Table.isTableFileName('ab.cd.db.txt')).toBeFalsy();
        });
    });

    describe('test getTableNameFromFileName', () => {
        it('should return table name', () => {
            expect(Table.getTableNameFromFileName('abcd.db.txt')).toMatch('abcd');
            expect(Table.getTableNameFromFileName('0AB_cd-2.db.txt')).toMatch('0AB_cd-2');
        });
    });
});
