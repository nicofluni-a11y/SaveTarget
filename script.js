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

        // Get user information
        const goal = document.getElementById("goal").value.trim();
        const target = Number(document.getElementById("target").value);
        const saved = Number(document.getElementById("saved").value);
        const date = document.getElementById("date").value;


        // Check required information
        if (!goal || !target || !date) {
            alert("Please enter your goal, target amount and target date.");
            return;
        }


        // Check numbers
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


        // ==========================================
        // CALCULATE DATES
        // ==========================================

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const targetDate = new Date(date + "T00:00:00");

        const difference =
            targetDate.getTime() - today.getTime();

        const daysRemaining =
            Math.ceil(
                difference / (1000 * 60 * 60 * 24)
            );


        // Make sure date is in the future
        if (daysRemaining <= 0) {
            alert("Please choose a future target date.");
            return;
        }


        // ==========================================
        // SAVINGS CALCULATIONS
        // ==========================================

        const remaining =
            target - saved;


        const weeksRemaining =
            daysRemaining / 7;


        const weeklySaving =
            remaining / weeksRemaining;


        const monthlySaving =
            weeklySaving * 52 / 12;


        const dailySaving =
            remaining / daysRemaining;


        const progress =
            (saved / target) * 100;


        const progressPercentage =
            Math.min(progress, 100);


        // ==========================================
        // FORMAT COMPLETION DATE
        // ==========================================

        const completionDate =
            targetDate.toLocaleDateString(
                "en-GB",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        // ==========================================
        // DISPLAY MAIN RESULTS
        // ==========================================

        document.getElementById("weekly-result").textContent =
            "€" + weeklySaving.toFixed(2);


        document.getElementById("monthly-result").textContent =
            "€" + monthlySaving.toFixed(2);


        document.getElementById("progress-result").textContent =
            progressPercentage.toFixed(1) + "%";


        // ==========================================
        // CREATE EXTRA RESULTS
        // ==========================================

        let extraResults =
            document.getElementById("extra-results");


        if (!extraResults) {

            extraResults =
                document.createElement("div");

            extraResults.id =
                "extra-results";


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


        // Update extra results

        document.getElementById("goal-result").textContent =
            goal;


        document.getElementById("remaining-result").textContent =
            "€" + remaining.toFixed(2);


        document.getElementById("days-result").textContent =
            daysRemaining + " days";


        // ==========================================
        // DAILY TARGET + COMPLETION DATE
        // ==========================================

        let planDetails =
            document.getElementById("plan-details");


        if (!planDetails) {

            planDetails =
                document.createElement("div");

            planDetails.id =
                "plan-details";


            planDetails.innerHTML = `

                <div class="plan-main">

                    <span>Daily saving target</span>

                    <strong id="daily-result">
                        €0.00
                    </strong>

                </div>


                <div class="plan-date">

                    <span>Goal date</span>

                    <strong id="date-result">
                        -
                    </strong>

                </div>

            `;


            document
                .getElementById("extra-results")
                .after(planDetails);

        }


        document.getElementById("daily-result").textContent =
            "€" + dailySaving.toFixed(2);


        document.getElementById("date-result").textContent =
            completionDate;


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
                .getElementById("plan-details")
                .after(progressContainer);

        }


        // Update progress

        document.getElementById("progress-text").textContent =
            progressPercentage.toFixed(1) + "%";


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

if (completeButton) {

    completeButton.addEventListener(
        "click",
        function () {

            if (!currentChallenge) {
                return;
            }


            localStorage.setItem(
                "challenge-" + currentChallenge,
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

}


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
