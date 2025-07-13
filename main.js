(() => {
    // ===========================================
    // CONSTANTS
    // ===========================================

    /**
     * Available colors for the game
     * @type {string[]}
     */
    const COLORS = [
        "blue",
        "green",
        "red",
        "orange",
        "yellow",
        "purple",
        "black",
    ];

    /**
     * Number of slots in each guess
     * @type {number}
     */
    const GUESS_LENGTH = 4;

    /**
     * Number of correct positions needed to win
     * @type {number}
     */
    const WIN_CONDITION = 4;

    /**
     * Default slot background color
     * @type {string}
     */
    const DEFAULT_SLOT_COLOR = "white";

    // ===========================================
    // GAME STATE VARIABLES
    // ===========================================

    /**
     * The secret color combination to guess
     * @type {string[]}
     */
    let secret = [];

    /**
     * Current player's guess in progress
     * @type {(string|null)[]}
     */
    let currentGuess = Array(GUESS_LENGTH).fill(null);

    /**
     * Flag indicating if the game has ended
     * @type {boolean}
     */
    let gameOver = false;

    /**
     * History of all guesses and their feedback for results display
     * @type {Array<{guess: string[], black: number, white: number}>}
     */
    let guessHistory = [];

    // ===========================================
    // DOM ELEMENTS
    // ===========================================

    /**
     * Container for displaying guess history
     * @type {HTMLElement}
     */
    const historyEl = document.getElementById("history");

    /**
     * Current row slot elements for active guess
     * @type {HTMLElement[]}
     */
    const currentRowSlots = Array.from(
        document.querySelectorAll("#current-row .slot")
    );

    /**
     * Button to submit the current guess
     * @type {HTMLElement}
     */
    const guessBtn = document.getElementById("guess-btn");

    /**
     * Popover element for displaying results
     * @type {HTMLElement}
     */
    const resultsPopover = document.getElementById("results-popover");

    /**
     * Container for results content in the popover
     * @type {HTMLElement}
     */
    const resultsShare = document.getElementById("results-share");

    /**
     * Button to share game results
     * @type {HTMLElement}
     */
    const shareBtn = document.getElementById("share-btn");

    /**
     * Button to close the results popover
     * @type {HTMLElement}
     */
    const closePopoverBtn = document.getElementById("close-popover-btn");

    /**
     * Button to reset the game
     * @type {HTMLElement}
     */
    const resetBtn = document.getElementById("reset-btn");

    /**
     * Button to show results pane
     * @type {HTMLElement}
     */
    const resultsBtn = document.getElementById("results-btn");

    // ===========================================
    // UTILITY FUNCTIONS
    // ===========================================

    /**
     * Generates a random color from the available colors array
     * @returns {string} A random color string
     */
    function getRandomColor() {
        return COLORS[ Math.floor(Math.random() * COLORS.length) ];
    }

    /**
     * Resets the current guess to empty state
     */
    function resetCurrentGuess() {
        currentGuess = Array(GUESS_LENGTH).fill(null);
    }

    /**
     * Resets all slot colors to default
     */
    function resetSlotColors() {
        currentRowSlots.forEach((slot) => {
            slot.style.backgroundColor = DEFAULT_SLOT_COLOR;
        });
    }

    /**
     * Formats the results for sharing with emoji representation
     * @param {Array<{guess: string[], black: number, white: number}>} history - The guess history
     * @returns {string} Formatted results string
     */
    function formatResultsForSharing(history) {
        let shareText = `I solved the Braincode puzzle in ${ history.length } guesses!\r\n`;

        history.forEach((entry) => {
            shareText += `\r\n${evaluateSpecificGuess(entry.guess).result}`;
        });

        return shareText;
    }

    // ===========================================
    // GAME LOGIC FUNCTIONS
    // ===========================================

    /**
     * Initializes a new game by generating a secret and resetting all state
     */
    function init() {
        // Generate secret combination
        secret = Array.from({ length: GUESS_LENGTH }, () => getRandomColor());

        // Debug logging (remove in production)
        console.log("Secret:", secret);

        // Reset game state
        resetCurrentGuess();
        gameOver = false;
        guessHistory = [];

        // Reset UI elements
        historyEl.innerHTML = "";
        guessBtn.disabled = true;
        guessBtn.style.display = "block";
        resetBtn.style.display = "none";
        resultsBtn.style.display = "none";
        resetSlotColors();
    }

    /**
     * Cycles through colors for a specific slot position
     * @param {number} index - The slot index to cycle
     */
    function cycleColor(index) {
        if (gameOver) return;

        const currentColor = currentGuess[ index ];
        const nextColor = currentColor === null
            ? COLORS[ 0 ]
            : COLORS[ (COLORS.indexOf(currentColor) + 1) % COLORS.length ];

        currentGuess[ index ] = nextColor;
        currentRowSlots[ index ].style.backgroundColor = nextColor;

        validateGuessBtn();
    }

    /**
     * Validates and updates the guess button state based on current guess completeness
     */
    function validateGuessBtn() {
        guessBtn.disabled = currentGuess.some((color) => color === null);
    }

    /**
     * Evaluates the current guess against the secret combination
     * @returns {{black: number, white: number}} Feedback with black (correct position) and white (correct color, wrong position) pegs
     */
    function evaluateCurrentGuess() {
        const guessCopy = [ ...currentGuess ];
        const result = evaluateSpecificGuess(guessCopy);
        return {
            black: result.black,
            white: result.white
        };
    }

    /**
     * Evaluate the given guess against the secret combination
     * @param {string[]} guess - The player's guess
     * @return {{black: number, white: number, result: string}} - The evaluation result with counts of black and white pegs and the resuklt string
     * */
    function evaluateSpecificGuess(guess) {
        const secretCopy = [ ...secret ];
        const resultChars = [ guess.length ];
        const guessCopy = [ ...guess ];

        // First pass: count exact matches (black pegs)
        let black = 0;
        for (let i = 0; i < GUESS_LENGTH; i++) {
            if (guessCopy[ i ] === secretCopy[ i ]) {
                black++;
                resultChars[ i ] = `⬛`; // Correct position
                guessCopy[i] = secretCopy[ i ] = null; // Mark as used
            }
        }

        // Second pass: count color matches in wrong positions (white pegs)
        let white = 0;
        for (let i = 0; i < GUESS_LENGTH; i++) {
            if (guessCopy[ i ] !== null) {
                const matchIndex = secretCopy.indexOf(guessCopy[ i ]);
                if (matchIndex !== -1) {
                    white++;
                    resultChars[ i ] = `⬜`; // Correct color, wrong position
                    secretCopy[ matchIndex ] = null; // Mark as used
                }
                else {
                    resultChars[ i ] = `✖️`; // Incorrect color
                }
            }
        }

        let result = resultChars.join('');

        return { black, white, result };
    }

    // ===========================================
    // DOM MANIPULATION FUNCTIONS
    // ===========================================

    /**
     * Creates and appends a new row to the guess history display
     * @param {number} black - Number of black pegs (correct position)
     * @param {number} white - Number of white pegs (correct color, wrong position)
     */
    function addHistoryRow(black, white) {
        const rowEl = document.createElement("div");
        rowEl.className = "row";

        const guessSlotsContainer = document.createElement("div");
        guessSlotsContainer.className = "guess-slots";

        // Create guess slots
        currentGuess.forEach((color) => {
            const slot = document.createElement("div");
            slot.className = "slot";
            slot.style.backgroundColor = color;
            slot.style.cursor = "default";
            guessSlotsContainer.appendChild(slot);
        });

        // Create feedback display
        const feedbackEl = document.createElement("div");
        feedbackEl.className = "feedback";

        const blackPeg = document.createElement("div");
        blackPeg.className = "peg";
        blackPeg.style.backgroundColor = "black";
        blackPeg.textContent = black;

        const whitePeg = document.createElement("div");
        whitePeg.className = "peg";
        whitePeg.style.backgroundColor = "white";
        whitePeg.style.color = "black";
        whitePeg.textContent = white;

        feedbackEl.appendChild(blackPeg);
        feedbackEl.appendChild(whitePeg);

        rowEl.appendChild(guessSlotsContainer);
        rowEl.appendChild(feedbackEl);

        historyEl.appendChild(rowEl);

        historyEl.scrollTop = historyEl.scrollHeight; // Scroll to bottom
    }

    /**
     * Displays the results popover with game completion information
     */
    function showResultsPopover() {
        resultsPopover.style.display = "block";
        resultsShare.textContent = '';
        resultsShare.textContent = formatResultsForSharing(guessHistory);
    }

    /**
     * Hides the results popover
     */
    function hideResultsPopover() {
        resultsPopover.style.display = "none";
    }

    // ===========================================
    // GAME FLOW FUNCTIONS
    // ===========================================

    /**
     * Processes the current guess and updates the game state
     */
    function handleGuess() {
        if (gameOver) return;

        const { black, white } = evaluateCurrentGuess();

        // Store the guess before resetting
        const completedGuess = [ ...currentGuess ];

        // Add to history display
        addHistoryRow(black, white);

        // Add to guess history for results
        guessHistory.push({
            guess: completedGuess,
            black,
            white
        });

        // Reset current guess UI
        resetCurrentGuess();
        resetSlotColors();
        validateGuessBtn();

        // Check for win condition
        if (black === WIN_CONDITION) {
            gameOver = true;
            guessBtn.style.display = "none";
            resetBtn.style.display = "block";
            resultsBtn.style.display = "block";

            showResultsPopover();
        }
    }

    /**
     * Handles the share functionality for game results
     */
    function handleShare() {
        const shareText = formatResultsForSharing(guessHistory);

        if (navigator.share) {
            navigator.share({
                title: "Braincode Puzzle Results",
                text: shareText,
            }).catch((error) => {
                console.error("Error sharing:", error);
                alert("Sharing failed. Please copy the results manually.");
            });
        } else {
            // Fallback for browsers without native sharing
            navigator.clipboard.writeText(shareText).then(() => {
                alert("Results copied to clipboard!");
            }).catch(() => {
                alert("Unable to copy results. Please copy manually.");
            });
        }
    }

    // ===========================================
    // EVENT LISTENERS
    // ===========================================

    /**
     * Set up all event listeners for the game
     */
    function setupEventListeners() {
        // Slot click handlers for color cycling
        currentRowSlots.forEach((slot) => {
            slot.addEventListener("click", () => {
                const index = parseInt(slot.dataset.index);
                cycleColor(index);
            });
        });

        // Guess button handler
        guessBtn.addEventListener("click", handleGuess);

        // Popover close button handler
        closePopoverBtn.addEventListener("click", () => {
            hideResultsPopover();
        });

        // Share button handler
        shareBtn.addEventListener("click", handleShare);

        // Reset button handler
        resetBtn.addEventListener("click", () => {
            init();
        });

        // Results button handler
        resultsBtn.addEventListener("click", () => {
            showResultsPopover();
        });
    }

    // ===========================================
    // GAME INITIALIZATION
    // ===========================================

    // Initialize event listeners and start the game
    setupEventListeners();
    init();
})();
