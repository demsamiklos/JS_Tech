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

Route.get('/login', 'AuthController.index')
Route.post('/login', 'AuthController.login')

Route.get('/register', 'RegisterController.index')
Route.post('/register', 'RegisterController.doRegister')

Route.get('/logout', 'AuthController.logout')



Route.get('/', 'TaskController.show')

Route.get('/create_task', 'TaskController.create').middleware('auth')
Route.post('/create_task', 'TaskController.doCreate').middleware('auth')

Route.get('/edit_task/:id', 'TaskController.edit').middleware('auth')
Route.post('/edit_task/:id', 'TaskController.doEdit').middleware('auth')

Route.get('/delete_task/:id', 'TaskController.doDelete').middleware('auth')




Route.get('/members', 'MemberController.show').middleware('auth')

Route.get('/create_member', 'MemberController.create').middleware('auth')
Route.post('/create_member', 'MemberController.doCreate').middleware('auth')

Route.get('/edit_member/:id', 'MemberController.edit').middleware('auth')
Route.post('/edit_member/:id', 'MemberController.doEdit').middleware('auth')

Route.get('/delete_member/:id', 'MemberController.doDelete').middleware('auth')

Route.group('ajax', function () {
  Route.post('/register', 'RegisterController.AJAXdoRegister')
  Route.post('/edit_task/:id', 'TaskController.AJAXdoEdit').middleware('auth')
  Route.delete('/delete_task/:id', 'TaskController.AJAXdoDelete').middleware('auth')
  Route.post('/edit_member/:id', 'MemberController.AJAXdoEdit').middleware('auth')
  Route.delete('/delete_member/:id', 'MemberController.AJAXdoDelete').middleware('auth')
}).prefix('/ajax')