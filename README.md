# Pergamon

Pergamon is simple storage solution for nodejs and typescript. All data are stored in single folder and divided  each table is represented by single file with `.db.txt` suffix. On each line is stored single item saved as json. Line number is matched to id.

## Installation

```sh
npm install pergamon
```

## Usage

```javascript
const Pergamon = require('pergamon');

const db = Pergamon('./test');
const table = db.createTable('table');

const id = await table.insert({something: 'data'});

console.log(await table.get(id));
```

## License

  [MIT](LICENSE)
