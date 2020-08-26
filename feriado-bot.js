/**
 * Autor: Lucas Laborne
 * Descrição: Módulo para obter a lista de feriados, calcular
 * a quantidade de dias e calcular o próximo feriado.
 */

const moment = require('moment');
const fs = require('fs');

moment.locale('pt-BR');

// Obtem uma lista ordenada com os próximos feriados
function getFeriados() {

    let feriados = JSON.parse(fs.readFileSync('./calendario/feriados.json'));
    const hoje = moment().subtract(3, 'hours');

    // Remove as datas que já passaram:
    const formato = 'DD-MM-YYYY';
    feriados = feriados.filter(item => (moment(item.data, formato) - hoje) > 0);

    // Ordena os feriados:
    feriados = feriados.sort((a, b) => moment(a.data, formato) - moment(b.data, formato));

    feriados.forEach(f => {
        const data = moment(f.data, formato);
        f.diaSemana = data.format('dddd');
        f.faltam = data.diff(hoje, 'days') + 1;
        f.isDiaUtil = !(f.diaSemana === 'Sábado' || f.diaSemana === 'Domingo');
    });

    return feriados;
}

// Responde quando será o próximo feriado
function proximoFeriado() {

    // Obtem um array json com os proximos feriados
    let feriados = getFeriados();

    // Se não houver mais feriados:
    if (!feriados)
        return 'Não há mais feriados este ano :(';

    // Obtem o próximo feriado:
    const prox = feriados[0];

    // Monta a resposta formatada:
    let str = '';
    const d = new Date();
    // Easter egg(s):
    if (d.getDate() === 31 && d.getMonth() + 1 === 10 && d.getFullYear() === 2019)
        str += `<code>\u{1F383}\u{1F47B}\u{1F383} ${prox.nome} \u{1F383}\u{1F47B}\u{1F383}</code>\n`;
    else
        str += `<code>${prox.nome}</code>\n`;

    str += (`<i>${prox.tipo} (${prox.data})</i>\n`);
    str += (`<b>${prox.diaSemana}</b>\n`);
    str += (`<b>Falta(m) ${prox.faltam} dia(s)</b>\n`);

    // Se cair no sabado, obtem e exibe o proximo feriado em dia util:
    if (!prox.isDiaUtil) {
        feriados = feriados.filter((val, i) => val.isDiaUtil);
        if (feriados.length) {
            str += (`\nO próximo feriado em dia útil é daqui a ${feriados[0].faltam} dia(s), e cai na ${feriados[0].diaSemana}`);
        }
    }
    return str;
}

// Exports:
module.exports = { getFeriados, proximoFeriado };
