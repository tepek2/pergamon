const { readLines, getLine, createFile, deleteFile } = require('../src/fs-utils');

describe('tests for work with fs', () => {
    const path = './test/pom.txt';

    describe('test readLines', () => {
        it('should test readLines', async () => {
            const lines = readLines(path);

            const fileLines = [];

            for await (const line of lines) {
                fileLines.push(line);
            }

            expect(fileLines).toEqual(['one', 'two', 'tree', 'four']);
        });
    });

    describe('test getLine', () => {
        it('should test getLine', async () => {
            const line = await getLine(path, 1);

            expect(line).toBe('two');
        });
    });

    describe('test createFile and deleteFile', () => {
        const testFile1 = './test/testFile.txt';
        afterAll(() => {
            Promise.all([deleteFile(testFile1)]);
        });

        it('should crate file', async () => {
            await createFile(testFile1);
        });
    });
});
