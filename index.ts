import express from 'express';
import {client} from './src/model/connection';
const app = express();

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

client.query('SELECT $1::text as message', ['Hello, world!']).then((res) => {
    console.log(res.rows[0].message);
    client.end();
})
