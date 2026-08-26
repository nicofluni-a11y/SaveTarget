// ==========================================
// SAVETARGET
// Calculator + Challenges + Milestones
// ==========================================


// ==========================================
// DATE INPUT
// ==========================================

const dateInput = document.getElementById("date");


// Automatically add "/" while typing

if (dateInput) {

    dateInput.addEventListener("input", function () {

        let value = this.value.replace(/\D/g, "");

        if (value.length > 8) {
            value = value.substring(0, 8);
        }

        if (value.length >= 5) {

            value =
                value.substring(0, 2) +
                "/" +
                value.substring(2, 4) +
                "/" +
                value.substring(4);

        } else if (value.length >= 3) {

            value =
                value.substring(0, 2) +
                "/" +
                value.substring(2);

        }

        this.value = value;

    });

}


// ==========================================
// VALIDATE DATE
// ==========================================

function getValidDate(dateString) {

    const parts =
        dateString.split("/");


    if (parts.length !== 3) {
        return null;
    }


    const day =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const year =
        Number(parts[2]);


    // Basic checks

    if (
        !day ||
        !month ||
        !year ||
        year < 2026 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {

        return null;

    }


    // Create date

    const date =
        new Date(year, month - 1, day);


    // Make sure JavaScript didn't
    // automatically correct an invalid date

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {

        return null;

    }


    return date;
}


// ==========================================
// SAVINGS CALCULATOR
// ==========================================

const calculateButton =
    document.getElementById("calculate");


if (calculateButton) {

    calculateButton.addEventListener(
        "click",
        function () {

            const goal =
                document
                    .getElementById("goal")
                    .value
                    .trim();


            const target =
                Number(
                    document
                        .getElementById("target")
                        .value
                );


            const saved =
                Number(
                    document
                        .getElementById("saved")
                        .value
                );


            const dateString =
                document
                    .getElementById("date")
                    .value
                    .trim();


            // ==========================================
            // CHECK INPUT
            // ==========================================

            if (!goal || !target || !dateString) {

                alert(
                    "Please enter your goal, target amount and target date."
                );

                return;

            }


            if (target <= 0) {

                alert(
                    "Your target must be greater than €0."
                );

                return;

            }


            if (saved < 0) {

                alert(
                    "Your saved amount cannot be negative."
                );

                return;

            }


            if (saved > target) {

                alert(
                    "You have already saved more than your target!"
                );

                return;

            }


            // ==========================================
            // VALIDATE DATE
            // ==========================================

            const targetDate =
                getValidDate(dateString);


            if (!targetDate) {

                alert(
                    "Please enter a valid date in DD/MM/YYYY format."
                );

                return;

            }


            // ==========================================
            // CALCULATE DAYS
            // ==========================================

            const today =
                new Date();

            today.setHours(
                0,
                0,
                0,
                0
            );


            targetDate.setHours(
                0,
                0,
                0,
                0
            );


            const difference =
                targetDate.getTime() -
                today.getTime();


            const daysRemaining =
                Math.ceil(
                    difference /
                    (1000 * 60 * 60 * 24)
                );


            if (daysRemaining <= 0) {

                alert(
                    "Please choose a future target date."
                );

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
                remaining /
                weeksRemaining;


            const monthlySaving =
                weeklySaving *
                52 /
                12;


            const dailySaving =
                remaining /
                daysRemaining;


            const progress =
                (saved / target) *
                100;


            const progressPercentage =
                Math.min(
                    progress,
                    100
                );


            // ==========================================
            // DISPLAY DATE
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
            // MAIN RESULTS
            // ==========================================

            document.getElementById(
                "weekly-result"
            ).textContent =
                "€" +
                weeklySaving.toFixed(2);


            document.getElementById(
                "monthly-result"
            ).textContent =
                "€" +
                monthlySaving.toFixed(2);


            document.getElementById(
                "progress-result"
            ).textContent =
                progressPercentage.toFixed(1) +
                "%";


            // ==========================================
            // EXTRA RESULTS
            // ==========================================

            let extraResults =
                document.getElementById(
                    "extra-results"
                );


            if (!extraResults) {

                extraResults =
                    document.createElement(
                        "div"
                    );


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


            document.getElementById(
                "goal-result"
            ).textContent =
                goal;


            document.getElementById(
                "remaining-result"
            ).textContent =
                "€" +
                remaining.toFixed(2);


            document.getElementById(
                "days-result"
            ).textContent =
                daysRemaining +
                " days";


            // ==========================================
            // DAILY TARGET + DATE
            // ==========================================

            let planDetails =
                document.getElementById(
                    "plan-details"
                );


            if (!planDetails) {

                planDetails =
                    document.createElement(
                        "div"
                    );


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


            document.getElementById(
                "daily-result"
            ).textContent =
                "€" +
                dailySaving.toFixed(2);


            document.getElementById(
                "date-result"
            ).textContent =
                completionDate;


            // ==========================================
            // PROGRESS BAR
            // ==========================================

            let progressContainer =
                document.getElementById(
                    "progress-container"
                );


            if (!progressContainer) {

                progressContainer =
                    document.createElement(
                        "div"
                    );


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


            document.getElementById(
                "progress-text"
            ).textContent =
                progressPercentage.toFixed(1) +
                "%";


            document.getElementById(
                "progress-fill"
            ).style.width =
                progressPercentage +
                "%";


            // ==========================================
            // MILESTONES
            // ==========================================

            let milestones =
                document.getElementById(
                    "milestones"
                );


            if (!milestones) {

                milestones =
                    document.createElement(
                        "div"
                    );


                milestones.id =
                    "milestones";


                milestones.innerHTML = `

                    <div class="milestones-title">

                        <span>
                            Savings milestones
                        </span>

                    </div>


                    <div class="milestone-list">

                        <div
                            class="milestone"
                            data-milestone="25"
                        >

                            <div class="milestone-icon">
                                25%
                            </div>

                            <div>

                                <strong>
                                    First quarter
                                </strong>

                                <span>
                                    You've got started!
                                </span>

                            </div>

                        </div>


                        <div
                            class="milestone"
                            data-milestone="50"
                        >

                            <div class="milestone-icon">
                                50%
                            </div>

                            <div>

                                <strong>
                                    Halfway there
                                </strong>

                                <span>
                                    You're making serious progress.
                                </span>

                            </div>

                        </div>


                        <div
                            class="milestone"
                            data-milestone="75"
                        >

                            <div class="milestone-icon">
                                75%
                            </div>

                            <div>

                                <strong>
                                    Almost there
                                </strong>

                                <span>
                                    Keep going!
                                </span>

                            </div>

                        </div>


                        <div
                            class="milestone"
                            data-milestone="100"
                        >

                            <div class="milestone-icon">
                                100%
                            </div>

                            <div>

                                <strong>
                                    Goal reached!
                                </strong>

                                <span>
                                    You did it! 🎉
                                </span>

                            </div>

                        </div>

                    </div>

                `;


                document
                    .getElementById("progress-container")
                    .after(milestones);

            }


            // Update milestone states

            const milestoneElements =
                document.querySelectorAll(
                    ".milestone"
                );


            milestoneElements.forEach(
                function (milestone) {

                    const milestoneValue =
                        Number(
                            milestone.getAttribute(
                                "data-milestone"
                            )
                        );


                    if (
                        progressPercentage >=
                        milestoneValue
                    ) {

                        milestone.classList.add(
                            "achieved"
                        );

                    } else {

                        milestone.classList.remove(
                            "achieved"
                        );

                    }

                }
            );


            // ==========================================
            // GOAL MESSAGE
            // ==========================================

            let goalMessage =
                document.getElementById(
                    "goal-message"
                );


            if (!goalMessage) {

                goalMessage =
                    document.createElement(
                        "div"
                    );


                goalMessage.id =
                    "goal-message";


                document
                    .getElementById("milestones")
                    .after(goalMessage);

            }


            if (progressPercentage >= 100) {

                goalMessage.innerHTML = `

                    <strong>
                        🎉 Goal reached!
                    </strong>

                    <span>
                        You've saved enough for your ${goal}.
                    </span>

                `;

                goalMessage.classList.add(
                    "complete"
                );

            } else {

                goalMessage.innerHTML = `

                    <strong>
                        Keep going!
                    </strong>

                    <span>
                        You're ${progressPercentage.toFixed(1)}% of the way to your ${goal}.
                    </span>

                `;

                goalMessage.classList.remove(
                    "complete"
                );

            }

        }
    );

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


const modal =
    document.getElementById(
        "challenge-modal"
    );


const modalNumber =
    document.getElementById(
        "modal-number"
    );


const modalTitle =
    document.getElementById(
        "modal-title"
    );


const modalDescription =
    document.getElementById(
        "modal-description"
    );


const completeButton =
    document.getElementById(
        "complete-challenge"
    );


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


    modal.classList.add(
        "active"
    );

}


// ==========================================
// CLOSE CHALLENGE
// ==========================================

function closeChallenge() {

    modal.classList.remove(
        "active"
    );


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
                "challenge-" +
                currentChallenge,
                "completed"
            );


            completeButton.textContent =
                "✓ Challenge completed!";


            const cards =
                document.querySelectorAll(
                    ".challenge"
                );


            cards.forEach(
                function (card) {

                    const button =
                        card.querySelector(
                            ".challenge-button"
                        );


                    if (
                        button &&
                        button
                            .getAttribute("onclick")
                            .includes(
                                currentChallenge
                            )
                    ) {

                        button.textContent =
                            "✓ Completed";


                        card.classList.add(
                            "completed"
                        );

                    }

                }
            );

        }
    );

}


// ==========================================
// LOAD COMPLETED CHALLENGES
// ==========================================

function loadCompletedChallenges() {

    const cards =
        document.querySelectorAll(
            ".challenge"
        );


    cards.forEach(
        function (card) {

            const button =
                card.querySelector(
                    ".challenge-button"
                );


            if (!button) {
                return;
            }


            const onclickText =
                button.getAttribute(
                    "onclick"
                );


            Object.keys(challenges)
                .forEach(
                    function (challengeName) {

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

                    }
                );

        }
    );

}


loadCompletedChallenges();


// ==========================================
// CLOSE MODAL OUTSIDE
// ==========================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === modal
            ) {

                closeChallenge();

            }

        }
    );

}


// ==========================================
// ESCAPE KEY
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeChallenge();

        }

    }
);
