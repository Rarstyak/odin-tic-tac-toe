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
        // Toggle between player 1 and 2
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
    const _cellDivs = [];

    // make and get all of the div s
    const _gameDiv = document.querySelector('#game');

    const _playerOneDiv = document.createElement('div');
    const _gameBoardDiv = document.createElement('div');
    const _playerTwoDiv = document.createElement('div');

    const _playerOneName = document.createElement('div');
    const _playerTwoName = document.createElement('div');

    const _playerOneWins = document.createElement('div');
    const _playerTwoWins = document.createElement('div');

    _playerOneDiv.classList.add('player-one');
    _gameBoardDiv.classList.add('gameboard');
    _playerTwoDiv.classList.add('player-two');

    _playerOneDiv.appendChild(_playerOneName);
    _playerTwoDiv.appendChild(_playerTwoName);

    _playerOneDiv.appendChild(_playerOneWins);
    _playerTwoDiv.appendChild(_playerTwoWins);

    _gameDiv.appendChild(_playerOneDiv);
    _gameDiv.appendChild(_gameBoardDiv);
    _gameDiv.appendChild(_playerTwoDiv);

    // On click, play round, then render
    const clickCell = (e) => {
        const row = e.target.getAttribute('data-row');
        const col = e.target.getAttribute('data-col');
        return _game.playTurn(row, col) ? render() : false;
    };

    // Initialize buttons
    _board.forEach(
        (row, rowIndex) => {
            row.forEach(
                (cell, colIndex) => {
                    const cellDiv = document.createElement('button');
                    const mark = cell.getMark()
                    cellDiv.setAttribute('data-mark', mark);
                    cellDiv.setAttribute('data-row', rowIndex);
                    cellDiv.setAttribute('data-col', colIndex);
                    // Could replace this with an img or svg later
                    cellDiv.textContent = mark;
                    // Add event handler
                    cellDiv.addEventListener('click', clickCell);
                    // Add to ref arrays
                    _gameBoardDiv.appendChild(cellDiv);
                    _cellDivs.push(cellDiv);
                }
            )
        }
    );

    // player name change
    // new Game button
    // display last winner and display current wins

    const getGame = () => _game;

    const render = () => {
        console.log("render")
        let players = _game.getPlayers();
        _playerOneName.textContent = players[0].name;
        _playerTwoName.textContent = players[1].name;

        _playerOneWins.textContent = players[0].getWins();
        _playerTwoWins.textContent = players[1].getWins();

        _cellDivs.forEach(
            (cellDiv) => {
                const row = cellDiv.getAttribute('data-row');
                const col = cellDiv.getAttribute('data-col');
                const mark = _board[row][col].getMark()
                cellDiv.setAttribute('data-mark', mark);
                // Could replace this with an img or svg later
                cellDiv.textContent = mark;
            }
        );

        return true;
    };

    render();

    return {
        getGame,
        render,
    };
})();