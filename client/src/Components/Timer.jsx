import React, { useState, useEffect} from 'react';
import './Timer.css';
import { useNavigate } from 'react-router-dom';

function Timer(props) {
    const [timer, setTimer] = useState(10);
    const navigate = useNavigate();

    const toGameOver = () => {
        navigate('/gameover');
    }

    useEffect(() => {

        if(timer <= -1){
            props.questionAnswered();
        }
        const intervalId = setInterval(() => {
            if (timer > -1){
                setTimer(prevTimer => prevTimer - 1);
            }
        }, 1000);


        return () => clearInterval(intervalId);
    }, [timer]);

    useEffect(() => {
        setTimer(10);
    }, [props.rodada]);

    const formatTime = () => {
        const minutes = Math.floor(timer / 60);
        const remainderTimer = timer % 60;
        if (timer > 0){
            return `${minutes}:${remainderTimer < 10 ? '0' : ''}${remainderTimer}`;
        }
        else{
            return `0:00`;
        }
    }

    return(
        <div>
            {formatTime()}
        </div>
    );
}

export default Timer;
