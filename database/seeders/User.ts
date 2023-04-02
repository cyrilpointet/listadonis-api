import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    const users: { email: string; password: string }[] = []
    for (let i = 0; i < 10; i++) {
      users.push({
        email: `user${i}@user.user`,
        password: 'user',
      })
    }
    await User.createMany(users)
  }
}
