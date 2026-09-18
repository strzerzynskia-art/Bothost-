const API_URL = "https://bothost-pz1h.onrender.com";


// =========================
// BOT LOCAL
// =========================

function getBot() {

    return JSON.parse(
        localStorage.getItem("bothost_bot")
    ) || {

        name: "Lunex",

        file: "Bot.py",

        python: "3.11",

        applicationId: "1537780797019258890"
    };
}


function saveBot(bot) {

    localStorage.setItem(
        "bothost_bot",
        JSON.stringify(bot)
    );
}


// =========================
// API BOT
// =========================

async function getBotStatus() {

    try {

        const response =
            await fetch(`${API_URL}/api/bot`);

        if (!response.ok) {

            throw new Error("Erreur API");
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Erreur récupération bot :",
            error
        );

        return null;
    }
}


// =========================
// CONTRÔLE BOT
// =========================

async function controlBot(action) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/bot/${action}`,
                {
                    method: "POST"
                }
            );

        if (!response.ok) {

            throw new Error("Erreur API");
        }

        return await response.json();

    } catch (error) {

        console.error(
            "Erreur contrôle bot :",
            error
        );

        alert(
            "Impossible de contacter l'API BotHost."
        );

        return null;
    }
}


// =========================
// PAGE BOT
// =========================

async function updateBotPage() {

    const bot = await getBotStatus();

    if (!bot) {
        return;
    }


    const name =
        document.querySelector(
            "#bot-name-display"
        );

    const status =
        document.querySelector(
            "#bot-status"
        );

    const file =
        document.querySelector(
            "#bot-file"
        );

    const python =
        document.querySelector(
            "#bot-python"
        );

    const applicationId =
        document.querySelector(
            "#bot-id"
        );

    const uptime =
        document.querySelector(
            "#bot-uptime"
        );

    const memory =
        document.querySelector(
            "#bot-memory"
        );

    const lastUpdate =
        document.querySelector(
            "#last-update"
        );


    if (name) {

        name.textContent =
            bot.name;
    }


    if (status) {

        status.textContent =
            bot.status;

        status.classList.remove(
            "online",
            "offline"
        );


        if (bot.status === "En ligne") {

            status.classList.add(
                "online"
            );

        } else {

            status.classList.add(
                "offline"
            );
        }
    }


    if (file) {

        file.textContent =
            bot.file;
    }


    if (python) {

        python.textContent =
            `Python ${bot.python}`;
    }


    if (applicationId) {

        applicationId.textContent =
            bot.application_id;
    }


    if (uptime) {

        uptime.textContent =
            bot.uptime ||
            "00:00:00";
    }


    if (memory) {

        memory.textContent =
            bot.memory ||
            "0 MB";
    }


    if (lastUpdate) {

        const maintenant =
            new Date();

        const heure =
            maintenant.toLocaleTimeString(
                "fr-FR"
            );

        lastUpdate.textContent =
            `Dernière actualisation : ${heure}`;
    }
}


// =========================
// CONSOLE
// =========================

async function updateConsole() {

    const output =
        document.querySelector(
            "#console-output"
        );

    const statusElement =
        document.querySelector(
            "#console-status"
        );

    const errorBox =
        document.querySelector(
            "#error-box"
        );

    const errorMessage =
        document.querySelector(
            "#error-message"
        );


    if (!output) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/logs`
            );


        if (!response.ok) {

            throw new Error(
                "Erreur API"
            );
        }


        const data =
            await response.json();


        // =========================
        // LOGS
        // =========================

        if (
            data.logs &&
            data.logs.length > 0
        ) {

            output.textContent =
                data.logs.join("\n");

        } else {

            output.textContent =
                "Aucun log pour le moment.";
        }


        // =========================
        // STATUT
        // =========================

        if (statusElement) {

            statusElement.textContent =
                data.status;

            statusElement.classList.remove(
                "online",
                "offline"
            );


            if (
                data.status === "En ligne"
            ) {

                statusElement.classList.add(
                    "online"
                );

            } else {

                statusElement.classList.add(
                    "offline"
                );
            }
        }


        // =========================
        // ERREUR
        // =========================

        if (
            data.error
        ) {

            errorBox.style.display =
                "block";

            errorMessage.textContent =
                data.error;

        } else {

            errorBox.style.display =
                "none";
        }


        // Descendre automatiquement
        // vers le dernier log

        output.scrollTop =
            output.scrollHeight;


    } catch (error) {

        console.error(
            "Erreur console :",
            error
        );

        output.textContent =
            "Impossible de récupérer les logs.";
    }
}


// =========================
// BOUTONS BOT
// =========================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "[data-action]"
            );

        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        if (
            ![
                "start",
                "restart",
                "stop"
            ].includes(action)
        ) {

            return;
        }


        button.disabled = true;


        const ancienTexte =
            button.textContent;


        if (action === "start") {

            button.textContent =
                "⏳ Démarrage...";
        }


        if (action === "restart") {

            button.textContent =
                "⏳ Redémarrage...";
        }


        if (action === "stop") {

            button.textContent =
                "⏳ Arrêt...";
        }


        const result =
            await controlBot(
                action
            );


        if (result) {

            alert(
                result.message
            );

            await updateBotPage();

            await updateConsole();
        }


        button.textContent =
            ancienTexte;

        button.disabled =
            false;
    }
);


// =========================
// ACTUALISER BOT
// =========================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "#refresh-bot"
            );

        if (!button) {
            return;
        }


        button.disabled = true;


        const ancienTexte =
            button.textContent;


        button.textContent =
            "⏳ Actualisation...";


        await updateBotPage();


        button.textContent =
            ancienTexte;


        button.disabled =
            false;
    }
);


// =========================
// ACTUALISER CONSOLE
// =========================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "#refresh-console"
            );

        if (!button) {
            return;
        }


        button.disabled = true;

        const ancienTexte =
            button.textContent;


        button.textContent =
            "⏳ Actualisation...";


        await updateConsole();


        button.textContent =
            ancienTexte;

        button.disabled =
            false;
    }
);


// =========================
// EFFACER CONSOLE
// =========================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "#clear-console"
            );

        if (!button) {
            return;
        }


        try {

            await fetch(
                `${API_URL}/api/logs/clear`,
                {
                    method: "POST"
                }
            );


            await updateConsole();


        } catch (error) {

            alert(
                "Impossible d'effacer la console."
            );
        }
    }
);


// =========================
// COPIER ERREUR
// =========================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                "#copy-error"
            );

        if (!button) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/logs`
                );


            const data =
                await response.json();


            if (!data.error) {

                alert(
                    "Aucune erreur détectée."
                );

                return;
            }


            await navigator.clipboard.writeText(
                data.error
            );


            alert(
                "Erreur copiée !"
            );


        } catch (error) {

            alert(
                "Impossible de copier l'erreur."
            );
        }
    }
);


// =========================
// AJOUTER UN BOT
// =========================

document.addEventListener(
    "click",
    (event) => {

        const button =
            event.target.closest(
                '[data-action="add-bot"]'
            );

        if (!button) {
            return;
        }


        const name =
            document.querySelector(
                "#bot-name"
            )?.value.trim();


        const file =
            document.querySelector(
                "#bot-file"
            )?.value.trim();


        const python =
            document.querySelector(
                "#python-version"
            )?.value;


        const applicationId =
            document.querySelector(
                "#bot-id"
            )?.value.trim();


        if (
            !name ||
            !file ||
            !python ||
            !applicationId
        ) {

            alert(
                "Veuillez remplir tous les champs."
            );

            return;
        }


        const bot = {

            name: name,

            file: file,

            python: python,

            applicationId:
                applicationId
        };


        saveBot(bot);


        alert(
            "Bot ajouté avec succès !"
        );


        window.location.href =
            "bot.html";
    }
);


// =========================
// CHARGEMENT
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateBotPage();

        updateConsole();


        // Actualisation automatique
        // toutes les 3 secondes

        setInterval(
            () => {

                updateBotPage();

                updateConsole();

            },
            3000
        );
    }
);
