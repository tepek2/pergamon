'use strict';

const { syncify } = require('../utils');
const {
    readLines,
    getLine,
    createFile,
    deleteFile,
    exists,
    appendFile,
    createPath,
    deleteFolder,
    getLineCount,
    updateLine,
    getFilsesNames,
    getFoldersNames,
    rewriteFile,
    readFile,
    copyFile
} = require('../../src/utils/fs-utils');

describe('tests for work with fs', () => {
    const path = './test/utils/data/fs-utils.txt';

    describe('test readLines', () => {
        it('should test readLines', async () => {
            const { lines } = readLines(path);

            const fileLines = [];

            for await (const line of lines) {
                fileLines.push(line);
            }

            expect(fileLines).toEqual(['one', 'two', 'three', 'four']);
        });
    });

    describe('test getLine', () => {
        it('should test getLine', async () => {
            const line = await getLine(path, 1);

            expect(line).toBe('two');
        });
    });

    describe('test createFile', () => {
        const testFile = './test/testFile-create.txt';
        const folderPath = './test/testFolder-create/';
        const testFile2 = `${folderPath}/testFile-create.db.txt`;

        afterAll(async () => {
            await deleteFile(testFile);
            await deleteFolder(folderPath);
        });

        it('should create file', async () => {
            await createFile(testFile);
            expect(await exists(testFile)).toBeTruthy();
        });

        it('should create file and path', async () => {
            await createFile(testFile2);
            expect(await exists(testFile2)).toBeTruthy();
        });
    });

    describe('test deleteFile', () => {
        const testFile = './test/testFile-delete.txt';

        beforeAll(async () => {
            await createFile(testFile);
        });

        it('should delete file', async () => {
            expect(await exists(testFile)).toBeTruthy();
            await deleteFile(testFile);
            expect(await exists(testFile)).toBeFalsy();
        });

        it('should ignore nonexisting files', async () => {
            const file = './file.txt';

            expect(await exists(file)).toBeFalsy();
            await deleteFile(file);
        });
    });

    describe('test exists', () => {
        it('should confirm that file exists', async () => {
            expect(await exists(path)).toBeTruthy();
        });

        it('should say that file don not exists', async () => {
            expect(await exists('./test/neexistuje.txt')).toBeFalsy();
        });
    });

    describe('test appendFile', () => {
        const testFile = './test/testFile-append.txt';

        beforeAll(async () => {
            await createFile(testFile);
        });

        afterAll(async () => {
            await deleteFile(testFile);
        });

        it('should write add the end of the file', async () => {
            const text1 = 'something';
            const text2 = 'something2';

            await appendFile(testFile, text1);
            expect(await readFile(testFile)).toBe(text1);

            await appendFile(testFile, text2);
            expect(await readFile(testFile)).toBe(`${text1}${text2}`);
        });
    });

    describe('test createPath', () => {
        const path = './test/testFolder';
        const path2 = `${path}/folder`;
        const file = `${path2}/file.txt`;

        afterAll(async () => {
            await deleteFile(file);
            await deleteFolder(path2);
            await deleteFolder(path);
        });

        it('should crate folder', async () => {
            await createPath(path2);
            await createFile(file);
            expect(await exists(file)).toBeTruthy();
        });
    });

    describe('test deleteFolder', () => {
        beforeAll(async () => {
            await createPath('./test/folder');
        });

        it('should delete folder', async () => {
            await deleteFolder('./test/folder');
        });

        it('should ignore nonexisting folder', async () => {
            await deleteFolder('./testFolder');
        });

        it('should delete folder and all data in it', async () => {
            const path = './test/folder-delete';
            const path2 = './test/folder-delete/folder';
            const file = 'file1.txt';

            await createPath(path2);
            await createFile(`${path}/${file}`);
            await createFile(`${path2}/${file}`);

            await deleteFolder(path);

            expect(await exists(`${path}/${file}`)).toBeFalsy();
        });
    });

    describe('test getLineCount', () => {
        const testFile = './test/testFile-lineCount.txt';

        beforeAll(async () => {
            await createFile(testFile);
            await appendFile(testFile, 'neco');
        });

        afterAll(async () => {
            await deleteFile(testFile);
        });

        it('should return line count of the file', async () => {
            expect(await getLineCount(path)).toBe(4);
            expect(await getLineCount(testFile)).toBe(1);
        });
    });

    describe('test updateLine', () => {
        const testFile = './test/testFile-update.txt';

        beforeAll(async () => {
            await createFile(testFile);
            const { lines } = readLines(path);
            for await (const line of lines) {
                await appendFile(testFile, `${line}\n`);
            }
        });

        afterAll(async () => {
            await deleteFile(testFile);
        });

        it('should update single line in file', async () => {
            expect(await getLine(testFile, 2)).toBe('three');
            await updateLine(testFile, 2, 'something else');
            expect(await getLine(testFile, 2)).toBe('something else');
        });

        it('should do nothing, when trying update nonexisting line', async () => {
            await updateLine(testFile, 222, 'something else');
        });
    });

    describe('test getFilsesNames', () => {
        const folderPath = './test/testFolder';
        const folders = ['folder1', 'folder2'];
        const files = ['file1.txt', 'file2.txt', 'file3.txt'];

        beforeAll(async () => {
            await createPath(folderPath);

            for (const file of files) {
                await createFile(`${folderPath}/${file}`);
            }
            for (const folder of folders) {
                await createPath(`${folderPath}/${folder}`);
            }
        });

        afterAll(async () => {
            await deleteFolder(folderPath);
        });

        it('should return names of all files in the folder', async () => {
            const files1 = await getFilsesNames(folderPath);

            expect(files1.sort()).toEqual(files.sort());
        });
    });

    describe('test getFoldersNames', () => {
        const folderPath = './test/testFolder';
        const folders = ['folder1', 'folder2'];
        const files = ['file1.txt', 'file2.txt', 'file3.txt'];

        beforeAll(async () => {
            await createPath(folderPath);

            for (const file of files) {
                await createFile(`${folderPath}/${file}`);
            }
            for (const folder of folders) {
                await createPath(`${folderPath}/${folder}`);
            }
        });

        afterAll(async () => {
            await deleteFolder(folderPath);
        });

        it('should return names of all folders in the folder', async () => {
            const folders1 = await getFoldersNames(folderPath);

            expect(folders1.sort()).toEqual(folders.sort());
        });
    });

    describe('test rewriteFile', () => {
        const path1 = './test/data/rewriteFile-rewrite.txt';
        const path2 = './test/data/rewriteFile-create.txt';

        afterAll(async () => {
            await deleteFile(path1);
            await deleteFile(path2);
        });

        it('should rewrite file', async () => {
            const path = './test/utils/data/fs-utils-read.txt';
            const text = 'something';

            await copyFile(path, path1);
            expect(await readFile(path1)).toBe('text');

            await rewriteFile(path1, text);
            expect(await readFile(path1)).toBe(text);
        });

        it('should create new file', async () => {
            const text = 'something';

            await rewriteFile(path2, text);

            expect(await readFile(path2)).toBe(text);
        });
    });

    describe('test readFile', () => {
        it('should read file', async () => {
            const path = './test/utils/data/fs-utils-read.txt';

            expect(await readFile(path)).toBe('text');
        });

        it('should raise exception for nonexisting file', async () => {
            const path = './test/notExists.txt';
            expect(await syncify(() => readFile(path))).toThrow();
        });
    });
});
