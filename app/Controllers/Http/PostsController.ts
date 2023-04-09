import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Post from 'App/Models/Post';

const postSchema = schema.create({
  title: schema.string({}, [rules.minLength(1)]),
});

export default class PostsController {
  public async create({ request }: HttpContextContract) {
    await request.validate({ schema: postSchema });

    const title = request.input('title');
    const band = request.band;

    const post = new Post();
    post.title = title;
    await post.save();
    await post.related('band').associate(band);

    return {
      post: post.serialize(),
    };
  }

  public async delete({ request, response }: HttpContextContract) {
    const params = request.params();
    const postId = params.postId;
    if (!postId) {
      return response.status(401).send('Missing post');
    }
    const post = await Post.findOrFail(postId);
    await post.delete();

    return {
      deleted: post.$isDeleted,
    };
  }
}
