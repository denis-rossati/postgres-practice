import { connection } from './connection';

export class Actors {
    public static async getAll() {
        const client = await connection.connect();

        try {
            const actors = await client.query(
                'SELECT actor_id as id, first_name, last_name FROM Actor;',
            );

            return actors.rows;
        } catch (e) {
            return null;
        } finally {
            await client.release();
        }
    }

    public static async getById(id: number) {
        const client = await connection.connect();

        try {
            const actor = await client.query(
                'SELECT actor_id as id, first_name, last_name FROM Actor WHERE actor_id = $1 LIMIT 1',
                [id],
            );

            return actor.rows;
        } catch (e) {
            return null;
        } finally {
            await client.release();
        }
    }
}
