function factorielle_iterative(n) {
  let resultat = 1;
  for (let i = 2; i <= n; i++) {
    resultat *= i;
  }
  return resultat;
}

function factorielle_recursive(n) {
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorielle_recursive(n - 1);
}

function factorielle_recursive_terminale(n, acc = 1) {
  if (n === 0 || n === 1) {
    return acc;
  }
  return factorielle_recursive_terminale(n - 1, n * acc);
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

log_mesure(factorielle_iterative, n);
log_mesure(factorielle_recursive, n);
log_mesure(factorielle_recursive_terminale, n);
