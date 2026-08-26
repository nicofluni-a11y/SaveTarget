// ==========================================
// SAVETARGET
// Calculator + Challenges
// ==========================================


// ==========================================
// SAVINGS CALCULATOR
// ==========================================

const calculateButton = document.getElementById("calculate");

if (calculateButton) {

    calculateButton.addEventListener("click", function () {

        // Get the user's information
        const goal = document.getElementById("goal").value;
        const target = Number(document.getElementById("target").value);
        const saved = Number(document.getElementById("saved").value);
        const date = document.getElementById("date").value;


        // Check that the user entered everything
        if (!goal || !target || !date) {
            alert("Please enter your goal, target amount and target date.");
            return;
        }


        // Check that the numbers make sense
        if (target <= 0) {
            alert("Your target must be greater than €0.");
            return;
        }

        if (saved < 0) {
            alert("Your saved amount cannot be negative.");
            return;
        }

        if (saved > target) {
            alert("You have already saved more than your target!");
            return;
        }


        // Calculate remaining amount
        const remaining = target - saved;


        // Calculate how many days are left
        const today = new Date();
        const targetDate = new Date(date);

        const difference =
            targetDate.getTime() - today.getTime();

        const daysRemaining =
            Math.ceil(difference / (1000 * 60 * 60 * 24));


        // Make sure the date is in the future
        if (daysRemaining <= 0) {
            alert("Please choose a future target date.");
            return;
        }


        // Calculate weeks remaining
        const weeksRemaining = daysRemaining / 7;


        // Calculate weekly saving
        const weeklySaving =
            remaining / weeksRemaining;


        // Calculate monthly saving
        const monthlySaving =
            weeklySaving * 52 / 12;


        // Calculate percentage complete
        const progress =
            (saved / target) * 100;


        // Prevent percentage going above 100
        const progressPercentage =
            Math.min(progress, 100);


        // ==========================================
        // DISPLAY RESULTS
        // ==========================================

        document.getElementById("weekly-result").textContent =
            "€" + weeklySaving.toFixed(2);


        document.getElementById("monthly-result").textContent =
            "€" + monthlySaving.toFixed(2);


        document.getElementById("progress-result").textContent =
            progressPercentage.toFixed(1) + "%";


        // ==========================================
        // ADD EXTRA RESULTS
        // ==========================================

        let extraResults =
            document.getElementById("extra-results");


        // Create the extra results section
        // if it doesn't already exist
        if (!extraResults) {

            extraResults =
                document.createElement("div");

            extraResults.id = "extra-results";

            extraResults.innerHTML = `

                <div class="extra-result">

                    <span>Goal</span>

                    <strong id="goal-result"></strong>

                </div>


                <div class="extra-result">

                    <span>Remaining</span>

                    <strong id="remaining-result"></strong>

                </div>


                <div class="extra-result">

                    <span>Days left</span>

                    <strong id="days-result"></strong>

                </div>

            `;


            document
                .getElementById("results")
                .after(extraResults);
        }


        // Add the values
        document.getElementById("goal-result").textContent =
            goal;


        document.getElementById("remaining-result").textContent =
            "€" + remaining.toFixed(2);


        document.getElementById("days-result").textContent =
            daysRemaining + " days";


        // ==========================================
        // PROGRESS BAR
        // ==========================================

        let progressContainer =
            document.getElementById("progress-container");


        if (!progressContainer) {

            progressContainer =
                document.createElement("div");

            progressContainer.id =
                "progress-container";

            progressContainer.innerHTML = `

                <div class="progress-header">

                    <span>Progress</span>

                    <strong id="progress-text">
                        0%
                    </strong>

                </div>


                <div class="progress-bar">

                    <div
                        id="progress-fill"
                        class="progress-fill"
                    ></div>

                </div>

            `;


            document
                .getElementById("extra-results")
                .after(progressContainer);
        }


        // Update progress text
        document.getElementById("progress-text").textContent =
            progressPercentage.toFixed(1) + "%";


        // Update progress bar
        document.getElementById("progress-fill").style.width =
            progressPercentage + "%";

    });

}


// ==========================================
// CHALLENGES
// ==========================================

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
            "Add an extra €5 to your usual weekly savings. Small amounts can make a big difference over time."

    }

};


// Get popup elements

const modal =
    document.getElementById("challenge-modal");

const modalNumber =
    document.getElementById("modal-number");

const modalTitle =
    document.getElementById("modal-title");

const modalDescription =
    document.getElementById("modal-description");

const completeButton =
    document.getElementById("complete-challenge");


let currentChallenge = null;


// ==========================================
// OPEN CHALLENGE
// ==========================================

function openChallenge(challengeName) {

    const challenge =
        challenges[challengeName];


    if (!challenge) {
        return;
    }


    currentChallenge =
        challengeName;


    modalNumber.textContent =
        challenge.number;


    modalTitle.textContent =
        challenge.title;


    modalDescription.textContent =
        challenge.description;


    completeButton.textContent =
        "Complete challenge";


    modal.classList.add("active");
}


// ==========================================
// CLOSE CHALLENGE
// ==========================================

function closeChallenge() {

    modal.classList.remove("active");

    currentChallenge = null;
}


// ==========================================
// COMPLETE CHALLENGE
// ==========================================

completeButton.addEventListener(
    "click",
    function () {

        if (!currentChallenge) {
            return;
        }


        localStorage.setItem(

            "challenge-" +
            currentChallenge,

            "completed"

        );


        completeButton.textContent =
            "✓ Challenge completed!";


        const cards =
            document.querySelectorAll(".challenge");


        cards.forEach(function (card) {

            const button =
                card.querySelector(
                    ".challenge-button"
                );


            if (

                button &&

                button
                    .getAttribute("onclick")
                    .includes(currentChallenge)

            ) {

                button.textContent =
                    "✓ Completed";


                card.classList.add(
                    "completed"
                );

            }

        });

    }
);


// ==========================================
// LOAD COMPLETED CHALLENGES
// ==========================================

function loadCompletedChallenges() {

    const cards =
        document.querySelectorAll(".challenge");


    cards.forEach(function (card) {

        const button =
            card.querySelector(
                ".challenge-button"
            );


        if (!button) {
            return;
        }


        const onclickText =
            button.getAttribute("onclick");


        Object.keys(challenges)
            .forEach(function (challengeName) {

                if (

                    onclickText &&

                    onclickText.includes(
                        challengeName
                    )

                ) {

                    const completed =
                        localStorage.getItem(
                            "challenge-" +
                            challengeName
                        );


                    if (
                        completed ===
                        "completed"
                    ) {

                        button.textContent =
                            "✓ Completed";


                        card.classList.add(
                            "completed"
                        );

                    }

                }

            });

    });

}


loadCompletedChallenges();


// ==========================================
// CLOSE POPUP BY CLICKING OUTSIDE
// ==========================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {
                closeChallenge();
            }

        }
    );

}


// ==========================================
// ESCAPE KEY CLOSES POPUP
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {
            closeChallenge();
        }

    }
);
