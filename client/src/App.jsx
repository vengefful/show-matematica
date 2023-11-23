import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Routes, NavLink} from 'react-router-dom';
import api from './Api';
import './App.css';
import Home from './pages/Home';
import Game from './pages/Game';
import GameOver from './pages/GameOver';
import Rank from './pages/Rank';


const App = () => {

    const [data, setData] = useState([]);
    const [name, setName] = useState('');
    const [nota, setNota] = useState(0);
    const [num, setNum] = useState(0);
    const [rodada, setRodada] = useState(1);
    const [qa, setQa] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/api/data');
                setData(response.data);
            } catch(error) {
                console.log('Erro ao buscar os dados', error);
            }
        };

        fetchData();
    }, []);


    return (
        <Router>
            <nav className="navbar">
                <li><NavLink to='/' activeclassname="navitem-active">Home</NavLink></li>
                <li><NavLink to='/api/rank' activeclassname="navitem-active">Rank</NavLink></li>
                <li><NavLink to='/api/info' activeclassname="navitem-active">Informações</NavLink></li>
            </nav>
            <Routes>
                <Route exact path='/' element={<Home name={name} setName={setName} data={data} setRodada={setRodada} setNota={setNota}/>} />
                <Route path='/game' element={<Game name={name} data={data} nota={nota} setNota={setNota} num={num} setNum={setNum} qa={qa} setQa={setQa} rodada={rodada} setRodada={setRodada}/>}  />
                <Route path='/gameover' element={<GameOver name={name} nota={nota} setNota={setNota} setRodada={setRodada} />} />
                <Route path='/api/rank' element={<Rank name={name} nota={nota} setNota={setNota} setRodada={setRodada} />} />
            </Routes>
        </Router>
    );
}

export default App;
