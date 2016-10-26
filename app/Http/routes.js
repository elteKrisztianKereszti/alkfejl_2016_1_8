'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/

const Route = use('Route')

Route.get('/', 'RecipeController.main').as('main')
Route.get('/recipe', 'RecipeController.index').as('recipe_list')
Route.get('/recipe/create', 'RecipeController.create').as('recipe_create')
Route.post('/recipe/create', 'RecipeController.doCreate').as('do_recipe_create')
Route.get('/recipe/:id', 'RecipeController.show').as('recipe_page')
