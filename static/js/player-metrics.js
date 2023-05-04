updateButton = document.querySelector('.update-display-name');
const user_id = updateButton.id
// console.log(user_id) //this logged correctly

fetch(`/user-metrics/${user_id}`) 
.then((response) => response.json())
.then((serverData) => {
// console.log(serverData["date_labels"])
// console.log(serverData["score_values"])

const username = serverData["display_name"]
const labels = serverData["date_labels"]
const scores = serverData["score_values"]

const testChart = new Chart(
    document.querySelector('#test-chart'),
    {
        type: 'line',
        label: `${username}'s Scores Over Time`,
        data: {
            labels: labels,
            datasets: [
                {data: scores}
            ]
        }
    })



})

