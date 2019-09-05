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

// Exportações:
module.exports = {
    getFeriados: getFeriados,
}