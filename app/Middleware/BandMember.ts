import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Band from 'App/Models/Band';
import { AuthenticationException } from '@adonisjs/auth/build/standalone';

export default class BandMember {
  public async handle({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    const user = await auth.authenticate();
    const params = request.params();
    const band = await Band.findOrFail(params.id);
    await band.load('users');

    const members = band.users.filter((elem) => {
      return elem.id === user.id;
    });
    if (members.length > 0) {
      request.band = band;
      await next();
    } else {
      throw new AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS');
    }
  }
}
