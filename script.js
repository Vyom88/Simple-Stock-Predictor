let chart;
document.getElementById('stockForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const stockSymbol = document.getElementById('stockInput').value;
    fetchStockData(stockSymbol);
});

async function fetchStockData(stockSymbol) {
    let labelElement = document.getElementById("loading");
    labelElement.innerHTML = "<em>Loading...</em>";

    if (chart != undefined) {
        chart.destroy();
    }
    const input = document.getElementById("stockInput");
    const inputValue = input.value;
    let response = await fetch("http://127.0.0.1:8000/predict", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 'symbol': inputValue })
    }).then(response => response.json())
        .then(data => {
            let predictions = [];
            for (let i=0; i< (data['dates'].length - data['predictions'].length); i++) {
                predictions.push(NaN);
            }
            for (let i = 0; i < data['predictions'].length; i++) {
                predictions.push(data['predictions'][i]);
            }
            displayChart(data['dates'], data['actual'], predictions, stockSymbol);
            console.log('Success:', data);
            labelElement.innerHTML = "";
        })
        .catch((error) => {
            console.error('Error:', error);
            labelElement.innerHTML = "Error fetching data";
        });
}

function displayChart(dates, actual, predictions, stockSymbol) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: `${stockSymbol} Stock Price Prediction`,
                data: predictions,
                borderColor: 'rgba(200, 2, 1, 1)',
                backgroundColor: 'rgba(200, 2, 1, 0.2)',
                borderWidth: 1
            },
            {
                label: `${stockSymbol} Stock Price Actual`,
                data: actual,
                borderColor: 'rgba(75, 192, 192, 0.8)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });
}