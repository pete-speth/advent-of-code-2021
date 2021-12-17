const utils = require("../utils.js");

module.exports = {
  solve: (inputFilePath) => {
    const target = utils.parseInput(inputFilePath, parseTarget);

    // py will always hit 0 because py is symmetrical around py_max
    // when we reach 0 the current velocity is the negative of the initial velocity
    // the velocity on the next step must be small enough to land us inside the target zone
    vy_max = -1 * target.y_min - 1;
    // when t = vy then vy - v_grav = 0 so we are at peak py
    t_max = vy_max;
    let py_max = calculateYPosition(vy_max, t_max);

    let vy_min = target.y_min;
    let vPairs = [];
    // range of vy that it's possible to hit the target
    for (let vy = vy_min; vy <= vy_max; vy++) {
      let t = 1;
      let py = vy;
      // iterate until we drop below the loop
      while (py >= target.y_min) {
        // if we are in the target y range
        // find all vx at this time that puts us in the target x range
        if (py <= target.y_max) {
          for (let vx = 1; vx <= target.x_max; vx++) {
            let px = calculateXPosition(vx, t);
            if (px >= target.x_min && px <= target.x_max) {
              vPairs.push({ vx, vy });
            }
          }
        }

        py += vy - t;
        t++;
      }
    }

    // velocity pairs may be in the target at more than one value of t
    // use a hash to find the unique pairs
    let hashes = vPairs.map((v) => v.vx * 1000 + v.vy);
    let unique = [...new Set(hashes)];

    return [py_max, unique.length];
  },
};

function calculateXPosition(vx, t) {
  let px = 0;
  for (let tx = 0; tx < t; tx++) {
    if (vx > tx) {
      px += vx - tx;
    }
  }
  return px;
}

function calculateYPosition(vy, t) {
  let py = 0;
  for (let ty = 0; ty < t; ty++) {
    py += vy - ty;
  }
  return py;
}

function parseTarget(str) {
  let coords = str.match(/(-?\d+)/g).map((s) => parseInt(s));
  return {
    x_min: coords[0],
    x_max: coords[1],
    y_min: coords[2],
    y_max: coords[3],
  };
}
