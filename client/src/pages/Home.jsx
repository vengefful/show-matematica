import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home(props) {

    const handleInputChange = (event) => {
        props.setName(event.target.value);
    };

    const navigate = useNavigate();

    const toGame = () => {
        props.setRodada(1);
        props.setNota(0);
        navigate('/game');
    }

    return (
        <div className="home">
            <h1>Show Matemático</h1>
            <div className="form-group">
                <label htmlFor="nome">Digite seu Nome</label>
                <input type="text" name="nome" value={props.name} placeholder="Digite seu Nome" onChange={handleInputChange}/>
                <label htmlFor="nome">Disciplina</label>
                <select onChange={props.handleEscolherDisciplina}>
                    <option value="">Selecione...</option>
                    <option value="Matematica">Matemática</option>
                    <option value="Geografia">Geografia</option>
                </select>
                <label htmlFor="nome">Turma</label>
                <select onChange={props.handleEscolherTurma}>
                    <option value="">Selecione...</option>
                    <option value="6-ano">6º ano</option>
                    <option value="7-ano">7º ano</option>
                    <option value="8-ano">8º ano</option>
                    <option value="9-ano">9º ano</option>
                </select>
                <button onClick={toGame}>Iniciar Jogo</button>
            </div>
        </div>
    )
}

export default Home
