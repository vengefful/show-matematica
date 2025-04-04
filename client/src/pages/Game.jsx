import React, { useState, useEffect } from 'react';
import Button from '../Components/Button';
import './Game.css';
import { useNavigate } from 'react-router-dom';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';
import Timer from '../Components/Timer';
import parse from 'html-react-parser';
import axios from 'axios';
import Question from '../Components/Question';

const Game = ({ name, escola, disciplina, turma, setPergunta }) => {
    const navigate = useNavigate();
    const [questoes, setQuestoes] = useState([]);
    const [questaoAtual, setQuestaoAtual] = useState(0);
    const [tempoRestante, setTempoRestante] = useState(0);
    const [nota, setNota] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buttonsDisabled, setButtonsDisabled] = useState(false);
    const [aleatorio, setAleatorio] = useState([1, 2, 3, 4]);
    const [config, setConfig] = useState(null);

    // Buscar configurações sempre que o componente for montado ou quando disciplina/turma mudar
    useEffect(() => {
        carregarConfiguracoes();
    }, [disciplina, turma]);

    const carregarConfiguracoes = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/config');
            console.log('Configurações carregadas:', response.data);
            setConfig(response.data);
            await carregarQuestoes(response.data.numQuestoes, response.data.tempoPorQuestao);
            setLoading(false);
        } catch (err) {
            console.error('Erro ao carregar configurações:', err);
            setError('Erro ao carregar configurações');
            setLoading(false);
        }
    };

    const carregarQuestoes = async (numQuestoes, tempoPorQuestao) => {
        try {
            const response = await axios.get(`/api/perguntas/${disciplina}/${turma}`);
            const questoesEmbaralhadas = response.data;
            setQuestoes(questoesEmbaralhadas);
            setTempoRestante(tempoPorQuestao);
            console.log('Tempo por questão definido como:', tempoPorQuestao);
        } catch (err) {
            console.error('Erro ao carregar questões:', err);
            setError('Erro ao carregar questões');
        }
    };

    const sendData = async (nota) => {
        try {
            await axios.post(`/api/completed?nome=${name}&nota=${nota}&escola=${escola}&disciplina=${disciplina}&turma=${turma}`);
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

    const questionAnswered = (result) => {
        if (result) {
            setNota(prev => prev + (config.pontuacaoMaxima / config.numQuestoes));
        }

        // Se ainda houver perguntas disponíveis, avançar para a próxima
        if (questoes.length > 1) {
            console.log('Avançando para próxima pergunta...');
            setQuestoes(prev => prev.slice(1));
            setQuestaoAtual(prev => prev + 1);
            setAleatorio(shuffle([1, 2, 3, 4]));
        } else {
            console.log('Última pergunta, encerrando jogo...');
            // Aguardar um momento para garantir que a pontuação foi atualizada
            setTimeout(() => {
                toGameOver(nota + (result ? config.pontuacaoMaxima / config.numQuestoes : 0));
            }, 100);
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
        setQuestoes([]);
        setQuestaoAtual(0);
        setTempoRestante(0);
        setNota(0);
    }, [disciplina, turma, setPergunta]);

    return (
        <div className="game-container">
            {loading ? (
                <div className="loading">Carregando configurações...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : config && questoes.length > 0 && questoes[0] ? (
                <>
                    <div className="game-header">
                        <h2>Questão {questaoAtual + 1} de {config.numQuestoes}</h2>
                        <div className="score">
                            <p>Nota: {nota.toFixed(2)} / {config.pontuacaoMaxima}</p>
                        </div>
                        <Timer 
                            rodada={questaoAtual} 
                            questionAnswered={questionAnswered}
                            tempoPorQuestao={config.tempoPorQuestao}
                            key={questaoAtual}
                        />
                    </div>
                    <div className="question" onCopy={handleCopy}>
                        <Question pergunta={questoes[0].pergunta} />
                    </div>
                    <div className="answers-container">
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={questoes[0][`alternativa${aleatorio[0]}`]} 
                                onClick={() => handleAnswer(questoes[0].resposta === aleatorio[0])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={questoes[0].resposta === aleatorio[0]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={questoes[0][`alternativa${aleatorio[1]}`]} 
                                onClick={() => handleAnswer(questoes[0].resposta === aleatorio[1])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={questoes[0].resposta === aleatorio[1]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={questoes[0][`alternativa${aleatorio[2]}`]} 
                                onClick={() => handleAnswer(questoes[0].resposta === aleatorio[2])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={questoes[0].resposta === aleatorio[2]}
                                disabled={buttonsDisabled}
                            />
                        </div>
                        <div className="answers">
                            <Button 
                                classButton="answers-button" 
                                text={questoes[0][`alternativa${aleatorio[3]}`]} 
                                onClick={() => handleAnswer(questoes[0].resposta === aleatorio[3])} 
                                onTouchStart={handleButtonTouchStart} 
                                onTouchEnd={handleButtonTouchEnd} 
                                resultado={questoes[0].resposta === aleatorio[3]}
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

export default Game;
