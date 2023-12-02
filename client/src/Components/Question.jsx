import React, { useState, useEffect } from 'react';
import api from '../Api';

const Question = (props) => {
    const paragrafos = props.pergunta?.split('\n');

    const extrairCaminhoImagem = (texto) => {

        const regex = /<img\s([^<>]+)>/; // Regex para capturar o conteúdo entre < e >
        const match = texto?.match(regex);

        if(match){
            return(match[1]);
        }
        return;
    };

    return(
        <>
            {paragrafos?.map((paragrafo, index) => (
                <p key={index}>{typeof extrairCaminhoImagem(paragrafo) === 'undefined' ? paragrafo : (<img src={`/api/imagens/${extrairCaminhoImagem(paragrafo)}`} alt="IMAGEM" />)}</p>
            ))}
        </>
    );
};

export default Question;
