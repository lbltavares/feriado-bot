/**
 * Criado: Lucas Laborne
 * Coautor: Arthur Branco
 * Descrição: Bot do Telegram para exibir o calendario e informar os
 * feriados da PUC
 *
 * Use o arquivo /calendario/feriados.json para informar os feriados
 *
 * Veja o calendario oficial aqui:
 * https://www.pucminas.br/calendario/Paginas/default.aspx
 *
 */

const Telegram = require('node-telegram-bot-api');
const { proximoFeriado, getFeriados } = require('./feriado-bot');

const PORT = process.env.PORT || 443;

// Bot do Telegram:
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegram(BOT_TOKEN, { polling: true });

// Ao receber uma mensagem
bot.on('message', async (msg) => {

    // Remetente:
    const from = msg.from;

    // Log:
    console.log(`Mensagem recebida de ${from.first_name} ${from.last_name} (${from.username}: ${from.id}): ${msg.text}`);

    // Ignora mensagens antigas (limite: 1 minuto)
    const limite = 60; // segs
    if (Math.round((new Date()).getTime() / 1000) - msg.date > limite)
        return;

    // Envia o proximo feriado
    if (msg.text === '/proximoferiado' || msg.text === '/proximoferiado@feriado_bot')
        bot.sendMessage(msg.chat.id, proximoFeriado(), { parse_mode: 'HTML' });

    // Envia o calendario
    else if (msg.text === '/calendario' || msg.text === '/calendario@feriado_bot')
        bot.sendPhoto(msg.chat.id, './assets/calendario.png');
    
    // Envia a grade
    else if (msg.text === '/grade' || msg.text === '/grade@feriado_bot')
        bot.sendPhoto(msg.chat.id, './assets/grade.jpg');

    // Envia a grade antiga
    else if (msg.text === '/gradeantiga' || msg.text === '/gradeantiga@feriado_bot')
        bot.sendPhoto(msg.chat.id, './assets/gradeantiga.jpg');

});
