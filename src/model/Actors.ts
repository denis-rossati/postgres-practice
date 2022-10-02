import { Client } from 'pg';

export class Actors {
  public static async getAll(client: Client) {
    return client.query(
      `SELECT 
                actor_id as id,
                first_name,
                last_name
             FROM Actor;
        `,
    );
  }

  public static async getById(client: Client, id: number) {
    return client.query(
      `SELECT
                actor_id as id,
                first_name,
                last_name
            FROM Actor
            WHERE actor_id = $1
            LIMIT 1`,
      [id],
    );
  }
}
