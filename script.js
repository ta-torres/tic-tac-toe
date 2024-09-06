const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
        }
    };

    const setBoard = (index, value) => {
        if (board[index] !== "") {
            return;
        }
        board[index] = value;
    };

    return {
        getBoard,
        resetBoard,
        setBoard
    };
})();

const Player = (symbol) => {
    this.symbol = symbol;
    const getSymbol = () => symbol;

    return { getSymbol };
};

const gameController = (() => {
    let players = [Player("X"), Player("O")];
    let currentPlayerIndex = 0;
    let isGameOver = false;
    let result = "";
    let winningSquares = [];

    const setPlayers = (player1, player2) => players = [player1, player2];

    const getCurrentPlayer = () => players[currentPlayerIndex];

    const switchPlayer = () => currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;

    const getIsGameOver = () => isGameOver;

    const getResult = () => result;

    const getWinningSquares = () => winningSquares;

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                winningSquares = [a, b, c];
                return squares[a];
            }
        }
        return squares.includes("") ? null : result = "tie";
    };

    const playRound = (index) => {
        if (gameBoard.getBoard()[index] !== "") {
            console.log(`Cell at index ${index} is already taken.`);
            return;
        }

        const currentPlayer = getCurrentPlayer();

        gameBoard.setBoard(index, currentPlayer.getSymbol());
        console.log(gameBoard.getBoard());

        result = calculateWinner(gameBoard.getBoard());
        if (!result) {
            switchPlayer();
        } else {
            isGameOver = true;

            if (result === "tie") {
                console.log("It's a tie!");
            } else {
                console.log(`The winner is: ${currentPlayer.getSymbol()}`);
            }
            //resetGame();
        }
    };

    const resetGame = () => {
        gameBoard.resetBoard();
        currentPlayerIndex = 0;
        isGameOver = false;
        result = "";
        winningSquares = [];
    };

    return {
        setPlayers,
        getCurrentPlayer,
        getIsGameOver,
        getResult,
        getWinningSquares,
        calculateWinner,
        playRound,
        resetGame,
    };
})();

const displayController = (() => {
    const board = document.querySelector(".board");
    const cells = document.querySelectorAll(".cell");
    const turn = document.querySelector(".turn-order");
    const gameOverModal = document.querySelector(".game-over");

    const initializeBoard = () => {
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => handleClick(index));
        });

        renderBoard();
        renderTurn();
        updateHoverEffect();
    };

    const handleClick = (index) => {
        if (gameController.getIsGameOver()) return;

        if (gameBoard.getBoard()[index] === "") {
            gameController.playRound(index);
            renderBoard();
            renderTurn();
            updateHoverEffect();
            if (gameController.getIsGameOver()) displayGameOver();
        }
    };

    const renderBoard = () => {
        const board = gameBoard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
            cell.classList.remove("winning-cell");
        });
    };

    const renderTurn = () => {
        const symbol = gameController.getCurrentPlayer().getSymbol();
        turn.textContent = symbol;
    };

    const toggleWinningSquares = () => {
        const winningSquares = gameController.getWinningSquares();
        if (winningSquares) {
            winningSquares.forEach((square) => {
                cells[square].classList.toggle("winning-cell");
            });
        }
    };

    const updateHoverEffect = () => {
        const symbol = gameController.getCurrentPlayer().getSymbol();
        cells.forEach(cell => {
            if (cell.textContent === "") {
                cell.setAttribute("symbol-hover", symbol);
            } else {
                cell.removeAttribute("symbol-hover");
            }
        });
    };

    const displayGameOver = () => {
        board.classList.add("game-over-state");
        gameOverModal.classList.remove("disabled");
        const winner = gameController.getCurrentPlayer().getSymbol();

        if (gameController.getResult() === "tie") {
            gameOverModal.querySelector("#result").textContent = "It's a tie";
            gameOverModal.querySelector("#game-over-text").textContent = "";
        }
        else {
            toggleWinningSquares();
            gameOverModal.querySelector("#game-over-text").textContent = "Congratulations!";
            gameOverModal.querySelector("#result").textContent = "The winner is: " + winner;
        }
    };

    const resetGame = () => {
        board.classList.remove("game-over-state");
        gameOverModal.classList.add("disabled");
        gameController.resetGame();
        toggleWinningSquares();
        renderBoard();
        renderTurn();
        updateHoverEffect();
    };

    gameOverModal.querySelector("#reset-btn").addEventListener("click", resetGame);

    return {
        initializeBoard,
    };
})();

document.addEventListener("DOMContentLoaded", () => displayController.initializeBoard());
