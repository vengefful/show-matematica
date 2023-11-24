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
                <button onClick={toGame}>Iniciar Jogo</button>
            </div>
        </div>
    )
}

export default Home
