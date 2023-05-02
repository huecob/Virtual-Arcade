//config for chart.js: type: 'line", data: {}, options: {}, plugins: []

const testChart = new Chart(
    document.querySelector("#test-chart"),
    {
        type: 'line',
        data: {
            labels: ['does', 'this', 'work'],
            datasets: [
                {data: [2, 4, 8]}
            ]
        },
    }
);