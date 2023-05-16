updateButton = document.querySelector('.update-display-name');
const user_id = updateButton.id
// console.log(user_id) //this logged correctly

fetch(`/user-metrics/${user_id}`) 
.then((response) => response.json())
.then((serverData) => {


const username = serverData["display_name"]
const labels = serverData["date_labels"]
const scores = serverData["score_values"]

// console.log(labels)
// console.log(scores)


const totalChart = new Chart(
    document.querySelector('#totals-chart'),
    {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {data: scores}
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: "ALL SCORE DATA",
                    position: "top",
                    align: "start",
                    padding: 20,
                }
            }
        }
    })
})

// Since game 2 isn't live yet, we can't test if the obj we created in server.py (222)
// I suggest to myself that we go back at some point and think of the best way to render these charts.

fetch(`/specific-game-data/${user_id}`)
.then((response) => response.json())
.then((serverData) => {

const score_data = [];
const labels = serverData['date_labels'];
const game_data = serverData['game_data'];


for (let element in game_data) {
    // console.log(game_data[element])
    datum = game_data[element]
    score_data.push(datum['score'])
}

if (labels.length > score_data.length) {
    const newDates = labels.slice(0,(score_data.length))
    newDates.reverse()
}

console.log(newDates)

// console.log(newDates)
// console.log(score_data)
// console.log(labels)
// crop date label lengths to match the length of scores list


const ADChart = new Chart(
    document.querySelector('#ADChart'),
    {
        type: 'line',
        data: {
            labels: newDates,
            datasets: [
                {data: score_data}
            ]
        },
        options: {
            responsive: false,
            plugins: {
                title: {
                    display: true,
                    text: "A.D. SCORE DATA",
                    position: "top",
                    align: "start",
                    padding: 20
                }
            }
        }
    })
})


