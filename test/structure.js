'use strict';

const dataFunctions = `{"id": 0, "data1": "something"}
{"id": 1, "data1": "somethingOther"}
{"id": 2, "data": "test", "data1": "somethingTotallyOther"}
{"id": 3, "data": "test", "data1": "something3"}
`;

const dataFunctionsStructure = {
    data: {
        'data-functions.txt': dataFunctions
    }
};

const pergamonStructure = {
    data: {
        db: {
            'table.db.txt': '{"id": 0, "data": "data"}\n'
        }
    }
};

module.exports = { dataFunctionsStructure, pergamonStructure };
