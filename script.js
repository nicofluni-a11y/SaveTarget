// ==========================================
// SAVETARGET
// ==========================================


// ==========================================
// CURRENT SESSION DATA
// ==========================================

let currentGoalData = null;
let additionalSavings = 0;


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
// ADDITIONAL SAVINGS LABELS
// ==========================================

const savingsSection =
    document.getElementById("savings");


if (savingsSection) {

    const eyebrow =
        savingsSection.querySelector(".eyebrow");

    const heading =
        savingsSection.querySelector("h2");

    const description =
        savingsSection.querySelector(".section-intro p:last-child");

    const savingsLabel =
        document.querySelector('label[for="add-savings"]');


    if (eyebrow) {
        eyebrow.textContent =
            "ADDITIONAL SAVINGS";
    }


    if (heading) {
        heading.innerHTML =
            "Add to your <span>savings.</span>";
    }


    if (description) {
        description.textContent =
            "Add extra money whenever you save and reduce the amount you need to save each week.";
    }


    if (savingsLabel) {
        savingsLabel.textContent =
            "How much would you like to add?";
    }

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
            Number(
                document.getElementById("target").value
            );

        const saved =
            Number(
                document.getElementById("saved").value
            ) || 0;

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


        // Save current calculator data.

        currentGoalData = {

            goal: goal,
            target: target,
            saved: saved,
            date: dateString,
            targetDate: targetDate,
            daysRemaining: daysRemaining

        };


        // Reset additional savings
        // whenever a new plan is created.

        additionalSavings = 0;


        const amountInput =
            document.getElementById("add-savings");


        if (amountInput) {
            amountInput.value = "";
        }


        updateCalculator();

        updateSavingsTracker();

    });

}


// ==========================================
// UPDATE CALCULATOR
// ==========================================

function updateCalculator() {

    if (!currentGoalData) return;


    const goal =
        currentGoalData.goal;

    const target =
        Number(currentGoalData.target);

    const originalSaved =
        Number(currentGoalData.saved);

    const daysRemaining =
        Number(currentGoalData.daysRemaining);


    // ==========================================
    // TOTAL SAVED
    // ==========================================

    const totalSaved =
        Math.min(
            originalSaved + additionalSavings,
            target
        );


    // ==========================================
    // REMAINING
    // ==========================================

    const remaining =
        Math.max(
            target - totalSaved,
            0
        );


    // ==========================================
    // SAVINGS CALCULATIONS
    // ==========================================

    const weeksRemaining =
        daysRemaining / 7;


    const weeklySaving =
        remaining / weeksRemaining;


    const monthlySaving =
        weeklySaving * 52 / 12;


    const dailySaving =
        remaining / daysRemaining;


    // ==========================================
    // PROGRESS
    // ==========================================

    const progress =
        target > 0
            ? (totalSaved / target) * 100
            : 0;


    const progressPercentage =
        Math.min(progress, 100);


    const targetDate =
        currentGoalData.targetDate;


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

    const weeklyResult =
        document.getElementById("weekly-result");

    const monthlyResult =
        document.getElementById("monthly-result");

    const progressResult =
        document.getElementById("progress-result");


    if (weeklyResult) {

        weeklyResult.textContent =
            "€" +
            weeklySaving.toFixed(2);

    }


    if (monthlyResult) {

        monthlyResult.textContent =
            "€" +
            monthlySaving.toFixed(2);

    }


    if (progressResult) {

        progressResult.textContent =
            progressPercentage.toFixed(1) +
            "%";

    }


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

                <span>
                    Goal
                </span>

                <strong id="goal-result"></strong>

            </div>


            <div class="extra-result">

                <span>
                    Remaining
                </span>

                <strong id="remaining-result"></strong>

            </div>


            <div class="extra-result">

                <span>
                    Days left
                </span>

                <strong id="days-result"></strong>

            </div>

        `;


        const results =
            document.getElementById("results");


        if (results) {
            results.after(extraResults);
        }

    }


    const goalResult =
        document.getElementById("goal-result");

    const remainingResult =
        document.getElementById("remaining-result");

    const daysResult =
        document.getElementById("days-result");


    if (goalResult) {
        goalResult.textContent = goal;
    }


    if (remainingResult) {

        remainingResult.textContent =
            "€" +
            remaining.toFixed(2);

    }


    if (daysResult) {

        daysResult.textContent =
            daysRemaining +
            " days";

    }


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


        const extra =
            document.getElementById("extra-results");


        if (extra) {
            extra.after(planDetails);
        }

    }


    const dailyResult =
        document.getElementById("daily-result");

    const dateResult =
        document.getElementById("date-result");


    if (dailyResult) {

        dailyResult.textContent =
            "€" +
            dailySaving.toFixed(2);

    }


    if (dateResult) {

        dateResult.textContent =
            completionDate;

    }


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


        const plan =
            document.getElementById(
                "plan-details"
            );


        if (plan) {
            plan.after(progressContainer);
        }

    }


    const progressText =
        document.getElementById("progress-text");

    const progressFill =
        document.getElementById("progress-fill");


    if (progressText) {

        progressText.textContent =
            progressPercentage.toFixed(1) +
            "%";

    }


    if (progressFill) {

        progressFill.style.width =
            progressPercentage +
            "%";

    }


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


        const progress =
            document.getElementById(
                "progress-container"
            );


        if (progress) {
            progress.after(milestones);
        }

    }


    updateMilestones(progressPercentage);


    // ==========================================
    // GOAL MESSAGE
    // ==========================================

    let goalMessage =
        document.getElementById(
            "goal-message"
        );


    if (!goalMessage) {

        goalMessage =
            document.createElement("div");

        goalMessage.id =
            "goal-message";


        const milestoneElement =
            document.getElementById(
                "milestones"
            );


        if (milestoneElement) {
            milestoneElement.after(goalMessage);
        }

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

}


// ==========================================
// MILESTONE FUNCTION
// ==========================================

function updateMilestones(progressPercentage) {

    const milestoneElements =
        document.querySelectorAll(
            ".milestone"
        );


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

            milestone.classList.add(
                "achieved"
            );

        } else {

            milestone.classList.remove(
                "achieved"
            );

        }

    });

}


// ==========================================
// ADDITIONAL SAVINGS
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
                Number(
                    amountInput.value
                );


            if (!currentGoalData) {

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


            const target =
                Number(
                    currentGoalData.target
                );


            const originalSaved =
                Number(
                    currentGoalData.saved
                );


            const currentTotal =
                originalSaved +
                additionalSavings;


            const newTotal =
                currentTotal +
                amount;


            if (newTotal > target) {

                alert(
                    "That would take you over your savings goal."
                );

                return;
            }


            additionalSavings += amount;


            amountInput.value = "";


            updateCalculator();

            updateSavingsTracker();


            const message =
                document.getElementById(
                    "savings-message"
                );


            if (message) {

                message.innerHTML =
                    "✓ €" +
                    amount.toFixed(2) +
                    " added to your additional savings!";


                setTimeout(function () {

                    message.innerHTML = "";

                }, 3000);

            }

        }
    );

}


// ==========================================
// UPDATE ADDITIONAL SAVINGS DISPLAY
// ==========================================

function updateSavingsTracker() {

    if (!currentGoalData) {
        return;
    }


    const target =
        Number(
            currentGoalData.target
        );


    const originalSaved =
        Number(
            currentGoalData.saved
        );


    const daysRemaining =
        Number(
            currentGoalData.daysRemaining
        );


    // ==========================================
    // ORIGINAL PLAN
    // ==========================================

    const originalRemaining =
        Math.max(
            target - originalSaved,
            0
        );


    const weeksRemaining =
        daysRemaining / 7;


    const originalWeekly =
        originalRemaining /
        weeksRemaining;


    const originalMonthly =
        originalWeekly *
        52 /
        12;


    // ==========================================
    // NEW PLAN
    // ==========================================

    const totalSaved =
        Math.min(
            originalSaved +
            additionalSavings,
            target
        );


    const newRemaining =
        Math.max(
            target -
            totalSaved,
            0
        );


    const newWeekly =
        newRemaining /
        weeksRemaining;


    const newMonthly =
        newWeekly *
        52 /
        12;


    // ==========================================
    // REDUCTION
    // ==========================================

    const weeklyReduction =
        Math.max(
            originalWeekly -
            newWeekly,
            0
        );


    const monthlyReduction =
        Math.max(
            originalMonthly -
            newMonthly,
            0
        );


    // ==========================================
    // UPDATE EXISTING HTML
    // ==========================================

    const weeklyReductionElement =
        document.getElementById(
            "tracked-weekly-reduction"
        );


    const monthlyReductionElement =
        document.getElementById(
            "tracked-monthly-reduction"
        );


    if (weeklyReductionElement) {

        weeklyReductionElement.textContent =
            "€" +
            weeklyReduction.toFixed(2);

    }


    if (monthlyReductionElement) {

        monthlyReductionElement.textContent =
            "€" +
            monthlyReduction.toFixed(2);

    }

}


// ==========================================
// RESET EVERYTHING ON PAGE LOAD
// ==========================================

function resetSavingsPage() {

    currentGoalData = null;
    additionalSavings = 0;


    const goalInput =
        document.getElementById("goal");

    const targetInput =
        document.getElementById("target");

    const savedInput =
        document.getElementById("saved");

    const dateInputElement =
        document.getElementById("date");

    const hiddenDateInput =
        document.getElementById("hidden-date");

    const additionalInput =
        document.getElementById("add-savings");


    if (goalInput) {
        goalInput.value = "";
    }

    if (targetInput) {
        targetInput.value = "";
    }

    if (savedInput) {
        savedInput.value = "";
    }

    if (dateInputElement) {
        dateInputElement.value = "";
    }

    if (hiddenDateInput) {
        hiddenDateInput.value = "";
    }

    if (additionalInput) {
        additionalInput.value = "";
    }


    const weeklyResult =
        document.getElementById(
            "weekly-result"
        );

    const monthlyResult =
        document.getElementById(
            "monthly-result"
        );

    const progressResult =
        document.getElementById(
            "progress-result"
        );


    if (weeklyResult) {
        weeklyResult.textContent =
            "€0.00";
    }

    if (monthlyResult) {
        monthlyResult.textContent =
            "€0.00";
    }

    if (progressResult) {
        progressResult.textContent =
            "0%";
    }


    // Remove dynamically generated
    // calculator sections.

    const extraResults =
        document.getElementById(
            "extra-results"
        );

    const planDetails =
        document.getElementById(
            "plan-details"
        );

    const progressContainer =
        document.getElementById(
            "progress-container"
        );

    const milestones =
        document.getElementById(
            "milestones"
        );

    const goalMessage =
        document.getElementById(
            "goal-message"
        );


    if (extraResults) {
        extraResults.remove();
    }

    if (planDetails) {
        planDetails.remove();
    }

    if (progressContainer) {
        progressContainer.remove();
    }

    if (milestones) {
        milestones.remove();
    }

    if (goalMessage) {
        goalMessage.remove();
    }


    // Reset Additional Savings values.

    const weeklyReduction =
        document.getElementById(
            "tracked-weekly-reduction"
        );

    const monthlyReduction =
        document.getElementById(
            "tracked-monthly-reduction"
        );


    if (weeklyReduction) {
        weeklyReduction.textContent =
            "€0.00";
    }

    if (monthlyReduction) {
        monthlyReduction.textContent =
            "€0.00";
    }

}


resetSavingsPage();


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


// ==========================================
// CHALLENGE MODAL
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


// ==========================================
// OPEN CHALLENGE
// ==========================================

function openChallenge(challengeName) {

    const challenge =
        challenges[challengeName];


    if (!challenge) return;


    currentChallenge =
        challengeName;


    if (modalNumber) {
        modalNumber.textContent =
            challenge.number;
    }


    if (modalTitle) {
        modalTitle.textContent =
            challenge.title;
    }


    if (modalDescription) {
        modalDescription.textContent =
            challenge.description;
    }


    const completed =
        localStorage.getItem(
            "challenge-" +
            challengeName
        );


    if (completeButton) {

        if (
            completed ===
            "completed"
        ) {

            completeButton.textContent =
                "✓ Challenge completed!";

        } else {

            completeButton.textContent =
                "Complete challenge";

        }

    }


    if (modal) {
        modal.classList.add("active");
    }

}


// ==========================================
// CLOSE CHALLENGE
// ==========================================

function closeChallenge() {

    if (modal) {
        modal.classList.remove("active");
    }

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


            displayActiveChallenges();

            checkChallengesComplete();

        }
    );

}


// ==========================================
// LOAD COMPLETED CHALLENGES
// ==========================================

function loadCompletedChallenges() {

    const cards =
        document.querySelectorAll(
            "#challenges .challenge"
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


        selected.forEach(function (challengeName) {

            localStorage.removeItem(
                "challenge-" +
                challengeName
            );

        });


        localStorage.setItem(
            "saveTargetActiveChallenges",
            JSON.stringify(selected)
        );

    }


    return selected;

}


// ==========================================
// DISPLAY ACTIVE CHALLENGES
// ==========================================

function displayActiveChallenges() {

    const challengeGrid =
        document.querySelector(
            "#challenges .challenge-grid"
        );


    if (!challengeGrid) return;


    const activeChallenges =
        getRandomChallenges();


    challengeGrid.innerHTML = "";


    activeChallenges.forEach(function (challengeName) {

        const challenge =
            challenges[challengeName];


        if (!challenge) return;


        const completed =
            localStorage.getItem(
                "challenge-" +
                challengeName
            ) === "completed";


        const card =
            document.createElement("div");


        card.className =
            "challenge";


        if (completed) {
            card.classList.add(
                "completed"
            );
        }


        card.innerHTML = `

            <span>
                ${challenge.number}
            </span>

            <h3>
                ${challenge.title}
            </h3>

            <p>
                ${challenge.description}
            </p>

            <button
                class="challenge-button"
                onclick="openChallenge('${challengeName}')"
            >
                ${completed
                    ? "✓ Completed"
                    : "View challenge →"}
            </button>

        `;


        challengeGrid.appendChild(card);

    });

}


// ==========================================
// CHECK IF ALL 3 CHALLENGES ARE COMPLETE
// ==========================================

function checkChallengesComplete() {

    const activeChallenges =
        getRandomChallenges();


    const allComplete =
        activeChallenges.every(
            function (challengeName) {

                return (
                    localStorage.getItem(
                        "challenge-" +
                        challengeName
                    ) ===
                    "completed"
                );

            }
        );


    if (!allComplete) return;


    activeChallenges.forEach(
        function (challengeName) {

            localStorage.removeItem(
                "challenge-" +
                challengeName
            );

        }
    );


    const challengeNames =
        Object.keys(challenges);


    const newChallenges =
        challengeNames
            .filter(function (name) {

                return !activeChallenges.includes(
                    name
                );

            })
            .sort(
                () => Math.random() - 0.5
            )
            .slice(0, 3);


    localStorage.setItem(
        "saveTargetActiveChallenges",
        JSON.stringify(newChallenges)
    );


    displayActiveChallenges();

}


// ==========================================
// DISPLAY INITIAL CHALLENGES
// ==========================================

displayActiveChallenges();


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


// ==================================================
// ==================================================
// SAVING TIPS
// ==================================================
// 100 TIP BANK
// ==================================================


const savingTips = [

    {
        title: "Set a weekly limit",
        description: "Give yourself a realistic spending limit for the week and try to stay within it."
    },

    {
        title: "Wait before buying",
        description: "Give yourself 24 or 48 hours before making an unnecessary purchase. You may find you don't want it anymore."
    },

    {
        title: "Cook at home",
        description: "Preparing meals at home can help reduce the amount you spend on takeaway food and restaurants."
    },

    {
        title: "Cancel unused subscriptions",
        description: "Check your subscriptions and remove anything you no longer use."
    },

    {
        title: "Compare prices",
        description: "Before buying something, compare different shops and look for a cheaper alternative."
    },

    {
        title: "Save unexpected money",
        description: "If you receive money you weren't expecting, consider putting some or all of it towards your savings goal."
    },

    {
        title: "Make a shopping list",
        description: "Write down what you actually need before shopping and try not to buy things that aren't on your list."
    },

    {
        title: "Avoid impulse purchases",
        description: "Ask yourself whether you really need something before spending money on it."
    },

    {
        title: "Use what you already have",
        description: "Check your cupboards, fridge and freezer before buying more food."
    },

    {
        title: "Bring lunch from home",
        description: "Preparing lunch at home can help you avoid spending money on food during the day."
    },

    {
        title: "Make your own coffee",
        description: "Making coffee at home instead of buying it can save a surprising amount over time."
    },

    {
        title: "Use a reusable bottle",
        description: "Carry a reusable water bottle so you don't need to keep buying drinks."
    },

    {
        title: "Plan your meals",
        description: "Planning meals before shopping can reduce food waste and unnecessary purchases."
    },

    {
        title: "Shop with a budget",
        description: "Decide how much you can spend before going shopping and stick to that amount."
    },

    {
        title: "Check your bank account",
        description: "Regularly checking your balance can help you stay aware of how much you're spending."
    },

    {
        title: "Track your spending",
        description: "Write down your spending for a week to see where your money is going."
    },

    {
        title: "Have a no-spend day",
        description: "Choose one day each week where you don't spend money on anything unnecessary."
    },

    {
        title: "Use free entertainment",
        description: "Look for free activities such as walking, reading, exercising or spending time with friends."
    },

    {
        title: "Walk when possible",
        description: "If a destination is nearby, consider walking instead of paying for transport."
    },

    {
        title: "Cycle when possible",
        description: "Cycling can be a cheaper alternative to driving or using public transport for short journeys."
    },

    {
        title: "Reduce food waste",
        description: "Use food before it expires and freeze items that you won't eat immediately."
    },

    {
        title: "Buy store brands",
        description: "Compare branded products with supermarket alternatives to see whether you can save money."
    },

    {
        title: "Buy second-hand",
        description: "Check second-hand options before buying something brand new."
    },

    {
        title: "Sell unused items",
        description: "Look around your home for things you no longer use and consider selling them."
    },

    {
        title: "Unsubscribe from marketing emails",
        description: "Reducing promotional emails can help you avoid being tempted by unnecessary purchases."
    },

    {
        title: "Remove saved card details",
        description: "Making online purchases slightly less convenient can give you more time to think before buying."
    },

    {
        title: "Use a wishlist",
        description: "Put things you want on a wishlist instead of buying them immediately."
    },

    {
        title: "Set a savings goal",
        description: "Having a specific goal can make it easier to stay motivated and avoid unnecessary spending."
    },

    {
        title: "Automate your savings",
        description: "If possible, automatically move a set amount into savings when you receive your income."
    },

    {
        title: "Save first",
        description: "Consider putting money towards your goal before spending on non-essential purchases."
    },

    {
        title: "Review your bills",
        description: "Go through your regular bills and check whether you can reduce any unnecessary costs."
    },

    {
        title: "Switch providers",
        description: "Compare providers for services such as insurance, internet and utilities when your contracts allow it."
    },

    {
        title: "Use loyalty points",
        description: "Use rewards and loyalty points when they provide genuine value instead of buying extra things to earn points."
    },

    {
        title: "Take advantage of discounts",
        description: "Look for legitimate discounts before making planned purchases."
    },

    {
        title: "Don't shop when hungry",
        description: "Shopping while hungry can make it easier to buy food you didn't plan to purchase."
    },

    {
        title: "Use cash for a budget",
        description: "Using a fixed amount of cash can make it easier to see how much you've actually spent."
    },

    {
        title: "Set a monthly spending target",
        description: "Choose a realistic spending target for the month and review your progress regularly."
    },

    {
        title: "Review yesterday's spending",
        description: "Spend a few minutes checking what you bought yesterday and identify anything you could have avoided."
    },

    {
        title: "Avoid unnecessary upgrades",
        description: "If something you own still works well, consider keeping it instead of upgrading."
    },

    {
        title: "Repair before replacing",
        description: "Check whether an item can be repaired before paying for a replacement."
    },

    {
        title: "Borrow instead of buying",
        description: "For things you'll only use occasionally, consider borrowing them from someone you know."
    },

    {
        title: "Share when practical",
        description: "Sharing certain costs or resources with friends or family can reduce individual expenses."
    },

    {
        title: "Use the library",
        description: "Borrow books and other resources instead of buying things you'll only use once."
    },

    {
        title: "Have a homemade night",
        description: "Choose one night each week to cook at home instead of ordering takeaway."
    },

    {
        title: "Pack snacks",
        description: "Take snacks from home when you're going out to avoid expensive convenience purchases."
    },

    {
        title: "Drink water",
        description: "Choosing tap water instead of buying drinks can reduce small recurring expenses."
    },

    {
        title: "Check your subscriptions monthly",
        description: "Make subscription reviews a monthly habit so unused services don't continue costing you money."
    },

    {
        title: "Use a 24-hour rule",
        description: "Wait at least 24 hours before buying something that isn't essential."
    },

    {
        title: "Use a 30-day rule",
        description: "For expensive non-essential purchases, consider waiting 30 days before deciding."
    },

    {
        title: "Set a fun-money budget",
        description: "Give yourself a specific amount for entertainment so you can enjoy yourself without overspending."
    },

    {
        title: "Separate needs from wants",
        description: "Before spending, ask yourself whether the purchase is something you need or simply something you want."
    },

    {
        title: "Avoid browsing shopping apps",
        description: "If you're trying to save, don't browse shopping apps just for entertainment."
    },

    {
        title: "Turn off shopping notifications",
        description: "Disable unnecessary sale and shopping notifications to reduce temptation."
    },

    {
        title: "Don't chase every sale",
        description: "A discount isn't a saving if you wouldn't have bought the item otherwise."
    },

    {
        title: "Use what is on sale wisely",
        description: "Only buy discounted products when they're things you genuinely need or planned to buy."
    },

    {
        title: "Plan your supermarket trip",
        description: "A clear list and budget can help you avoid wandering around and making unnecessary purchases."
    },

    {
        title: "Check your cupboards first",
        description: "Before buying groceries, see what you already have at home."
    },

    {
        title: "Freeze leftovers",
        description: "Freeze suitable leftovers so they don't go to waste and become another purchase later."
    },

    {
        title: "Use public transport",
        description: "When practical, compare public transport costs with driving and parking costs."
    },

    {
        title: "Combine errands",
        description: "Complete several errands in one trip to save time, fuel and transport costs."
    },

    {
        title: "Plan fuel trips",
        description: "Combining journeys can help reduce unnecessary fuel spending."
    },

    {
        title: "Check your insurance",
        description: "Review your insurance policies periodically and compare available options before renewal."
    },

    {
        title: "Review your phone plan",
        description: "Check whether you're paying for more data or features than you actually use."
    },

    {
        title: "Review your internet plan",
        description: "Compare your current internet plan with your actual usage and available alternatives."
    },

    {
        title: "Reduce unnecessary fees",
        description: "Check your accounts for avoidable fees and look for ways to reduce them."
    },

    {
        title: "Use reminders for bills",
        description: "Set reminders for important payments so you can avoid avoidable late fees."
    },

    {
        title: "Keep an emergency buffer",
        description: "Building a small emergency fund can help prevent unexpected expenses from disrupting your savings plan."
    },

    {
        title: "Give every euro a purpose",
        description: "Knowing what your money is intended for can make it easier to avoid spending it randomly."
    },

    {
        title: "Round up your savings",
        description: "When possible, round up the amount you save so small extra amounts build up over time."
    },

    {
        title: "Save small amounts",
        description: "Don't underestimate small savings. Regular €1, €2 or €5 savings can add up over time."
    },

    {
        title: "Save your spare change",
        description: "Put spare coins or small leftover amounts into your savings instead of spending them."
    },

    {
        title: "Challenge yourself",
        description: "Create a small weekly savings challenge to keep saving interesting and motivating."
    },

    {
        title: "Reward progress without spending",
        description: "Celebrate savings milestones with free activities rather than expensive rewards."
    },

    {
        title: "Keep your goal visible",
        description: "Put a reminder of your savings goal somewhere you'll see it regularly."
    },

    {
        title: "Name your savings goal",
        description: "Giving your savings a name can make the goal feel more personal and motivating."
    },

    {
        title: "Visualise your target",
        description: "Break your target into smaller milestones so your progress feels easier to see."
    },

    {
        title: "Celebrate milestones",
        description: "Recognise when you reach 25%, 50% or 75% of your goal."
    },

    {
        title: "Don't give up after one mistake",
        description: "One unnecessary purchase doesn't ruin your plan. Get back on track with your next decision."
    },

    {
        title: "Review your budget weekly",
        description: "A quick weekly review can help you spot problems before they become bigger."
    },

    {
        title: "Review your budget monthly",
        description: "At the end of each month, compare your planned spending with what actually happened."
    },

    {
        title: "Use a spending category system",
        description: "Separate your spending into categories so you can easily see where your money goes."
    },

    {
        title: "Set a grocery budget",
        description: "Choose a realistic weekly grocery budget and use it as a guide when shopping."
    },

    {
        title: "Avoid convenience spending",
        description: "Planning ahead can help you avoid paying extra for convenience when you're hungry, thirsty or in a rush."
    },

    {
        title: "Pack before leaving home",
        description: "Take water, snacks and anything else you'll need so you don't have to buy them later."
    },

    {
        title: "Use free local activities",
        description: "Look for free events, parks, walks and community activities instead of automatically paying for entertainment."
    },

    {
        title: "Have a free weekend",
        description: "Try spending an entire weekend using things you already have and choosing free activities."
    },

    {
        title: "Try a spending freeze",
        description: "Choose a short period where you only spend money on essential expenses."
    },

    {
        title: "Set a clothing budget",
        description: "Decide how much you can spend on clothes and avoid going over that amount."
    },

    {
        title: "Wear what you own",
        description: "Before buying new clothes, create outfits using items you already have."
    },

    {
        title: "Unfollow tempting shops",
        description: "Unfollow shopping accounts that regularly encourage you to buy things you don't need."
    },

    {
        title: "Use price alerts",
        description: "For planned purchases, use price alerts where available instead of constantly checking for discounts."
    },

    {
        title: "Avoid buying duplicates",
        description: "Check what you already own before buying another item that serves the same purpose."
    },

    {
        title: "Borrow special equipment",
        description: "For rarely used equipment, consider borrowing or renting rather than purchasing it."
    },

    {
        title: "Plan expensive purchases",
        description: "For large purchases, research them in advance instead of making a rushed decision."
    },

    {
        title: "Compare total costs",
        description: "Look beyond the initial price and consider maintenance, accessories and ongoing costs."
    },

    {
        title: "Use free trials carefully",
        description: "If you start a free trial, set a reminder to cancel it if you don't want to continue."
    },

    {
        title: "Avoid lifestyle creep",
        description: "When your income increases, consider directing some of the extra money towards your savings instead of automatically increasing spending."
    },

    {
        title: "Increase savings gradually",
        description: "When you're comfortable with your current savings amount, try increasing it slightly."
    },

    {
        title: "Save extra income",
        description: "Consider putting bonuses, gifts or other unexpected income towards your savings goal."
    },

    {
        title: "Use windfalls wisely",
        description: "When you receive an unexpected financial boost, decide in advance how much you want to save."
    },

    {
        title: "Keep saving automatic",
        description: "Making saving automatic can reduce the temptation to spend the money first."
    },

    {
        title: "Focus on one goal",
        description: "If you're struggling to save, focusing on one clear goal can make your progress easier to manage."
    },

    {
        title: "Break large goals down",
        description: "Divide a large target into smaller milestones to make it feel more achievable."
    },

    {
        title: "Check progress regularly",
        description: "Review your savings progress regularly so you know whether you're on track."
    },

    {
        title: "Make saving a habit",
        description: "Saving consistently is often more effective than relying on occasional large contributions."
    },

    {
        title: "Start today",
        description: "You don't need a huge amount of money to begin. Start with what you can comfortably save."
    }

];


// ==========================================
// RANDOMLY SELECT 6 TIPS
// ==========================================

function getRandomTips() {

    const shuffledTips =
        [...savingTips].sort(
            () => Math.random() - 0.5
        );


    return shuffledTips.slice(0, 6);

}


// ==========================================
// DISPLAY 6 RANDOM TIPS
// ==========================================

function displayRandomTips() {

    const tipsGrid =
        document.querySelector(
            "#tips .challenge-grid"
        );


    if (!tipsGrid) {
        return;
    }


    const selectedTips =
        getRandomTips();


    tipsGrid.innerHTML = "";


    selectedTips.forEach(function (tip, index) {

        const card =
            document.createElement("div");


        card.className =
            "challenge";


        card.innerHTML = `

            <span>
                ${String(index + 1).padStart(2, "0")}
            </span>

            <h3>
                ${tip.title}
            </h3>

            <p>
                ${tip.description}
            </p>

        `;


        tipsGrid.appendChild(card);

    });

}


// ==========================================
// DISPLAY RANDOM TIPS ON EVERY PAGE LOAD
// ==========================================

displayRandomTips();


// ==========================================
// END SAVETARGET SCRIPT
// ==========================================
