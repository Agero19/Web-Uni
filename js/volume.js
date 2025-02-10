function vol_cylindre(h, r) {
  return Math.PI * r * r * h;
}

console.log(vol_cylindre(2, 3));

function vol_cylindre_tab(h_min, h_max, r_min, r_max, pas_h = 1, pas_r = 1) {
  let tableau = [];

  for (let h = h_min; h <= h_max; h += pas_h) {
    for (let r = r_min; r <= r_max; r += pas_r) {
      let volume = vol_cylindre(h, r);
      tableau.push({ h: h, r: r, vol: volume });
    }
  }
  tableau.sort((a, b) => a.vol - b.vol);

  return tableau;
}

let t = vol_cylindre_tab(1, 3, 1, 3);
console.log(t);

let t_string = t.map((obj) => JSON.stringify(obj));
console.log(t_string);

t.forEach((obj) => {
  console.log(
    `Le volume d'un cylindre de rayon ${obj.r}cm et de hauteur ${obj.h}cm est ${obj.vol}cm³`
  );
});
