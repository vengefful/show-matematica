import React, { useEffect, useState } from 'react';
import './GameOver.css';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../Api';

function GameOver(props){
    const navigate = useNavigate();
    const location = useLocation();
    const nota = location.state?.nota || 0;

    const newGame = () => {
        props.setNota(0);
        props.setRodada(1);
        navigate('/game');
    }

    return (
        <div>
            <div className="container-gameover">
                <div className="item-gameover">
                    <h1>{nota >= 6 ? "PARABÉNS" : "GAME OVER"}</h1>
                </div>
                <div className="item-gameover">
                    <p>Parabéns <b>{props.name}</b></p>
                </div>
                <div className="item-gameover">
                    <p>Sua Nota foi <b>{Number(nota).toFixed(1)}</b></p>
                </div>
                <div className="item-gameover">
                    <button className="button-novamente" onClick={newGame}>Tente Novamente</button>
                </div>
            </div>
        </div>
    );
}

export default GameOver
