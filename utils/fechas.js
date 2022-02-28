const { DateTime } = require("luxon");
const { fechaPorDefecto, fechaIsoPorDefecto } = require("./constantes");

// convierte una fecha sql a fechaIso (ej :2019-01-28 -> "2019-01-28T00:00:00.000Z")
const fechaIso = (fechaStr) => {
    result = DateTime.fromSQL(fechaPorDefecto).toISODate();
    if (fechaStr.length > 0) {
        result = DateTime.fromSQL(fechaStr).toISODate();
    }
    return result;
}


// convierte una fecha iso a sql (ej "2019-01-28T00:00:00.000Z" -> 2019-01-28)
const fechaSql = (fechaIso) => {
    let result =  DateTime.fromISO(fechaIsoPorDefecto, { zone: 'utc' }).toSQLDate();
    if (fechaIso.length > 0) {
        result = DateTime.fromISO(fechaIso, { zone: 'utc' }).toSQLDate(); //cerca
    }
    return result;
}


const test = () => {
    const fecha = fechaIso(fechaPorDefecto);
    console.log("fechaIso", fecha);
    const fecha2 = fechaSql("");
    console.log("fechaSql", fecha2); 
}

//test();
module.exports = ({
    fechaIso: fechaIso,
    fechaSql: fechaSql
})
