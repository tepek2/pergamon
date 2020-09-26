const fs = require('fs');
const readline = require('readline');

const readLines = (path) => {
    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        crlfDelay: Infinity
    });

    return readInterface;
};

const getLine = (path, lineNumber) => {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(path);
        const readInterface = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        let index = 0;
        readInterface.on('line', (line) => {
            if (index === lineNumber) {
                readInterface.close();
                fileStream.close();
                resolve(line);
            }
            index++;
        });

        readInterface.on('error', reject);

        fileStream.on('end', () => {
            resolve(null);
        });
    });
};

const createFile = (path) => {
    return fs.promises.appendFile(path, '');
};

const deleteFile = (path) => {
    return fs.promises.unlink(path);
};

const appendFile = (path, text) => {
    return fs.promises.appendFile(path, `${text}\n`);
};

const createPath = (path) => {
    return fs.promises.mkdir(path);
};

const deletePath = (path) => {
    return fs.promises.rmdir(path);
};

const exists = (path) => {
    return fs.promises.access(path, fs.constants.F_OK);
};

const rewriteFile = (path, text) => {
    return fs.promises.writeFile(path, `${text}\n`);
};

const writeTiLine = (path, lineNumber, text) => {
    const streamInput = fs.createReadStream(path); 
    const lineInterface = readline.createInterface({
        input: streamInput,
        // output: fs.createWriteStream(path),
        crlfDelay: Infinity
    });

    let index = 0;
    lineInterface.on('line', (line) => {
        if (index === lineNumber) {
            lineInterface.close();
            streamInput.close();
        }
        index++;
    });

    streamInput.on('end', () => {});
    // const file = fs.promises.open(path, 'w');
    // const ws = fs.promises.write(file);
};

module.exports = { readLines, getLine, createFile, deleteFile, appendFile, createPath, deletePath, exists, rewriteFile, writeTiLine };
