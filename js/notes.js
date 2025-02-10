function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function alea_note() {
  return {
    note: randomInt(0, 20),
    coeff: randomInt(1, 100),
  };
}

function alea_tab_notes(n) {
  return Array(n)
    .fill()
    .map(() => alea_note());
}

function const_tab_note(note, coeff, longueur) {
  return Array(longueur).fill({ note: note, coeff: coeff });
}

function poids_coeff(tab) {
  return tab.reduce((sum, item) => sum + item.coeff, 0);
}

function moyenne(tab) {
  const result = tab.reduce(
    (acc, item) => {
      return {
        sumProd: acc.sumProd + item.note * item.coeff,
        sumCoeff: acc.sumCoeff + item.coeff,
      };
    },
    { sumProd: 0, sumCoeff: 0 }
  );

  return result.sumCoeff === 0 ? 0 : result.sumProd / result.sumCoeff;
}

function mediane(tab) {
  if (tab.length === 0) return 0;

  const sortedTab = [...tab].sort((a, b) => a.note - b.note);
  const mid = Math.floor(sortedTab.length / 2);

  if (sortedTab.length % 2 === 0) {
    return (sortedTab[mid - 1].note + sortedTab[mid].note) / 2;
  } else {
    return sortedTab[mid].note;
  }
}

const tabAlea = alea_tab_notes(5);
console.log("Tableau aléatoire:", tabAlea);
console.log("Moyenne:", moyenne(tabAlea));
console.log("Médiane:", mediane(tabAlea));

const tabConst = const_tab_note(12, 2, 5);
console.log("\nTableau constant:", tabConst);
console.log("Moyenne:", moyenne(tabConst));
console.log("Médiane:", mediane(tabConst));
