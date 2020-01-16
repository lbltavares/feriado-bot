/**
 * Criado: Lucas Laborne
 * Descrição: Bot do Telegram para exibir o calendario e informar os
 * feriados da PUC em geral
 * 
 * Regras:
 * > Use o arquivo /calendario/feriados.json para adicionar/modificar/remover feriados
 * > Coloque apenas feriados relacionados à PUC-MG e ao curso de Eng. de Software
 * > KEEP IT SIMPLE, STUPID !!!
 * 
 */

const Telegram = require('node-telegram-bot-api');
const { proximoFeriado } = require('./feriado-bot');
const fs = require('fs');

// Bot do Telegram:
const BOT_TOKEN = JSON.parse(fs.readFileSync('config.json')).bot_token;
let bot = new Telegram(BOT_TOKEN, { polling: true });


bot.on('message', async (msg) => {
    const from = msg.from;
    console.log(`Mensagem recebida de ${from.first_name} ${from.last_name} (${from.username}:${from.id})`);

    if (msg.text == '/proximoferiado' || msg.text == '/proximoferiado@feriado_bot') {
        bot.sendMessage(msg.chat.id, proximoFeriado(), { parse_mode: 'HTML' });

    } else if (msg.text == '/calendario' || msg.text == '/calendario@feriado_bot') {
        bot.sendPhoto(msg.chat.id, './calendario/calendario.jpg');

    } else {
        console.log('Mensagem: ' + msg.text);
    }
});
