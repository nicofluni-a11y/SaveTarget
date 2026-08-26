const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET;


const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, "[]");
}

app.use(express.json());
app.use(express.static(__dirname));

function getUsers() {
    return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(users, null, 4)
    );
}

function authenticate(req, res, next) {

    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {

        return res.status(401).json({
            message: "You must be logged in."
        });

    }

    const token = header.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.userId = decoded.userId;

        next();

    } catch {

        return res.status(401).json({
            message: "Your session has expired."
        });

    }

}


// ==========================================
// SIGN UP
// ==========================================

app.post("/api/signup", async (req, res) => {

    const {
        name,
        email,
        password
    } = req.body;

    if (!name || !email || !password) {

        return res.status(400).json({
            message: "Please complete all fields."
        });

    }

    if (password.length < 6) {

        return res.status(400).json({
            message: "Password must be at least 6 characters."
        });

    }

    const users = getUsers();

    const existingUser =
        users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

    if (existingUser) {

        return res.status(409).json({
            message: "An account with that email already exists."
        });

    }

    const passwordHash =
        await bcrypt.hash(password, 10);

    const user = {

        id:
            Date.now().toString(),

        name,

        email:
            email.toLowerCase(),

        password:
            passwordHash,

        goal:
            null,

        trackedSaved:
            0,

        challenges:
            {}

    };

    users.push(user);

    saveUsers(users);

    const token =
        jwt.sign(
            {
                userId: user.id
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

    res.status(201).json({
        message: "Account created successfully.",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });

});


// ==========================================
// LOG IN
// ==========================================

app.post("/api/login", async (req, res) => {

    const {
        email,
        password
    } = req.body;

    const users = getUsers();

    const user =
        users.find(
            user =>
                user.email.toLowerCase() ===
                String(email).toLowerCase()
        );

    if (!user) {

        return res.status(401).json({
            message: "Incorrect email or password."
        });

    }

    const passwordMatches =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!passwordMatches) {

        return res.status(401).json({
            message: "Incorrect email or password."
        });

    }

    const token =
        jwt.sign(
            {
                userId: user.id
            },
            JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

    res.json({
        message: "Logged in successfully.",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });

});


// ==========================================
// GET CURRENT USER DATA
// ==========================================

app.get(
    "/api/account",
    authenticate,
    (req, res) => {

        const users = getUsers();

        const user =
            users.find(
                user =>
                    user.id === req.userId
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        res.json({

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },

            goal:
                user.goal,

            trackedSaved:
                user.trackedSaved,

            challenges:
                user.challenges

        });

    }
);


// ==========================================
// SAVE GOAL
// ==========================================

app.post(
    "/api/goal",
    authenticate,
    (req, res) => {

        const {
            goal,
            target,
            saved,
            date
        } = req.body;

        if (
            !goal ||
            !target ||
            !date
        ) {

            return res.status(400).json({
                message: "Invalid goal data."
            });

        }

        const users = getUsers();

        const user =
            users.find(
                user =>
                    user.id === req.userId
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        user.goal = {
            goal,
            target: Number(target),
            saved: Number(saved) || 0,
            date
        };

        user.trackedSaved =
            Number(saved) || 0;

        saveUsers(users);

        res.json({
            message: "Savings goal saved.",
            goal: user.goal,
            trackedSaved: user.trackedSaved
        });

    }
);


// ==========================================
// ADD SAVINGS
// ==========================================

app.post(
    "/api/savings",
    authenticate,
    (req, res) => {

        const amount =
            Number(req.body.amount);

        if (
            !amount ||
            amount <= 0
        ) {

            return res.status(400).json({
                message: "Enter an amount greater than €0."
            });

        }

        const users = getUsers();

        const user =
            users.find(
                user =>
                    user.id === req.userId
            );

        if (!user || !user.goal) {

            return res.status(400).json({
                message: "Please create a savings goal first."
            });

        }

        const newSaved =
            Number(user.trackedSaved) +
            amount;

        if (
            newSaved >
            Number(user.goal.target)
        ) {

            return res.status(400).json({
                message:
                    "That would take you over your savings goal."
            });

        }

        user.trackedSaved =
            newSaved;

        saveUsers(users);

        res.json({
            message: "Savings added.",
            trackedSaved: newSaved
        });

    }
);


// ==========================================
// COMPLETE CHALLENGE
// ==========================================

app.post(
    "/api/challenges/:challengeName",
    authenticate,
    (req, res) => {

        const challengeName =
            req.params.challengeName;

        const users = getUsers();

        const user =
            users.find(
                user =>
                    user.id === req.userId
            );

        if (!user) {

            return res.status(404).json({
                message: "User not found."
            });

        }

        user.challenges[challengeName] =
            "completed";

        saveUsers(users);

        res.json({
            message: "Challenge completed.",
            challenges: user.challenges
        });

    }
);


// ==========================================
// LOGOUT
// ==========================================

app.post(
    "/api/logout",
    authenticate,
    (req, res) => {

        res.json({
            message: "Logged out successfully."
        });

    }
);


// ==========================================
// START SERVER
// ==========================================

app.listen(
    PORT,
    () => {

        console.log(
            `SaveTarget running at http://localhost:${PORT}`
        );

    }
);
