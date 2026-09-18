import os
import discord
from discord.ext import commands


# =========================
# TOKEN
# =========================

TOKEN = os.getenv("DISCORD_TOKEN")


# =========================
# VÉRIFICATION TOKEN
# =========================

if not TOKEN:

    print(
        "ERREUR : DISCORD_TOKEN n'est pas configuré.",
        flush=True
    )

    raise RuntimeError(
        "DISCORD_TOKEN n'est pas configuré."
    )


# =========================
# INTENTS
# =========================

intents = discord.Intents.default()

intents.message_content = True


# =========================
# BOT
# =========================

bot = commands.Bot(

    command_prefix="!",

    intents=intents
)


# =========================
# CONNEXION
# =========================

@bot.event
async def on_ready():

    print(
        f"CONNECTÉ : {bot.user}",
        flush=True
    )

    print(
        f"ID Discord : {bot.user.id}",
        flush=True
    )


# =========================
# ERREUR DE COMMANDE
# =========================

@bot.event
async def on_command_error(ctx, error):

    print(
        f"ERREUR COMMANDE : {error}",
        flush=True
    )


# =========================
# DÉMARRAGE
# =========================

print(
    "Démarrage de Lunex...",
    flush=True
)


bot.run(TOKEN)
