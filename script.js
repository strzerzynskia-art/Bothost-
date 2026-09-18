document.addEventListener("DOMContentLoaded", function () {

    console.log("🤖 BotHost est chargé !");


    /*
     * =========================
     * AFFICHER LE BOT ENREGISTRÉ
     * =========================
     */

    const botNameDisplay =
        document.getElementById("bot-name-display");

    if (botNameDisplay) {

        const savedBot =
            localStorage.getItem("bothost_bot");

        let bot = null;

        if (savedBot) {

            try {

                bot = JSON.parse(savedBot);

            } catch (error) {

                console.error(
                    "Impossible de lire les données du bot :",
                    error
                );

            }

        }

        const statusDisplay =
            document.getElementById("bot-status-display");

        const stateDisplay =
            document.getElementById("bot-state-display");

        const fileDisplay =
            document.getElementById("bot-file-display");

        const pythonDisplay =
            document.getElementById("bot-python-display");

        const idDisplay =
            document.getElementById("bot-id-display");


        if (bot) {

            const botStatus =
                bot.status || "Hors ligne";

            const isOnline =
                botStatus.toLowerCase() === "en ligne";


            botNameDisplay.textContent =
                "🤖 " + (bot.name || "Mon bot Discord");

            statusDisplay.textContent =
                (isOnline ? "🟢 " : "🔴 ") + botStatus;

            stateDisplay.textContent =
                botStatus;

            fileDisplay.textContent =
                bot.file || "—";

            pythonDisplay.textContent =
                bot.python
                    ? "Python " + bot.python
                    : "—";

            idDisplay.textContent =
                bot.id || "—";


            statusDisplay.classList.toggle(
                "offline",
                !isOnline
            );


        } else {

            botNameDisplay.textContent =
                "🤖 Aucun bot ajouté";

            statusDisplay.textContent =
                "⚪ Aucun bot configuré";

            stateDisplay.textContent =
                "Non configuré";

            fileDisplay.textContent =
                "—";

            pythonDisplay.textContent =
                "—";

            idDisplay.textContent =
                "—";


            statusDisplay.classList.add("offline");

        }

    }


    /*
     * =========================
     * DÉMARRER LE BOT
     * =========================
     */

    const startButtons =
        document.querySelectorAll(
            '[data-action="start"]'
        );

    startButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "▶️ Demande de démarrage du bot..."
            );

            alert(
                "▶️ Démarrage demandé.\n\n" +
                "Le contrôle réel du bot sera connecté au backend plus tard."
            );

        });

    });


    /*
     * =========================
     * REDÉMARRER LE BOT
     * =========================
     */

    const restartButtons =
        document.querySelectorAll(
            '[data-action="restart"]'
        );

    restartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "🔄 Demande de redémarrage du bot..."
            );

            alert(
                "🔄 Redémarrage demandé.\n\n" +
                "Le contrôle réel du bot sera connecté au backend plus tard."
            );

        });

    });


    /*
     * =========================
     * ARRÊTER LE BOT
     * =========================
     */

    const stopButtons =
        document.querySelectorAll(
            '[data-action="stop"]'
        );

    stopButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log(
                "🛑 Demande d'arrêt du bot..."
            );

            alert(
                "🛑 Arrêt demandé.\n\n" +
                "Le contrôle réel du bot sera connecté au backend plus tard."
            );

        });

    });


    /*
     * =========================
     * AJOUTER UN BOT
     * =========================
     */

    const addBotButton =
        document.querySelector(
            '[data-action="add-bot"]'
        );


    if (addBotButton) {

        addBotButton.addEventListener(
            "click",
            function () {

                const botName =
                    document
                        .getElementById("bot-name")
                        ?.value
                        .trim();


                const botFile =
                    document
                        .getElementById("bot-file")
                        ?.value
                        .trim();


                const pythonVersion =
                    document
                        .getElementById("python-version")
                        ?.value;


                const botId =
                    document
                        .getElementById("bot-id")
                        ?.value
                        .trim();


                if (!botName) {

                    alert(
                        "❌ Entre le nom de ton bot."
                    );

                    return;

                }


                if (!botFile) {

                    alert(
                        "❌ Entre le nom du fichier principal."
                    );

                    return;

                }


                if (!botId) {

                    alert(
                        "❌ Entre l'ID de ton application Discord."
                    );

                    return;

                }


                const bot = {

                    name: botName,

                    file: botFile,

                    python: pythonVersion,

                    id: botId,

                    status: "Hors ligne"

                };


                localStorage.setItem(
                    "bothost_bot",
                    JSON.stringify(bot)
                );


                console.log(
                    "🤖 Bot ajouté :",
                    bot
                );


                alert(
                    "✅ Ton bot a été ajouté à BotHost !"
                );


                addBotButton.textContent =
                    "✅ Bot ajouté";

            }
        );

    }


    /*
     * =========================
     * EFFACER LA CONSOLE
     * =========================
     */

    const clearConsoleButton =
        document.querySelector(
            '[data-action="clear-console"]'
        );


    const consoleElement =
        document.querySelector(".console");


    if (
        clearConsoleButton &&
        consoleElement
    ) {

        clearConsoleButton.addEventListener(
            "click",
            function () {

                consoleElement.innerHTML = "";

                console.log(
                    "🗑️ Console effacée."
                );

            }
        );

    }


    /*
     * =========================
     * PARAMÈTRES
     * =========================
     */

    const saveSettingsButton =
        document.querySelector(
            '[data-action="save-settings"]'
        );


    if (saveSettingsButton) {

        saveSettingsButton.addEventListener(
            "click",
            function () {

                alert(
                    "💾 Paramètres enregistrés.\n\n" +
                    "La sauvegarde réelle sera connectée au backend plus tard."
                );


                console.log(
                    "⚙️ Paramètres enregistrés."
                );

            }
        );

    }

});
