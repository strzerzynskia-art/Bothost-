const API_URL = "https://bothost-pz1h.onrender.com";

// =========================
// BOT LOCAL
// =========================

function getBot() {
    return JSON.parse(localStorage.getItem("bothost_bot")) || {
        name: "Lunex",
        file: "Bot.py",
        python: "3.11",
        applicationId: "1537780797019258890"
    };
}

function saveBot(bot) {
    localStorage.setItem("bothost_bot", JSON.stringify(bot));
}


// =========================
// API
// =========================

async function getBotStatus() {
    try {
        const response = await fetch(`${API_URL}/api/bot`);

        if (!response.ok) {
            throw new Error("Erreur API");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


async function controlBot(action) {
    try {
        const response = await fetch(`${API_URL}/api/bot/${action}`, {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Erreur API");
        }

        return await response.json();
    } catch (error) {
        console.error(error);
        alert("Impossible de contacter l'API BotHost.");
        return null;
    }
}


// =========================
// AFFICHAGE DU BOT
// =========================

async function updateBotPage() {
    const bot = await getBotStatus();

    if (!bot) {
        return;
    }

    const name = document.querySelector("#bot-name-display");
    const status = document.querySelector("#bot-status");
    const file = document.querySelector("#bot-file");
    const python = document.querySelector("#bot-python");
    const applicationId = document.querySelector("#bot-id");

    if (name) name.textContent = bot.name;
    if (status) status.textContent = bot.status;
    if (file) file.textContent = bot.file;
    if (python) python.textContent = `Python ${bot.python}`;
    if (applicationId) applicationId.textContent = bot.application_id;
}


// =========================
// BOUTONS START / RESTART / STOP
// =========================

document.addEventListener("click", async (event) => {

    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;

    if (!["start", "restart", "stop"].includes(action)) {
        return;
    }

    button.disabled = true;

    const result = await controlBot(action);

    if (result) {
        alert(result.message);
        await updateBotPage();
    }

    button.disabled = false;
});


// =========================
// AJOUTER UN BOT
// =========================

const addBotButton = document.querySelector('[data-action="add-bot"]');

if (addBotButton) {

    addBotButton.addEventListener("click", () => {

        const name = document.querySelector("#bot-name")?.value.trim();
        const file = document.querySelector("#bot-file")?.value.trim();
        const python = document.querySelector("#python-version")?.value;
        const applicationId = document.querySelector("#bot-id")?.value.trim();

        if (!name || !file || !python || !applicationId) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const bot = {
            name: name,
            file: file,
            python: python,
            applicationId: applicationId
        };

        saveBot(bot);

        alert("Bot ajouté avec succès !");

        window.location.href = "bot.html";
    });
}


// =========================
// CHARGEMENT
// =========================

document.addEventListener("DOMContentLoaded", () => {
    updateBotPage();
});
