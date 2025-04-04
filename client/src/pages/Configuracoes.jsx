import React, { useState, useEffect } from 'react';
import './Configuracoes.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Configuracoes() {
    const navigate = useNavigate();
    const [config, setConfig] = useState({
        numQuestoes: 20,
        tempoPorQuestao: 180,
        pontuacaoMaxima: 20
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [limpandoRanking, setLimpandoRanking] = useState(false);

    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    const carregarConfiguracoes = async () => {
        try {
            const response = await axios.get('/api/config');
            setConfig(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Erro ao carregar configurações:', err);
            setError('Erro ao carregar configurações');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: parseInt(value)
        }));
    };

    const handleSave = async () => {
        // Validações
        if (config.numQuestoes < 1) {
            alert('O número de questões deve ser pelo menos 1');
            return;
        }
        if (config.tempoPorQuestao < 10) {
            alert('O tempo por questão deve ser pelo menos 10 segundos');
            return;
        }
        if (config.pontuacaoMaxima < 1) {
            alert('A pontuação máxima deve ser pelo menos 1');
            return;
        }

        try {
            console.log('Iniciando salvamento de configurações...');
            console.log('Dados a serem enviados:', config);
            
            const response = await axios.post('/api/config', config);
            console.log('Resposta do servidor:', response.data);
            alert('Configurações salvas com sucesso!');
            navigate('/');
        } catch (err) {
            console.error('Erro ao salvar configurações:', err);
            console.error('Detalhes do erro:', err.response?.data || err.message);
            alert('Erro ao salvar configurações');
        }
    };

    const handleLimparRanking = async () => {
        const confirmacao = window.confirm('Tem certeza que deseja limpar todo o ranking? Esta ação não poderá ser desfeita.');
        
        if (!confirmacao) {
            return;
        }
        
        try {
            setLimpandoRanking(true);
            const response = await axios.delete('/api/limpar-ranking');
            console.log('Resposta do servidor:', response.data);
            alert(`Ranking limpo com sucesso! ${response.data.registrosRemovidos} registros foram removidos.`);
            setLimpandoRanking(false);
        } catch (err) {
            console.error('Erro ao limpar ranking:', err);
            alert('Erro ao limpar ranking. Tente novamente mais tarde.');
            setLimpandoRanking(false);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

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
                    <label htmlFor="pontuacaoMaxima">Pontuação Máxima:</label>
                    <input
                        type="number"
                        id="pontuacaoMaxima"
                        name="pontuacaoMaxima"
                        value={config.pontuacaoMaxima}
                        onChange={handleChange}
                        min="1"
                    />
                </div>

                <div className="config-info">
                    <p>Pontuação por questão: {(config.pontuacaoMaxima / config.numQuestoes).toFixed(2)} pontos</p>
                </div>

                <button onClick={handleSave} className="save-button">
                    Salvar Configurações
                </button>
                
                <div className="section-divider"></div>
                
                <div className="danger-zone">
                    <h2>Zona de Perigo</h2>
                    <p>Estas ações são irreversíveis. Prossiga com cuidado.</p>
                    
                    <button 
                        onClick={handleLimparRanking} 
                        className="danger-button"
                        disabled={limpandoRanking}
                    >
                        {limpandoRanking ? 'Limpando...' : 'Limpar Todo o Ranking'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Configuracoes; 