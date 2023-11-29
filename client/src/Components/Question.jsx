import React, { useState } from 'react';

const Question = (props) => {
    const paragrafos = props.pergunta?.split('\n');

    const extrairCaminhoImagem = () => {

        const regex = /<([^<>]+)>/; // Regex para capturar o conteúdo entre < e >
        const match = props.pergunta?.match(regex);

        if(match){
            return(match[1]);
        }
        return;
    };

    return(
        <>
            {paragrafos?.map((paragrafo, index) => (
                <p key={index}>{paragrafo.charAt(0) !== '<' ? paragrafo : (extrairCaminhoImagem() && <img src={extrairCaminhoImagem()} alt="imagem" />)}</p>
            ))}
        </>
    );
};

export default Question;
