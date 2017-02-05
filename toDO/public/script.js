/*
** AJAX REGISTER FORM
*/
$('.register-form').on('submit', function (e) {
	var element = $(this)
	e.preventDefault()
	const url = '/ajax' + (element.attr('action') || window.location.pathname);
	const headers = {
		'csrf-token': $('[name="_csrf"]').val()
	}
	const data = element.serializeArray()

	$.ajax({
		url,
		method: 'post',
		data,
		dataType: 'json',
		headers
		})
	.done(function( data ) {
		if ( data.success ) {
			$('.panel-heading').after(`
				<div class="panel panel-` + data.messagetype + `">
					<div class="panel-heading">` + data.message + `</div>
				</div>
			`);
		}
	});
})

/*
** AJAX EDIT TASK FORM
*/
$('.task-edit').on('submit', function (e) {
	var element = $(this)
	e.preventDefault()

	const url = '/ajax' + (element.attr('action') || window.location.pathname);
	const headers = {
		'csrf-token': $('[name="_csrf"]').val()
	}
	const data = element.serializeArray()

	$.ajax({
		url,
		method: 'post',
		data,
		dataType: 'json',
		headers
		})
	.done(function( data ) {
		if ( data.success ) {
			$('.panel-heading').after(`
				<div class="panel panel-success">
					<div class="panel-heading">Sikeresen elmentve</div>
				</div>
			`);
		}
	});
})

/*
** AJAX DELETE TASK
*/
$('.task-delete').on('click', function (e) {
	var element = $(this)
	e.preventDefault()

	const url = '/ajax' + element.attr('href')
	const headers = {
		'csrf-token': $('[name="_csrf"]').val()
	}

	$.ajax({
		url,
		method: 'DELETE',
		dataType: 'json',
		headers
		})
	.done(function( data ) {
		if ( data.success ) {
			element.parent().parent().html(`
				<td colspan="6">
					<div class="panel panel-success">
						<div class="panel-heading">Sikeresen törölve</div>
					</div>
				</td>
			`);
		}
	});
})

/*
** AJAX EDIT MEMBER FORM
*/
$('.member-edit').on('submit', function (e) {
	var element = $(this)
	e.preventDefault()

	const url = '/ajax' + (element.attr('action') || window.location.pathname);
	const headers = {
		'csrf-token': $('[name="_csrf"]').val()
	}
	const data = element.serializeArray()

	$.ajax({
		url,
		method: 'post',
		data,
		dataType: 'json',
		headers
		})
	.done(function( data ) {
		if ( data.success ) {
			$('.panel-heading').after(`
				<div class="panel panel-success">
					<div class="panel-heading">Sikeresen elmentve</div>
				</div>
			`);
		}
	});
})

/*
** AJAX DELETE MEMBER
*/
$('.member-delete').on('click', function (e) {
	var element = $(this)
	e.preventDefault()

	const url = '/ajax' + element.attr('href')
	const headers = {
		'csrf-token': $('[name="_csrf"]').val()
	}

	$.ajax({
		url,
		method: 'DELETE',
		dataType: 'json',
		headers
		})
	.done(function( data ) {
		if ( data.success ) {
			element.parent().parent().html(`
				<td colspan="6">
					<div class="panel panel-success">
						<div class="panel-heading">Sikeresen törölve</div>
					</div>
				</td>
			`);
		}
	});
})