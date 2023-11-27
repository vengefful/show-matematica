import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';
import api from './Api';
import './App.css';
import Home from './pages/Home';
import Game from './pages/Game';
import GameOver from './pages/GameOver';
import Rank from './pages/Rank';
import Info from './pages/Info';
import NewQuestion from './pages/NewQuestion';

const App = () => {

    const [pergunta, setPergunta] = useState({});
    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [nota, setNota] = useState(0);
    const [num, setNum] = useState(0);
    const [rodada, setRodada] = useState(1);
    const [qa, setQa] = useState(false);
    const [disciplina, setDisciplina] = useState('');
    const [turma, setTurma] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/perguntas');
                setData(response.data);
            } catch(error) {
                console.log('Erro ao buscar os dados', error);
            }
        };

        fetchData();
    }, []);

    const handleEscolherDisciplina = (event) => {
        const disciplinaSelecionada = event.target.value;

        switch (disciplinaSelecionada) {
            case 'Matematica':
                setDisciplina('Matematica');
                break;
            case 'Geografia':
                setDisciplina('Geografia');
                break;
            default:
                setDisciplina('');;
                break;
        }
    };

    const handleEscolherTurma = (event) => {
        const turmaSelecionada = event.target.value;

        switch (turmaSelecionada) {
            case '6-ano':
                setTurma('6-ano');
                break;
            case '7-ano':
                setTurma('7-ano');
                break;
            case '8-ano':
                setTurma('8-ano');
                break;
            case '9-ano':
                setTurma('9-ano');
                break;
            default:
                setTurma('');
                break;
        }
    };


    return (
        <Router>
            <nav className="navbar">
                <li><NavLink to='/' activeclassname="navitem-active">Home</NavLink></li>
                <li><NavLink to='/api/rank' activeclassname="navitem-active">Rank</NavLink></li>
                <li><NavLink to='/api/info' activeclassname="navitem-active">Informações</NavLink></li>
            </nav>
            <Routes>
                <Route exact path='/' element={<Home name={name} setName={setName} data={data} setRodada={setRodada} setNota={setNota} handleEscolherDisciplina={handleEscolherDisciplina} handleEscolherTurma={handleEscolherTurma}/>} />
                <Route path='/game' element={<Game name={name} data={data} nota={nota} setNota={setNota} num={num} setNum={setNum} qa={qa} setQa={setQa} rodada={rodada} setRodada={setRodada} pergunta={pergunta} setPergunta={setPergunta} disciplina={disciplina} turma={turma} />}  />
                <Route path='/gameover' element={<GameOver name={name} nota={nota} setNota={setNota} setRodada={setRodada} setNum={setNum} disciplina={disciplina} turma={turma} />} />
                <Route path='/api/rank' element={<Rank name={name} nota={nota} setNota={setNota} setRodada={setRodada} disciplina={disciplina} turma={turma} />} />
                <Route path='/api/info' element={<Info/>} />
                <Route path='/api/newquestion' element={<NewQuestion disciplina={disciplina} />} />
            </Routes>
        </Router>
    );
}

export default App;
