'use strict';

const { exists, deleteFile } = require('../src/utils/fs-utils');
const Table = require('../src/table');

describe('test table functionality', () => {
    describe('test createTable', () => {
        const dataFile = './test/data/data-functions.txt';
        const newTable = './test/data/new-table.txt';

        afterEach(async () => {
            await deleteFile(newTable);
        });

        it('should create table, do operations with data and delete table', async () => {
            const testData = { data: 'something' };

            const table = new Table(newTable);
            await table.init();
            expect(await exists(newTable)).toBeTruthy();

            const id = await table.insert(testData);
            expect(await table.get(id)).toMatchObject({ ...testData, id });

            const newData = { data: 'somethingNew' };
            await table.update(id, newData);
            expect(await table.get(id)).toMatchObject({ ...newData, id });

            await table.deleteTable();
            expect(await exists(newTable)).toBeFalsy();

            const newTableId = await table.insert(testData);
            expect(newTableId).toBe(id);
            expect(await table.get(newTableId)).toMatchObject({ ...testData, id: newTableId });
        });

        it('should filter items', async () => {
            const table = new Table(dataFile);
            await table.init();

            const items = await table.filter((item) => item.id >= 0);
            expect(items).toHaveLength(4);

            const items2 = await table.filter((item) => item.data === 'test');
            expect(items2).toHaveLength(2);
        });

        it('should return path to table file', async () => {
            const table = new Table(dataFile);
            await table.init();

            expect(table.getTablePath()).toMatch(dataFile);
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
