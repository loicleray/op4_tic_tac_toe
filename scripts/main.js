
// gameBoard IIFE, access to the methods on the object, but _board itself is private (limited to function scope).
const gameBoard = (() => {
    // create an empty array to represent the game board (3x3 = 9 total)
    const _board = new Array(9).fill(null);

    // shothand to access celll on the board
    const getField = (index) => _board[index];

    // set the value of a cell on the board
    const setField = (index, value) => _board[index] = value;

    // check if the board is full
    const isFull = () => _board.every((item) => item !== null);

    // reset the board to original state
    function resetBoard(){
        _board.forEach((item, index) => {
        _board[index] = null;
    })};
    return {
        getField,
        setField,
        resetBoard,
        isFull,
    };
})();

// Player Factory Function
function Player(name, symbol) {
    const getSign = () => symbol;
    const getName = () => name;

    return {getSign, getName};
};

// Game Logic
function GameLogic(Player1, Player2) {
    
    let isGameOver = false;
    let gameWinner = null
    const _players = [Player1, Player2];
    let _currentPlayer = _players[0];

    // switch players
    const switchPlayer = () => {
        if (_currentPlayer == _players[0]) {
            _currentPlayer = _players[1];
        } else {
            if (_currentPlayer == _players[1]) {
            _currentPlayer = _players[0];
            };
    }};

    const getCurrentPlayer = () => _currentPlayer;

    const makeMove = (player, index) => {
        // if spot free, place player sign and switch player
        if (gameBoard.getField(index) === null) {
            gameBoard.setField(index, player.getSign());
            switchPlayer();
        } else {
            // if not free, do nothing and post to console
            console.log(`Space \'${index}\' is already taken by \'${player.getName()}\'.`);
        }};

    // Check for winning combinations TK
    const checkGameStatus = () => {
            let usedFields = {
                            'Player1_positions': [],
                            'Player2_positions': [],
                            'Null_positions': [],
                        };

            const winningPositions = [
                                        [0, 1, 2],
                                        [3, 4, 5],
                                        [6, 7, 8],
                                        [0, 3, 6],
                                        [1, 4, 7],
                                        [2, 5, 8],
                                        [0, 4, 8],
                                        [2, 4, 6],
                                    ];
            
            for (let i = 0; i < 9; i++){
                if (gameBoard.getField(i) == Player1.getSign()){
                    usedFields.Player1_positions.push(i);
                } else if (gameBoard.getField(i) == Player2.getSign()){
                    usedFields.Player2_positions.push(i);
                } else {
                    usedFields.Null_positions.push(i);
                }
            };

            for (let index = 0; index < winningPositions.length; index++){
                if (winningPositions[index].every( (item) => usedFields.Player1_positions.includes(item))){
                    gameWinner = Player1;
                    alert(`${Player1.getName()} wins!`);
                    isGameOver = true;
                } else if (winningPositions[index].every( (item) => usedFields.Player2_positions.includes(item))){
                    gameWinner = Player2;
                    alert(`${Player2.getName()} wins!`);
                    isGameOver = true;
                } else if ((_players.every((player) => !player.isWinner)) && gameBoard.isFull()){
                    alert(`It's a draw!`);
                    isGameOver = true;
                } else {
                    isGameOver = false;
                };
            };
    };

    const resetGameLogic = () => {
        _currentPlayer = _players[0];
        isGameOver = false;
        gameWinner = null;
    }

    // const runGame = () => {
    //     while (! isGameOver) {
    //         // do something, maybe
    //     }
    // }

    return {
            getCurrentPlayer,
            switchPlayer,
            makeMove,
            checkGameStatus,
            gameWinner,
            isGameOver,
            resetGameLogic,
        };
};

// Testing Game Logic
// Create a couple of players
const person1 = Player('Player 1', 'X');
const person2 = Player('Player 2', 'O');

// Game Display IIFE
const displayController = (() => {
    // Create a game instance
    const gameInstance = GameLogic(person1, person2);

    // DOM elements
    const messageSpanDOM = document.getElementById('message-span');
    const resetButtonDOM = document.getElementById('reset-button');
    const gameCells = document.querySelectorAll('.gameboard__cell');
    
    // Initial display update
    updateDisplay();

    // changes DOM contents (cells and headings) based off gameboard array
    function updateDisplay() {
        // update the board
        for (let i = 0; i < gameCells.length; i++){
            gameCells[i].innerHTML = gameBoard.getField(i);
            };

        // update the current player
        messageSpanDOM.innerHTML = gameInstance.getCurrentPlayer().getName();
    };
    
    // game cell functionality
    gameCells.forEach(cell => cell.addEventListener('click', (e) => {
        const cellIndex = e.target.getAttribute('data-game-cell-index');
        console.log(`Cell \'${cellIndex}\' clicked by \'${gameInstance.getCurrentPlayer().getName()}`)
        gameInstance.makeMove(gameInstance.getCurrentPlayer(), cellIndex); //need
        updateDisplay();
        gameInstance.checkGameStatus();
    }));

    // reset button functionality
    resetButtonDOM.addEventListener("click", (e) => {
        gameBoard.resetBoard();
        gameInstance.resetGameLogic();  
        updateDisplay();
        console.log('reset button clicked');
    });

})();