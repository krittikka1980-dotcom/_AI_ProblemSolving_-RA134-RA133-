function parseGraph(input) {
    let edges = input.split(",");
    let graph = {};

    edges.forEach(edge => {
        let [a, b] = edge.trim().split("-");

        if (!graph[a]) graph[a] = [];
        if (!graph[b]) graph[b] = [];

        graph[a].push(b);
        graph[b].push(a);
    });

    return graph;
}

/* BFS */
function bfs(graph, start, goal) {
    let queue = [[start]];
    let visited = new Set();
    let nodes = 0;

    while (queue.length) {
        let path = queue.shift();
        let node = path[path.length - 1];
        nodes++;

        if (node === goal) return {path, nodes};

        if (!visited.has(node)) {
            visited.add(node);
            for (let n of graph[node]) {
                queue.push([...path, n]);
            }
        }
    }
    return {path: [], nodes};
}

/* DFS */
function dfs(graph, start, goal) {
    let stack = [[start]];
    let visited = new Set();
    let nodes = 0;

    while (stack.length) {
        let path = stack.pop();
        let node = path[path.length - 1];
        nodes++;

        if (node === goal) return {path, nodes};

        if (!visited.has(node)) {
            visited.add(node);
            for (let n of graph[node]) {
                stack.push([...path, n]);
            }
        }
    }
    return {path: [], nodes};
}

function run() {
    let graphInput = document.getElementById("graphInput").value;
    let start = document.getElementById("start").value.trim();
    let goal = document.getElementById("goal").value.trim();

    if (!graphInput || !start || !goal) {
        alert("Fill all fields!");
        return;
    }

    let graph = parseGraph(graphInput);

    let t1 = performance.now();
    let bfsResult = bfs(graph, start, goal);
    let t2 = performance.now();

    let t3 = performance.now();
    let dfsResult = dfs(graph, start, goal);
    let t4 = performance.now();

    document.getElementById("bfsPath").innerText = bfsResult.path.join(" → ");
    document.getElementById("dfsPath").innerText = dfsResult.path.join(" → ");

    document.getElementById("bfsStats").innerText =
        `BFS → Nodes: ${bfsResult.nodes}, Time: ${(t2 - t1).toFixed(2)} ms`;

    document.getElementById("dfsStats").innerText =
        `DFS → Nodes: ${dfsResult.nodes}, Time: ${(t4 - t3).toFixed(2)} ms`;

    drawGraph(graph, bfsResult.path);
}

/* GRAPH VISUALIZATION */
function drawGraph(graph, path) {
    const canvas = document.getElementById("graphCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let nodes = Object.keys(graph);
    let pos = {};

    let cx = canvas.width / 2;
    let cy = canvas.height / 2;
    let r = 150;

    nodes.forEach((node, i) => {
        let angle = (2 * Math.PI / nodes.length) * i;
        pos[node] = {
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        };
    });

    /* edges */
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;

    for (let n in graph) {
        for (let nei of graph[n]) {
            ctx.beginPath();
            ctx.moveTo(pos[n].x, pos[n].y);
            ctx.lineTo(pos[nei].x, pos[nei].y);
            ctx.stroke();
        }
    }

    /* path */
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 4;

    for (let i = 0; i < path.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(pos[path[i]].x, pos[path[i]].y);
        ctx.lineTo(pos[path[i+1]].x, pos[path[i+1]].y);
        ctx.stroke();
    }

    /* nodes */
    for (let n of nodes) {
        ctx.beginPath();
        ctx.fillStyle = "#38bdf8";
        ctx.arc(pos[n].x, pos[n].y, 18, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.fillText(n, pos[n].x - 5, pos[n].y + 5);
    }
}