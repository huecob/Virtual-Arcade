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
});

fetch(`/game-1-user-metrics/${user_id}`)
.then((response) => response.json())
.then((serverData) => {

(serverData['error-code'] ? 
    document.querySelector.innerHTML = serverData['error-code]'] : null);

const dateLabels = [];
const scoreData = [];

for (let dates in serverData) {
    dateLabels.push(dates)
    scoreData.push(serverData[dates])
}

console.log(dateLabels, scoreData)

const game1 = new Chart(
    document.querySelector('#game1-chart'),
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
                    text: "Artificial Dunderhead",
                    position: "top",
                    align: "start",
                    padding: 20
                }
            }
        }
    })
});

fetch(`/game-2-user-metrics/${user_id}`)
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

const game2 = new Chart(
    document.querySelector('#game2-chart'),
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
                    text: "Sundown till Sunrise",
                    position: "top",
                    align: "start",
                    padding: 20
                }
            }
        }
    })
});

fetch(`/game-3-user-metrics/${user_id}`)
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

const game3 = new Chart(
    document.querySelector('#game3-chart'),
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
                    text: "Responsibility Rain",
                    position: "top",
                    align: "start",
                    padding: 20
                }
            }
        }
    })
})