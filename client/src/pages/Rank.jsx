import React, { useState, useEffect } from 'react';
import './Rank.css';
import api from '../Api';

const turmasDisponiveis = [
    { value: 'EMMAT1A', label: 'EMMAT1A' },
    { value: 'EMMAT1B', label: 'EMMAT1B' },
    { value: 'EMMAT1C', label: 'EMMAT1C' },
    { value: 'EMMAT2A', label: 'EMMAT2A' },
    { value: 'EMMAT2B', label: 'EMMAT2B' },
    { value: 'EMMAT2C', label: 'EMMAT2C' },
    { value: 'EMMAT3A', label: 'EMMAT3A' },
    { value: 'EMMAT3B', label: 'EMMAT3B' },
    { value: 'EMMAT3C', label: 'EMMAT3C' }
];

function Rank() {
    const [ranking, setRanking] = useState([]);
    const [turma, setTurma] = useState('');
    const [disciplina, setDisciplina] = useState('');
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 20;

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await api.get('/api/rank');
                setRanking(response.data);
            } catch (error) {
                console.error('Erro ao buscar ranking:', error);
            }
        };

        fetchRanking();
    }, []);

    // Filtrar ranking por turma e disciplina
    const rankingFiltrado = ranking.filter(item => {
        if (turma && item.turma !== turma) return false;
        if (disciplina && item.disciplina !== disciplina) return false;
        return true;
    });

    // Calcular índices para paginação
    const indiceUltimoItem = paginaAtual * itensPorPagina;
    const indicePrimeiroItem = indiceUltimoItem - itensPorPagina;
    const itensAtuais = rankingFiltrado.slice(indicePrimeiroItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(rankingFiltrado.length / itensPorPagina);

    return (
        <div className="rank-container">
            <h1>Ranking</h1>
            
            <div className="filters">
                <select
                    value={turma}
                    onChange={(e) => setTurma(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todas as turmas</option>
                    {turmasDisponiveis.map((turma, index) => (
                        <option key={index} value={turma.value}>
                            {turma.label}
                        </option>
                    ))}
                </select>

                <select
                    value={disciplina}
                    onChange={(e) => setDisciplina(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todas as disciplinas</option>
                    <option value="Matematica">Matemática</option>
                    <option value="Geografia">Geografia</option>
                </select>
            </div>

            <table className="rank-table">
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Nota</th>
                        <th>Turma</th>
                        <th>Disciplina</th>
                        <th>Data e Hora</th>
                    </tr>
                </thead>
                <tbody>
                    {itensAtuais.map((item, index) => (
                        <tr key={item.id}>
                            <td>{indicePrimeiroItem + index + 1}º</td>
                            <td>{item.nome}</td>
                            <td>{item.nota}</td>
                            <td>{item.turma}</td>
                            <td>{item.disciplina}</td>
                            <td>{item.data_hora ? new Date(item.data_hora).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit',
                                timeZone: 'America/Sao_Paulo'
                            }) : 'Data não disponível'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                <button 
                    onClick={() => setPaginaAtual(paginaAtual - 1)} 
                    disabled={paginaAtual === 1}
                >
                    Anterior
                </button>
                <span>Página {paginaAtual} de {totalPaginas}</span>
                <button 
                    onClick={() => setPaginaAtual(paginaAtual + 1)} 
                    disabled={paginaAtual === totalPaginas}
                >
                    Próxima
                </button>
            </div>
        </div>
    );
}

export default Rank;
