'use strict'

const Database = use('Database')
const Task = use('App/Model/Task')
const Member = use('App/Model/Member')
const User = use('App/Model/User')
const Validator = use('Validator')

class MemberController {
	* show(request, response) {
		const members = yield Database
			.table('members')
			.where('creator_id', request.currentUser.id)

		yield response.sendView('list_members', { members: members })
		return
	}

	* create(request, response) {
		yield response.sendView('create_member')
		return
	}

	* doCreate(request, response) {
		const memberData = { 
			name: request.input('name'),
			creator_id: request.currentUser.id
		}

		const rules = {
			name: 'required',
		}

		const validation = yield Validator.validateAll(memberData, rules)
		if (validation.fails()) {
			yield request
				.withAll()
				.andWith({ errors: validation.messages() })
				.flash()
			response.redirect('back')
			return
		}

		yield Database
				.table('members')
				.insert(memberData)

		response.redirect('members')
		return
	}

	* edit(request, response) {
		const member_id = request.param('id')

		var member = yield Database
			.table('members')
			.where('id', member_id)
			.limit(1)
		member = member[0]

		if (request.currentUser.id !== member.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		yield response.sendView('edit_member', { member: member })
		return
	}

	* doEdit(request, response) {
		const member_id = request.param('id')

		var member = yield Database
			.table('members')
			.where('id', member_id)
			.limit(1)
		member = member[0]

		if (request.currentUser.id !== member.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const memberData = { 
			name: request.input('name'),
		}

		const rules = {
			name: 'required',
		}

		const validation = yield Validator.validateAll(memberData, rules)
		if (validation.fails()) {
			yield request
				.withAll()
				.andWith({ errors: validation.messages() })
				.flash()
			response.redirect('back')
			return
		}

		yield Database
			.table('members')
			.where('id', member_id)
			.update(memberData)

		response.redirect('/members')
		return
	}

	* AJAXdoEdit(request, response) {
		const member_id = request.param('id')

		var member = yield Database
			.table('members')
			.where('id', member_id)
			.limit(1)
		member = member[0]

		if (request.currentUser.id !== member.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const memberData = { 
			name: request.input('name'),
		}

		const rules = {
			name: 'required',
		}

		const validation = yield Validator.validateAll(memberData, rules)
		if (validation.fails()) {
			yield request
				.withAll()
				.andWith({ errors: validation.messages() })
				.flash()
			response.redirect('back')
			return
		}

		yield Database
			.table('members')
			.where('id', member_id)
			.update(memberData)

		response.ok({ success: true })
		return
	}

	* doDelete(request, response) {
		const member_id = request.param('id')

		var member = yield Database
			.table('members')
			.where('id', member_id)
			.limit(1)
		member = member[0]

		if (request.currentUser.id !== member.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const subTasks = yield Database
			.table('tasks')
			.innerJoin('relations', 'tasks.id', 'relations.task_id')
			.innerJoin('members', 'relations.member_id', 'members.id')
			.where('members.id', member.id)
			.select('tasks.id')

		for (var i in subTasks) {
			const count = yield Database
				.table('relations')
				.count('tasks_id as count')
				.where('relations.task_id', subTasks[i].id)
			if (count[0].count == 1) {
				yield Database
					.table('tasks')
					.where('id', subTasks[i].id)
					.delete()
			}
		}

		yield Database
			.table('relations')
			.where('member_id', member_id)
			.delete()

		yield Database
			.table('members')
			.where('id', member_id)
			.delete()

		response.redirect('/members')
		return
	}

	* AJAXdoDelete(request, response) {
		const member_id = request.param('id')

		var member = yield Database
			.table('members')
			.where('id', member_id)
			.limit(1)
		member = member[0]

		if (request.currentUser.id !== member.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const subTasks = yield Database
			.table('tasks')
			.innerJoin('relations', 'tasks.id', 'relations.task_id')
			.innerJoin('members', 'relations.member_id', 'members.id')
			.where('members.id', member.id)
			.select('tasks.id')

		for (var i in subTasks) {
			const count = yield Database
				.table('relations')
				.count('tasks_id as count')
				.where('relations.task_id', subTasks[i].id)
			if (count[0].count == 1) {
				yield Database
					.table('tasks')
					.where('id', subTasks[i].id)
					.delete()
			}
		}

		yield Database
			.table('relations')
			.where('member_id', member_id)
			.delete()

		yield Database
			.table('members')
			.where('id', member_id)
			.delete()

		response.ok({ success: true })
		return
	}
}

module.exports = MemberController