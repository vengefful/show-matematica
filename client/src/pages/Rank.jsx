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
    const [rank, setRank] = useState([]);
    const [turma, setTurma] = useState('');
    const [disciplina, setDisciplina] = useState('');

    useEffect(() => {
        const fetchRank = async () => {
            try {
                const response = await api.get(`/api/rank/${turma}/${disciplina}`);
                setRank(response.data);
            } catch (error) {
                console.log('Erro ao buscar rank:', error);
            }
        };

        fetchRank();
    }, [turma, disciplina]);

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
                    <option value="Portugues">Português</option>
                    <option value="Geografia">Geografia</option>
                    <option value="Historia">História</option>
                    <option value="Ciencias">Ciências</option>
                </select>
            </div>

            <table className="rank-table">
                <thead>
                    <tr>
                        <th>Posição</th>
                        <th>Nome</th>
                        <th>Escola</th>
                        <th>Turma</th>
                        <th>Disciplina</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>
                    {rank.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.nome}</td>
                            <td>{item.escola}</td>
                            <td>{item.turma}</td>
                            <td>{item.disciplina}</td>
                            <td>{item.nota.toFixed(1)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Rank;
