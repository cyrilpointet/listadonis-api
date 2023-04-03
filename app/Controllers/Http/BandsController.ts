// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Band from 'App/Models/Band';

const bandSchema = schema.create({
  name: schema.string({}, [rules.minLength(1)]),
});

export default class BandsController {
  public async create({ request, auth }: HttpContextContract) {
    await request.validate({ schema: bandSchema });

    const name = request.input('name');
    const user = await auth.authenticate();

    const band = new Band();
    band.name = name;
    await band.save();
    await band.related('users').attach([user.id]);

    await band.load('users');

    return {
      band: band.serialize(),
    };
  }

  public async read({ request }: HttpContextContract) {
    return { band: request.band.serialize() };
  }

  public async update({ request }: HttpContextContract) {
    await request.validate({ schema: bandSchema });

    const name = request.input('name');
    const band = request.band;
    band.name = name;
    await band.save();

    return {
      band: band.serialize(),
    };
  }

  public async delete({ request }: HttpContextContract) {
    const band = request.band;
    await band.delete();

    return { deleted: band.$isDeleted };
  }
}
