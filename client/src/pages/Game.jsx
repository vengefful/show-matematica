import React, { useState, useEffect} from 'react';
import Button from '../Components/Button';
import './Game.css';
import { useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Timer from '../Components/Timer';
import parse from 'html-react-parser';


function Game(props) {

    const numQuestions = 20;
    const [win, setWin] = useState(false);
    const navigate = useNavigate();

    const random = (min,max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useEffect(() => {
        props.setNum(random(0, props.data.length - 1));

    }, [props.rodada]);

    const toGameOver = () => {
        navigate('/gameover');
    }

    const questionAnswered = () => {
        if (props.rodada < numQuestions){
            if(win){
                props.setNota(props.nota + 0.5);
            }
            else{
                console.log("errou");
            }
            // props.setNum(random(0, props.data.length));
            props.setRodada(props.rodada + 1);
        }
        else{
            if(win){
                props.setNota(props.nota + 0.5);
            }
            setWin(false);
            props.setRodada(1);
            toGameOver();
        }
    }

    const delay = (() => {
        setTimeout(() => {
            questionAnswered();
        }, 1000);
    })

    const handleAnswer = () => {
        // console.log('Botão Clicado!!!!!!!!!');
        delay();

    }

    const handleButtonTouchStart = () => {
        // console.log('Botão tocado!!!!!');
        // Adicione aqui a lógica que deseja executar quando o botão é tocado
      };

    const handleButtonTouchEnd = () => {
    // console.log('Toque no botão encerrado!');
    // Adicione aqui a lógica que deseja executar quando o toque no botão é encerrado
    };

    const handleCopy = (event) => {
        event.preventDefault();
    }


    return (
        <div>
            <div className="score">
                <p className="score-itens">Acertos: {props.nota * 2} / 20</p>
                <p className="score-itens">Pontuação: {props.nota.toFixed(1)} / 10</p>
            </div>
            <div>
                <Timer rodada={props.rodada} questionAnswered={questionAnswered}/>
            </div>
            <h1>Rodada {props.rodada}</h1>
            <div className="question" onCopy={handleCopy}>
                {parse(props.data[props.num]?.question)}
        {console.log(props.data[props.num]?.r1, props.data[props.num]?.r2, props.data[props.num]?.r3, props.data[props.num]?.r4)}
            </div>
            <div className="answers-container">
                <div className="answers">
                    <Button classButton="answers-button" text={props.data[props.num]?.q1} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} win={props.data[props.num]?.r1 === 'TRUE' ? true : false} setWin={setWin} />
                </div>
                <div className="answers">
                    <Button classButton="answers-button" text={props.data[props.num]?.q2} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} win={props.data[props.num]?.r2 === 'TRUE' ? true : false} setWin={setWin} />
                </div>
                <div className="answers">
                    <Button classButton="answers-button" text={props.data[props.num]?.q3} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} win={props.data[props.num]?.r3 === 'TRUE' ? true : false} setWin={setWin} />
                </div>
                <div className="answers">
                    <Button classButton="answers-button" text={props.data[props.num]?.q4} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} win={props.data[props.num]?.r4 ==='TRUE' ? true : false} setWin={setWin} />
                </div>
            </div>
        </div>
    )
}

export default Game
