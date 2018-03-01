import query from './../sql-api'
import transform from './transformation'
import present from './presentation'

const fs = require('fs');
const path = require('path');

const write = path => x => {
    fs.writeFileSync(path, x, 'utf8');
    return x;
};

export default (params, {affiliatesMap}) => query(process.env.jewel_connection_string, fs.readFileSync(path.resolve(__dirname, './index.sql'), 'utf8'), params)
    .then((x: { rows: [any] }) => transform(x.rows))
    .then((x: any) => present(x, params, {affiliatesMap}))
