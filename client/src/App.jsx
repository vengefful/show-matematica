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
        'Lima Castro': ['Matemática', 'Geografia'],
        'Orlando Dantas': ['Geografia'],
        'Sabino Ribeiro': ['Geografia']
    };
    const turmasLimaCastro = {
        'Matemática': ['1M02', '1M03', '1I01', '1I02'],
        'Geografia': ['1M02', '1I02'],
    };
    const turmasOrlandoDantas = {
        'Geografia': ['9A', '8A'],
    };
    const turmasSabinoRibeiro = {
        'Geografia': ['6A', '7A'],
    };
    const escolas = ['Lima Castro', 'Orlando Dantas', 'Sabino Ribeiro'];

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
    };

    const handleEscolherTurma = (e) => {
        const selectedTurma = e.target.value;
        setTurma(selectedTurma);
        localStorage.setItem('turma', selectedTurma);
    }

    // const handleEscolherDisciplina = (event) => {
    //     const disciplinaSelecionada = event.target.value;
    //
    //     switch (disciplinaSelecionada) {
    //         case 'Matematica':
    //             setDisciplina('Matematica');
    //             break;
    //         case 'Geografia':
    //             setDisciplina('Geografia');
    //             break;
    //         default:
    //             setDisciplina('');;
    //             break;
    //     }
    // };
    //
    // const handleEscolherTurma = (event) => {
    //     const turmaSelecionada = event.target.value;
    //
    //     switch (turmaSelecionada) {
    //         case '6-ano':
    //             setTurma('6-ano');
    //             break;
    //         case '7-ano':
    //             setTurma('7-ano');
    //             break;
    //         case '8-ano':
    //             setTurma('8-ano');
    //             break;
    //         case '9-ano':
    //             setTurma('9-ano');
    //             break;
    //         default:
    //             setTurma('');
    //             break;
    //     }
    // };


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
                <Route path='/api/newquestion' element={<NewQuestion disciplina={disciplina} />} />
            </Routes>
        </Router>
    );
}

export default App;
