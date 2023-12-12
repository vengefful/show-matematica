import React, { useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home(props) {

    const handleInputChange = (event) => {
        props.setName(event.target.value);
        localStorage.setItem('name', event.target.value);
    };

    const navigate = useNavigate();

    const toGame = () => {
        props.setRodada(1);
        props.setNota(0);

        if(props.disciplina === 'Geografia'){
            document.body.className = 'bgG';
        } else if (props.disciplina === 'Matematica'){
            document.body.className = 'bgM';
        } else {
            document.body.className = 'bgP';
        }

        navigate('/game');
    }

    useEffect(() => {
        const nameSave = localStorage.getItem('name');

        if(nameSave) {
            props.setName(nameSave);
        }

    }, []);

    return (
        <div className="home">
            <h1>Quiz</h1>
            <div className="form-group">
                <label htmlFor="nome">Digite seu Nome</label>
                <input type="text" name="nome" value={props.name} placeholder="Digite seu Nome" onChange={handleInputChange}/>
                <div className="items-escolha">
                    <label>Escola:</label>
                    <select value={props.escola} onChange={props.handleEscolherEscola}>
                        <option value="">Selecione</option>
                        {props.escolas.map((escola, index) => (
                            <option key={index} value={escola}>
                                {escola}
                            </option>
                        ))}
                    </select>
                </div>

                {props.escola === "Lima Castro" && (
                    <div className="items-escolha">
                        <label>Disciplina:</label>
                        <select value={props.disciplina} onChange={props.handleEscolherDisciplina}>
                            <option value="">Selecione</option>
                            {props.disciplinas[props.escola].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {props.escola === "Lima Castro" && props.disciplina && (
                    <div className="items-escolha">
                        <label>Turma:</label>
                        <select value={props.turma} onChange={props.handleEscolherTurma}>
                            <option value="">Selecione</option>
                            {props.turmasLimaCastro[props.disciplina]?.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {props.escola === "Orlando Dantas" && (
                    <div className="items-escolha">
                        <label>Disciplina:</label>
                        <select value={props.disciplina} onChange={props.handleEscolherDisciplina}>
                            <option value="">Selecione</option>
                            {props.disciplinas[props.escola].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {props.escola === "Orlando Dantas" && props.disciplina && (
                    <div className="items-escolha">
                        <label>Turma:</label>
                        <select value={props.turma} onChange={props.handleEscolherTurma}>
                            <option value="">Selecione</option>
                            {props.turmasOrlandoDantas[props.disciplina]?.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {props.escola === "Sabino Ribeiro" && (
                    <div className="items-escolha">
                        <label>Disciplina:</label>
                        <select value={props.disciplina} onChange={props.handleEscolherDisciplina}>
                            <option value="">Selecione</option>
                            {props.disciplinas[props.escola].map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                {props.escola === "Sabino Ribeiro" && props.disciplina && (
                    <div className="items-escolha">
                        <label>Turma:</label>
                        <select value={props.turma} onChange={props.handleEscolherTurma}>
                            <option value="">Selecione</option>
                            {props.turmasSabinoRibeiro[props.disciplina]?.map((item, index) => (
                                <option key={index} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                    </div>
                )}

                <button onClick={toGame}>Iniciar Jogo</button>
            </div>
        </div>
    )
}

export default Home
