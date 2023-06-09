import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'posts';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('title', 255).notNullable();
      table.integer('band_id').unsigned().references('bands.id').onDelete('CASCADE');

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });
      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
