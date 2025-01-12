import { words } from './word.js';


//created the variable and added the information popup element by Id


/*created the function that adds open-popup class to popup class so when
the info icon is clicked the howtoplay information will be seen
*/

//makes sure the html is loaded first
document.addEventListener("DOMContentLoaded", function() {
    /*created the function that adds open-popup class to popup class so when
    the info icon is clicked the howtoplay information will be seen
    */
    const popup = document.getElementById("popup");
  
    
    
    function openPopup() {

        popup.classList.add("open-popup");
        document.getElementById("overlay").style.display = "block";
        
    }
    /*created the function that removes open-popup class to popup class so when
    the info icon is clicked the howtoplay information will be hidden
    */
    function closePopup() {
        
        popup.classList.remove("open-popup");
        document.getElementById("overlay").style.display = "none";
        
    }

    

    // Close popup if clicking outside of it
    //const overlay = document.getElementById("popup");
    document.addEventListener("click", function(event) {
        const popUp = document.getElementById("popup");
        const popupMenuIcon = document.querySelector(".open-pop-menu");
        if (
            popUp.classList.contains("open-popup") &&
            !popUp.contains(event.target)&&
            !popupMenuIcon.contains(event.target)
        ) {
            closePopup();
        }
    });


   
  

     // Add these functions to the global scope if needed
     window.openPopup = openPopup;
     window.closePopup = closePopup;
    

 });


 
const gameContainer = document.getElementById('game-container');
const wordDisplay = document.getElementById('word-to-find');
const countdownDisplay = document.getElementById('countdown-display');
const movesDisplay = document.getElementById('moves-to-try');
const countdownDuration = 5; // Timer set to 5 seconds
const maxMoves = 11; // Maximum allowed moves
let remainingMoves = maxMoves; // Track remaining moves

// Select a random word from the words array
const wordToFind = words[Math.floor(Math.random() * words.length)];

// Update the displayed word to find
wordDisplay.textContent = `Find the word: "${wordToFind}"`;
movesDisplay.textContent = `Moves Left: ${remainingMoves}`;

// Split the word into letters and create an array of alphabet letters
let wordLetters = wordToFind.split('');
let alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

// Create an updated alphabet with only letters that aren't in `wordToFind`
let updatedAlphabet = alphabet.filter(letter => {
    if (wordLetters.includes(letter)) {
        wordLetters.splice(wordLetters.indexOf(letter), 1); // Remove from wordLetters if found
        return false; // Exclude from updatedAlphabet
    }
    return true;
});

// Track the number of occurrences needed for each letter in `wordToFind`
const remainingCounts = {};
wordToFind.split('').forEach(letter => {
    remainingCounts[letter] = (remainingCounts[letter] || 0) + 1;
});

// Track tiles with correct letters
const correctTiles = {};

// Function to generate a random letter
function getRandomLetter() {
    return updatedAlphabet[Math.floor(Math.random() * updatedAlphabet.length)];
}

// Function to initialize the game tiles
function initializeTiles() {
    const tiles = [];
    const wordLetters = wordToFind.split('');

    // Create 20 tile elements
    for (let i = 0; i < 20; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.innerHTML = `
            <div class="tile-inner">
                <div class="tile-front"></div>
                <div class="tile-back"></div>
            </div>
        `;
       
        tiles.push(tile);
    }

    // Randomly place each letter of the word in a tile and mark them as correct
    wordLetters.forEach(letter => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * tiles.length);
        } while (tiles[randomIndex].querySelector('.tile-back').textContent);

        tiles[randomIndex].querySelector('.tile-back').textContent = letter;

        // Track each correct tile
        if (!correctTiles[letter]) {
            correctTiles[letter] = [];
        }
        correctTiles[letter].push(tiles[randomIndex]);
    });

    // Fill remaining tiles with random letters
    tiles.forEach(tile => {
        if (!tile.querySelector('.tile-back').textContent) {
            tile.querySelector('.tile-back').textContent = getRandomLetter();
        }
        tile.classList.add('flipped'); // Initially reveal the tile
        tile.style.pointerEvents = 'none'; // Disable clicks initially

        gameContainer.appendChild(tile);
    });

    // Start countdown and update display every second
    let countdown = countdownDuration;
    countdownDisplay.textContent = countdown;
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.textContent = "Play!";
            hideTilesAndEnableClicks(tiles);
        }
    }, 1000);
}

// Function to hide all letters and enable clicking on tiles
function hideTilesAndEnableClicks(tiles) {
    tiles.forEach(tile => {
        tile.classList.remove('flipped'); // Hide the tile by removing the "flipped" class
        tile.style.pointerEvents = 'auto'; // Enable clicking after hiding

        // Add click event listener to flip tile on click
        tile.addEventListener('click', () => handleTileClick(tile));
    });
}



// Select the result popup and message elements
const resultPopup = document.getElementById('result-popup');
const resultMessage = document.getElementById('result-message');
const restartButton = document.getElementById('restart-game');

// Function to show the result message
function showResultMessage(message) {
    setTimeout(() =>{
        resultMessage.textContent = message;
        resultPopup.classList.add('active'); // Show the result popup

    }, 900);
   
}

// Add an event listener to the "Play Again" button to restart the game
restartButton.addEventListener('click', () => {
    resultPopup.classList.remove('active'); // Hide the popup
    window.location.reload(); // Reload the page to restart the game
});


// Modify handleTileClick function to show the result when the game ends
function handleTileClick(tile) {
    if (remainingMoves <= 0) return; // Prevent clicks if moves are exhausted

    remainingMoves--;
    movesDisplay.textContent = `Moves Left: ${remainingMoves}`; // Update moves display

    const tileLetter = tile.querySelector('.tile-back').textContent;

    // Check if this tile is marked as correct and if we still need this letter
    if (remainingCounts[tileLetter] > 0 && correctTiles[tileLetter]?.includes(tile)) {
        tile.classList.add('flipped');
        tile.style.pointerEvents = 'none'; // Disable further clicks on this tile
        remainingCounts[tileLetter] -= 1; // Decrease the remaining count for this letter

        // Remove this tile from correctTiles array for this letter
        correctTiles[tileLetter] = correctTiles[tileLetter].filter(correctTile => correctTile !== tile);

        // If no more of this letter is needed, remove from correctTiles
        if (remainingCounts[tileLetter] === 0) {
            delete correctTiles[tileLetter];
        }

    } else {
        // If the letter is not needed, close the tile briefly after clicking
        tile.classList.add('flipped');
        setTimeout(() => {
            tile.classList.remove('flipped');
        }, 500);
    }

    // Check for game completion or if out of moves
    if (Object.values(remainingCounts).every(count => count === 0)) {
        showResultMessage("You Won!");
        // Select the container where the icon will be added
        const iconContainer = document.getElementById('icon-container');
        // Create an <img> element for the custom icon
        const iconElement = document.createElement('img');

        // Set the 'src' attribute to the icon's location
        iconElement.src = 'trophy.svg'; // Replace with your file path or URL

        // Optionally set alt text for accessibility
        iconElement.alt = 'Trophy Icon';

        // Optionally style the icon (e.g., size)
        iconElement.style.width = '50px';
        iconElement.style.height = '50px';

        // Append the icon to the container
        iconContainer.appendChild(iconElement);

    } else if (remainingMoves <= 0) {
        showResultMessage("You Lost.");
        disableAllTiles();
    }

}

// Select the close icon element
const closePopupIcon = document.getElementById('close-popup');

// Function to hide the result popup
function closeResultPopup() {
    resultPopup.classList.remove('active');
}

// Add an event listener to the close icon to close the popup
closePopupIcon.addEventListener('click', closeResultPopup);

//add event listener to the overlay
resultPopup.addEventListener('click', (event)=>{
    //check if the clicked element is the overlay, not the popup content
    if(event.target === resultPopup){
        closeResultPopup();
    }
})

// Optional: Keep the existing Play Again button functionality to restart the game
restartButton.addEventListener('click', () => {
    resultPopup.classList.remove('active'); // Hide the popup
    window.location.reload(); // Reload the page to restart the game
});


// play again button for the main page

const restartMainPageButton = document.getElementById('new-game');
restartMainPageButton.addEventListener('click', () => {
    resultPopup.classList.remove('active'); // Hide the popup
    window.location.reload(); // Reload the page to restart the game
});

// Function to disable all tiles when moves are exhausted
function disableAllTiles() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => tile.style.pointerEvents = 'none');
}







// Initialize the game
initializeTiles();
 




