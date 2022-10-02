import { Client } from 'pg';

export class Actors {
  public static async getAll(client: Client) {
    const actors = await client.query(
      `SELECT actor_id as id,
              first_name,
              last_name
       FROM Actor;
      `,
    );

    await client.end();
    return actors;
  }

  public static async getById(client: Client, id: number) {
    const actor = client.query(
      `SELECT actor_id as id,
              first_name,
              last_name
       FROM Actor
       WHERE actor_id = $1
       LIMIT 1`,
      [id],
    );

    await client.end();
    return actor;
  }
}
