'use strict';

const Path = require('path');
const { exists, createTempFolder, deleteFolder } = require('utils-helpers').fs;
const Json = require('../src/json');

describe('test json functionality', () => {
    describe('test create json file', () => {
        const jsonFile = 'new-json.json';
        let tempDir = '';

        beforeAll(async () => {
            tempDir = await createTempFolder('json');
        });

        afterAll(async () => {
            await deleteFolder(tempDir);
        });

        it('should create json file and test basic workflow', async () => {
            const testData = { test: 'data' };

            const jsonObject = new Json(Path.join(tempDir, jsonFile));
            // const jsonObject = new Json('./neco.json');
            await jsonObject.init();

            expect(await exists(jsonObject.path)).toBeTruthy();

            jsonObject.data = testData;
            await jsonObject.save();

            const jsonObject2 = new Json(Path.join(tempDir, jsonFile));
            await jsonObject2.init();
            await jsonObject2.load();

            expect(jsonObject2.data).toMatchObject(testData);
        });
    });
});
