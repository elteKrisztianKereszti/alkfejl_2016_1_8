'use strict'

const Schema = use('Schema')

class CategoriesSchema extends Schema {

  up () {
    this.create('categories', (table) => {
      table.increments()
      table.string('nev')
      table.timestamps()
    })
  }

  down () {
    this.drop('categories')
  }

}

module.exports = CategoriesSchema
