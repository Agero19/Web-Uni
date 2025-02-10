function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function randomCoord(min, max) {
  return {
    x: randomNumber(min, max),
    y: randomNumber(min, max),
  };
}

function randomCoords(min, max, length) {
  return Array(length)
    .fill()
    .map(() => randomCoord(min, max));
}

function sqrDist(cord1, cord2) {
  const dist_x = cord2.x - cord1.x;
  const dist_y = cord2.y - cord1.y;
  return dist_x * dist_x + dist_y * dist_y;
}

function dist(cord1, cord2) {
  return Math.sqrt(sqrDist(cord1, cord2));
}

function tabDist(tab) {
  if (tab.length < 2) return 0;

  return tab.reduce((sum, coord, i) => {
    if (i === 0) return 0;
    return sum + dist(tab[i - 1], coord);
  }, 0);
}

function plus_pres_de(c, c1, c2) {
  const d1 = sqrDist(c, c1);
  const d2 = sqrDist(c, c2);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

function tri_plus_proche(c, tab) {
  return [...tab].sort((a, b) => plus_pres_de(c, a, b));
}

function tri_plus_loin(c, tab) {
  return [...tab].sort((a, b) => plus_pres_de(c, b, a));
}

function tri_glouton(tab) {
  if (tab.length <= 1) return [...tab];

  const result = [tab[0]];
  let remaining = tab.slice(1);

  while (remaining.length > 0) {
    const current = result[result.length - 1];
    remaining = tri_plus_proche(current, remaining);
    result.push(remaining[0]);
    remaining = remaining.slice(1);
  }

  return result;
}

const coords = randomCoords(0, 100, 10);
console.log("Tableau original:", coords);

const tri1 = tri_glouton(coords);
console.log("Distance trajet 1:", tabDist(tri1));

const tri2 = tri_glouton([...coords].reverse());
console.log("Distance trajet 2:", tabDist(tri2));
