import React, { useEffect } from 'react';
import './GameOver.css';
import { useNavigate } from 'react-router-dom';
import api from '../Api';

function GameOver(props){

    const navigate = useNavigate();

    const newGame = () => {
        props.setNota(0);
        props.setRodada(1);
        navigate('/game');
    }

    useEffect(() => {
        const sendData = async () => {
            try {
                const response = await api.post(`/api/completed?disciplina=${props.disciplina}&turma=${props.turma}`, {
                    name: props.name,
                    nota: props.nota
                });

                console.log(response.data);
            } catch(error) {
                console.log('Erro ao enviar os dados', error);
            }
        };

        sendData();
    }, [props.name, props.nota]);

    return (
        <div>
            <div className="container-gameover">
                <div className="item-gameover">
                    <h1>{props.nota >= 6 ? "PARABÉNS" : "GAME OVER"}</h1>
                </div>
                <div className="item-gameover">
                    <p>Parabéns <b>{props.name}</b></p>
                </div>
                <div className="item-gameover">
                    <p>Sua Nota foi <b>{Number(props.nota).toFixed(1)}</b></p>
                </div>
                <div className="item-gameover">
                    <button className="button-novamente" onClick={newGame}>Tente Novamente</button>
                </div>
            </div>
        </div>
    );
}

export default GameOver
