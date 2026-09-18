from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="BotHost API",
    description="API de gestion des bots Discord de BotHost",
    version="1.0.0"
)

# Autoriser ton site BotHost à communiquer avec l'API
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
# API
# =========================

@app.get("/")
def home():
    return {
        "name": "BotHost API",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/api/bot")
def get_bot():
    return bot


@app.post("/api/bot/start")
def start_bot():
    bot["status"] = "En ligne"

    return {
        "success": True,
        "message": "Lunex démarré",
        "bot": bot
    }


@app.post("/api/bot/restart")
def restart_bot():
    bot["status"] = "En ligne"

    return {
        "success": True,
        "message": "Lunex redémarré",
        "bot": bot
    }


@app.post("/api/bot/stop")
def stop_bot():
    bot["status"] = "Hors ligne"

    return {
        "success": True,
        "message": "Lunex arrêté",
        "bot": bot
    }


@app.get("/api/status")
def api_status():
    return {
        "api": "online",
        "bot": bot["status"]
}
