// ==========================================
// SAVETARGET
// ==========================================



// ==========================================
// DATE INPUT + CALENDAR
// ==========================================

const dateInput = document.getElementById("date");
const hiddenDate = document.getElementById("hidden-date");
const calendarButton = document.getElementById("calendar-button");


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


if (calendarButton && hiddenDate) {

    calendarButton.addEventListener("click", function () {

        if (typeof hiddenDate.showPicker === "function") {
            hiddenDate.showPicker();
        } else {
            hiddenDate.click();
        }

    });


    hiddenDate.addEventListener("change", function () {

        if (!this.value) return;

        const parts = this.value.split("-");

        const year = parts[0];
        const month = parts[1];
        const day = parts[2];

        dateInput.value =
            day + "/" + month + "/" + year;

    });

}



// ==========================================
// DATE VALIDATION
// ==========================================

function getValidDate(dateString) {

    const parts = dateString.split("/");

    if (parts.length !== 3) {
        return null;
    }

    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);

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

    const date = new Date(
        year,
        month - 1,
        day
    );

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
// CALCULATOR
// ==========================================

const calculateButton =
    document.getElementById("calculate");


if (calculateButton) {

    calculateButton.addEventListener("click", function () {

        const goal =
            document.getElementById("goal").value.trim();

        const target =
            Number(document.getElementById("target").value);

        const saved =
            Number(document.getElementById("saved").value);

        const dateString =
            document.getElementById("date").value.trim();


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


        const targetDate =
            getValidDate(dateString);


        if (!targetDate) {

            alert(
                "Please enter a valid date in DD/MM/YYYY format."
            );

            return;
        }


        const today = new Date();

        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);


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


        // Calculations

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


        const completionDate =
            targetDate.toLocaleDateString(
                "en-GB",
                {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );


        // Main results

        document.getElementById(
            "weekly-result"
        ).textContent =
            "€" + weeklySaving.toFixed(2);


        document.getElementById(
            "monthly-result"
        ).textContent =
            "€" + monthlySaving.toFixed(2);


        document.getElementById(
            "progress-result"
        ).textContent =
            progressPercentage.toFixed(1) + "%";



        // Extra results

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


        document.getElementById(
            "goal-result"
        ).textContent = goal;


        document.getElementById(
            "remaining-result"
        ).textContent =
            "€" + remaining.toFixed(2);


        document.getElementById(
            "days-result"
        ).textContent =
            daysRemaining + " days";



        // Plan details

        let planDetails =
            document.getElementById("plan-details");


        if (!planDetails) {

            planDetails =
                document.createElement("div");

            planDetails.id =
                "plan-details";

            planDetails.innerHTML = `

                <div class="plan-main">

                    <span>
                        Daily saving target
                    </span>

                    <strong id="daily-result">
                        €0.00
                    </strong>

                </div>


                <div class="plan-date">

                    <span>
                        Goal date
                    </span>

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
            "€" + dailySaving.toFixed(2);


        document.getElementById(
            "date-result"
        ).textContent =
            completionDate;



        // Progress bar

        let progressContainer =
            document.getElementById(
                "progress-container"
            );


        if (!progressContainer) {

            progressContainer =
                document.createElement("div");

            progressContainer.id =
                "progress-container";

            progressContainer.innerHTML = `

                <div class="progress-header">

                    <span>
                        Progress
                    </span>

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
            progressPercentage.toFixed(1) + "%";


        document.getElementById(
            "progress-fill"
        ).style.width =
            progressPercentage + "%";



        // Milestones

        let milestones =
            document.getElementById("milestones");


        if (!milestones) {

            milestones =
                document.createElement("div");

            milestones.id =
                "milestones";

            milestones.innerHTML = `

                <div class="milestones-title">
                    Savings milestones
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


        const milestoneElements =
            document.querySelectorAll(".milestone");


        milestoneElements.forEach(function (milestone) {

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

                milestone.classList.add("achieved");

            } else {

                milestone.classList.remove("achieved");

            }

        });



        // Goal message

        let goalMessage =
            document.getElementById("goal-message");


        if (!goalMessage) {

            goalMessage =
                document.createElement("div");

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

            goalMessage.classList.add("complete");

        } else {

            goalMessage.innerHTML = `

                <strong>
                    Keep going!
                </strong>

                <span>
                    You're ${progressPercentage.toFixed(1)}% of the way to your ${goal}.
                </span>

            `;

            goalMessage.classList.remove("complete");
        }

    });

}



// ==========================================
// SAVING CHALLENGES
// ==========================================

// 30 challenge bank

const challengeBank = [

    {
        title: "No-spend Friday",
        description:
            "Try going one full day without spending money on anything you don't need. Put what you would have spent towards your savings goal."
    },

    {
        title: "Round it up",
        description:
            "Round your purchases up to the nearest euro and save the difference."
    },

    {
        title: "Save an extra €5",
        description:
            "Add an extra €5 to your usual weekly savings."
    },

    {
        title: "Skip one takeaway",
        description:
            "Skip one takeaway this week and put the money you would have spent into your savings."
    },

    {
        title: "Coffee at home",
        description:
            "Make your coffee at home instead of buying one. Save the money you would normally spend."
    },

    {
        title: "Pack your lunch",
        description:
            "Bring lunch from home instead of buying it. Put the money saved towards your goal."
    },

    {
        title: "24-hour spending freeze",
        description:
            "Don't spend any money for 24 hours unless it is essential."
    },

    {
        title: "Save your coins",
        description:
            "Put every coin you receive this week into your savings."
    },

    {
        title: "Cancel one unused subscription",
        description:
            "Find a subscription you don't use and cancel it. Save the money you would have spent."
    },

    {
        title: "One less snack",
        description:
            "Skip one unnecessary snack purchase and save the money instead."
    },

    {
        title: "Compare before buying",
        description:
            "Before buying something, check another shop or website for a better price and save the difference."
    },

    {
        title: "Sell something",
        description:
            "Find one thing you no longer need and sell it. Put the money into your savings."
    },

    {
        title: "Use what you already have",
        description:
            "Make a meal using ingredients you already have instead of buying something new."
    },

    {
        title: "Save a £1/€1 coin",
        description:
            "Every time you receive a £1 or €1 coin, put it straight into your savings."
    },

    {
        title: "No impulse purchases",
        description:
            "Don't buy anything on impulse for the next three days."
    },

    {
        title: "Walk instead",
        description:
            "Walk instead of paying for transport for one journey where it is practical."
    },

    {
        title: "Save the difference",
        description:
            "Choose a cheaper alternative to something you normally buy and save the difference."
    },

    {
        title: "Cook twice",
        description:
            "Cook enough food for two meals and avoid buying another meal later."
    },

    {
        title: "The €10 challenge",
        description:
            "Find €10 of spending you can avoid this week and add it to your savings."
    },

    {
        title: "Check your bank",
        description:
            "Review your recent spending and identify one unnecessary expense to cut."
    },

    {
        title: "Bring your own drink",
        description:
            "Take a reusable bottle or drink from home instead of buying one."
    },

    {
        title: "Wait before buying",
        description:
            "Wait 48 hours before buying anything non-essential. If you don't need it, save the money instead."
    },

    {
        title: "Save your cashback",
        description:
            "If you receive cashback or a small refund, put it straight into your savings."
    },

    {
        title: "Cheap entertainment",
        description:
            "Choose a free or low-cost activity instead of an expensive day out."
    },

    {
        title: "Grocery challenge",
        description:
            "Try to spend less on your next grocery shop than you normally would and save the difference."
    },

    {
        title: "Save a percentage",
        description:
            "Put an extra 1% of your usual weekly spending amount into your savings."
    },

    {
        title: "No online shopping",
        description:
            "Avoid unnecessary online shopping for seven days."
    },

    {
        title: "Declutter and save",
        description:
            "Find three things you no longer use. Sell them and put the money into your goal."
    },

    {
        title: "The €20 challenge",
        description:
            "Find €20 of savings across the week by cutting unnecessary spending."
    },

    {
        title: "Double your saving",
        description:
            "For one week, try to save twice your normal weekly amount."
    }

];



// ==========================================
// CHALLENGE STORAGE
// ==========================================

const COMPLETED_KEY =
    "savetarget-completed-challenges";

const CURRENT_KEY =
    "savetarget-current-challenges";



function getCompletedChallenges() {

    return JSON.parse(
        localStorage.getItem(COMPLETED_KEY) || "[]"
    );

}



function saveCompletedChallenges(completed) {

    localStorage.setItem(
        COMPLETED_KEY,
        JSON.stringify(completed)
    );

}



// ==========================================
// RANDOM CHALLENGES
// ==========================================

function getNewChallenges() {

    const completed =
        getCompletedChallenges();

    const available =
        challengeBank
            .map(function (challenge, index) {
                return {
                    ...challenge,
                    id: index + 1
                };
            })
            .filter(function (challenge) {
                return !completed.includes(challenge.id);
            });


    // If all 30 have been completed,
    // start a fresh round.

    if (available.length < 3) {

        localStorage.removeItem(
            COMPLETED_KEY
        );

        return getNewChallenges();

    }


    const selected = [];


    while (selected.length < 3) {

        const randomIndex =
            Math.floor(
                Math.random() *
                available.length
            );

        const challenge =
            available[randomIndex];


        if (
            !selected.some(
                function (item) {
                    return item.id === challenge.id;
                }
            )
        ) {

            selected.push(challenge);

        }

    }


    return selected;

}



// ==========================================
// DISPLAY CHALLENGES
// ==========================================

function loadChallenges() {

    const grid =
        document.getElementById(
            "challenge-grid"
        );


    if (!grid) return;


    let current =
        JSON.parse(
            localStorage.getItem(
                CURRENT_KEY
            ) || "null"
        );


    // If there are no current challenges,
    // create three new ones.

    if (
        !current ||
        !Array.isArray(current) ||
        current.length !== 3
    ) {

        current =
            getNewChallenges();

        localStorage.setItem(
            CURRENT_KEY,
            JSON.stringify(current)
        );

    }


    renderChallenges(current);

    updateChallengeProgress();

}



// ==========================================
// RENDER CHALLENGES
// ==========================================

function renderChallenges(challenges) {

    const grid =
        document.getElementById(
            "challenge-grid"
        );


    if (!grid) return;


    const completed =
        getCompletedChallenges();


    grid.innerHTML = "";


    challenges.forEach(function (challenge, index) {

        const card =
            document.createElement("div");

        card.className =
            "challenge";


        if (
            completed.includes(challenge.id)
        ) {

            card.classList.add("completed");

        }


        card.innerHTML = `

            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${challenge.title}
            </h3>

            <p>
                ${challenge.description}
            </p>

            <button
                class="challenge-button"
                onclick="openChallenge(${challenge.id})"
            >
                ${
                    completed.includes(challenge.id)
                    ? "✓ Completed"
                    : "View challenge →"
                }
            </button>

        `;


        grid.appendChild(card);

    });

}



// ==========================================
// OPEN CHALLENGE
// ==========================================

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



function openChallenge(challengeId) {

    const current =
        JSON.parse(
            localStorage.getItem(
                CURRENT_KEY
            ) || "[]"
        );


    const challenge =
        current.find(function (item) {

            return item.id === challengeId;

        });


    if (!challenge) return;


    currentChallenge =
        challenge;


    modalNumber.textContent =
        String(
            current.indexOf(challenge) + 1
        ).padStart(2, "0");


    modalTitle.textContent =
        challenge.title;


    modalDescription.textContent =
        challenge.description;


    const completed =
        getCompletedChallenges();


    if (
        completed.includes(challenge.id)
    ) {

        completeButton.textContent =
            "✓ Challenge completed!";

    } else {

        completeButton.textContent =
            "Complete challenge";

    }


    modal.classList.add("active");

}



// ==========================================
// CLOSE CHALLENGE
// ==========================================

function closeChallenge() {

    if (!modal) return;

    modal.classList.remove(
        "active"
    );

    currentChallenge =
        null;

}



// ==========================================
// COMPLETE CHALLENGE
// ==========================================

if (completeButton) {

    completeButton.addEventListener(
        "click",
        function () {

            if (!currentChallenge) return;


            let completed =
                getCompletedChallenges();


            // Don't add it twice.

            if (
                !completed.includes(
                    currentChallenge.id
                )
            ) {

                completed.push(
                    currentChallenge.id
                );

            }


            saveCompletedChallenges(
                completed
            );


            completeButton.textContent =
                "✓ Challenge completed!";


            updateChallengeProgress();


            // Check whether all three
            // current challenges are complete.

            const current =
                JSON.parse(
                    localStorage.getItem(
                        CURRENT_KEY
                    ) || "[]"
                );


            const allComplete =
                current.every(function (challenge) {

                    return completed.includes(
                        challenge.id
                    );

                });


            if (allComplete) {

                // Close the modal first.

                closeChallenge();


                // Wait a moment so the user
                // can see the completed state.

                setTimeout(function () {

                    const newChallenges =
                        getNewChallenges();


                    localStorage.setItem(
                        CURRENT_KEY,
                        JSON.stringify(
                            newChallenges
                        )
                    );


                    renderChallenges(
                        newChallenges
                    );

                    updateChallengeProgress();

                }, 600);

            } else {

                // Update only the current card.

                renderChallenges(current);

                // Re-open the modal so the user
                // can see that it is completed.

                const updatedCurrent =
                    JSON.parse(
                        localStorage.getItem(
                            CURRENT_KEY
                        ) || "[]"
                    );


                const updatedChallenge =
                    updatedCurrent.find(function (item) {

                        return (
                            item.id ===
                            currentChallenge.id
                        );

                    });


                if (updatedChallenge) {

                    currentChallenge =
                        updatedChallenge;

                    modal.classList.add(
                        "active"
                    );

                    completeButton.textContent =
                        "✓ Challenge completed!";

                }

            }

        }
    );

}



// ==========================================
// CHALLENGE PROGRESS
// ==========================================

function updateChallengeProgress() {

    const progress =
        document.getElementById(
            "challenge-progress"
        );


    if (!progress) return;


    const completed =
        getCompletedChallenges();


    progress.textContent =
        "Challenges completed: " +
        completed.length +
        " / 30";

}



// ==========================================
// CLOSE MODAL WHEN CLICKING OUTSIDE
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



// ==========================================
// LOAD CHALLENGES
// ==========================================

loadChallenges();
