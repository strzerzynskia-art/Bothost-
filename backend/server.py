import os
import sys
import time
import subprocess
import threading
from collections import deque

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
# BOT
# =========================

bot = {
    "name": "Lunex",
    "file": "Bot.py",
    "python": "3.11",
    "application_id": "1537780797019258890",
    "status": "Hors ligne",
    "uptime": "00:00:00",
    "memory": "0 MB",
    "error": None
}


# =========================
# PROCESSUS
# =========================

bot_process = None
bot_start_time = None

logs = deque(maxlen=500)

log_thread = None


# =========================
# OUTILS LOGS
# =========================

def add_log(message):

    global logs

    if not message:
        return

    token = os.getenv("DISCORD_TOKEN")

    if token:
        message = message.replace(token, "[TOKEN MASQUÉ]")

    heure = time.strftime("%H:%M:%S")

    logs.append(f"[{heure}] {message}")


def read_bot_logs():

    global bot_process

    if bot_process is None:
        return

    try:

        for line in iter(bot_process.stdout.readline, ""):

            if not line:
                break

            line = line.rstrip()

            add_log(line)

            lower = line.lower()

            if (
                "traceback" in lower
                or "error" in lower
                or "exception" in lower
                or "failed" in lower
                or "invalid token" in lower
            ):

                bot["error"] = line

        bot_process.stdout.close()

    except Exception as error:

        add_log(f"Erreur de lecture des logs : {error}")


# =========================
# FICHIER BOT
# =========================

def get_bot_file():

    return os.path.join(
        os.path.dirname(__file__),
        "bots",
        "Lunex",
        "Bot.py"
    )


# =========================
# PROCESSUS ACTIF
# =========================

def is_bot_running():

    global bot_process

    if bot_process is None:
        return False

    if bot_process.poll() is None:
        return True

    return False


# =========================
# UPTIME
# =========================

def get_uptime():

    global bot_start_time

    if bot_start_time is None:
        return "00:00:00"

    seconds = int(time.time() - bot_start_time)

    hours = seconds // 3600
    minutes = (seconds % 3600) // 60
    seconds = seconds % 60

    return f"{hours:02d}:{minutes:02d}:{seconds:02d}"


# =========================
# STATUT
# =========================

def update_bot_status():

    global bot_process

    if is_bot_running():

        bot["status"] = "En ligne"
        bot["uptime"] = get_uptime()

    else:

        if bot_process is not None:

            code = bot_process.poll()

            if code is not None and code != 0:

                bot["status"] = "Erreur"

            else:

                bot["status"] = "Hors ligne"

        else:

            bot["status"] = "Hors ligne"

        bot["uptime"] = "00:00:00"


# =========================
# ACCUEIL
# =========================

@app.get("/")
def home():

    return {
        "name": "BotHost API",
        "status": "online",
        "version": "1.0.0"
    }


# =========================
# DEBUG FICHIERS
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
# INFORMATIONS BOT
# =========================

@app.get("/api/bot")
def get_bot():

    update_bot_status()

    return bot


# =========================
# LOGS
# =========================

@app.get("/api/logs")
def get_logs():

    update_bot_status()

    return {
        "logs": list(logs),
        "error": bot["error"],
        "status": bot["status"]
    }


# =========================
# EFFACER LES LOGS
# =========================

@app.post("/api/logs/clear")
def clear_logs():

    logs.clear()

    bot["error"] = None

    return {
        "success": True,
        "message": "Console effacée."
    }


# =========================
# DÉMARRER
# =========================

@app.post("/api/bot/start")
def start_bot():

    global bot_process
    global bot_start_time
    global log_thread

    update_bot_status()

    if is_bot_running():

        return {
            "success": False,
            "message": "Lunex est déjà en ligne.",
            "bot": bot
        }


    token = os.getenv("DISCORD_TOKEN")

    if not token:

        bot["status"] = "Erreur"

        bot["error"] = "DISCORD_TOKEN n'est pas configuré sur Render."

        add_log("ERREUR : DISCORD_TOKEN n'est pas configuré sur Render.")

        return {
            "success": False,
            "message": "DISCORD_TOKEN n'est pas configuré sur le serveur.",
            "bot": bot
        }


    bot_file = get_bot_file()

    if not os.path.exists(bot_file):

        bot["status"] = "Erreur"

        bot["error"] = f"Bot.py introuvable : {bot_file}"

        add_log(f"ERREUR : Bot.py introuvable : {bot_file}")

        return {
            "success": False,
            "message": "Bot.py est introuvable.",
            "bot": bot
        }


    try:

        logs.clear()

        bot["error"] = None

        add_log("Démarrage de Lunex...")

        environment = os.environ.copy()

        environment["DISCORD_TOKEN"] = token


        bot_process = subprocess.Popen(

            [
                sys.executable,
                "-u",
                bot_file
            ],

            cwd=os.path.dirname(bot_file),

            env=environment,

            stdout=subprocess.PIPE,

            stderr=subprocess.STDOUT,

            text=True,

            bufsize=1
        )


        bot_start_time = time.time()

        bot["status"] = "Démarrage"

        bot["uptime"] = "00:00:00"


        log_thread = threading.Thread(
            target=read_bot_logs,
            daemon=True
        )

        log_thread.start()


        return {

            "success": True,

            "message": "Lunex est en cours de démarrage.",

            "bot": bot
        }


    except Exception as error:

        bot_process = None
        bot_start_time = None

        bot["status"] = "Erreur"

        bot["error"] = str(error)

        add_log(f"ERREUR : {error}")

        return {

            "success": False,

            "message": f"Impossible de démarrer Lunex : {error}",

            "bot": bot
        }


# =========================
# REDÉMARRER
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

    add_log("Redémarrage de Lunex...")

    return start_bot()


# =========================
# ARRÊTER
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

    add_log("Lunex arrêté.")


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
