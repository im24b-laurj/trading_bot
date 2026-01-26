const tradesContainer = document.getElementById("trades");
const priceUpdated = document.getElementById("current_price");
const totalPnlValue = document.getElementById("total_pnl_value");
const highLowContainer = document.getElementById("high_low_value");
const cashChartCanvas = document.getElementById("cash_chart");
let cashChart = null;

// Fix chart size so it doesn't change with layout
if (cashChartCanvas) {
    // Fixed chart sizing
    cashChartCanvas.width = 900;
    cashChartCanvas.height = 400;
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

    // Reverse to show newest first
    const reversedTrades = [...data].reverse();

    reversedTrades.forEach(trade => {
        const tradeCard = document.createElement("div");
        tradeCard.className = "trade-card";

        const entry = round(trade.entry_price, 2);
        const exit = trade.exit_price !== null ? round(trade.exit_price, 2) : null;
        const pnl = trade.pnl !== null ? round(trade.pnl, 2) : null;
        const isOpen = exit === null;
        const isProfit = pnl !== null && pnl > 0;
        const isLoss = pnl !== null && pnl < 0;

        if (isOpen) {
            tradeCard.classList.add("open");
        } else if (isProfit) {
            tradeCard.classList.add("profit");
        } else if (isLoss) {
            tradeCard.classList.add("loss");
        }

        if (pnl !== null) {
            totalPnL += pnl;
            runningCash += pnl;
            equityLabels.push(trade.time);
            equityValues.push(round(runningCash, 2));
        }

        // Create card structure
        const header = document.createElement("div");
        header.className = "trade-header";

        const side = document.createElement("div");
        side.className = `trade-side ${trade.side}`;
        side.textContent = trade.side;

        const time = document.createElement("div");
        time.className = "trade-time";
        time.textContent = trade.time;

        header.appendChild(side);
        header.appendChild(time);

        const stats = document.createElement("div");
        stats.className = "trade-stats";

        // Entry Price
        const entryStat = document.createElement("div");
        entryStat.className = "trade-stat";
        const entryLabel = document.createElement("div");
        entryLabel.className = "trade-stat-label";
        entryLabel.textContent = "Entry Price";
        const entryValue = document.createElement("div");
        entryValue.className = "trade-stat-value";
        entryValue.textContent = `$${entry}`;
        entryStat.appendChild(entryLabel);
        entryStat.appendChild(entryValue);

        // Exit Price
        const exitStat = document.createElement("div");
        exitStat.className = "trade-stat";
        const exitLabel = document.createElement("div");
        exitLabel.className = "trade-stat-label";
        exitLabel.textContent = "Exit Price";
        const exitValue = document.createElement("div");
        exitValue.className = "trade-stat-value";
        exitValue.textContent = exit !== null ? `$${exit}` : "-";
        exitStat.appendChild(exitLabel);
        exitStat.appendChild(exitValue);

        stats.appendChild(entryStat);
        stats.appendChild(exitStat);

        // PnL
        const pnlContainer = document.createElement("div");
        pnlContainer.className = "trade-pnl";
        const pnlLabel = document.createElement("div");
        pnlLabel.className = "trade-pnl-label";
        pnlLabel.textContent = "Profit & Loss";
        const pnlValue = document.createElement("div");
        pnlValue.className = "trade-pnl-value";
        
        if (isOpen) {
            pnlValue.textContent = "OPEN";
            pnlValue.classList.add("open");
        } else if (pnl !== null) {
            pnlValue.textContent = `${pnl >= 0 ? '+' : ''}$${pnl}`;
            if (isProfit) {
                pnlValue.classList.add("profit");
            } else if (isLoss) {
                pnlValue.classList.add("loss");
            }
        } else {
            pnlValue.textContent = "-";
        }

        pnlContainer.appendChild(pnlLabel);
        pnlContainer.appendChild(pnlValue);

        // Assemble card
        tradeCard.appendChild(header);
        tradeCard.appendChild(stats);
        tradeCard.appendChild(pnlContainer);

        tradesContainer.appendChild(tradeCard);
    });

    // Update total PnL card with color coding
    const totalPnLRounded = round(totalPnL, 2);
    totalPnlValue.innerText = `${totalPnLRounded >= 0 ? '+' : ''}$${totalPnLRounded}`;
    
    // Remove existing color classes
    totalPnlValue.classList.remove("profit", "loss");
    
    // Add appropriate color class
    if (totalPnLRounded > 0) {
        totalPnlValue.classList.add("profit");
    } else if (totalPnLRounded < 0) {
        totalPnlValue.classList.add("loss");
    }

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
                        borderColor: "rgba(102, 126, 234, 1)",
                        backgroundColor: "rgba(102, 126, 234, 0.1)",
                        borderWidth: 3,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: "rgba(102, 126, 234, 1)",
                        pointBorderColor: "#fff",
                        pointBorderWidth: 2,
                        fill: true
                    }]
                },
                options: {
                    responsive: false,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            labels: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            title: { 
                                display: true, 
                                text: "Time",
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                font: {
                                    size: 10
                                }
                            }
                        },
                        y: {
                            title: { 
                                display: true, 
                                text: "Cash ($)",
                                font: {
                                    size: 12,
                                    weight: 'bold'
                                }
                            },
                            ticks: {
                                font: {
                                    size: 10
                                }
                            }
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
    const priceElement = document.getElementById("current_price_value");
    if (priceElement) {
        priceElement.textContent = `$${round(data, 2)}`;
    } else {
        priceUpdated.innerText = `Current Price: $${round(data, 2)}`;
    }
}

// Fetch rolling high/low
async function fetchHighLow() {
    const response = await fetch('/high_low');
    const data = await response.json();
    highLowContainer.innerText = `High: ${round(data.high, 2)}  |  Low: ${round(data.low, 2)}`;
}

// Refresh every 5 seconds
setInterval(() => {
    fetchTrades();
    getCurrentPrice();
    fetchHighLow();
}, 5000);

// Initial load
fetchTrades();
getCurrentPrice();
fetchHighLow();
