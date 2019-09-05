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
const { getFeriados, quantosDias } = require('./feriado-bot');
const fs = require('fs');

// Bot do Telegram:
const BOT_TOKEN = JSON.parse(fs.readFileSync('config.json')).bot_token;
let bot = new Telegram(BOT_TOKEN, { polling: true });

// Retorna o próximo feriado
function proximoFeriado() {
    let feriados = getFeriados();
    let prox = feriados[0];
    if (!prox)
        return 'Não há mais feriados este ano :(';

    let str = (`<code>${prox.nome}</code>\n`);
    str += (`<i>${prox.tipo} (${prox.data})</i>\n`);
    str += (`<b>${prox.diaSemana}</b>\n`);
    str += (`<b>Falta(m) ${prox.faltam} dia(s)</b>\n`);

    if (!prox.isDiaUtil) {
        feriados = feriados.filter((val, i) => val.isDiaUtil);
        if (feriados.length) {
            str += (`\nO próximo feriado em dia útil é daqui a ${feriados[0].faltam} dia(s), e cai na ${feriados[0].diaSemana}`);
        }
    }
    return str;
}

bot.on('message', async (msg) => {
    const from = msg.from;
    console.log(`Mensagem recebida de ${from.first_name} ${from.last_name} (${from.username}:${from.id})`);

    if (msg.text == '/proximoferiado' || msg.text == '/proximoferiado@feriado_bot') {
        bot.sendMessage(msg.chat.id, proximoFeriado(), { parse_mode: 'HTML' });

    } else if (msg.text == '/calendario' || msg.text == '/calendario@feriado_bot') {
        bot.sendPhoto(msg.chat.id, './calendario/calendario.png');

    } else {
        /**
         * Aqui temos acesso a todas as mensagens do grupo, em tempo real.
         * Podemos tentar filtrar e responder mensagens como 'amanhã tem aula?',
         * ou 'que dia começam as férias/aulas?'
         */
    }
});
