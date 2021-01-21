'use strict';

const Path = require('path');
const { syncify } = require('utils-helpers/src/utils');
const { copyFile, getLineCount, createTempFolder, createFsStructure, deleteFolder } = require('utils-helpers/src/fs');

const { getItem, filterItems, updateItem, setItem, deleteItem, insertItem } = require('../src/data-functions');
const { ERROR_UPDATE, ERROR_NEGATIVE_ID } = require('../src/errors');
const { dataFunctionsStructure } = require('./structure');

describe('test data functions', () => {
    let tempFolder = '';

    beforeAll(async () => {
        tempFolder = await createTempFolder('data-functions');
        await createFsStructure(tempFolder, dataFunctionsStructure);
    });

    afterAll(async () => {
        await deleteFolder(tempFolder);
    });

    const dataFile = Path.join('data', 'data-functions.txt');

    describe('test getItem', () => {
        it('should get item by id', async () => {
            const item = await getItem(Path.join(tempFolder, dataFile), 0);
            expect(item).toMatchObject({ id: 0, data1: 'something' });
        });

        it('should return null for nonexisting item', async () => {
            const item = await getItem(Path.join(tempFolder, dataFile), 4);
            expect(item).toBe(null);
        });

        it('should throw exception', async () => {
            expect(await syncify(() => getItem(Path.join(tempFolder, dataFile), -1))).toThrow(ERROR_NEGATIVE_ID);
        });
    });

    describe('test filterItems', () => {
        it('should return matching items', async () => {
            const items = await filterItems(Path.join(tempFolder, dataFile), (item) => { return [1, 2].includes(item.id); });
            expect(items.length).toBe(2);
            expect(items[0].data1).toMatch('somethingOther');
        });

        it('should return empty array', async () => {
            const items = await filterItems(Path.join(tempFolder, dataFile), (item) => { return item.id > 10; });
            expect(items).toHaveLength(0);
        });

        it('should not raise exception on nonexisting field', async () => {
            expect(await filterItems(Path.join(tempFolder, dataFile), (item) => { return item.ids === 1; })).toHaveLength(0);
            expect(await filterItems(Path.join(tempFolder, dataFile), (item) => { return item.ids.id === 1; })).toHaveLength(0);
        });
    });

    describe('test updateItem', () => {
        const file = 'data-functions-copy-update.txt';

        beforeAll(async () => {
            await copyFile(Path.join(tempFolder, dataFile), Path.join(tempFolder, file));
        });

        it('should update item and not change id', async () => {
            const id = 1;
            const data = { id: 0, data1: 'something' };

            await updateItem(Path.join(tempFolder, file), id, data);
            const item = await getItem(Path.join(tempFolder, file), id);
            expect(item).toMatchObject(data);
        });

        it('should update item', async () => {
            const id = 2;
            const newData = 'newData';

            const item = await getItem(Path.join(tempFolder, file), id);
            await updateItem(Path.join(tempFolder, file), id, { newData });

            expect(await getItem(Path.join(tempFolder, file), id)).toMatchObject({ ...item, newData });
        });

        it('should raise error, trying to update nonexisting item', async () => {
            expect(await syncify(() => updateItem(Path.join(tempFolder, file), 10, { data: 'something' }))).toThrow(ERROR_UPDATE);
        });

        it('should raise error, trying to update deleted item', async () => {
            await deleteItem(Path.join(tempFolder, file), 4);
            expect(await syncify(() => updateItem(Path.join(tempFolder, file), 4, { data: 'something' }))).toThrow(ERROR_UPDATE);
        });

        it('should be impossible to update id', async () => {
            const newText = 'newText';
            const item3 = await getItem(Path.join(tempFolder, file), 3);
            await updateItem(Path.join(tempFolder, file), 2, { id: 3, data1: newText });

            expect(await getItem(Path.join(tempFolder, file), 2)).toMatchObject({ id: 2, data1: newText });
            expect(await getItem(Path.join(tempFolder, file), 3)).toMatchObject(item3);
        });
    });

    describe('test setItem', () => {
        const file = 'data-functions-copy-set.txt';

        beforeAll(async () => {
            await copyFile(Path.join(tempFolder, dataFile), Path.join(tempFolder, file));
        });

        it('should set data', async () => {
            const id = 1;
            const newData = 'newData';

            await setItem(Path.join(tempFolder, file), id, { newData });
            expect(await getItem(Path.join(tempFolder, file), id)).toMatchObject({ id, newData });
        });
    });

    describe('test deleteItem', () => {
        const file = 'data-functions-copy-delete.txt';

        beforeAll(async () => {
            await copyFile(Path.join(tempFolder, dataFile), Path.join(tempFolder, file));
        });

        it('should delete item', async () => {
            expect(await getItem(Path.join(tempFolder, file), 3)).not.toBeNull();
            await deleteItem(Path.join(tempFolder, file), 3);
            expect(await getItem(Path.join(tempFolder, file), 3)).toBeNull();
        });

        it('should not to change next items', async () => {
            await deleteItem(Path.join(tempFolder, file), 1);
            expect((await getItem(Path.join(tempFolder, file), 2)).id).toBe(2);
        });

        it('should not raise exception, when deleting nonexisting item', async () => {
            await deleteItem(Path.join(tempFolder, file), 0);
            await deleteItem(Path.join(tempFolder, file), 0);

            await deleteItem(Path.join(tempFolder, file), 10);
        });
    });

    describe('test insertItem', () => {
        const file = 'data-functions-copy-insert.txt';

        beforeAll(async () => {
            await copyFile(Path.join(tempFolder, dataFile), Path.join(tempFolder, file));
        });

        it('should insert new item', async () => {
            const newData = { data1: 'newData' };
            const lineCount = await getLineCount(Path.join(tempFolder, file));
            const id = await insertItem(Path.join(tempFolder, file), newData);
            await insertItem(Path.join(tempFolder, file), { data1: 'something' });
            expect(id).toBe(lineCount);
            expect(await getItem(Path.join(tempFolder, file), id)).toMatchObject({ ...newData, id });
        });
    });
});
