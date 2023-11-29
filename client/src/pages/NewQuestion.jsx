import React, { useState, useEffect, useRef } from 'react';
import './NewQuestion.css';
import api from '../Api';

function NewQuestion(props) {

    const [enviado, setEnviado] = useState(false);
    const [pesquisa, setPesquisa] = useState('');
    const [dadosPesquisados, setDadosPesquisados] = useState([]);
    const [pergunta, setPergunta] = useState('');
    const [alternativa1, setAlternativa1] = useState('');
    const [alternativa2, setAlternativa2] = useState('');
    const [alternativa3, setAlternativa3] = useState('');
    const [alternativa4, setAlternativa4] = useState('');
    const [resposta, setResposta] = useState(0);
    const [disciplina, setDisciplina] = useState('');
    const [turma, setTurma] = useState('');
    const [perguntas, setPerguntas] = useState([]);
    const [imagem, setImagem] = useState(null);

    useEffect(() => {
        api.get('/api/perguntas')
        .then(response => {
            setPerguntas(response.data);
        })
        .catch(error => {
            console.log('Erro ao buscar perguntas: ', error);
        })
    }, [enviado]);

    useEffect(() => {
        api.get(`/api/search-pergunta?text=${pesquisa}`)
        .then(response => {
            setDadosPesquisados(response.data);
        })
        .catch(error => {
            console.log('Erro ao buscar perguntas: ', error);
        })
    }, [pesquisa]);

    const textareaRef = useRef(null);

    const handlePerguntaChange = (event) => {
        setPergunta(event.target.value);
    };

    const handleAlternativa1Change = (event) => {
        setAlternativa1(event.target.value);
    };

    const handleAlternativa2Change = (event) => {
        setAlternativa2(event.target.value);
    };

    const handleAlternativa3Change = (event) => {
        setAlternativa3(event.target.value);
    };

    const handleAlternativa4Change = (event) => {
        setAlternativa4(event.target.value);
    };

    const handlePesquisaChange = (event) => {
        setPesquisa(event.target.value);
    };


    useEffect(() => {
        if(textareaRef.current){
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [pergunta, alternativa1, alternativa2, alternativa3, alternativa4]);

    const handleEscolherResposta = (event) => {
        const respostaSelecionada = event.target.value;

        switch (respostaSelecionada) {
            case 'Resposta 1':
                setResposta(1);
                break;
            case 'Resposta 2':
                setResposta(2);
                break;
            case 'Resposta 3':
                setResposta(3);
                break;
            case 'Resposta 4':
                setResposta(4);
                break;
            default:
                setResposta(0);;
                break;
        }
    };

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
            case '1-ano':
                setTurma('1-ano');
                break;
            case '2-ano':
                setTurma('2-ano');
                break;
            case '3-ano':
                setTurma('3-ano');
                break;
            default:
                setTurma('');
                break;
        }
    };

    const handleFileChange = (event) => {
        setImagem(event.target.files[0]);
    };

    const sendQuestion = () => {

        const formData = new FormData();
        formData.append('imagem', imagem)

        setEnviado(true);

        try {
            const response = api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Resposta do servidor:', response.data);
        } catch(error) {
            console.log('Erro ao enviar imagem', error);
        }

        try {
            const response = api.post('/api/addquestion', {
                pergunta: pergunta,
                alternativa1: alternativa1,
                alternativa2: alternativa2,
                alternativa3: alternativa3,
                alternativa4: alternativa4,
                resposta: resposta,
                disciplina: disciplina,
                turma: turma
            });

            console.log(response.data);
        } catch(error) {
            console.log('Erro ao enviar os dados', error);
        }

        setTimeout(() => {
            setEnviado(false);
            setPergunta('');
            setAlternativa1('');
            setAlternativa2('');
            setAlternativa3('');
            setAlternativa4('');
        }, 2000);

    };


    return (
        <div className="new-question">
            <div className='container-item'>
                <div className='item'>
                    <h1>Adicionar Nova Questão</h1>
                    <div className="form-group">
                        <label htmlFor="nome">Digite o Problema</label>
                        <textarea className="pergunta" type="text" name="nome" value={pergunta} onChange={handlePerguntaChange} row="40" cols={100} placeholder="Digite a pergunta aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Selecione Imagem</label>
                        <input className="input-imagem" type="file" onChange={handleFileChange} />
                        <label htmlFor="nome">Digite a Pergunta 1</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa1} onChange={handleAlternativa1Change} row="20" cols={100} placeholder="Digite a alternativa 1 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Digite a Pergunta 2</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa2} onChange={handleAlternativa2Change} row="20" cols={100} placeholder="Digite a alternativa 2 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Digite a Pergunta 3</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa3} onChange={handleAlternativa3Change} row="20" cols={100} placeholder="Digite a alternativa 3 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Digite a Pergunta 4</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa4} onChange={handleAlternativa4Change} row="20" cols={100} placeholder="Digite a alternativa 4 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Resposta</label>
                        <select onChange={handleEscolherResposta}>
                            <option value="">Selecione...</option>
                            <option value="Resposta 1">Resposta 1</option>
                            <option value="Resposta 2">Resposta 2</option>
                            <option value="Resposta 3">Resposta 3</option>
                            <option value="Resposta 4">Resposta 4</option>
                        </select>
                        <label htmlFor="nome">Disciplina</label>
                        <select onChange={handleEscolherDisciplina}>
                            <option value="">Selecione...</option>
                            <option value="Matematica">Matemática</option>
                            <option value="Geografia">Geografia</option>
                        </select>
                        <label htmlFor="nome">Turma</label>
                        <select onChange={handleEscolherTurma}>
                            <option value="">Selecione...</option>
                            <option value="6-ano">6º ano</option>
                            <option value="7-ano">7º ano</option>
                            <option value="8-ano">8º ano</option>
                            <option value="9-ano">9º ano</option>
                            <option value="1-ano">1º ano médio</option>
                            <option value="2-ano">2º ano médio</option>
                            <option value="3-ano">3º ano médio</option>
                        </select>

                        <button onClick={sendQuestion}>{!enviado ? 'Adicionar Pergunta' : 'Pergunta Enviada'}</button>
                    </div>
                </div>
                <div className='item'>
                    <h1>Atualizar e Pesquisar</h1>
                    <div className='form-group-b'>
                            <div className='lista-items'>
                            <label htmlFor="nome">Pesquise</label>
                                <textarea className="pergunta-pesquisar" type="text" name="nome" value={pesquisa} onChange={handlePesquisaChange} row="40" cols={100} placeholder="Digite a pergunta a pesquisar..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                            </div>
                    </div>
                </div>
                <div className='item'>
                    <h1>Lista de questões ({perguntas.length})</h1>
                    <div className='form-group-b'>
                            <div className='lista-items'>
                                {pesquisa.length === 0 ? (perguntas.map(pergunta => (
                                    <p className={`lista-perguntas-${pergunta.id % 2}`} key={pergunta.id}>
                                        {pergunta.id.toString().padStart(4, '0')} - {' '}
                                        {pergunta.disciplina} - {' '}
                                        {pergunta.turma} {': '}
                                        {pergunta.pergunta}
                                        {/* Renderize outros detalhes das perguntas conforme necessário */}
                                    </p>
                                ))) :(
                                    dadosPesquisados.map(pergunta => (
                                        <p className={`lista-perguntas-${pergunta.id % 2}`} key={pergunta.id}>
                                            {pergunta.id.toString().padStart(4, '0')} - {' '}
                                            {pergunta.disciplina} - {' '}
                                            {pergunta.turma} {': '}
                                            {pergunta.pergunta}
                                        </p>
                                    ))
                                )}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewQuestion
