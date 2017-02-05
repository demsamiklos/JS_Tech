'use strict'

const Database = use('Database')
const Task = use('App/Model/Task')
const Member = use('App/Model/Member')
const Relation = use('App/Model/Relation')
const User = use('App/Model/User')
const Validator = use('Validator')

class ListController {
	* show(request, response) {
		const isLoggedIn = yield request.auth.check()
		if (isLoggedIn) {
			const tasks = yield Database
				.table('tasks')
				.where('creator_id', request.currentUser.id)

			const members = yield Database
				.table('tasks')
				.innerJoin('relations', 'tasks.id', 'relations.task_id')
				.innerJoin('members', 'relations.member_id', 'members.id')
				.where('tasks.creator_id', request.currentUser.id)
				.select('members.name', 'relations.task_id')

			yield response.sendView('list_tasks', { tasks: tasks, members: members })
			return
		}
		yield response.sendView('home')
		return
	}

	* create(request, response) {
		const members = yield Database
			.table('members')
			.where('creator_id', request.currentUser.id)
		yield response.sendView('create_task', { members: members })
		return
	}

	* doCreate(request, response) {
		const taskData = {
			title: request.input('title'),
			information: request.input('information'),
			status: request.input('status'),
			creator_id: request.currentUser.id
		}

		const rules = {
			title: 'required',
			information: 'required',
			status: 'required',
		};

		const validation = yield Validator.validateAll(taskData, rules)
		if (validation.fails()) {
			yield request
				.withAll()
				.andWith({ errors: validation.messages() })
				.flash()
			response.redirect('back')
			return
		}

		const members = request.input('aMembers')
		if (members === null) {
			response.redirect('back')
			return
		}

		const task_id = yield Database
			.insert(taskData)
			.into('tasks')

		var relationData = []
		for(var i in members) {
			relationData.push({
					task_id: task_id[0],
					member_id: members[i],
					creator_id: request.currentUser.id
			})
		}
		yield Database
				.table('relations')
				.insert(relationData)

		response.redirect('/')
		return
	}

	* edit(request, response) {
		const task_id = request.param('id')

		var task = yield Database
			.from('tasks')
			.where('id', task_id)
			.limit(1)
		task = task[0]

		if (request.currentUser.id !== task.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const members = yield Database
			.table('members')
			.where('creator_id', request.currentUser.id)
		
		const checks = yield Database
				.table('tasks')
				.innerJoin('relations', 'tasks.id', 'relations.task_id')
				.innerJoin('members', 'relations.member_id', 'members.id')
				.where('tasks.creator_id', request.currentUser.id)
				.where('tasks.id', task_id)
				.select('members.id')

		yield response.sendView('edit_task', { task: task, members: members, checks: checks })
		return
	}

	* doEdit(request, response) {
		const task_id = request.param('id')

		var task = yield Database
			.table('tasks')
			.where('id', task_id)
			.limit(1)
		task = task[0]

		if (request.currentUser.id !== task.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const taskData = {
			title: request.input('title'),
			information: request.input('information'),
			status: request.input('status')
		}

		const rules = {
			title: 'required',
			information: 'required',
			status: 'required',
		};

		const validation = yield Validator.validateAll(taskData, rules)
		if (validation.fails()) {
			yield request
				.withAll()
				.andWith({ errors: validation.messages() })
				.flash()
			response.redirect('back')
			return
		}

		yield Database
			.table('tasks')
			.where('id', task_id)
			.update(taskData)

		const members = request.input('aMembers')
		if (members === null) {
			response.redirect('back')
			return
		}

		yield Database
			.table('relations')
			.where('task_id', task_id)
			.delete()

		var relationData = []
		for(var i in members) {
			relationData.push({
					task_id: task_id,
					member_id: members[i],
					creator_id: request.currentUser.id
			})
		}

		yield Database
				.table('relations')
				.insert(relationData)

		response.redirect('/')
		return
	}

	* AJAXdoEdit(request, response) {
		const task_id = request.param('id')

		var task = yield Database
			.table('tasks')
			.where('id', task_id)
			.limit(1)
		task = task[0]

		if (request.currentUser.id !== task.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		const taskData = {
			title: request.input('title'),
			information: request.input('information'),
			status: request.input('status')
		}

		const rules = {
			title: 'required',
			information: 'required',
			status: 'required',
		};

		const validation = yield Validator.validateAll(taskData, rules)
		if (validation.fails()) {
			yield request
				.withAll()
				.andWith({ errors: validation.messages() })
				.flash()
			response.redirect('back')
			return
		}

		yield Database
			.table('tasks')
			.where('id', task_id)
			.update(taskData)

		const members = request.input('aMembers')
		if (members === null) {
			response.redirect('back')
			return
		}

		yield Database
			.table('relations')
			.where('task_id', task_id)
			.delete()

		var relationData = []
		for(var i in members) {
			relationData.push({
					task_id: task_id,
					member_id: members[i],
					creator_id: request.currentUser.id
			})
		}

		yield Database
				.table('relations')
				.insert(relationData)

		response.ok({ success: true })
		return
	}

	* doDelete(request, response) {
		const task_id = request.param('id');

		var task = yield Database
			.table('tasks')
			.where('id', task_id)
			.limit(1)
		task = task[0]

		if (request.currentUser.id !== task.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		yield Database
			.table('tasks')
			.where('id', task_id)
			.delete()

		yield Database
			.table('relations')
			.where('task_id', task_id)
			.delete()

		response.redirect('/')
		return
	}

	* AJAXdoDelete(request, response) {
		const task_id = request.param('id');

		var task = yield Database
			.table('tasks')
			.where('id', task_id)
			.limit(1)
		task = task[0]

		if (request.currentUser.id !== task.creator_id) {
			yield response.sendView('errors.index.njk', { status: '405', message: 'A nem hozzád tartozó adatokat nem szerkesztheted / törölheted! Ne is próbálkozz ;)' })
			return
		}

		yield Database
			.table('tasks')
			.where('id', task_id)
			.delete()

		yield Database
			.table('relations')
			.where('task_id', task_id)
			.delete()

		response.ok({ success: true })
		return
	}
}

module.exports = ListController