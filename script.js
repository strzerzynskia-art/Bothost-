document.addEventListener("DOMContentLoaded", function () {

    console.log("🤖 BotHost est chargé !");

    /*
     * =========================
     * BOUTONS DU BOT
     * =========================
     */

    const restartButtons = document.querySelectorAll(
        '[data-action="restart"]'
    );

    const stopButtons = document.querySelectorAll(
        '[data-action="stop"]'
    );

    const startButtons = document.querySelectorAll(
        '[data-action="start"]'
    );


    /*
     * =========================
     * REDÉMARRER
     * =========================
     */

    restartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log("🔄 Demande de redémarrage du bot...");

            alert(
                "🔄 Redémarrage demandé.\n\n" +
                "Le contrôle réel du bot sera connecté au backend plus tard."
            );

        });

    });


    /*
     * =========================
     * ARRÊTER
     * =========================
     */

    stopButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log("🛑 Demande d'arrêt du bot...");

            alert(
                "🛑 Arrêt demandé.\n\n" +
                "Le contrôle réel du bot sera connecté au backend plus tard."
            );

        });

    });


    /*
     * =========================
     * DÉMARRER
     * =========================
     */

    startButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            console.log("▶️ Demande de démarrage du bot...");

            alert(
                "▶️ Démarrage demandé.\n\n" +
                "Le contrôle réel du bot sera connecté au backend plus tard."
            );

        });

    });


    /*
     * =========================
     * CONSOLE
     * =========================
     */

    const clearConsoleButton =
        document.querySelector('[data-action="clear-console"]');

    const consoleElement =
        document.querySelector(".console");


    if (clearConsoleButton && consoleElement) {

        clearConsoleButton.addEventListener("click", function () {

            consoleElement.innerHTML = "";

            console.log("🗑️ Console effacée.");

        });

    }


    /*
     * =========================
     * PARAMÈTRES
     * =========================
     */

    const saveSettingsButton =
        document.querySelector('[data-action="save-settings"]');


    if (saveSettingsButton) {

        saveSettingsButton.addEventListener("click", function () {

            alert(
                "💾 Paramètres enregistrés.\n\n" +
                "La sauvegarde réelle sera connectée au backend plus tard."
            );

            console.log("⚙️ Paramètres enregistrés.");

        });

    }

});
