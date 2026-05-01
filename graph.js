function drawChart(hits, misses) {
    new Chart(document.getElementById("chart"), {
        type: 'bar',
        data: {
            labels: ['Hits', 'Misses'],
            datasets: [{
                label: 'Performance',
                data: [hits, misses]
            }]
        }
    });
}