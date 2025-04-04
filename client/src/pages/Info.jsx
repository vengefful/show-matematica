import React from 'react';
import './Info.css';

function Info() {
    return (
        <div className="info-container">
            <h1>Informações do Quiz</h1>
            
            <div className="info-section">
                <h2>Como Funciona</h2>
                <p>O quiz é uma ferramenta interativa para testar seus conhecimentos em diferentes disciplinas.</p>
                <ul>
                    <li>Escolha sua escola, disciplina e turma</li>
                    <li>Responda às questões no tempo determinado</li>
                    <li>Acumule pontos por cada resposta correta</li>
                    <li>Veja sua posição no ranking da turma</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>Configurações do Quiz</h2>
                <p>O professor pode configurar:</p>
                <ul>
                    <li>Número de questões por quiz</li>
                    <li>Tempo por questão (em segundos)</li>
                    <li>Nota máxima do quiz</li>
                </ul>
                <p>A pontuação por questão é calculada automaticamente (nota máxima / número de questões)</p>
            </div>

            <div className="info-section">
                <h2>Regras</h2>
                <ul>
                    <li>Cada questão tem um tempo limite para resposta</li>
                    <li>Respostas corretas somam pontos</li>
                    <li>O quiz termina quando todas as questões forem respondidas ou o tempo acabar</li>
                    <li>Sua nota será registrada no ranking da turma</li>
                </ul>
            </div>

            <div className="info-section">
                <h2>Ranking</h2>
                <p>O ranking mostra:</p>
                <ul>
                    <li>Posição do aluno</li>
                    <li>Nome do aluno</li>
                    <li>Nota obtida</li>
                    <li>Data e hora da realização</li>
                </ul>
                <p>Você pode filtrar o ranking por disciplina e turma</p>
            </div>
        </div>
    );
}

export default Info;
