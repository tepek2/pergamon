'use strict';

const { syncify } = require('./utils');
const { getItem, filterItems, updateItem, setItem, deleteItem, insertItem } = require('../src/data-functions');
const { copyFile, deleteFile, getLineCount } = require('../src/utils/fs-utils');
const { ERROR_UPDATE, ERROR_NEGATIVE_ID } = require('../src/errors');

describe('test data functions', () => {
    const dataFile = './test/data/data-functions.txt';

    describe('test getItem', () => {
        it('should get item by id', async () => {
            const item = await getItem(dataFile, 0);
            expect(item).toMatchObject({ id: 0, data1: 'something' });
        });

        it('should return null for nonexisting item', async () => {
            const item = await getItem(dataFile, 4);
            expect(item).toBe(null);
        });

        it('should throw exception', async () => {
            expect(await syncify(() => getItem(dataFile, -1))).toThrow(ERROR_NEGATIVE_ID);
        });
    });

    describe('test filterItems', () => {
        it('should return matching items', async () => {
            const items = await filterItems(dataFile, (item) => { return [1, 2].includes(item.id); });
            expect(items.length).toBe(2);
            expect(items[0].data1).toMatch('somethingOther');
        });

        it('should return empty array', async () => {
            const items = await filterItems(dataFile, (item) => { return item.id > 10; });
            expect(items).toHaveLength(0);
        });

        it('should not raise exception on nonexisting field', async () => {
            expect(await filterItems(dataFile, (item) => { return item.ids === 1; })).toHaveLength(0);
            expect(await filterItems(dataFile, (item) => { return item.ids.id === 1; })).toHaveLength(0);
        });
    });

    describe('test updateItem', () => {
        const copiedData = './test/data/data-functions-copy-update.txt';

        beforeAll(async () => {
            await copyFile(dataFile, copiedData);
        });

        afterAll(async () => {
            await deleteFile(copiedData);
        });

        it('should update item and not change id', async () => {
            const id = 1;
            const data = { id: 0, data1: 'something' };

            await updateItem(copiedData, id, data);
            const item = await getItem(copiedData, id);
            expect(item).toMatchObject(data);
        });

        it('should update item', async () => {
            const id = 2;
            const newData = 'newData';

            const item = await getItem(copiedData, id);
            await updateItem(copiedData, id, { newData });

            expect(await getItem(copiedData, id)).toMatchObject({ ...item, newData });
        });

        it('should raise error, trying to update nonexisting item', async () => {
            expect(await syncify(() => updateItem(copiedData, 10, { data: 'something' }))).toThrow(ERROR_UPDATE);
        });

        it('should raise error, trying to update deleted item', async () => {
            await deleteItem(copiedData, 4);
            expect(await syncify(() => updateItem(copiedData, 4, { data: 'something' }))).toThrow(ERROR_UPDATE);
        });

        it('should be impossible to update id', async () => {
            const newText = 'newText';
            const item3 = await getItem(copiedData, 3);
            await updateItem(copiedData, 2, { id: 3, data1: newText });

            expect(await getItem(copiedData, 2)).toMatchObject({ id: 2, data1: newText });
            expect(await getItem(copiedData, 3)).toMatchObject(item3);
        });
    });

    describe('test setItem', () => {
        const copiedData = './test/data/data-functions-copy-set.txt';

        beforeAll(async () => {
            await copyFile(dataFile, copiedData);
        });

        afterAll(async () => {
            await deleteFile(copiedData);
        });

        it('should set data', async () => {
            const id = 1;
            const newData = 'newData';

            await setItem(copiedData, id, { newData });
            expect(await getItem(copiedData, id)).toMatchObject({ id, newData });
        });
    });

    describe('test deleteItem', () => {
        const copiedData = './test/data/data-functions-copy-delete.txt';

        beforeAll(async () => {
            await copyFile(dataFile, copiedData);
        });

        afterAll(async () => {
            await deleteFile(copiedData);
        });

        it('should delete item', async () => {
            expect(await getItem(copiedData, 3)).not.toBeNull();
            await deleteItem(copiedData, 3);
            expect(await getItem(copiedData, 3)).toBeNull();
        });

        it('should not to change next items', async () => {
            await deleteItem(copiedData, 1);
            expect((await getItem(copiedData, 2)).id).toBe(2);
        });

        it('should not raise exception, when deleting nonexisting item', async () => {
            await deleteItem(copiedData, 0);
            await deleteItem(copiedData, 0);

            await deleteItem(copiedData, 10);
        });
    });

    describe('test insertItem', () => {
        const copiedData = './test/data/data-functions-copy-insert.txt';

        beforeAll(async () => {
            await copyFile(dataFile, copiedData);
        });

        afterAll(async () => {
            await deleteFile(copiedData);
        });

        it('should insert new item', async () => {
            const newData = { data1: 'newData' };
            const lineCount = await getLineCount(copiedData);
            const id = await insertItem(copiedData, newData);
            await insertItem(copiedData, { data1: 'something' });
            expect(id).toBe(lineCount);
            expect(await getItem(copiedData, id)).toMatchObject({ ...newData, id });
        });
    });
});
