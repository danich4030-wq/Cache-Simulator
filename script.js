function runSimulation() {

    let cacheSize = parseInt(document.getElementById("cacheSize").value);
    let addresses = document.getElementById("addresses").value.split(",").map(Number);
    let mapping = document.getElementById("mapping").value;

    let steps = document.getElementById("steps");
    let table = document.getElementById("tableBody");

    steps.innerHTML = "";
    table.innerHTML = "";

    let cache = [];
    let sets = {};
    let hits = 0;
    let misses = 0;

    let hitData = [];
    let missData = [];

    addresses.forEach((addr, i) => {

        setTimeout(() => {

            let result = "";

            // ---------------- DIRECT ----------------
            if (mapping === "direct") {
                let index = addr % cacheSize;

                if (cache[index] === addr) {
                    hits++;
                    result = "HIT";
                } else {
                    misses++;
                    cache[index] = addr;
                    result = "MISS";
                }
            }

            // ---------------- FIFO ----------------
            else if (mapping === "fifo") {
                if (cache.includes(addr)) {
                    hits++;
                    result = "HIT";
                } else {
                    misses++;
                    if (cache.length >= cacheSize) cache.shift();
                    cache.push(addr);
                    result = "MISS";
                }
            }

            // ---------------- LRU ----------------
            else if (mapping === "lru") {
                let pos = cache.indexOf(addr);

                if (pos !== -1) {
                    hits++;
                    cache.splice(pos, 1);
                    cache.push(addr);
                    result = "HIT";
                } else {
                    misses++;
                    if (cache.length >= cacheSize) cache.shift();
                    cache.push(addr);
                    result = "MISS";
                }
            }

            // ---------------- SET ASSOCIATIVE ----------------
            else if (mapping === "set") {
                let setSize = 2;
                let setIndex = addr % setSize;

                if (!sets[setIndex]) sets[setIndex] = [];

                if (sets[setIndex].includes(addr)) {
                    hits++;
                    result = "HIT";
                } else {
                    misses++;
                    if (sets[setIndex].length >= 2) sets[setIndex].shift();
                    sets[setIndex].push(addr);
                    result = "MISS";
                }
            }

            // UI UPDATE
            steps.innerHTML += `Step ${i + 1}: ${addr} → ${result}<br>`;

            table.innerHTML += `
                <tr>
                    <td>${addr}</td>
                    <td style="color:${result === "HIT" ? "lime" : "red"}">${result}</td>
                </tr>
            `;

            hitData.push(hits);
            missData.push(misses);

            document.getElementById("result").innerHTML =
                `Hits: ${hits} | Misses: ${misses}`;

        }, i * 600);
    });

    setTimeout(() => {
        drawChart(hitData, missData);
    }, addresses.length * 700);
}

// ---------------- GRAPH ----------------
function drawChart(hitData, missData) {

    let ctx = document.getElementById("chart").getContext("2d");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: hitData.map((_, i) => i + 1),
            datasets: [
                {
                    label: "Hits",
                    data: hitData,
                    borderColor: "green"
                },
                {
                    label: "Misses",
                    data: missData,
                    borderColor: "red"
                }
            ]
        }
    });
}