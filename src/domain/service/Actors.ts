import { Actors as ActorsModel } from '../../model/Actors';

export class Actors {
    public static async getAll() {
        return ActorsModel.getAll();
    }

    public static async getById(id: number) {
        const response = await ActorsModel.getById(id);

        if (response === null) {
            return null;
        }

        if (response.length === 0) {
            return { actor: {} };
        }

        return { actor: response[0] };
    }
}
