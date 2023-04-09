// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Band from 'App/Models/Band';
import User from 'App/Models/User';

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
    await band.load('posts');
    return {
      band: band.serialize(),
    };
  }

  public async read({ request }: HttpContextContract) {
    const band = request.band;
    await band.load('posts');
    return { band: band.serialize() };
  }

  public async update({ request }: HttpContextContract) {
    await request.validate({ schema: bandSchema });

    const name = request.input('name');
    const band = request.band;
    band.name = name;
    await band.save();

    await band.load('posts');
    return {
      band: band.serialize(),
    };
  }

  public async delete({ request }: HttpContextContract) {
    const band = request.band;
    await band.delete();

    return { deleted: band.$isDeleted };
  }

  public async addMember({ request }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        email: schema.string({}, [rules.email()]),
      }),
    });

    const member = await User.findByOrFail('email', request.input('email'));
    const band = request.band;
    await band.related('users').attach([member.id]);

    await band.load('users');

    return {
      band: band.serialize(),
    };
  }

  public async removeMember({ request }: HttpContextContract) {
    await request.validate({
      schema: schema.create({
        memberId: schema.number([rules.required()]),
      }),
    });

    const band = request.band;
    await band.related('users').detach([request.input('memberId')]);

    await band.load('users');

    if (band.users.length < 1) {
      await band.delete();
      return {
        band: null,
      };
    }

    return {
      band: band.serialize(),
    };
  }
}
