import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import User from 'App/Models/User';
import { schema, rules } from '@ioc:Adonis/Core/Validator';

const userSchema = schema.create({
  email: schema.string({}, [rules.email()]),
  password: schema.string({}, [rules.minLength(8)]),
});

export default class AuthController {
  public async login({ request, auth }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '10 days',
    });
    const user = await User.findByOrFail('email', email);
    await user.load('bands');
    return { user: user.serialize(), token: token.toJSON().token };
  }

  public async register({ request, auth }: HttpContextContract) {
    await request.validate({ schema: userSchema });

    const email = request.input('email');
    const password = request.input('password');

    const user = new User();
    user.email = email;
    user.password = password;
    await user.save();

    await user.load('bands');

    const token = await auth.use('api').login(user, {
      expiresIn: '10 days',
    });

    return { user: user.serialize(), token: token.toJSON().token };
  }
}
