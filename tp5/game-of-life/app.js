// Constructeur JeuDeLaVie
function JeuDeLaVie(n) {
  // Attributs
  this.taille = n;
  this.jeuVie = Array(n)
    .fill()
    .map(() => Array(n).fill(false));
  this.isRunning = false;
  this.interval = null;
  this.generation = 0;

  // Initialisations aléatoires
  this.remplirAleatoire = function () {
    for (let i = 0; i < this.taille; i++) {
      for (let j = 0; j < this.taille; j++) {
        this.jeuVie[i][j] = Math.random() > 0.8; // 20% de chance d'être vivant
      }
    }
    this.generation = 0;
    document.getElementById("generation").textContent = this.generation;
  };

  this.remplirAleatoire();

  // Méthode pour créer la table dans un élément HTML
  this.creerTabDansId = function (id) {
    const container = document.getElementById(id);
    if (!container) return;

    container.innerHTML = "";
    const table = document.createElement("table");
    for (let i = 0; i < this.taille; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < this.taille; j++) {
        const td = document.createElement("td");
        if (this.jeuVie[i][j]) {
          td.classList.add("vivant");
        }

        // toggle vivant/mort au clic sur cellule
        td.dataset.row = i;
        td.dataset.col = j;
        td.addEventListener("click", (e) => {
          const row = parseInt(e.target.dataset.row);
          const col = parseInt(e.target.dataset.col);
          this.jeuVie[row][col] = !this.jeuVie[row][col];
          e.target.classList.toggle("vivant");
        });

        tr.appendChild(td);
      }
      table.appendChild(tr);
    }

    container.appendChild(table);
  };

  // Compter voisins vivants
  this.voisinsVivants = function (x, y) {
    let count = 0;

    // 8 voisins potentiels
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        // Ne compter pas la celluse elle-meme
        if (i === 0 && j === 0) continue;

        const nx = (x + i + this.taille) % this.taille;
        const ny = (y + j + this.taille) % this.taille;
        if (this.jeuVie[nx][ny]) {
          count++;
        }
      }
    }

    return count;
  };

  // Méthode pour calculer la prochaine génération
  this.oneTurn = function () {
    const newGrid = Array(this.taille)
      .fill()
      .map(() => Array(this.taille).fill(false));

    // Appliquer les règles du jeu de la vie
    for (let i = 0; i < this.taille; i++) {
      for (let j = 0; j < this.taille; j++) {
        const voisins = this.voisinsVivants(i, j);

        if (this.jeuVie[i][j] && (voisins === 2 || voisins === 3)) {
          newGrid[i][j] = true;
        } else if (!this.jeuVie[i][j] && voisins === 3) {
          newGrid[i][j] = true;
        }
      }
    }

    this.jeuVie = newGrid;
    this.generation++;
    document.getElementById("generation").textContent = this.generation;
  };

  // Méthode pour mettre à jour l'affichage
  this.mettreAJourAffichage = function () {
    const table = document.querySelector("#jeuDeLaVie table");
    if (!table) return;

    for (let i = 0; i < this.taille; i++) {
      for (let j = 0; j < this.taille; j++) {
        const cell = table.rows[i].cells[j];
        if (this.jeuVie[i][j]) {
          cell.classList.add("vivant");
        } else {
          cell.classList.remove("vivant");
        }
      }
    }
  };

  // Méthode pour avancer d'un tour
  this.unTour = function () {
    this.oneTurn();
    this.mettreAJourAffichage();
  };

  // Méthode pour démarrer l'animation
  this.demarrer = function (vitesse) {
    if (this.isRunning) return;

    this.isRunning = true;
    document.getElementById("status").textContent = "Simulation en cours...";

    const intervalMs = Math.max(50, 1000 - vitesse * 50);

    this.interval = setInterval(() => {
      this.unTour();
    }, intervalMs);
  };

  // Méthode pour arrêter l'animation
  this.arreter = function () {
    if (!this.isRunning) return;

    clearInterval(this.interval);
    this.isRunning = false;
    document.getElementById("status").textContent =
      "En pause - cliquez sur les cellules pour les activer/désactiver";
  };

  // Méthode pour réinitialiser la grille
  this.reinitialiser = function () {
    this.arreter();
    this.jeuVie = Array(this.taille)
      .fill()
      .map(() => Array(this.taille).fill(false));
    this.generation = 0;
    document.getElementById("generation").textContent = this.generation;
    this.mettreAJourAffichage();
    document.getElementById("status").textContent =
      "Grille réinitialisée - cliquez sur les cellules pour les activer/désactiver";
  };
}

document.addEventListener("DOMContentLoaded", function () {
  let gridSize = parseInt(document.getElementById("gridSize").value);
  let jeu = new JeuDeLaVie(gridSize);

  jeu.creerTabDansId("jeuDeLaVie");

  document.getElementById("startBtn").addEventListener("click", function () {
    const speed = parseInt(document.getElementById("speed").value);
    jeu.demarrer(speed);
  });

  document.getElementById("pauseBtn").addEventListener("click", function () {
    jeu.arreter();
  });

  document.getElementById("resetBtn").addEventListener("click", function () {
    jeu.reinitialiser();
  });

  document.getElementById("randomBtn").addEventListener("click", function () {
    jeu.arreter();
    jeu.remplirAleatoire();
    jeu.mettreAJourAffichage();
    document.getElementById("status").textContent =
      "Population aléatoire générée";
  });

  document.getElementById("gridSize").addEventListener("change", function () {
    const newSize = parseInt(this.value);
    if (newSize >= 10 && newSize <= 100) {
      jeu.arreter();
      jeu = new JeuDeLaVie(newSize);
      jeu.creerTabDansId("jeuDeLaVie");
      document.getElementById(
        "status"
      ).textContent = `Nouvelle grille ${newSize}×${newSize} créée`;
    }
  });

  document.getElementById("speed").addEventListener("change", function () {
    if (jeu.isRunning) {
      jeu.arreter();
      const speed = parseInt(this.value);
      jeu.demarrer(speed);
    }
  });
});
