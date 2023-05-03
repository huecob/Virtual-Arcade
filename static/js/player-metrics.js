//config for chart.js: type: 'line", data: {}, options: {}, plugins: []

const today = new Date();
const labels = [];

for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    labels.push(date.toLocaleDateString());
}

const testChart = new Chart(
    document.querySelector("#test-chart"),
    {
        type: 'line',
        data: {
            labels: ['does', 'this', 'work'],
            datasets: [
                {
                  label: 'Today',
                  data: [10, 36, 27],
                },
                {
                  label: 'Yesterday',
                  data: [5, 0, 7],
                },
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Last 7 Days'
                    }
                }]
            },
            title: {
                display: true,
                text: "User Metrics"
            }
        }
    }
);
