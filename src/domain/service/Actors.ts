import { Actors as ActorsModel } from '../../model/Actors';

export class Actors {
  public static async getAll() {
    return ActorsModel.getAll();
  }

  public static async getById(id: number) {
    const response = await ActorsModel.getById(id);

    if (response !== null) {
      return response[0] || null;
    }

    return null;
  }
}
