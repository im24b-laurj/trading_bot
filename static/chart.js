const tradesContainer = document.getElementById("trades");
const priceUpdated = document.getElementById("current_price");
const totalPnlValue = document.getElementById("total_pnl_value");
const highLowContainer = document.getElementById("high_low_value");
const cashChartCanvas = document.getElementById("cash_chart");
let cashChart = null;

// Fix chart size so it doesn't change with layout
if (cashChartCanvas) {
    cashChartCanvas.width = 760;   // fixed width in pixels
    cashChartCanvas.height = 240;  // fixed height in pixels
}

// Simple rounding helper (decimals = number of decimal places)
function round(value, decimals = 2) {
    if (value === null || value === undefined || isNaN(value)) return value;
    const factor = Math.pow(10, decimals);
    return Math.round(Number(value) * factor) / factor;
}

// Fetch trades and display them
async function fetchTrades() {
    const response = await fetch('/trades');
    const data = await response.json();
    tradesContainer.innerHTML = ""; // clear previous trades

    let totalPnL = 0;
    const startingCash = 10000; // must match server.py
    let runningCash = startingCash;
    const equityLabels = [];
    const equityValues = [];

    data.forEach(trade => {
        const tradeEl = document.createElement("div");

        const entry = round(trade.entry_price, 2);
        const exit = trade.exit_price !== null ? round(trade.exit_price, 2) : "-";
        const pnl = trade.pnl !== null ? round(trade.pnl, 2) : null;

        let pnlText = pnl !== null ? ` | PnL: ${pnl}` : "";
        if (pnl !== null) {
            totalPnL += pnl;
            runningCash += pnl;
            equityLabels.push(trade.time);
            equityValues.push(round(runningCash, 2));
        }

        tradeEl.innerText = `Time: ${trade.time} | Type: ${trade.side} | Entry: ${entry} | Exit: ${exit}${pnlText}`;

        if (trade.pnl > 0) tradeEl.classList.add("trade-profit");
        else if (trade.pnl < 0) tradeEl.classList.add("trade-loss");

        tradesContainer.appendChild(tradeEl);
    });

    // Update total PnL card
    totalPnlValue.innerText = round(totalPnL, 2);

    // Update / create cash chart if canvas is present
    if (cashChartCanvas && typeof Chart !== "undefined") {
        const ctx = cashChartCanvas.getContext("2d");

        if (!cashChart) {
            cashChart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: equityLabels,
                    datasets: [{
                        label: "Bot Cash",
                        data: equityValues,
                        borderColor: "rgba(37, 99, 235, 1)",
                        backgroundColor: "rgba(37, 99, 235, 0.1)",
                        borderWidth: 2,
                        tension: 0.2,
                        pointRadius: 2
                    }]
                },
                options: {
                    // Fixed-size chart: do not resize with the container
                    responsive: false,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            title: { display: true, text: "Time" }
                        },
                        y: {
                            title: { display: true, text: "Cash" }
                        }
                    }
                }
            });
        } else {
            cashChart.data.labels = equityLabels;
            cashChart.data.datasets[0].data = equityValues;
            cashChart.update();
        }
    }
}

// Fetch current price
async function getCurrentPrice() {
    const response = await fetch('/current_price');
    const data = await response.json();
    priceUpdated.innerText = `Current Price: ${round(data, 2)}`;
}

// Fetch rolling high/low
async function fetchHighLow() {
    const response = await fetch('/high_low');
    const data = await response.json();
    highLowContainer.innerText = `High: ${round(data.high, 2)}  |  Low: ${round(data.low, 2)}`;
}

// Refresh frequently (every second) so UI feels snappy
setInterval(() => {
    fetchTrades();
    getCurrentPrice();
    fetchHighLow();
}, 1000);

// Initial load
fetchTrades();
getCurrentPrice();
fetchHighLow();
