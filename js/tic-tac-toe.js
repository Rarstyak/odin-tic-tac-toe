const Player = (name, marker) => {
    const _marker = marker;
    let _wins = 0;
    const getMarker = () => _marker;
    const win = () => _wins += 1;
    const getWins = () => _wins;
    return {
        name,
        getMarker,
        win,
        getWins,
    };
}

const Cell = () => {
    let _value = ' ';

    const getMark = () => _value;

    const setMark = (mark) => {
        if (_value === ' ') {
            _value = mark;
            return true;
        } else {
            return false;
        }
    };
    
    const clear = () => _value = ' ';

    return {
        getMark,
        setMark,
        clear,
    };
}

const GameBoard = () => {
    const _rows = 3;
    const _columns = 3;
    const _board = [];

    for (let i = 0; i < _rows; i += 1) {
        _board[i] = [];
        for (let j = 0; j < _columns; j += 1) {
            _board[i].push(Cell());
        }
    }

    const clear = () => {
        _board.map(
            (row) => row.map(
                (cell) => cell.clear()
            )
        );
    };

    const getBoard = () => _board;

    const getDisplay = () => {
        const display = _board.map(
            (row) => row.map(
                (cell) => cell.getMark()
            )
        );
        return display;
    };

    const getMark = (row, column) => _board[row][column].getMark();

    const setMark = (mark, row, column) => _board[row][column].setMark(mark);
    
    return {
        clear,
        getBoard,
        getDisplay,
        getMark,
        setMark,
    };
};

const GameController = () => {
    const _gameBoard = GameBoard();
    let _winner = "";

    const _players = [];
    _players.push(Player("One", "O"));
    _players.push(Player("Two", "X"));

    let activePlayer = _players[0];

    const newGame = () => {
        _gameBoard.clear();
        _winner = "";
    };

    const getGameBoard = () => _gameBoard;

    const getPlayers = () => _players;

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = () => {
        // Toggle between player 0 and 1, does not support multiple player history
        // To support multiple player history, would need to adjust _players
        activePlayer = (activePlayer === _players[1]) ? _players[0] : _players[1];
    };

    const _allEqual = (...arguments) => {
        return arguments.every( (element, index, array) => element === array[0]);
    };

    const checkWin = () => {
        const mark = activePlayer.getMarker();
        const display = _gameBoard.getDisplay();
        // Top Row
        if (_allEqual(activePlayer.getMarker(), display[0][0], display[0][1], display[0][2])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Top Row Victory for ${_winner.name}`);
        }
        // Mid Row
        if (_allEqual(mark, display[1][0], display[1][1], display[1][2])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Middle Row Victory for ${_winner.name}`);
        }
        // Bot Row
        if (_allEqual(mark, display[2][0], display[2][1], display[2][2])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Bottom Row Victory for ${_winner.name}`);
        }
        // Col One
        if (_allEqual(mark, display[0][0], display[1][0], display[2][0])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Column One Victory for ${_winner.name}`);
        }
        // Col Two
        if (_allEqual(mark, display[0][1], display[1][1], display[2][1])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Column Two Victory for ${_winner.name}`);
        }
        // Col Thr
        if (_allEqual(mark, display[0][2], display[1][2], display[2][2])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Column Three Victory for ${_winner.name}`);
        }
        // Diag /
        if (_allEqual(mark, display[2][0], display[1][1], display[0][2])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Forward Diagonal Victory for ${_winner.name}`);
        }
        // Diag \
        if (_allEqual(mark, display[0][0], display[1][1], display[2][2])) {
            _winner = activePlayer;
            _winner.win();
            console.log(`Backward Diagonal Victory for ${_winner.name}`);
        }
        // Tie
        if (display[0][0] != 0 && display[0][1] != 0 && display[0][2] != 0 &&
            display[1][0] != 0 && display[1][1] != 0 && display[0][2] != 0 && 
            display[2][0] != 0 && display[2][1] != 0 && display[0][2] != 0) {
            _winner = "TIE";
            console.log('Tie')
        }
    }

    // _winner can be "", "TIE", or one of the player objects in _players
    const getWinner = () => _winner;

    const playTurn = (row, column) => {
        const mark = activePlayer.getMarker();
        // Check for winner first, then try to set mark
        if (_winner || !_gameBoard.setMark(mark, row, column)) {
            // if bad turn log so and return
            console.log(`Invalid ${mark} move at (${row},${column})`);
            return false;
        } else {
            // if good turn, check win conditions and if not switch player
            console.log(`Valid ${mark} move at (${row},${column})`);
            checkWin();
            switchActivePlayer();
            return true;
        }
    };

    return {
        newGame,
        getGameBoard,
        getPlayers,
        getActivePlayer,
        getWinner,
        playTurn,
    };
};

const DisplayController = (() => {
    const _game = GameController();
    const _board = _game.getGameBoard().getBoard();
    const _cellButtons = [];

    // make and get all of the div s
    const _gameDiv = document.querySelector('#game');

    const _optionsDiv = document.createElement('div');

    const _playerLeftDiv = document.createElement('div');
    const _gameBoardDiv = document.createElement('div');
    const _playerRightDiv = document.createElement('div');

    const _infoDiv = document.createElement('div');

    const _playerLeftName = document.createElement('button');
    const _playerRightName = document.createElement('button');

    const _playerLeftWins = document.createElement('div');
    const _playerRightWins = document.createElement('div');

    _optionsDiv.classList.add('options');

    _playerLeftDiv.classList.add('player-left');
    _gameBoardDiv.classList.add('gameboard');
    _playerRightDiv.classList.add('player-right');

    _infoDiv.classList.add('info');

    _playerLeftDiv.appendChild(_playerLeftName);
    _playerRightDiv.appendChild(_playerRightName);

    _playerLeftDiv.appendChild(_playerLeftWins);
    _playerRightDiv.appendChild(_playerRightWins);

    _gameDiv.appendChild(_optionsDiv);
    _gameDiv.appendChild(_playerLeftDiv);
    _gameDiv.appendChild(_gameBoardDiv);
    _gameDiv.appendChild(_playerRightDiv);
    _gameDiv.appendChild(_infoDiv);

    // Player name change
    const changeName = (e) => {
        const playerNumber = e.target.getAttribute('data-player');
        const playerName = _game.getPlayers()[playerNumber].name;
        const promptName = prompt(`Please enter a new name for ${playerName}`);
        _game.getPlayers()[playerNumber].name = promptName ? promptName : playerName;
        render();
    }

    _playerLeftName.setAttribute('data-player', 0);
    _playerRightName.setAttribute('data-player', 1);
    _playerLeftName.addEventListener('click', changeName);
    _playerRightName.addEventListener('click', changeName);

    // Restart Button
    const restart = () => {
        _game.newGame();
        render();
    };

    const newGameButton = document.createElement('button');
    newGameButton.textContent = 'Restart';
    newGameButton.addEventListener('click', restart);
    _optionsDiv.appendChild(newGameButton);

    // On click, play round, then render
    const clickCell = (e) => {
        const row = e.target.getAttribute('data-row');
        const col = e.target.getAttribute('data-col');
        return _game.playTurn(row, col) ? render() : false;
    };

    // Game Cell Buttons
    _board.forEach(
        (row, rowIndex) => {
            row.forEach(
                (cell, colIndex) => {
                    const cellButton = document.createElement('button');
                    const mark = cell.getMark()
                    cellButton.setAttribute('data-mark', mark);
                    cellButton.setAttribute('data-row', rowIndex);
                    cellButton.setAttribute('data-col', colIndex);
                    // Could replace this with an img or svg later
                    cellButton.textContent = mark;
                    // Add event handler
                    cellButton.addEventListener('click', clickCell);
                    // Add to ref arrays
                    _gameBoardDiv.appendChild(cellButton);
                    _cellButtons.push(cellButton);
                }
            )
        }
    );

    const getGame = () => _game;

    const render = () => {
        // console.log("render")
        const players = _game.getPlayers();
        const leftPlayerNumber = _playerLeftName.getAttribute('data-player');
        const rightPlayerNumber = _playerRightName.getAttribute('data-player');

        _playerLeftName.textContent = players[leftPlayerNumber].name;
        _playerRightName.textContent = players[rightPlayerNumber].name;

        _playerLeftWins.textContent = players[leftPlayerNumber].getWins();
        _playerRightWins.textContent = players[rightPlayerNumber].getWins();

        _cellButtons.forEach(
            (cellDiv) => {
                const row = cellDiv.getAttribute('data-row');
                const col = cellDiv.getAttribute('data-col');
                const mark = _board[row][col].getMark()
                cellDiv.setAttribute('data-mark', mark);
                // Could replace this with an img or svg later
                cellDiv.textContent = mark;
            }
        );

        if (_game.getWinner() === 'TIE') {
            _infoDiv.textContent = `It's a tie! Press Restart at the top!`;
        } else if (_game.getWinner()) {
            _infoDiv.textContent = `${_game.getWinner().name} Won! Press Restart at the top!`;
        } else {
            _infoDiv.textContent = `It's ${_game.getActivePlayer().name}'s turn!`;
        }

        return true;
    };

    render();

    return {
        getGame,
        render,
    };
})();