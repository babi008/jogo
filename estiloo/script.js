const player = document.getElementById("player");
    const obstacles = document.querySelectorAll(".obstacle");
    const final = document.querySelector(".final");

    let position = 50;
    let isOnTop = false;
    let keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowRight: false
    };
    const passedObstacles = new Set();

    const levelMessages = {
      "5": "🎈 Você passou pela infância!",
      "10": "📚 Sobreviveu à pré-adolescência!",
      "15": "🔥 15 anos de coragem!",
      "18": "🎉 Bem-vindo à maioridade!"
    };

    document.addEventListener("keydown", (e) => {
      if (e.code in keys) {
        keys[e.code] = true;

        if (e.code === "ArrowUp") {
          player.src = "imagem/download (1).png";
          player.style.bottom = "";
          player.style.top = "0";
          isOnTop = true;
        }

        if (e.code === "ArrowDown") {
          player.src = "imagem/download (2).png";
          player.style.top = "";
          player.style.bottom = "0";
          isOnTop = false;
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.code in keys) {
        keys[e.code] = false;
      }
    });

    function movePlayer() {
      if (keys.ArrowRight) {
        position += 2;
        player.style.left = position + "px";
      }

      obstacles.forEach(obstacle => {
        const obsLeft = parseInt(obstacle.style.left);
        const obsLevel = obstacle.dataset.level;

        if (position + 60 > obsLeft && position < obsLeft + 40) {
          const isTopObstacle = obstacle.classList.contains("top");
          const isBottomObstacle = obstacle.classList.contains("bottom");

          if ((isTopObstacle && isOnTop) || (isBottomObstacle && !isOnTop)) {
            alert("💥 Você colidiu com o obstáculo do nível " + obsLevel);
            location.reload();
          }
        }

        if (position > obsLeft + 40 && !passedObstacles.has(obsLevel)) {
          passedObstacles.add(obsLevel);
          showLevelMessage(obsLevel);
        }
      });

      const finalLeft = parseInt(final.style.left);
      if (position >= finalLeft) {
        clearInterval(gameLoop);
        document.getElementById("puzzleBox").classList.remove("hidden");
      }
    }

    function showLevelMessage(level) {
      const msg = document.getElementById("levelMessage");
      msg.textContent = levelMessages[level] || `✅ Você passou pelo nível ${level}!`;
      msg.classList.remove("hidden");
      setTimeout(() => {
        msg.classList.add("hidden");
      }, 2500);
    }

    const gameLoop = setInterval(movePlayer, 20);

    // Quebra-cabeça
    const pieces = document.querySelectorAll('.piece');
    const dropZones = document.querySelectorAll('.drop-zone');
    let completedPieces = 0;

    pieces.forEach(piece => {
      piece.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData("text/plain", piece.dataset.number);
      });
    });

    dropZones.forEach(zone => {
      zone.addEventListener('dragover', (e) => e.preventDefault());

      zone.addEventListener('drop', (e) => {
        const number = e.dataTransfer.getData("text/plain");
        if (zone.dataset.number === number) {
          zone.textContent = number;
          zone.classList.add("filled");
          completedPieces += 1;

          const draggedPiece = document.querySelector(`.piece[data-number="${number}"]`);
          draggedPiece.remove();

          if (completedPieces === 2) {
            showCongratulations();
          }
        }
      });
    });

    function showCongratulations() {
      document.getElementById("puzzleBox").classList.add("hidden");
      document.getElementById("message").classList.remove("hidden");
      celebrate();
      launchConfetti(); // 🎉 Aqui está a mágica!
    }

    function celebrate() {
      player.style.transition = "bottom 0.3s ease";
      player.style.bottom = "100px";
      setTimeout(() => player.style.bottom = "0px", 300);

      const confetti = document.createElement("div");
      confetti.className = "confetti";
      document.body.appendChild(confetti);

      for (let i = 0; i < 100; i++) {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.left = Math.random() * window.innerWidth + "px";
        dot.style.top = Math.random() * 100 + "px";
        dot.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.appendChild(dot);
      }


      setTimeout(() => confetti.remove(), 3000);
    }
    function launchConfetti() {
      const confettiContainer = document.createElement("div");
      confettiContainer.className = "confetti";
      document.body.appendChild(confettiContainer);
    
      for (let i = 0; i < 100; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
    
        piece.style.left = Math.random() * 100 + "vw";
        piece.style.top = Math.random() * -100 + "px";
        piece.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        piece.style.animationDuration = (2 + Math.random() * 2) + "s";
        piece.style.animationDelay = Math.random() + "s";
    
        confettiContainer.appendChild(piece);
      }
    
      // Remover após 5s
      setTimeout(() => confettiContainer.remove(), 5000);
    }

    // Controles Mobile
    function moveUp() {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    }

    function moveDown() {
      document.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    }

    function startMovingRight() {
      keys.ArrowRight = true;
      if (!window.mobileMoveInterval) {
        window.mobileMoveInterval = setInterval(() => {
          position += 2;
          player.style.left = position + "px";
        }, 20);
      }
    }

    function stopMovingRight() {
      keys.ArrowRight = false;
      clearInterval(window.mobileMoveInterval);
      window.mobileMoveInterval = null;
    }