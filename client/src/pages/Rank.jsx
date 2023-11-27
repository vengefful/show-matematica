import React, { useEffect, useState } from 'react';
import './Rank.css';
import api from '../Api';

function Rank(props) {

    const [rankData, setRankData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await api.get(`/api/rank?disciplina=Matematica&turma=9-ano`);
                setRankData(response.data);
            } catch(error){
                console.error('Erro ao buscar dados do CSV:', error);
            }
        };

        fetchData();

    }, []);



    return (
        <div>
            <h2>Rank Lima Castro</h2>
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
                        {rankData.map((data, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{Number(data.Nota).toFixed(1)}</td>
                              <td>{data.Nome}</td>
                              <td>{data.Horário}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Rank;
