import React, { useState, useEffect} from 'react';
import Button from '../Components/Button';
import './Game.css';
import { useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Timer from '../Components/Timer';
import parse from 'html-react-parser';
import api from '../Api';
import Question from '../Components/Question';

function Game(props) {

    const [aleatorio, setAleatorio] = useState([1, 2, 3, 4]);
    const numQuestions = 2;
    const navigate = useNavigate();

    const random = (min,max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const shuffle = (array) => {
        for (let i = array.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (1 + 2));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    useEffect(() => {
        props.setNum(random(0, props.data.length - 1));

    }, [props.rodada]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/api/pergunta?disciplina=${props.disciplina}&turma=${props.turma.charAt(0)}-ano`);
                // console.log(response.data);
                props.setPergunta(response.data);
            } catch(error) {
                console.log('Erro ao buscar os dados', error);
            }
        };
        setAleatorio(shuffle(aleatorio));
        fetchData();
    }, [props.rodada]);

    const sendData = async (nota) => {
        try {
            const response = await api.post(`/api/completed?nome=${props.name}&nota=${nota}&escola=${props.escola}&disciplina=${props.disciplina}&turma=${props.turma}`);
            console.log(response.data);
        } catch(error) {
            console.log('Erro ao enviar os dados', error);
        }
    };

    const toGameOver = (nota) => {
        sendData(nota);
        navigate('/gameover');
    }

    const questionAnswered = (resultado) => {
        if (props.rodada < numQuestions){
            if(resultado){
                props.setNota(prevNota =>  prevNota + 0.5);
            }
            else{
                //adicionar errou
            }
            // props.setNum(random(0, props.data.length));
            props.setRodada(prevRodada => prevRodada + 1);
        }
        else{
            if(resultado){
                props.setNota(prevNota => prevNota + 0.5);
                const nota = props.nota + 0.5;
                props.setRodada(1);
                toGameOver(nota);
            } else{
                props.setRodada(1);
                toGameOver(props.nota);
            }
        }
    }

    const delay = ((resultado) => {
        setTimeout(() => {
            questionAnswered(resultado);
        }, 1000);
    })

    const handleAnswer = (resultado) => {
        // console.log('Botão Clicado!!!!!!!!!');
        delay(resultado);

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
            <div className="h1-timer">
                <div className="h1-timer-item">
                    <Timer rodada={props.rodada} questionAnswered={questionAnswered}/>
                </div>
                <div className="h1-timer-item2">
                    <h1>Rodada {props.rodada}</h1>
                </div>
            </div>
            <div className="question" onCopy={handleCopy}>
                <Question pergunta={props.pergunta.pergunta} />
            </div>
            <div className="answers-container">
                <div className="answers">
                    <Button classButton="answers-button" text={props.pergunta?.[`alternativa${aleatorio[0]}`]} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} resultado={props.pergunta?.resposta === aleatorio[0] ? true : false}/>
                </div>
                <div className="answers">
                    <Button classButton="answers-button" text={props.pergunta?.[`alternativa${aleatorio[1]}`]} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} resultado={props.pergunta?.resposta === aleatorio[1] ? true : false}/>
                </div>
                <div className="answers">
                    <Button classButton="answers-button" text={props.pergunta?.[`alternativa${aleatorio[2]}`]} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} resultado={props.pergunta?.resposta === aleatorio[2] ? true : false}/>
                </div>
                <div className="answers">
                    <Button classButton="answers-button" text={props.pergunta?.[`alternativa${aleatorio[3]}`]} onClick={handleAnswer} onTouchStart={handleButtonTouchStart} onTouchEnd={handleButtonTouchEnd} resultado={props.pergunta?.resposta === aleatorio[3] ? true : false}/>
                </div>
            </div>
        </div>
    )
}

export default Game
