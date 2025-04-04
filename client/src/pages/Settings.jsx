import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Settings = () => {
    const navigate = useNavigate();
    const [numQuestoes, setNumQuestoes] = useState(20);
    const [tempoPorQuestao, setTempoPorQuestao] = useState(180);
    const [pontuacaoMaxima, setPontuacaoMaxima] = useState(20);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        carregarConfiguracoes();
    }, []);

    const carregarConfiguracoes = async () => {
        try {
            const response = await axios.get('/api/config');
            const config = response.data;
            setNumQuestoes(config.numQuestoes);
            setTempoPorQuestao(config.tempoPorQuestao);
            setPontuacaoMaxima(config.pontuacaoMaxima);
            setLoading(false);
        } catch (err) {
            console.error('Erro ao carregar configurações:', err);
            setError('Erro ao carregar configurações');
            setLoading(false);
        }
    };

    const salvarConfiguracoes = async () => {
        console.log('Iniciando salvamento de configurações...');
        console.log('Dados a serem enviados:', {
            numQuestoes,
            tempoPorQuestao,
            pontuacaoMaxima
        });
        
        try {
            const response = await axios.post('/api/config', {
                numQuestoes,
                tempoPorQuestao,
                pontuacaoMaxima
            });
            console.log('Resposta do servidor:', response.data);
            alert('Configurações salvas com sucesso!');
            navigate('/');
        } catch (err) {
            console.error('Erro ao salvar configurações:', err);
            console.error('Detalhes do erro:', err.response?.data || err.message);
            alert('Erro ao salvar configurações');
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Carregando...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Configurações do Quiz</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Número de Questões
                        </label>
                        <input
                            type="number"
                            value={numQuestoes}
                            onChange={(e) => setNumQuestoes(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="1"
                            max="50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tempo por Questão (segundos)
                        </label>
                        <input
                            type="number"
                            value={tempoPorQuestao}
                            onChange={(e) => setTempoPorQuestao(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="30"
                            max="300"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Pontuação Máxima
                        </label>
                        <input
                            type="number"
                            value={pontuacaoMaxima}
                            onChange={(e) => setPontuacaoMaxima(parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            min="1"
                            max="100"
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        Voltar
                    </button>
                    <button
                        onClick={() => {
                            console.log('Botão Salvar clicado');
                            salvarConfiguracoes();
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings; 