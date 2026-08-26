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


        // ==========================================
        // EXTRA RESULTS
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


        // ==========================================
        // PLAN DETAILS
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


        // ==========================================
        // PROGRESS BAR
        // ==========================================

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


        // ==========================================
        // MILESTONES
        // ==========================================

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


        updateMilestones(progressPercentage);


        // ==========================================
        // GOAL MESSAGE
        // ==========================================

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


        // ==========================================
        // SAVE CURRENT GOAL DATA
        // ==========================================

        localStorage.setItem(
            "saveTargetGoal",
            JSON.stringify({
                goal: goal,
                target: target,
                saved: saved,
                date: dateString
            })
        );


        // Reset tracked savings to calculator amount
        localStorage.setItem(
            "saveTargetTrackedSaved",
            saved.toString()
        );


        updateSavingsTracker();

    });

}


// ==========================================
// MILESTONE FUNCTION
// ==========================================

function updateMilestones(progressPercentage) {

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

}


// ==========================================
// SAVINGS TRACKER
// ==========================================

const addSavingsButton =
    document.getElementById(
        "add-savings-button"
    );


if (addSavingsButton) {

    addSavingsButton.addEventListener(
        "click",
        function () {

            const amountInput =
                document.getElementById(
                    "add-savings"
                );

            const amount =
                Number(amountInput.value);


            const savedGoal =
                localStorage.getItem(
                    "saveTargetGoal"
                );


            if (!savedGoal) {

                alert(
                    "Please calculate your savings plan first."
                );

                return;
            }


            if (
                !amount ||
                amount <= 0
            ) {

                alert(
                    "Please enter an amount greater than €0."
                );

                return;
            }


            const goalData =
                JSON.parse(savedGoal);


            let currentSaved =
                Number(
                    localStorage.getItem(
                        "saveTargetTrackedSaved"
                    )
                );


            if (
                isNaN(currentSaved)
            ) {

                currentSaved =
                    Number(goalData.saved);

            }


            const newSaved =
                currentSaved + amount;


            if (
                newSaved > Number(goalData.target)
            ) {

                alert(
                    "That would take you over your savings goal."
                );

                return;
            }


            localStorage.setItem(
                "saveTargetTrackedSaved",
                newSaved.toString()
            );


            amountInput.value = "";


            const message =
                document.getElementById(
                    "savings-message"
                );


            message.innerHTML =
                "✓ €" +
                amount.toFixed(2) +
                " added to your savings!";


            updateSavingsTracker();


            setTimeout(function () {

                message.innerHTML = "";

            }, 3000);

        }
    );

}


// ==========================================
// UPDATE SAVINGS TRACKER
// ==========================================

function updateSavingsTracker() {

    const savedGoal =
        localStorage.getItem(
            "saveTargetGoal"
        );


    if (!savedGoal) return;


    const goalData =
        JSON.parse(savedGoal);


    let currentSaved =
        Number(
            localStorage.getItem(
                "saveTargetTrackedSaved"
            )
        );


    if (
        isNaN(currentSaved)
    ) {

        currentSaved =
            Number(goalData.saved);

    }


    const target =
        Number(goalData.target);


    const remaining =
        Math.max(
            target - currentSaved,
            0
        );


    const progress =
        target > 0
            ? (currentSaved / target) * 100
            : 0;


    const percentage =
        Math.min(progress, 100);


    const trackedSaved =
        document.getElementById(
            "tracked-saved"
        );


    const trackedRemaining =
        document.getElementById(
            "tracked-remaining"
        );


    const trackedProgress =
        document.getElementById(
            "tracked-progress"
        );


    const trackedProgressText =
        document.getElementById(
            "tracked-progress-text"
        );


    const trackedProgressFill =
        document.getElementById(
            "tracked-progress-fill"
        );


    if (trackedSaved) {

        trackedSaved.textContent =
            "€" +
            currentSaved.toFixed(2);

    }


    if (trackedRemaining) {

        trackedRemaining.textContent =
            "€" +
            remaining.toFixed(2);

    }


    if (trackedProgress) {

        trackedProgress.textContent =
            percentage.toFixed(1) +
            "%";

    }


    if (trackedProgressText) {

        trackedProgressText.textContent =
            percentage.toFixed(1) +
            "%";

    }


    if (trackedProgressFill) {

        trackedProgressFill.style.width =
            percentage + "%";

    }

}


// Load saved tracker when page opens

updateSavingsTracker();


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
    },

    mealprep: {
        number: "04",
        title: "Meal prep",
        description:
            "Prepare your meals at home for three days instead of buying food out. Put the money you save towards your goal."
    },

    coffee: {
        number: "05",
        title: "Skip the coffee",
        description:
            "Skip one takeaway coffee and save the money you would have spent."
    },

    coins: {
        number: "06",
        title: "Coin jar",
        description:
            "Put all your loose change into a savings jar for one week."
    },

    twenty: {
        number: "07",
        title: "Save €20",
        description:
            "Find a way to save an extra €20 this week and add it to your goal."
    },

    subscription: {
        number: "08",
        title: "Check your subscriptions",
        description:
            "Look through your subscriptions and identify one you don't really use."
    },

    leftovers: {
        number: "09",
        title: "Use your leftovers",
        description:
            "Use food you already have at home instead of buying something new."
    },

    transport: {
        number: "10",
        title: "Walk instead",
        description:
            "Walk or cycle somewhere you would normally drive or take public transport."
    },

    online: {
        number: "11",
        title: "No online shopping",
        description:
            "Avoid buying anything online for one full week."
    },

    savings: {
        number: "12",
        title: "Double your saving",
        description:
            "Double your usual saving amount for one week."
    },

    cash: {
        number: "13",
        title: "Cash-only day",
        description:
            "Take out a fixed amount of cash and stick to that budget for the day."
    },

    homemade: {
        number: "14",
        title: "Homemade meal",
        description:
            "Make a meal at home that you would normally buy."
    },

    wishlist: {
        number: "15",
        title: "Wait 48 hours",
        description:
            "If you want to buy something you don't need, wait 48 hours before purchasing it."
    },

    ten: {
        number: "16",
        title: "Save an extra €10",
        description:
            "Put an extra €10 towards your savings goal this week."
    },

    budget: {
        number: "17",
        title: "Make a budget",
        description:
            "Write down your expected spending for the next seven days."
    },

    bargain: {
        number: "18",
        title: "Find a cheaper option",
        description:
            "Find one regular purchase that you can replace with a cheaper alternative."
    },

    free: {
        number: "19",
        title: "Free entertainment",
        description:
            "Find something fun to do that costs absolutely nothing."
    },

    unused: {
        number: "20",
        title: "Sell something",
        description:
            "Find one item you no longer use and sell it. Put the money towards your goal."
    },

    water: {
        number: "21",
        title: "Bring your own drink",
        description:
            "Bring water or a drink from home instead of buying one."
    },

    lunch: {
        number: "22",
        title: "Bring your lunch",
        description:
            "Prepare and bring your lunch from home instead of buying it."
    },

    impulse: {
        number: "23",
        title: "Beat an impulse purchase",
        description:
            "Avoid one impulse purchase and put the money you saved towards your goal."
    },

    challenge25: {
        number: "24",
        title: "Save €25",
        description:
            "Find a way to save an extra €25 and add it to your savings."
    },

    week: {
        number: "25",
        title: "One-week challenge",
        description:
            "Go one full week without buying anything unnecessary."
    },

    app: {
        number: "26",
        title: "Check your spending",
        description:
            "Look through your recent transactions and identify one area where you could spend less."
    },

    bargainhunt: {
        number: "27",
        title: "Bargain hunt",
        description:
            "Before buying something this week, compare prices and find the cheapest option."
    },

    treat: {
        number: "28",
        title: "Skip one treat",
        description:
            "Skip one unnecessary treat and put the money towards your savings goal."
    },

    thirty: {
        number: "29",
        title: "Save €30",
        description:
            "Find a way to save an extra €30 and add it to your goal."
    },

    reset: {
        number: "30",
        title: "Savings reset",
        description:
            "Review your spending, choose one thing to cut back on and put the money you save towards your goal."
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


    if (!challenge) return;


    currentChallenge =
        challengeName;


    modalNumber.textContent =
        challenge.number;


    modalTitle.textContent =
        challenge.title;


    modalDescription.textContent =
        challenge.description;


    const completed =
        localStorage.getItem(
            "challenge-" +
            challengeName
        );


    if (
        completed === "completed"
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

            if (!currentChallenge) return;


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


            cards.forEach(function (card) {

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

            });

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


    cards.forEach(function (card) {

        const button =
            card.querySelector(
                ".challenge-button"
            );


        if (!button) return;


        const onclickText =
            button.getAttribute(
                "onclick"
            );


        Object.keys(challenges).forEach(
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

    });

}


loadCompletedChallenges();

// ==========================================
// RANDOM CHALLENGE BANK
// ==========================================

function getRandomChallenges() {

    const challengeNames =
        Object.keys(challenges);

    let selected =
        JSON.parse(
            localStorage.getItem(
                "saveTargetActiveChallenges"
            )
        );

    if (
        !selected ||
        selected.length !== 3
    ) {

        selected =
            challengeNames
                .sort(
                    () => Math.random() - 0.5
                )
                .slice(0, 3);

        localStorage.setItem(
            "saveTargetActiveChallenges",
            JSON.stringify(selected)
        );
    }

    return selected;
}



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

        if (
            event.key === "Escape"
        ) {

            closeChallenge();

        }

    }
);
