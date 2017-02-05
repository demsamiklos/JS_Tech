'use strict'

const User = use('App/Model/User')
const Hash = use('Hash')

class AuthController {

	* index(request, response) {
		yield response.sendView('login')
		return
	}

	* login(request, response) {
		const email = request.input('email')
		const password = request.input('password')

		try {
			const authCheck = yield request.auth.attempt(email, password)
			if (authCheck) {
				yield response.redirect('/')
				return
			}
		}
		catch (error) {
			yield response.sendView('login', { messagetype: 'danger', message : 'Nem megfelelő E-mail cím vagy Jelszó!' })
			return
		}
	}

	* logout(request, response) {
		yield request.auth.logout()
		return response.redirect('/')
	}
}

module.exports = AuthController