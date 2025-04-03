import React, { useState, useEffect, useCallback } from 'react';
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
    const navigate = useNavigate();
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [perguntasDisponiveis, setPerguntasDisponiveis] = useState([]);
    const [aleatorio, setAleatorio] = useState([1, 2, 3, 4]);
    const [perguntaAtual, setPerguntaAtual] = useState(null);
    const [respostaSelecionada, setRespostaSelecionada] = useState(null);
    const [mostrarResposta, setMostrarResposta] = useState(false);
    const [tempoRestante, setTempoRestante] = useState(30);
    const [erro, setErro] = useState('');
    const numQuestions = 10;

    const sendData = async (nota) => {
        try {
            await api.post(`/api/completed?nome=${props.name}&nota=${nota}&escola=${props.escola}&disciplina=${props.disciplina}&turma=${props.turma}`);
        } catch(error) {
            console.log('Erro ao enviar os dados', error);
        }
    };

    const toGameOver = (nota) => {
        sendData(nota);
        navigate('/gameover', { state: { nota: nota } });
    }

    const random = (min,max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const shuffle = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    useEffect(() => {
        const carregarPerguntas = async () => {
            try {
                // Normalizar o nome da disciplina para "Matematica" (sem acento)
                const disciplina = props.disciplina === "Matemática" ? "Matematica" : props.disciplina;
                
                console.log(`Carregando perguntas para disciplina: ${disciplina}, turma: ${props.turma}`);
                const response = await fetch(`/api/perguntas/${disciplina}/${props.turma}`);
                const data = await response.json();
                
                console.log('Perguntas recebidas:', data);
                
                if (!data || data.length === 0) {
                    alert('Não há perguntas cadastradas para esta disciplina e turma. Por favor, cadastre perguntas antes de iniciar o jogo.');
                    navigate('/');
                    return;
                }

                // Embaralhar todas as perguntas
                const perguntasEmbaralhadas = shuffle([...data]);
                
                // Selecionar apenas as primeiras 5 perguntas
                const perguntasSelecionadas = perguntasEmbaralhadas.slice(0, numQuestions);
                
                setPerguntasDisponiveis(perguntasSelecionadas);
                
                // Iniciar com a primeira pergunta
                setPerguntaAtual(perguntasSelecionadas[0]);
                props.setPergunta(perguntasSelecionadas[0]);
                setAleatorio(shuffle([1, 2, 3, 4]));
                
            } catch (error) {
                console.error('Erro ao carregar perguntas:', error);
                alert('Erro ao carregar perguntas. Tente novamente mais tarde.');
                navigate('/');
            }
        };

        carregarPerguntas();
    }, [props.disciplina, props.turma, navigate]);

    const questionAnswered = (resultado) => {
        if(resultado) {
            props.setNota(prevNota => prevNota + 1);
        }

        // Se ainda houver perguntas disponíveis, avançar para a próxima
        if (perguntasDisponiveis.length > 1) {
            console.log('Avançando para próxima pergunta...');
            const proximaPergunta = perguntasDisponiveis[1];
            setPerguntasDisponiveis(prev => prev.slice(1));
            setPerguntaAtual(proximaPergunta);
            props.setPergunta(proximaPergunta);
            setAleatorio(shuffle([1, 2, 3, 4]));
            props.setRodada(prevRodada => prevRodada + 1);
        } else {
            console.log('Última pergunta, encerrando jogo...');
            toGameOver(props.nota);
        }
    };

    const delay = ((resultado) => {
        setButtonsDisabled(true);
        setTimeout(() => {
            questionAnswered(resultado);
            setButtonsDisabled(false);
        }, 1000);
    });

    const handleAnswer = (resultado) => {
        if (!buttonsDisabled) {
            delay(resultado);
        }
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

    // Resetar o estado quando mudar de disciplina ou turma
    useEffect(() => {
        setPerguntasDisponiveis([]);
        setPerguntaAtual(null);
        setRespostaSelecionada(null);
        setMostrarResposta(false);
        setTempoRestante(30);
        props.setNota(0);
        props.setRodada(1);
    }, [props.disciplina, props.turma, props.setNota, props.setRodada]);

    return (
        <div>
            <div className="score">
                <p className="score-itens">Acertos: {props.nota} / 10</p>
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
            {perguntaAtual ? (
                <>
                    <div className="question" onCopy={handleCopy}>
                        <Question pergunta={perguntaAtual.pergunta} />
                    </div>
                    <div className="answers-container">
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={perguntaAtual[`alternativa${aleatorio[0]}`]} 
                                onClick={() => handleAnswer(perguntaAtual.resposta === aleatorio[0])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={perguntaAtual.resposta === aleatorio[0]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={perguntaAtual[`alternativa${aleatorio[1]}`]} 
                                onClick={() => handleAnswer(perguntaAtual.resposta === aleatorio[1])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={perguntaAtual.resposta === aleatorio[1]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={perguntaAtual[`alternativa${aleatorio[2]}`]} 
                                onClick={() => handleAnswer(perguntaAtual.resposta === aleatorio[2])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={perguntaAtual.resposta === aleatorio[2]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={perguntaAtual[`alternativa${aleatorio[3]}`]} 
                                onClick={() => handleAnswer(perguntaAtual.resposta === aleatorio[3])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={perguntaAtual.resposta === aleatorio[3]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="loading">Carregando pergunta...</div>
            )}
        </div>
    )
}

export default Game
