/**
 * Autor: Lucas Laborne
 * Descrição: Módulo para obter a lista de feriados, calcular
 * a quantidade de dias, etc...
 * 
 * KEEP IT SIMPLE, STUPID !!!
 * 
 */

const moment = require('moment');
const fs = require('fs');

moment.locale('pt-BR');

// Obtem uma lista ordenada com os próximos feriados
function getFeriados() {
    let feriados = JSON.parse(fs.readFileSync('./calendario/feriados.json'));
    let hoje = moment();
    // Remove as datas que já passaram:
    feriados = feriados.filter(item => hoje.diff(moment(item.data, 'DD-MM-YYYY')) < 0);
    // Ordena os feriados:
    feriados = feriados.sort((a, b) => moment(a.data, 'DD-MM-YYYY') - moment(b.data, 'DD-MM-YYYY'));

    feriados.forEach(f => {
        let data = moment(f.data, 'DD-MM-YYYY');
        f.diaSemana = data.format('dddd');
        f.faltam = data.diff(hoje, 'days') + 1;
        f.isDiaUtil = !(f.diaSemana == 'Sábado' || f.diaSemana == 'Domingo');
    });

    return feriados;
}

// Responde quando será o próximo feriado
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

// Exportações:
module.exports = {
    getFeriados: getFeriados,
    proximoFeriado: proximoFeriado
}