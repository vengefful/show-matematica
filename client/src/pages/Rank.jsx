import React, { useEffect, useState } from 'react';
import './Rank.css';
import api from '../Api';

function Rank(props) {

    const [rankData, setRankData] = useState([]);
    const [disciplina, setDisciplina] = useState(props.disciplina);
    const [turma, setTurma] = useState(props.turma);
    const [escola, setEscola] =  useState(props.escola);
    const disciplinas = {
        'Lima Castro': ['Matemática', 'Geografia'],
        'Orlando Dantas': ['Geografia'],
        'Sabino Ribeiro': ['Geografia']
    };
    const turmasLimaCastro = {
        'Matemática': ['1M02', '1M03', '1I01', '1I02'],
        'Geografia': ['1M02', '1I02'],
    };
    const turmasOrlandoDantas = {
        'Geografia': ['9A', '9B', '8A'],
    };
    const turmasSabinoRibeiro = {
        'Geografia': ['6A', '7A'],
    };
    const escolas = ['Lima Castro', 'Orlando Dantas', 'Sabino Ribeiro'];

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await api.get(`/api/rank/${escola}/${disciplina}/${turma}`);
                setRankData(response.data.alunos);
            } catch(error){

            }
        };

        fetchData();

    }, [escola, disciplina, turma]);

    const handleEscolaChange = (e) => {
        const selectedEscola = e.target.value;
        setEscola(selectedEscola);
        setDisciplina('');
    };

    const handleDisciplinaChange = (e) => {
        const selectedDisciplina = e.target.value;
        setDisciplina(selectedDisciplina);
        setTurma('');
    };

    const handleTurmaChange = (e) => {
        const selectedTurma = e.target.value;
        setTurma(selectedTurma);
    }

    return (
        <div>
            <h2>Rank</h2>
            <h3>{!escola ? "" : escola}</h3>
            <h4>{!disciplina ? "" : disciplina} {!turma ? "" : ` - ${turma}`}</h4>
            <div>

                <div className="items-escolha">
                    <label className='label-rank'>Escola:</label>
                    <select value={escola} onChange={handleEscolaChange}>
                        <option value="">Selecione</option>
                        {escolas.map((escola, index) => (
                            <option key={index} value={escola}>
                                {escola}
                            </option>
                        ))}
                    </select>
                </div>

                {escola === "Lima Castro" && (
                    <div className="items-escolha">
                        <label className='label-rank'>Disciplina:</label>
                        <select value={disciplina} onChange={handleDisciplinaChange}>
                            <option value="">Selecione</option>
                            {disciplinas[escola].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {escola === "Lima Castro" && disciplina && (
                    <div className="items-escolha">
                        <label className='label-rank'>Turma:</label>
                        <select value={turma} onChange={handleTurmaChange}>
                            <option value="">Selecione</option>
                            {turmasLimaCastro[disciplina]?.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {escola === "Orlando Dantas" && (
                    <div className="items-escolha">
                        <label className='label-rank'>Disciplina:</label>
                        <select value={disciplina} onChange={handleDisciplinaChange}>
                            <option value="">Selecione</option>
                            {disciplinas[escola].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {escola === "Orlando Dantas" && disciplina && (
                    <div className="items-escolha">
                        <label className='label-rank'>Turma:</label>
                        <select value={turma} onChange={handleTurmaChange}>
                            <option value="">Selecione</option>
                            {turmasOrlandoDantas[disciplina].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {escola === "Sabino Ribeiro" && (
                    <div className="items-escolha">
                        <label className='label-rank'>Disciplina:</label>
                        <select value={disciplina} onChange={handleDisciplinaChange}>
                            <option value="">Selecione</option>
                            {disciplinas[escola].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {escola === "Sabino Ribeiro" && disciplina && (
                    <div className="items-escolha">
                        <label className='label-rank'>Turma:</label>
                        <select value={turma} onChange={handleTurmaChange}>
                            <option value="">Selecione</option>
                            {turmasSabinoRibeiro[disciplina].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

            </div>


            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Nota</th>
                            <th>Nome</th>
                            <th>Horário</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankData.map((alunos, index) => (
                            <tr key={alunos.id}>
                              <td>{index + 1}</td>
                              <td>{Number(alunos.nota).toFixed(1)}</td>
                              <td>{alunos.nome}</td>
                              <td>{alunos.data}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Rank;
