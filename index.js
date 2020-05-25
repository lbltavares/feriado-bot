/**
 * Criado: Lucas Laborne
 * Descrição: Bot do Telegram para exibir o calendario e informar os
 * feriados da PUC em geral
 * 
 * Regras:
 * > Use o arquivo /calendario/feriados.json para adicionar/modificar/remover feriados
 * > Coloque apenas feriados relacionados à PUC-MG e ao curso de Eng. de Software
 * 
 */

const Telegram = require('node-telegram-bot-api');
const { proximoFeriado } = require('./feriado-bot');

// Bot do Telegram:
const BOT_TOKEN = process.env.BOT_TOKEN;
let bot = new Telegram(BOT_TOKEN, { polling: true });

let ultimoCalendario, ultimoCalendarioId;

// Ao receber uma mensagem
bot.on('message', async (msg) => {

    // Remetente:
    const from = msg.from;

    // Log:
    console.log(`Mensagem recebida de ${from.first_name} ${from.last_name} (${from.username}: ${from.id}): ${msg.text}`);

    // Ignora mensagens antigas (limite: 1 minuto)
    let limite = 60; // segs
    if (Math.round((new Date()).getTime() / 1000) - msg.date > limite)
        return;

    // Envia o proximo feriado
    if (msg.text == '/proximoferiado' || msg.text == '/proximoferiado@feriado_bot')
        bot.sendMessage(msg.chat.id, proximoFeriado(), { parse_mode: 'HTML' });

    // Envia o calendario
    else if (msg.text == '/calendario' || msg.text == '/calendario@feriado_bot') {
        if (!ultimoCalendario || (msg.date - ultimoCalendario) > 10) {
            ultimoCalendario = msg.date;
            bot.sendPhoto(msg.chat.id, './calendario/calendario.jpg')
                .then(m => ultimoCalendarioId = m.message_id);
        } else {
            bot.sendMessage(msg.chat.id, '\u{1F446}', { reply_to_message_id: ultimoCalendarioId });
        }
    }

});
