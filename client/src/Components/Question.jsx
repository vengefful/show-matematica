import React from 'react';

const Question = (props) => {
    const paragrafos = props.pergunta?.split('\n');

    return(
        <>
            {paragrafos?.map((paragrafo, index) => (
                <p key={index}>{paragrafo}</p>
            ))}
        </>
    );
};

export default Question;
