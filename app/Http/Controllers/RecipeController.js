'use strict'

const Category = use('App/Model/Category')
const Recipe = use('App/Model/Recipe')
const User = use('App/Model/User')
const Validator = use('Validator')
const Helpers = use('Helpers')
const fs = use('fs')

class RecipeController {
  /**
   *
   */
  * main (request, response) {
    // load all categories
    const categories = yield Category.all()

    // for each category load the last 3 recipes
    for (let category of categories) {
      const latestRecipes = yield category.recipes().active().orderBy('id', 'desc').limit(3).fetch()
      category.latestRecipes = latestRecipes.toJSON()
    }

    yield response.sendView('main', {
      categories: categories
        .filter(category => category.latestRecipes.length > 0)
        .toJSON()
    })
  }

  /**
   *
   */
  * create (request, response) {
    const categories = yield Category.all()

    yield response.sendView('recipe_create', { categories: categories.toJSON() })
  }

  /**
   *
   */
  * doCreate (request, response) {
    const recipeData = request.all()
    const validation = yield Validator.validateAll(recipeData, {
      name: 'required',
      description: 'required',
      ingredients: 'required'
    })

    if (validation.fails()) {
      yield request
        .withAll()
        .andWith({ errors: validation.messages() })
        .flash()

      response.route('recipe_create')
    } else {
      const category = yield Category.find(recipeData.category)

      if (!category) {
        yield request
          .withAll()
          .andWith({ errors: [{ message: 'category doesn\'t exist' }] })
          .flash()

        response.route('recipe_create')
      } else {
        const recipeImage = request.file('image', { maxSize: '1mb', allowedExtensions: ['jpg', 'JPG'] })

        if (recipeImage.clientSize() > 0 && !recipeImage.validate()) {
          yield request
            .withAll()
            .andWith({ errors: [{ message: recipeImage.errors() }] })
            .flash()

          response.route('recipe_create')
          return
        }

        const recipe = new Recipe()
        recipe.name = recipeData.name
        recipe.description = recipeData.description
        recipe.ingredients = recipeData.ingredients
        recipe.category_id = recipeData.category
        recipe.created_by_id = 1 // TODO: Replace

        // TODO: these lines should be executed atomically
        yield recipe.save()
        yield recipeImage.move(Helpers.publicPath() + '/images', `${recipe.id}.jpg`)

        response.route('recipe_page', { id: recipe.id })
      }
    }
  }

  /**
   *
   */
  * show (request, response) {
    const recipeId = request.param('id')
    const recipe = yield Recipe.find(recipeId)

    if (recipe) {
      yield recipe.related('category').load()
      yield recipe.related('created_by').load()

      const fileName = `/images/${recipe.id}.jpg`
      const imageExists = yield fileExists(`${Helpers.publicPath()}/${fileName}`)
      const recipeImage = imageExists ? fileName : false

      yield response.sendView('recipe', { recipe: recipe.toJSON(), recipeImage })
    } else {
      response.notFound('Recipe not found.')
    }
  }

}

function fileExists(fileName) {
  return new Promise((resolve, reject) => {
    fs.access(fileName, fs.constants.F_OK, err => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}

module.exports = RecipeController
