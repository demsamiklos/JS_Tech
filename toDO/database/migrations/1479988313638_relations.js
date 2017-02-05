'use strict'

const Schema = use('Schema')

class RelationsTableSchema extends Schema {

  up () {
    this.create('relations', (table) => {
      table.increments('id')
      table.integer('task_id').unsigned().references('id').inTable('tasks')
      table.integer('member_id').unsigned().references('id').inTable('members')
      table.integer('creator_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('relations')
  }

}

module.exports = RelationsTableSchema
