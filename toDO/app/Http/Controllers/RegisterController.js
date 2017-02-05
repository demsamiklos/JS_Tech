'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')

class RegisterController {
	* index(request, response) {
		yield response.sendView('register')
		return
	}

	* doRegister(request, response) {
		const user = new User()
		user.username = request.input('name')
		user.email = request.input('email')
		user.password = yield Hash.make(request.input('password'))
		
		try {
			yield user.save()
			yield response.sendView('login', { messagetype: 'success', message : 'A regisztráció sikeres volt! Kérlek jelentkezz be!' })
			return
		}
		catch (error) {
			yield response.sendView('register', { messagetype: 'danger', message : 'A regisztráció sikertelen volt! A megadott e-mail cím már regisztrálva van!' })
			return
		}
	}

	* AJAXdoRegister(request, response) {
		const user = new User()
		user.username = request.input('name')
		user.email = request.input('email')
		user.password = yield Hash.make(request.input('password'))
		
		try {
			yield user.save()
			response.ok({ success: true, messagetype: 'success', message : 'A regisztráció sikeres volt! Kérlek jelentkezz be!' })
			return
		}
		catch (error) {
			response.ok({ success: true, messagetype: 'danger', message : 'A regisztráció sikertelen volt! A megadott e-mail cím már regisztrálva van!' })
			return
		}
	}
}

module.exports = RegisterController