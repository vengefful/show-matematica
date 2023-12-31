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
    const [escola, setEscola] =  useState('');
    const disciplinas = {
        'Lima Castro': ['Matematica', 'Geografia'],
        'Orlando Dantas': ['Geografia'],
        'Sabino Ribeiro': ['Geografia']
    };
    const turmasLimaCastro = {
        'Matematica': ['1M02', '1M03', '1I01', '1I02'],
        'Geografia': ['1M02', '1I02'],
    };
    const turmasOrlandoDantas = {
        'Geografia': ['9A', '9B', '8A'],
    };
    const turmasSabinoRibeiro = {
        'Geografia': ['6A', '7A'],
    };
    const escolas = ['Lima Castro', 'Orlando Dantas', 'Sabino Ribeiro'];
    const disciplinasMinistradas = ['Matematica', 'Geografia'];
    const seriesMinistradas = ['6-ano', '7-ano', '8-ano', '9-ano', '1-ano', '2-ano', '3-ano'];

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

    useEffect(() => {
        const escolaSave = localStorage.getItem('escola');
        const disciplinaSave = localStorage.getItem('disciplina');
        const turmaSave = localStorage.getItem('turma');

        if(escolaSave){
            setEscola(escolaSave);
        }
        if(disciplinaSave){
            setDisciplina(disciplinaSave)
        }
        if(turmaSave){
            setTurma(turmaSave);
        }
    })

    const handleEscolherEscola = (e) => {
        const selectedEscola = e.target.value;
        setEscola(selectedEscola);
        setDisciplina('');
        localStorage.setItem('escola', selectedEscola);
    };

    const handleEscolherDisciplina = (e) => {
        const selectedDisciplina = e.target.value;
        setDisciplina(selectedDisciplina);
        setTurma('');
        localStorage.setItem('disciplina', selectedDisciplina);
        if(selectedDisciplina === 'Geografia'){
            document.body.className = 'bgG';
        } else if (selectedDisciplina === 'Matematica'){
            document.body.className = 'bgM';
        } else {
            document.body.className = 'bgP';
        }
    };

    const handleEscolherTurma = (e) => {
        const selectedTurma = e.target.value;
        setTurma(selectedTurma);
        localStorage.setItem('turma', selectedTurma);
    }

    useEffect(()=> {
        document.body.className = 'bgP';
    }, []);

    return (
        <Router>
            <nav className="navbar">
                <li><NavLink to='/' activeclassname="navitem-active">Home</NavLink></li>
                <li><NavLink to='/api/rank' activeclassname="navitem-active">Rank</NavLink></li>
                <li><NavLink to='/api/info' activeclassname="navitem-active">Informações</NavLink></li>
            </nav>
            <Routes>
                <Route exact path='/' element={<Home name={name} setName={setName} data={data} setRodada={setRodada} setNota={setNota} escola={escola} disciplina={disciplina} turma={turma} escolas={escolas} disciplinas={disciplinas} turmasLimaCastro={turmasLimaCastro} turmasOrlandoDantas={turmasOrlandoDantas} turmasSabinoRibeiro={turmasSabinoRibeiro} handleEscolherDisciplina={handleEscolherDisciplina} handleEscolherTurma={handleEscolherTurma} handleEscolherEscola={handleEscolherEscola} />} />
                <Route path='/game' element={<Game name={name} data={data} nota={nota} setNota={setNota} num={num} setNum={setNum} qa={qa} setQa={setQa} rodada={rodada} setRodada={setRodada} pergunta={pergunta} setPergunta={setPergunta} escola={escola} disciplina={disciplina} turma={turma} />}  />
                <Route path='/gameover' element={<GameOver name={name} nota={nota} setNota={setNota} setRodada={setRodada} setNum={setNum} disciplina={disciplina} turma={turma} />} />
                <Route path='/api/rank' element={<Rank name={name} nota={nota} setNota={setNota} setRodada={setRodada} disciplina={disciplina} turma={turma} escola={escola} />} />
                <Route path='/api/info' element={<Info/>} />
                <Route path='/api/newquestion' element={<NewQuestion disciplina={disciplina} disciplinasMinistradas={disciplinasMinistradas} handleEscolherDisciplina={handleEscolherDisciplina} seriesMinistradas={seriesMinistradas} />} />
            </Routes>
        </Router>
    );
}

export default App;
