function padovan_tableau_unshift(n) {
  let tableau = [];
  for (let i = 0; i <= n; i++) {
    if (i <= 2) {
      tableau.unshift(1);
    } else {
      tableau.unshift(tableau[1] + tableau[2]); // P(n) = P(n-2) + P(n-3)
    }
  }
  return tableau;
}

function padovan_tableau_push(n) {
  let tableau = [];
  for (let i = 0; i <= n; i++) {
    if (i <= 2) {
      tableau.push(1);
    } else {
      tableau.push(tableau[i - 2] + tableau[i - 3]); // P(n) = P(n-2) + P(n-3)
    }
  }
  return tableau;
}

function padovan_iterative(n) {
  if (n <= 2) return 1;

  let p0 = 1,
    p1 = 1,
    p2 = 1; // P(0), P(1), P(2)
  let pn = 0;

  for (let i = 3; i <= n; i++) {
    pn = p1 + p0; // P(n) = P(n-2) + P(n-3)
    p0 = p1;
    p1 = p2;
    p2 = pn;
  }

  return pn;
}

function padovan_recursive(n) {
  if (n <= 2) return 1;
  return padovan_recursive(n - 2) + padovan_recursive(n - 3);
}

function padovan_avec_unshift(n) {
  let tableau = padovan_tableau_unshift(n);
  return tableau[0]; // La tête du tableau contient P(n)
}

function padovan_avec_push(n) {
  let tableau = padovan_tableau_push(n);
  return tableau[n]; // La queue du tableau contient P(n)
}

function log_mesure(f, n) {
  const nb_repet = 100;
  let debut = performance.now();
  for (let k = 0; k <= nb_repet; k++) f(n);
  let fin = performance.now();
  console.log(
    `${nb_repet} appels à ${f.name}(${n}) prennent ${fin - debut} millisecondes`
  );
}

let n = 20;
log_mesure(padovan_iterative, n);
log_mesure(padovan_recursive, n);
log_mesure(padovan_avec_unshift, n);
log_mesure(padovan_avec_push, n);
