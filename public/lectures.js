var update = document.getElementById('update')
var del = document.getElementById('delete')
update.addEventListener('click', function () {
  fetch('publikuot', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      
    })
  })
  .then(response => {
    if (response.ok) return response.json()
		window.location.reload()
  })
  .then(data => {
    console.log(data)
	window.location.reload()
  })
})
del.addEventListener('click', function () {
  window.location.reload()
})
