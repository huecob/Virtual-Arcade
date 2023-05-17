updateButton = document.querySelector('.update-display-name');
const user_id = updateButton.id
// console.log(user_id) //this logged correctly

fetch(`/user-metrics/${user_id}`) 
.then((response) => response.json())
.then((serverData) => {

const dateLabels = [];

const scoreData = [];

for (let dates in serverData) {
    dateLabels.push(dates)
    scoreData.push(serverData[dates])
}



const totalChart = new Chart(
    document.querySelector('#totals-chart'),
    {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [
                {data: scoreData}
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

fetch(`/game-1-user-metrics/${user_id}`)
.then((response) => response.json())
.then((serverData) => {

console.log(serverData)

const dateLabels = [];
const scoreData = [];

for (let dates in serverData) {
    dateLabels.push(dates)
    scoreData.push(serverData[dates])
}

console.log(dateLabels, scoreData)

const ADChart = new Chart(
    document.querySelector('#ADChart'),
    {
        type: 'line',
        data: {
            labels: dateLabels,
            datasets: [
                {data: scoreData}
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


