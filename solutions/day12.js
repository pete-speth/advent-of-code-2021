const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const edges = utils.parseInputLinesToList(inputFilePath, parseEdge);

    // build graph
    const graph = {};
    edges.forEach((e) => {
      if (graph[e[0]]) {
        graph[e[0]].connections.push(e[1]);
      } else {
        graph[e[0]] = { connections: [e[1]] };
      }

      if (graph[e[1]]) {
        graph[e[1]].connections.push(e[0]);
      } else {
        graph[e[1]] = { connections: [e[0]] };
      }
    });

    let paths = [];
    traverse(graph, "start", ["start"], paths);

    let paths2 = [];
    traverseWithRepeatVisit(graph, "start", ["start"], paths2, false);

    return [paths.length, paths2.length];
  },
};

function parseEdge(line) {
  return line.trim().split("-");
}

function traverse(graph, node, path, paths) {
  if (node == "end") {
    paths.push(path);
  } else {
    graph[node].connections.forEach((c) => {
      if (c != "start") {
        if (!(isLowerCase(c) && path.includes(c))) {
          traverse(graph, c, path.concat(c), paths);
        }
      }
    });
  }
}

function traverseWithRepeatVisit(graph, node, path, paths, usedRepeat) {
  if (node == "end") {
    paths.push(path);
  } else {
    graph[node].connections.forEach((c) => {
      if (c != "start") {
        if (!(isLowerCase(c) && path.includes(c))) {
          traverseWithRepeatVisit(graph, c, path.concat(c), paths, usedRepeat);
        } else {
          if (!usedRepeat) {
            traverseWithRepeatVisit(graph, c, path.concat(c), paths, true);
          }
        }
      }
    });
  }
}

function isLowerCase(s) {
  return s.toLowerCase() === s;
}
