'use strict'

const Schema = use('Schema')

class MembersTableSchema extends Schema {

  up () {
    this.create('members', (table) => {
      table.increments('id')
      table.string('name', 80).notNullable()
      table.integer('creator_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('members')
  }

}

module.exports = MembersTableSchema
