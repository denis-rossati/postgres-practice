import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.PG_USER,
  database: process.env.PG_DB,
  password: process.env.PG_PW,
  port: Number(process.env.PG_PORT),
});

client.connect();

export {
  client,
};
