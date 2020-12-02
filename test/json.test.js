'use strict';

const { deleteFile, exists } = require('../src/utils/fs-utils');
const Json = require('../src/json');

describe('test json functionality', () => {
    describe('test create json file', () => {
        const newJson = './test/data/new-json.json';

        afterEach(async () => {
            await deleteFile(newJson);
        });

        it('should create json file and test basic workflow', async () => {
            const testData = { test: 'data' };

            const jsonObject = new Json(newJson);
            await jsonObject.init();

            expect(await exists(jsonObject.path)).toBeTruthy();

            jsonObject.data = testData;
            await jsonObject.save();

            const jsonObject2 = new Json(newJson);
            await jsonObject2.init();
            await jsonObject2.load();

            expect(jsonObject2.data).toMatchObject(testData);
        });
    });
});
