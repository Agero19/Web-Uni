// Fonction qui renvoie un nombre pseudo-aléatoire entre min et max
function nbAlea(min, max) {
  min = parseInt(min);
  max = parseInt(max);
  var nb = min + (max - min + 1) * Math.random();
  return Math.floor(nb);
}

// Classe pour gérer le jeu
class DevineJeu {
  constructor() {
    this.min = 0;
    this.max = 100;
    this.targetNumber = 0;
    this.attempts = 0;
    this.isPlaying = false;
    this.highScores = JSON.parse(localStorage.getItem("highScores")) || [];

    // Éléments du DOM
    this.setupScreen = document.getElementById("setup-screen");
    this.gameScreen = document.getElementById("game-screen");
    this.resultScreen = document.getElementById("result-screen");
    this.minInput = document.getElementById("min-value");
    this.maxInput = document.getElementById("max-value");
    this.guessInput = document.getElementById("guess");
    this.attemptsElement = document.getElementById("attempts");
    this.feedbackElement = document.getElementById("feedback");
    this.resultMessageElement = document.getElementById("result-message");
    this.currentMinElement = document.getElementById("current-min");
    this.currentMaxElement = document.getElementById("current-max");
    this.highScoresElement = document.getElementById("high-scores");

    // Boutons
    this.startButton = document.getElementById("start-game");
    this.submitButton = document.getElementById("submit-guess");
    this.newGameButton = document.getElementById("new-game");
    this.quitGameButton = document.getElementById("quit-game");
    this.playAgainButton = document.getElementById("play-again");
    this.changeRangeButton = document.getElementById("change-range");

    // Initialisation des événements
    this.initEventListeners();
    this.updateHighScores();
  }

  initEventListeners() {
    this.startButton.addEventListener("click", () => this.startGame());
    this.submitButton.addEventListener("click", () => this.checkGuess());
    this.newGameButton.addEventListener("click", () => this.startNewGame());
    this.quitGameButton.addEventListener("click", () => this.quitGame());
    this.playAgainButton.addEventListener("click", () => this.startNewGame());
    this.changeRangeButton.addEventListener("click", () =>
      this.showSetupScreen()
    );

    this.guessInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.checkGuess();
      }
    });
  }

  showSetupScreen() {
    this.setupScreen.classList.remove("hidden");
    this.gameScreen.classList.add("hidden");
    this.resultScreen.classList.add("hidden");
    this.isPlaying = false;
  }

  showGameScreen() {
    this.setupScreen.classList.add("hidden");
    this.gameScreen.classList.remove("hidden");
    this.resultScreen.classList.add("hidden");
  }

  showResultScreen() {
    this.setupScreen.classList.add("hidden");
    this.gameScreen.classList.add("hidden");
    this.resultScreen.classList.remove("hidden");
  }

  startGame() {
    // Récupérer et valider l'intervalle
    let min = parseInt(this.minInput.value);
    let max = parseInt(this.maxInput.value);

    if (isNaN(min) || isNaN(max) || min >= max) {
      alert("Veuillez entrer un intervalle valide (min < max).");
      return;
    }

    // Configurer et démarrer le jeu
    this.min = min;
    this.max = max;
    this.targetNumber = nbAlea(min, max);
    this.attempts = 0;
    this.isPlaying = true;

    // Mettre à jour l'interface
    this.attemptsElement.textContent = this.attempts;
    this.currentMinElement.textContent = this.min;
    this.currentMaxElement.textContent = this.max;
    this.feedbackElement.classList.add("hidden");
    this.guessInput.value = "";

    this.showGameScreen();
    this.guessInput.focus();
  }

  startNewGame() {
    this.targetNumber = nbAlea(this.min, this.max);
    this.attempts = 0;
    this.isPlaying = true;

    this.attemptsElement.textContent = this.attempts;
    this.feedbackElement.classList.add("hidden");
    this.guessInput.value = "";

    this.showGameScreen();
    this.guessInput.focus();
  }

  quitGame() {
    if (confirm("Êtes-vous sûr de vouloir quitter la partie en cours ?")) {
      this.showSetupScreen();
    }
  }

  checkGuess() {
    if (!this.isPlaying) return;

    const guess = parseInt(this.guessInput.value);

    if (isNaN(guess)) {
      alert("Veuillez entrer un nombre valide.");
      this.guessInput.focus();
      return;
    }

    this.attempts++;
    this.attemptsElement.textContent = this.attempts;

    this.feedbackElement.classList.remove("hidden");

    if (guess < this.targetNumber) {
      this.feedbackElement.textContent = `Le nombre à deviner est plus grand que ${guess}.`;
      this.feedbackElement.style.backgroundColor = "#fef3c7";
    } else if (guess > this.targetNumber) {
      this.feedbackElement.textContent = `Le nombre à deviner est plus petit que ${guess}.`;
      this.feedbackElement.style.backgroundColor = "#fef3c7";
    } else {
      this.isPlaying = false;
      this.feedbackElement.textContent = `Bravo ! Vous avez trouvé le nombre ${
        this.targetNumber
      } en ${this.attempts} tentative${this.attempts > 1 ? "s" : ""}.`;
      this.feedbackElement.style.backgroundColor = "#d1fae5";

      this.saveScore();

      setTimeout(() => {
        this.resultMessageElement.textContent = `Vous avez trouvé le nombre ${
          this.targetNumber
        } en ${this.attempts} tentative${this.attempts > 1 ? "s" : ""}.`;
        this.showResultScreen();
      }, 1500);
    }

    this.guessInput.value = "";
    this.guessInput.focus();
  }

  saveScore() {
    const score = {
      attempts: this.attempts,
      range: `${this.min} - ${this.max}`,
      date: new Date().toLocaleDateString(),
    };
    this.highScores.push(score);

    // Trier par nombre de tentatives (croissant)
    this.highScores.sort((a, b) => a.attempts - b.attempts);
    localStorage.setItem("highScores", JSON.stringify(this.highScores));
    this.updateHighScores();
  }

  updateHighScores() {
    if (this.highScores.length === 0) {
      this.highScoresElement.innerHTML =
        '<tr><td colspan="4">Aucun score enregistré</td></tr>';
      return;
    }

    let html = "";
    const topScores = this.highScores.slice(0, 5);
    topScores.forEach((score, index) => {
      html += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${score.attempts}</td>
                        <td>${score.range}</td>
                        <td>${score.date}</td>
                    </tr>
                    `;
    });

    this.highScoresElement.innerHTML = html;
  }
}

// Initialiser le jeu
document.addEventListener("DOMContentLoaded", () => {
  const game = new DevineJeu();
});
