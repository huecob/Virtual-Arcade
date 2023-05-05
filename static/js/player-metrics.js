updateButton = document.querySelector('.update-display-name');
const user_id = updateButton.id
// console.log(user_id) //this logged correctly

fetch(`/user-metrics/${user_id}`) 
.then((response) => response.json())
.then((serverData) => {


const username = serverData["display_name"]
const labels = serverData["date_labels"]
const scores = serverData["score_values"]


const totalChart = new Chart(
    document.querySelector('#totals-chart'),
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

fetch(`/specific-game-data/${user_id}+${game_id}`)
.then((response) => response.json())
.then((serverData) => {
    
    for (let i = 0; i < serverData['number_of_games']; i++) {
        let gameChart;
        gameChart = new Chart(
            document.querySelector(`#game${i}-chart`),
        {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {data: scores}
                ]
            }
        }

)}
    
})


