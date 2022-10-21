import { Pool } from 'pg';

import * as dotenv from 'dotenv';

dotenv.config();

const connection = new Pool({
    user: process.env.PG_USER,
    database: process.env.PG_DB,
    password: process.env.PG_PW,
    port: Number(process.env.PG_PORT),
});

export {
    connection,
};
