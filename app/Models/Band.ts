import { DateTime } from 'luxon';
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm';
import User from 'App/Models/User';
import Post from 'App/Models/Post';

export default class Band extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>;
}
