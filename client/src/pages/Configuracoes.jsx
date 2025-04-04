import React, { useState, useEffect } from 'react';
import './Configuracoes.css';

function Configuracoes() {
    const [config, setConfig] = useState({
        numQuestoes: 20,
        tempoPorQuestao: 180,
        notaMaxima: 20
    });

    useEffect(() => {
        // Carrega configurações salvas
        const savedConfig = localStorage.getItem('quizConfig');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));
    };

    const handleSave = () => {
        // Validações
        if (config.numQuestoes < 1) {
            alert('O número de questões deve ser pelo menos 1');
            return;
        }
        if (config.tempoPorQuestao < 10) {
            alert('O tempo por questão deve ser pelo menos 10 segundos');
            return;
        }
        if (config.notaMaxima < 1) {
            alert('A nota máxima deve ser pelo menos 1');
            return;
        }

        // Salva no localStorage
        localStorage.setItem('quizConfig', JSON.stringify(config));
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="config-container">
            <h1>Configurações do Quiz</h1>
            <div className="config-form">
                <div className="config-item">
                    <label htmlFor="numQuestoes">Número de Questões:</label>
                    <input
                        type="number"
                        id="numQuestoes"
                        name="numQuestoes"
                        value={config.numQuestoes}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="config-item">
                    <label htmlFor="tempoPorQuestao">Tempo por Questão (segundos):</label>
                    <input
                        type="number"
                        id="tempoPorQuestao"
                        name="tempoPorQuestao"
                        value={config.tempoPorQuestao}
                        onChange={handleChange}
                        min="10"
                    />
                </div>

                <div className="config-item">
                    <label htmlFor="notaMaxima">Nota Máxima do Quiz:</label>
                    <input
                        type="number"
                        id="notaMaxima"
                        name="notaMaxima"
                        value={config.notaMaxima}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="config-info">
                    <p>Pontuação por questão: {(config.notaMaxima / config.numQuestoes).toFixed(2)} pontos</p>
                </div>

                <button onClick={handleSave} className="save-button">
                    Salvar Configurações
                </button>
            </div>
        </div>
    );
}

export default Configuracoes; 