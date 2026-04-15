import { useState } from "react";

const promResp = (data) => {
    const valores = Object.values(data).filter(
        (v) => typeof v === "number"
    );

    const totalRespuestas = valores.length;

    const suma = valores.reduce((acc, val) => acc + val, 0);

    const promedio = suma / totalRespuestas;

    return {
        totalRespuestas,
        suma,
        promedio: promedio.toFixed(2),
    };

}

export default promResp;