'use strict'

const Schema = use('Schema')

class TasksTableSchema extends Schema {

  up () {
    this.create('tasks', (table) => {
      table.increments('id')
      table.string('title', 80).notNullable()
      table.string('information', 80).notNullable()
      table.string('status', 80).notNullable()
      table.integer('creator_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('tasks')
  }

}

module.exports = TasksTableSchema
