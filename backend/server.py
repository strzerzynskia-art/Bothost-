import os
import sys
import time
import subprocess

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


# =========================
# APPLICATION
# =========================

app = FastAPI(
    title="BotHost API",
    description="API de gestion des bots Discord de BotHost",
    version="1.0.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# BOT LUNEX
# =========================

bot = {
    "name": "Lunex",
    "file": "Bot.py",
    "python": "3.11",
    "application_id": "1537780797019258890",
    "status": "Hors ligne",
    "uptime": "00:00:00",
    "memory": "0 MB"
}


# =========================
# PROCESSUS DU BOT
# =========================

bot_process = None
bot_start_time = None


# =========================
# OUTILS
# =========================

def get_bot_file():
    """
    Retourne le chemin exact vers Bot.py.
    Render utilise 'backend' comme dossier racine.
    """

    return os.path.join(
        os.path.dirname(__file__),
        "bots",
        "Lunex",
        "Bot.py"
    )


def is_bot_running():
    global bot_process

    if bot_process is None:
        return False

    if bot_process.poll() is None:
        return True

    return False


def get_uptime():
    global bot_start_time

    if bot_start_time is None:
        return "00:00:00"

    seconds = int(time.time() - bot_start_time)

    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60

    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


def update_bot_status():

    if is_bot_running():
        bot["status"] = "En ligne"
        bot["uptime"] = get_uptime()

    else:
        bot["status"] = "Hors ligne"
        bot["uptime"] = "00:00:00"


# =========================
# ACCUEIL API
# =========================

@app.get("/")
def home():

    return {
        "name": "BotHost API",
        "status": "online",
        "version": "1.0.0"
    }


# =========================
# DIAGNOSTIC DES FICHIERS
# =========================

@app.get("/api/debug/files")
def debug_files():

    base = os.path.dirname(__file__)

    bots_folder = os.path.join(
        base,
        "bots"
    )

    lunex_folder = os.path.join(
        bots_folder,
        "Lunex"
    )

    bot_file = os.path.join(
        lunex_folder,
        "Bot.py"
    )

    return {
        "base": base,

        "contenu_backend": (
            os.listdir(base)
            if os.path.exists(base)
            else []
        ),

        "bots_existe": os.path.exists(bots_folder),

        "contenu_bots": (
            os.listdir(bots_folder)
            if os.path.exists(bots_folder)
            else []
        ),

        "lunex_existe": os.path.exists(lunex_folder),

        "contenu_lunex": (
            os.listdir(lunex_folder)
            if os.path.exists(lunex_folder)
            else []
        ),

        "bot_file": bot_file,

        "bot_existe": os.path.exists(bot_file)
    }


# =========================
# INFORMATIONS DU BOT
# =========================

@app.get("/api/bot")
def get_bot():

    update_bot_status()

    return bot


# =========================
# DÉMARRER LE BOT
# =========================

@app.post("/api/bot/start")
def start_bot():

    global bot_process
    global bot_start_time

    update_bot_status()

    if is_bot_running():

        return {
            "success": False,
            "message": "Lunex est déjà en ligne.",
            "bot": bot
        }


    # =========================
    # TOKEN
    # =========================

    token = os.getenv("DISCORD_TOKEN")

    if not token:

        bot["status"] = "Hors ligne"

        return {
            "success": False,
            "message": "DISCORD_TOKEN n'est pas configuré sur le serveur.",
            "bot": bot
        }


    # =========================
    # FICHIER BOT
    # =========================

    bot_file = get_bot_file()


    if not os.path.exists(bot_file):

        return {
            "success": False,
            "message": f"Fichier Bot.py introuvable. Chemin recherché : {bot_file}",
            "bot": bot
        }


    # =========================
    # ENVIRONNEMENT
    # =========================

    try:

        environment = os.environ.copy()

        environment["DISCORD_TOKEN"] = token


        # =========================
        # DÉMARRAGE
        # =========================

        bot_process = subprocess.Popen(
            [sys.executable, bot_file],
            cwd=os.path.dirname(bot_file),
            env=environment
        )


        bot_start_time = time.time()


        bot["status"] = "En ligne"
        bot["uptime"] = "00:00:00"


        return {
            "success": True,
            "message": "Lunex démarré.",
            "bot": bot
        }


    except Exception as error:

        bot_process = None
        bot_start_time = None

        bot["status"] = "Hors ligne"

        return {
            "success": False,
            "message": f"Impossible de démarrer Lunex : {error}",
            "bot": bot
        }


# =========================
# REDÉMARRER LE BOT
# =========================

@app.post("/api/bot/restart")
def restart_bot():

    global bot_process
    global bot_start_time

    if is_bot_running():

        try:

            bot_process.terminate()
            bot_process.wait(timeout=10)

        except Exception:

            try:
                bot_process.kill()

            except Exception:
                pass


    bot_process = None
    bot_start_time = None


    return start_bot()


# =========================
# ARRÊTER LE BOT
# =========================

@app.post("/api/bot/stop")
def stop_bot():

    global bot_process
    global bot_start_time

    if not is_bot_running():

        bot["status"] = "Hors ligne"
        bot["uptime"] = "00:00:00"

        return {
            "success": False,
            "message": "Lunex est déjà hors ligne.",
            "bot": bot
        }


    try:

        bot_process.terminate()
        bot_process.wait(timeout=10)

    except Exception:

        try:
            bot_process.kill()

        except Exception:
            pass


    bot_process = None
    bot_start_time = None

    bot["status"] = "Hors ligne"
    bot["uptime"] = "00:00:00"


    return {
        "success": True,
        "message": "Lunex arrêté.",
        "bot": bot
    }


# =========================
# STATUT API
# =========================

@app.get("/api/status")
def api_status():

    update_bot_status()

    return {
        "api": "online",
        "bot": bot["status"]
        }
