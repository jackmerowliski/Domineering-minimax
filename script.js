const boardSize = 8;
const board = new Array(boardSize).fill(null).map(() => new Array(boardSize).fill(null));
let currentPlayer = 'H'; // 'H' for horizontal, 'V' for vertical
let gameOver = false;

function promptForStartingPlayer() {
  const startingPlayer = prompt("Kurš sāks spēli? Ievadiet 'H' ja vēlaties sākt un 'V' ja vēlaties lai sāk dators:");

  if (startingPlayer === 'H' || startingPlayer === 'V') {
    currentPlayer = startingPlayer;
  } else {
    alert("Nepareiza ievade. Ievadiet 'H' ja vēlaties sākt un 'V' ja vēlaties lai sāk dators:");
    promptForStartingPlayer();
  }
}
promptForStartingPlayer();


function isValidMove(x, y, player) {
    if (board[y][x] !== null) return false;
    
    if (player === 'H') {
      if (x + 1 >= boardSize || board[y][x + 1] !== null) return false;
    } else {
      if (y + 1 >= boardSize || board[y + 1][x] !== null) return false;
    }
  
    return true;
  }
  function placePiece(x, y, player) {
    board[y][x] = player;
  
    if (player === 'H') {
      board[y][x + 1] = player;
    } else {
      board[y + 1][x] = player;
    }
  }
  function isGameOver() {
    let hMovesAvailable = false;
    let vMovesAvailable = false;
  
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (isValidMove(x, y, 'H')) hMovesAvailable = true;
        if (isValidMove(x, y, 'V')) vMovesAvailable = true;
      }
    }
  
    if (!hMovesAvailable && !vMovesAvailable) {
      return 'T'; 
    } else if (!hMovesAvailable) {
      return 'V';
    } else if (!vMovesAvailable) {
      return 'H';
    }
  
    return null;
  }
  
  
  function minimax(depth, isMaximizingPlayer) {
    if (depth === 0 || isGameOver()) {
      return evaluateBoard();
    }
  
    let bestValue = isMaximizingPlayer ? -Infinity : Infinity;
    const nextPlayer = currentPlayer === 'H' ? 'V' : 'H';
  
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (isValidMove(x, y, currentPlayer)) {
          placePiece(x, y, currentPlayer);
          currentPlayer = nextPlayer;
          const value = minimax(depth - 1, !isMaximizingPlayer);
          currentPlayer = nextPlayer === 'H' ? 'V' : 'H';
          unplacePiece(x, y);
  
          if (isMaximizingPlayer) {
            bestValue = Math.max(bestValue, value);
          } else {
            bestValue = Math.min(bestValue, value);
          }
        }
      }
    }
  
    return bestValue;
  }
  
  
  
  
  function getAIMove() {
    let bestMove = null;
    let bestValue = -Infinity;
  
    for (let y = 0; y < boardSize; y++) {
      for (let x = 0; x < boardSize; x++) {
        if (isValidMove(x, y, currentPlayer)) {
          placePiece(x, y, currentPlayer);
          const value = minimax(3, false); // depth
          unplacePiece(x, y);
  
          if (value > bestValue) {
            bestValue = value;
            bestMove = { x, y };
          }
        }
      }
    }
  
    if (bestMove === null) {
      return null;
    }
  
    return bestMove;
  }
  
  
  

  
  let winner = null;

  function handlePlayerMove(x, y) {
    if (!isValidMove(x, y, currentPlayer) || winner !== null) return;
  
    placePiece(x, y, currentPlayer);
    updateBoardUI(); // Add this line to update the UI before the AI starts its calculations
    winner = isGameOver();
  
    if (winner === null) {
      currentPlayer = currentPlayer === 'H' ? 'V' : 'H';
  
      if (currentPlayer === 'V') {
        updateStatusMessage(); // Update the status message before the AI starts thinking
        setTimeout(() => {
          const aiMove = getAIMove();
          if (aiMove === null) {
            winner = 'H';
          } else {
            placePiece(aiMove.x, aiMove.y, currentPlayer);
            winner = isGameOver();
            currentPlayer = currentPlayer === 'H' ? 'V' : 'H';
          }
  
          // Update the game status message and the board UI
          updateStatusMessage();
          updateBoardUI();
        }, 1000); // Add a delay of 1000 milliseconds (1 second) before the AI starts thinking
      } else {
        // Update the game status message and the board UI
        updateStatusMessage();
        updateBoardUI();
      }
    } else {
      // Update the game status message and the board UI
      updateStatusMessage();
      updateBoardUI();
    }
  }
  
  

  
  

function updateStatusMessage() {
  const statusElement = document.querySelector('.status');

  if (winner !== null) {
    if (winner === 'H') {
      statusElement.textContent = 'Spēlētāja uzvara!🧍';
    } else if (winner === 'V') {
      statusElement.textContent = 'Datora uzvara!💻';
    } else if (winner === 'T') { 
      statusElement.textContent = 'Neizšķirts';
    }
  } else {
    statusElement.textContent = currentPlayer === 'H' ? "Spēlētāja gājiens" : "Datora gājiens, lūdzu uzgaidiet...";
  }
}
  
      function updateBoardUI() {
        const boardElement = document.querySelector('.board');
      
        boardElement.innerHTML = '';
        for (let y = 0; y < boardSize; y++) {
          for (let x = 0; x < boardSize; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.style.gridRowStart = y + 1;
            cell.style.gridColumnStart = x + 1;
            cell.dataset.x = x;
            cell.dataset.y = y;
      
            if (board[y][x] !== null) {
              cell.classList.add(board[y][x] === 'H' ? 'horizontal' : 'vertical');
            }
      
            boardElement.appendChild(cell);
          }
        }
      }
      document.querySelector('.board').addEventListener('click', (event) => {
        if (gameOver) return;
      
        const x = parseInt(event.target.dataset.x, 10);
        const y = parseInt(event.target.dataset.y, 10);
      
        if (x !== undefined && y !== undefined) {
          handlePlayerMove(x, y);
        }
      });
      
      document.querySelector('.reset').addEventListener('click', () => {
        for (let y = 0; y < boardSize; y++) {
          for (let x = 0; x < boardSize; x++) {
            board[y][x] = null;
          }
        }
      
        promptForStartingPlayer();
        gameOver = false;
        winner = null;
      
        if (currentPlayer === 'V') {
          const aiMove = getAIMove();
          handlePlayerMove(aiMove.x, aiMove.y);
        } else {
          updateStatusMessage();
          updateBoardUI();
        }
      });
      
      function evaluateBoard(player) {
        let horizontalMoves = 0;
        let verticalMoves = 0;
        let blockingMoves = 0;
        let centeredMoves = 0;
      
        for (let y = 0; y < boardSize; y++) {
          for (let x = 0; x < boardSize; x++) {
            if (isValidMove(x, y, 'H')) {
              horizontalMoves++;
      
              // Check for potential blocking moves
              if (y - 1 >= 0 && isValidMove(x, y - 1, 'V')) {
                blockingMoves++;
              }
              if (y + 1 < boardSize && isValidMove(x, y + 1, 'V')) {
                blockingMoves++;
              }
      
              // Encourage centered moves
              if ((x === Math.floor(boardSize / 2) || x === Math.floor(boardSize / 2) - 1) &&
                  (y === Math.floor(boardSize / 2) || y === Math.floor(boardSize / 2) - 1)) {
                centeredMoves++;
              }
            }
            if (isValidMove(x, y, 'V')) {
              verticalMoves++;
      
              // Check for potential blocking moves
              if (x - 1 >= 0 && isValidMove(x - 1, y, 'H')) {
                blockingMoves--;
              }
              if (x + 1 < boardSize && isValidMove(x + 1, y, 'H')) {
                blockingMoves--;
              }
      
              // Encourage centered moves
              if ((x === Math.floor(boardSize / 2) || x === Math.floor(boardSize / 2) - 1) &&
                  (y === Math.floor(boardSize / 2) || y === Math.floor(boardSize / 2) - 1)) {
                centeredMoves--;
              }
            }
          }
        }
      
        const moveDifference = player === 'H' ? horizontalMoves - verticalMoves : verticalMoves - horizontalMoves;
      
        if (player === 'V') {
          return moveDifference * 3 + blockingMoves * 2.5 + centeredMoves * 1.5;
        } else {
          return moveDifference * 2 + blockingMoves * 1.5 + centeredMoves * 1;
        }
      }
      
      
      
      function unplacePiece(x, y) {
        board[y][x] = null;
      
        if (currentPlayer === 'H') {
          board[y][x + 1] = null;
        } else {
          board[y + 1][x] = null;
        }
      }
            
      updateBoardUI();
      if (currentPlayer === 'V') {
        const aiMove = getAIMove();
        handlePlayerMove(aiMove.x, aiMove.y);
      }           
                