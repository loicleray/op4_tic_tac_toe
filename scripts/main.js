
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
    
    let _isGameOver = false;
    let _gameWinner = null;
    let _winningCombo = null;

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

    const _getBoardPositions = () => {
        let usedFields = {
            'Player1_positions': [],
            'Player2_positions': [],
            'Null_positions': [],
        };
    
        for (let i = 0; i < 9; i++){
            if (gameBoard.getField(i) == Player1.getSign()) {
                usedFields.Player1_positions.push(i);
                continue;
            };
            if (gameBoard.getField(i) == Player2.getSign()) {
                usedFields.Player2_positions.push(i);
                continue;
            };
            if (gameBoard.getField(i) == null) {
                usedFields.Null_positions.push(i);
                continue;
            };
            
        };

        return usedFields
    };

    // Check for winning combinations TK
    function updateGameStatus() {

        const usedFields = _getBoardPositions()

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

        // actual game outcome logic
        for (let index = 0; index < winningPositions.length; index++){
            if (winningPositions[index].every( (item) => usedFields.Player1_positions.includes(item))){
                _isGameOver = true;
                _gameWinner = _players[0];
                _winningCombo = winningPositions[index]
                break
            };
            if (winningPositions[index].every( (item) => usedFields.Player2_positions.includes(item))){
                _isGameOver = true;
                _gameWinner = _players[1];
                _winningCombo = winningPositions[index]
                break
            };
            
        };

        if (gameBoard.isFull() && _gameWinner == null){
            _isGameOver = true;
            _winningCombo = null
        };
    };

    const resetGameLogic = () => {
        _currentPlayer = _players[0];
        _isGameOver = false;
        _gameWinner = null;
    };

    return {
            getCurrentPlayer,
            switchPlayer,
            makeMove,
            updateGameStatus,
            getIsGameOver: () => _isGameOver,
            getWinningCombo: () => _winningCombo,
            getGameWinner: () => _gameWinner,
            resetGameLogic,
        };
};


// Create a couple of players

const person1 = Player('Player 1', '🤞');
const person2 = Player('Player 2', '👌');

// Game Display IIFE
const displayController = (() => {

    // make game instance
    gameInstance = GameLogic(person1, person2);

    // DOM elements
    const messageSpanDOM = document.getElementById('message-span');
    const resetButtonDOM = document.getElementById('reset-button');
    const modifyPlayersButtonDOM = document.getElementById('modify-players-button');
    // Elements in Dialog
    const playerDialogDOM = document.getElementById('dialogue-player-info')
    const closeDialogButtonDOM = document.getElementById('closeDialogButton')
    const submitDialogButtonDOM = document.getElementById('submitDialogButton')

    const gameCells = document.querySelectorAll('.gameboard__cell');

    // changes DOM contents (cells and headings) based off gameboard array
    function updateBoardDisplay() {
        // update the board
        for (let i = 0; i < gameCells.length; i++){
            gameCells[i].innerHTML = gameBoard.getField(i);
            };
        };

    function updateMessageDisplay() {
        // update the current player
        if (gameInstance.getIsGameOver() == false) {
            messageSpanDOM.innerHTML = gameInstance.getCurrentPlayer().getName();
        };

        if (gameInstance.getIsGameOver() == true){
            let winner = gameInstance.getGameWinner(); 

            if (winner) {
                messageSpanDOM.innerHTML = `${winner.getName()} wins!`;
            } else {
                messageSpanDOM.innerHTML = `It's a tie!`;
            };
        };
    };

    function updateAllDisplay() {
        updateBoardDisplay();
        updateMessageDisplay();
    };

    // reset button functionality
    resetButtonDOM.addEventListener("click", (e) => {
        gameBoard.resetBoard();
        gameInstance.resetGameLogic();  
        updateAllDisplay();
    });

    modifyPlayersButtonDOM.addEventListener("click", (e) => {
        playerDialogDOM.showModal()
    });

    closeDialogButtonDOM.addEventListener("click", (e) => {
        playerDialogDOM.close()
    });


    // intitial render
    updateAllDisplay()

        // game cell functionality (depending of if game isGameOver boolean)
        gameCells.forEach(cell => cell.addEventListener('click', (e) => {
            const cellIndex = e.target.getAttribute('data-game-cell-index');
            if (gameInstance.getIsGameOver() == false) {
                // e.target.classlist.add(`${gameInstance.getCurrentPlayer().getName}`)
                // console.log(`Cell \'${cellIndex}\' clicked by \'${gameInstance.getCurrentPlayer().getName()}`)
                gameInstance.makeMove(gameInstance.getCurrentPlayer(), cellIndex);
                gameInstance.updateGameStatus();
                updateAllDisplay();
            };
            if (gameInstance.getIsGameOver()) {
                alert("Game has ended. Thanks for playing.")
                // add css class to prevent hover color change of cells
            };
        }));

})();