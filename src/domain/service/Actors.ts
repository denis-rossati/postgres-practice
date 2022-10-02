import { client } from '../../model/connection';
import { Actors as ActorsModel } from '../../model/Actors';

export class Actors {
  public static async getAll() {
    const response = await ActorsModel.getAll(client);
    return response.rows;
  }

  public static async getById(id: number) {
    const response = await ActorsModel.getById(client, id);
    if (response.rows.length > 0) {
      return response.rows[0];
    }
    return null;
  }
}
