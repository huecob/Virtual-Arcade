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
        data: {
            labels: labels,
            datasets: [
                {data: scores}
            ]
        }
    })
})

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


console.log(score_data)
console.log(labels)

// const ADChart = new Chart(
//     document.querySelector('#ADchart'),
//     {
//         type: 'line',
//         data: {
//             labels: labels,
//             datasets: [
//                 {data: scores}
//             ]
//         }
//     })
})


