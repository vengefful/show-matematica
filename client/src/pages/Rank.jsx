import React, { useState, useEffect } from 'react';
import './Rank.css';
import api from '../Api';
import axios from 'axios';

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

const Rank = () => {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [turmas, setTurmas] = useState([]);
    const [disciplinas, setDisciplinas] = useState([]);
    const [turmaSelecionada, setTurmaSelecionada] = useState('');
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [historico, setHistorico] = useState([]);
    const [showHistorico, setShowHistorico] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);

    useEffect(() => {
        const fetchRanking = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/rank');
                console.log('Dados recebidos:', response.data); // Debug
                
                // Agrupar por nome, turma e disciplina e manter a maior nota
                const rankingAgrupado = response.data.reduce((acc, curr) => {
                    const key = `${curr.nome}-${curr.turma}-${curr.disciplina}`;
                    if (!acc[key] || parseFloat(curr.nota) > parseFloat(acc[key].nota)) {
                        acc[key] = {
                            ...curr,
                            melhor_nota: parseFloat(curr.nota),
                            ultima_tentativa: curr.data_hora
                        };
                    }
                    return acc;
                }, {});

                // Converter para array e ordenar
                const rankingOrdenado = Object.values(rankingAgrupado)
                    .sort((a, b) => b.melhor_nota - a.melhor_nota);

                console.log('Ranking agrupado:', rankingOrdenado); // Debug
                
                setRanking(rankingOrdenado);
                
                // Extrair turmas e disciplinas únicas
                const turmasUnicas = [...new Set(response.data.map(item => item.turma))];
                const disciplinasUnicas = [...new Set(response.data.map(item => item.disciplina))];
                
                setTurmas(turmasUnicas);
                setDisciplinas(disciplinasUnicas);
                setError(null);
            } catch (err) {
                console.error('Erro ao buscar ranking:', err);
                setError('Erro ao carregar ranking');
            } finally {
                setLoading(false);
            }
        };

        fetchRanking();
    }, []);

    // Filtrar ranking por turma e disciplina
    const rankingFiltrado = ranking.filter(aluno => 
        (!turmaSelecionada || aluno.turma === turmaSelecionada) &&
        (!disciplinaSelecionada || aluno.disciplina === disciplinaSelecionada)
    );

    // Calcular paginação
    const totalPages = Math.ceil(rankingFiltrado.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const rankingPaginado = rankingFiltrado.slice(startIndex, endIndex);

    const verHistorico = async (aluno) => {
        setLoading(true);
        setAlunoSelecionado(aluno);
        try {
            const response = await axios.get(`/api/historico/${aluno.nome}/${aluno.turma}/${aluno.disciplina}`);
            setHistorico(response.data);
            setShowHistorico(true);
        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
        }
        setLoading(false);
    };

    return (
        <div className="rank-container">
            <h1>Ranking</h1>
            
            <div className="filters">
                <select 
                    value={turmaSelecionada} 
                    onChange={(e) => setTurmaSelecionada(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todas as turmas</option>
                    {turmas.map(turma => (
                        <option key={turma} value={turma}>{turma}</option>
                    ))}
                </select>

                <select 
                    value={disciplinaSelecionada} 
                    onChange={(e) => setDisciplinaSelecionada(e.target.value)}
                    className="filter-select"
                >
                    <option value="">Todas as disciplinas</option>
                    {disciplinas.map(disciplina => (
                        <option key={disciplina} value={disciplina}>{disciplina}</option>
                    ))}
                </select>
            </div>

            <div className="table-wrapper">
                <table className="rank-table">
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Nome</th>
                            <th>Melhor Nota</th>
                            <th>Turma</th>
                            <th>Disciplina</th>
                            <th>Última Tentativa</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankingPaginado.map((aluno, index) => (
                            <tr key={`${aluno.nome}-${aluno.turma}-${aluno.disciplina}-${Date.now()}-${index}`}>
                                <td>{startIndex + index + 1}º</td>
                                <td>{aluno.nome}</td>
                                <td>{aluno.melhor_nota ? aluno.melhor_nota.toFixed(1) : '0.0'}</td>
                                <td>{aluno.turma}</td>
                                <td>{aluno.disciplina}</td>
                                <td>{aluno.ultima_tentativa ? new Date(aluno.ultima_tentativa).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    timeZone: 'America/Sao_Paulo'
                                }) : 'Data não disponível'}</td>
                                <td>
                                    <button 
                                        className="btn-historico"
                                        onClick={() => verHistorico(aluno)}
                                    >
                                        Ver Histórico
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button 
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                >
                    Primeira
                </button>
                <button 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Anterior
                </button>
                <span>Página {currentPage} de {totalPages}</span>
                <button 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Próxima
                </button>
                <button 
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    Última
                </button>
            </div>

            {showHistorico && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Histórico de Tentativas</h2>
                        <h3>{alunoSelecionado.nome} - {alunoSelecionado.turma} - {alunoSelecionado.disciplina}</h3>
                        
                        {loading ? (
                            <p>Carregando histórico...</p>
                        ) : (
                            <div className="historico-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Tentativa</th>
                                            <th>Nota</th>
                                            <th>Data/Hora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historico.map((tentativa, index) => (
                                            <tr key={`${tentativa.data_hora}-${index}-${Date.now()}`}>
                                                <td>{tentativa.tentativa}ª</td>
                                                <td>{tentativa.nota}</td>
                                                <td>{new Date(tentativa.data_hora).toLocaleString('pt-BR')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        
                        <button 
                            className="btn-fechar"
                            onClick={() => setShowHistorico(false)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Rank;
