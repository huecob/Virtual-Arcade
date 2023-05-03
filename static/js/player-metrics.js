//config for chart.js: type: 'line", data: {}, options: {}, plugins: []
// user = document.querySelector('form .update-display-name');

user_id = user.user_id

fetch(`/user-metrics/${user_id}`) 
.then((response) => response.json())
.then((serverData) => {
console.log(serverData)
})



