'use strict';

// Selecting elements
const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');
const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const colorPicker = document.getElementById('colorPicker');

let scores, currentScore, activePlayer, playing;
let isRolling = false; // Add this flag to prevent multiple rolls

// Color picker functionality
colorPicker.addEventListener('input', function(e) {
    document.body.style.background = `linear-gradient(to top left, ${e.target.value}, #ff0044)`;
});

// Starting conditions
const init = function () {
    // Remove any ongoing animations first
    player0El.classList.remove('winner-animation');
    player1El.classList.remove('winner-animation');
    diceEl.classList.remove('rolling');

    scores = [0, 0];
    currentScore = 0;
    activePlayer = 0;
    playing = true;
    isRolling = false;

    score0El.textContent = 0;
    score1El.textContent = 0;
    current0El.textContent = 0;
    current1El.textContent = 0;

    diceEl.classList.add('hidden');
    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
    
    btnRoll.disabled = false;
    btnHold.disabled = false;
};

const switchPlayer = function () {
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    currentScore = 0;
    activePlayer = activePlayer === 0 ? 1 : 0;
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
};

// Show winner popup
const showWinner = function(playerNumber) {
    alert(`Congratulations! Player ${playerNumber + 1} wins! 🎉`);
};

// Rolling dice functionality
const rollDice = function() {
    if (playing && !isRolling) {
        isRolling = true;
        diceEl.classList.add('rolling');
        
        const dice = Math.trunc(Math.random() * 6) + 1;

        setTimeout(() => {
            diceEl.classList.remove('hidden', 'rolling');
            diceEl.src = `dice-${dice}.png`;

            if (dice !== 1) {
                currentScore += dice;
                document.getElementById(`current--${activePlayer}`).textContent = currentScore;
            } else {
                switchPlayer();
            }
            isRolling = false;
        }, 400);
    }
};

// Hold functionality
const holdScore = function() {
    if (playing && !isRolling) {
        scores[activePlayer] += currentScore;
        document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

        if (scores[activePlayer] >= 100) {
            playing = false;
            diceEl.classList.add('hidden');
            
            const winner = document.querySelector(`.player--${activePlayer}`);
            winner.classList.add('player--winner');
            winner.classList.remove('player--active');
            
            btnRoll.disabled = true;
            btnHold.disabled = true;
            
            showWinner(activePlayer);
            winner.classList.add('winner-animation');
        } else {
            switchPlayer();
        }
    }
};

btnRoll.addEventListener('click', rollDice);
btnHold.addEventListener('click', holdScore);

btnNew.addEventListener('click', init);

// Keyboard controls
document.addEventListener('keydown', function(e) {
    if (e.code === 'KeyN') {
        init();
    }
    if (playing && !isRolling) {
        if (e.code === 'Space') {
            e.preventDefault(); // Prevent page scroll
            rollDice();
        } else if (e.code === 'Enter') {
            e.preventDefault(); // Prevent form submission
            holdScore();
        }
    }
});

// Initialize the game
init();