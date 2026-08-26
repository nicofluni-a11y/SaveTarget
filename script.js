// ==============================
// SAVETARGET - CHALLENGES
// ==============================

// Information for each challenge
const challenges = {
    nospend: {
        number: "01",
        title: "No-spend Friday",
        description:
            "Try going one full day without spending money on anything you don't need. At the end of the day, put the money you would have spent towards your savings goal."
    },

    roundup: {
        number: "02",
        title: "Round it up",
        description:
            "Whenever you buy something, round the price up to the nearest euro and put the difference towards your savings goal."
    },

    five: {
        number: "03",
        title: "Save an extra €5",
        description:
            "Add an extra €5 to your usual weekly savings. It might seem small, but small amounts can make a big difference over time."
    }
};


// Get the popup elements
const modal = document.getElementById("challenge-modal");
const modalNumber = document.getElementById("modal-number");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const completeButton = document.getElementById("complete-challenge");


// Keep track of the challenge currently being viewed
let currentChallenge = null;


// ==============================
// OPEN CHALLENGE
// ==============================

function openChallenge(challengeName) {

    const challenge = challenges[challengeName];

    // If the challenge doesn't exist, stop
    if (!challenge) {
        return;
    }

    currentChallenge = challengeName;

    modalNumber.textContent = challenge.number;
    modalTitle.textContent = challenge.title;
    modalDescription.textContent = challenge.description;

    completeButton.textContent = "Complete challenge";

    modal.classList.add("active");
}


// ==============================
// CLOSE CHALLENGE
// ==============================

function closeChallenge() {

    modal.classList.remove("active");

    currentChallenge = null;
}


// ==============================
// COMPLETE CHALLENGE
// ==============================

completeButton.addEventListener("click", function () {

    if (!currentChallenge) {
        return;
    }

    // Save completion in the browser
    localStorage.setItem(
        "challenge-" + currentChallenge,
        "completed"
    );

    completeButton.textContent = "✓ Challenge completed!";

    // Find the challenge card
    const cards = document.querySelectorAll(".challenge");

    cards.forEach(function (card) {

        const button = card.querySelector(".challenge-button");

        if (
            button &&
            button.getAttribute("onclick").includes(currentChallenge)
        ) {
            button.textContent = "✓ Completed";
            card.classList.add("completed");
        }

    });

});


// ==============================
// LOAD COMPLETED CHALLENGES
// ==============================

function loadCompletedChallenges() {

    const cards = document.querySelectorAll(".challenge");

    cards.forEach(function (card) {

        const button = card.querySelector(".challenge-button");

        if (!button) {
            return;
        }

        const onclickText = button.getAttribute("onclick");

        Object.keys(challenges).forEach(function (challengeName) {

            if (
                onclickText &&
                onclickText.includes(challengeName)
            ) {

                const completed =
                    localStorage.getItem(
                        "challenge-" + challengeName
                    );

                if (completed === "completed") {

                    button.textContent = "✓ Completed";
                    card.classList.add("completed");

                }

            }

        });

    });

}


// Run when the page loads
loadCompletedChallenges();


// ==============================
// CLOSE MODAL WHEN CLICKING OUTSIDE
// ==============================

modal.addEventListener("click", function (event) {

    if (event.target === modal) {
        closeChallenge();
    }

});


// ==============================
// CLOSE MODAL WITH ESCAPE KEY
// ==============================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {
        closeChallenge();
    }

});
