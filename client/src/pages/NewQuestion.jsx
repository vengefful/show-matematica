import React, { useState, useEffect, useRef } from 'react';
import './NewQuestion.css';
import api from '../Api';
import Question from '../Components/Question';

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
    const [turmaPesquisada, setTurmaPesquisada] = useState('');
    const [perguntas, setPerguntas] = useState([]);
    const [imagem, setImagem] = useState(null);
    const [imageName, setImageName] = useState('');
    const [newNameImg, setNewNameImg] = useState('');
    const [disciplinaPesquisada, setDisciplinaPesquisa] = useState('');
    const [editarPerguntaID, setEditarPerguntaID] = useState(-1);
    const fileInputRef = useRef(null);
    const perguntaRef = useRef();
    const [erroEnvio, setErroEnvio] = useState(false);
    const [file, setFile] = useState(null);

    const getPerguntaById = (id) => {
        api.get(`/api/pergunta/${id}`)
        .then(response => {
            setDadosPesquisados(response.data);
        })
        .catch(error => {

        })
    }

    useEffect(() => {

        if (disciplinaPesquisada === ''){
            api.get('/api/perguntas')
            .then(response => {
                setPerguntas(response.data);
            })
            .catch(error => {

            })
        }
        else {
            if (turmaPesquisada === '') {
                api.get(`/api/perguntas/${disciplinaPesquisada}`)
                .then(response => {
                    setPerguntas(response.data.perguntas);
                })
                .catch(error => {

                })
            }
            else {
                api.get(`/api/perguntas/${disciplinaPesquisada}/${turmaPesquisada}`)
                .then(response => {
                    setPerguntas(response.data.perguntas);
                })
                .catch(error => {

                })
            }
        }
    }, [enviado, disciplinaPesquisada, turmaPesquisada]);

    useEffect(() => {
        if (pesquisa && !isNaN(pesquisa)){
            getPerguntaById(pesquisa);
        }
        else{
            if (disciplinaPesquisada === ''){
                api.get(`/api/search-pergunta?text=${pesquisa}`)
                .then(response => {
                    setDadosPesquisados(response.data);
                })
                .catch(error => {

                })
            } else {
                if (turmaPesquisada === ''){
                    api.get(`/api/search-pergunta/${disciplinaPesquisada}?text=${pesquisa}`)
                    .then(response => {
                        setDadosPesquisados(response.data);
                    })
                    .catch(error => {

                    })

                } else{
                    api.get(`/api/search-pergunta/${disciplinaPesquisada}/${turmaPesquisada}?text=${pesquisa}`)
                    .then(response => {
                        setDadosPesquisados(response.data);
                    })
                    .catch(error => {

                    })
                }
            }
        }
    }, [pesquisa]);

    const textareaRef = useRef(null);

    const handleEditarPergunta = (event) => {
        const id = Number(event.target.textContent.slice(0,5));
        getPerguntaById(id);
        setEditarPerguntaID(id);
        setPergunta(dadosPesquisados[0]?.pergunta);
        setAlternativa1(dadosPesquisados[0]?.alternativa1);
        setAlternativa2(dadosPesquisados[0]?.alternativa2);
        setAlternativa3(dadosPesquisados[0]?.alternativa3);
        setAlternativa4(dadosPesquisados[0]?.alternativa4);
        setResposta(dadosPesquisados[0]?.resposta);
        setDisciplina(dadosPesquisados[0]?.disciplina);
        setTurma(dadosPesquisados[0]?.turma);
    }

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

    const handleEscolherDisciplinaPesquisa = (event) => {
        const disciplinaSelecionada = event.target.value;

        switch (disciplinaSelecionada) {
            case 'Matematica':
                setDisciplinaPesquisa('Matematica');
                break;
            case 'Geografia':
                setDisciplinaPesquisa('Geografia');
                break;
            default:
                setDisciplinaPesquisa('');
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

    const handleEscolherTurmaPesquisada = (event) => {
        const turmaSelecionada = event.target.value;

        switch (turmaSelecionada) {
            case '6-ano':
                setTurmaPesquisada('6-ano');
                break;
            case '7-ano':
                setTurmaPesquisada('7-ano');
                break;
            case '8-ano':
                setTurmaPesquisada('8-ano');
                break;
            case '9-ano':
                setTurmaPesquisada('9-ano');
                break;
            case '1-ano':
                setTurmaPesquisada('1-ano');
                break;
            case '2-ano':
                setTurmaPesquisada('2-ano');
                break;
            case '3-ano':
                setTurmaPesquisada('3-ano');
                break;
            default:
                setTurmaPesquisada('');
                break;
        }
    };

    useEffect(() => {
        if(imagem){
            sendImage();
            // setImageName(imagem.name);
            const addText = `\n<img ${newNameImg}${imagem.name.slice(imagem.name.lastIndexOf('.'))}>\n`;
            setPergunta(prevPergunta => prevPergunta + addText);
        }
    }, [imagem]);

    useEffect(() => {
        const getID = async () => {

            try {
                const response = await api.get('/api/ultimoID');
                setNewNameImg(response.data.ultimoID);
                return response.data.ultimoID;
            } catch(error) {

            }
        };

        if (editarPerguntaID === -1){
            getID();
        } else{
            setNewNameImg(editarPerguntaID);
        }

    }, [enviado]);

    const sendImage = async () => {
        const formData = new FormData();
        formData.append('imagem', imagem)

        try {
            const response = await api.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // const data = await response.data;
            setImageName(response.data.imageName);
        } catch(error) {

        }
    };

    const handleFileChange = (event) => {
        setImagem(event.target.files[0]);
    };


    const sendQuestion = () => {

        setEnviado(true);

        if(editarPerguntaID === -1){
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

                setTimeout(() => {
                    setErroEnvio(false);
                    setEnviado(false);
                    setPergunta('');
                    setAlternativa1('');
                    setAlternativa2('');
                    setAlternativa3('');
                    setAlternativa4('');
                    setEditarPerguntaID(-1);
                    if(fileInputRef.current){
                        fileInputRef.current.value = '';
                    }
                }, 2000);

            } catch(error) {

            }
        } else{
            try{
                const response = api.put(`/api/editar-pergunta/${editarPerguntaID}`, {
                    pergunta: pergunta,
                    alternativa1: alternativa1,
                    alternativa2: alternativa2,
                    alternativa3: alternativa3,
                    alternativa4: alternativa4,
                    resposta: resposta,
                    disciplina: disciplina,
                    turma: turma
                });
                setTimeout(() => {
                    setErroEnvio(false);
                    setEnviado(false);
                    setPergunta('');
                    setAlternativa1('');
                    setAlternativa2('');
                    setAlternativa3('');
                    setAlternativa4('');
                    setEditarPerguntaID(-1);
                    if(fileInputRef.current){
                        fileInputRef.current.value = '';
                    }
                }, 2000);

            } catch(erorr){

            }
        };
    };

    const enviarNovamente = () => {
        setErroEnvio(false);
        sendQuestion();
    }

    const handleScroll = (event) => {
        if(perguntaRef) {
            const { deltaY } = event;

            perguntaRef.current.scrollTop += deltaY;
            event.preventDefault();
        }
    }

    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            await api.post('/api/uploadCSV', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } catch(error){

        }
    };

    return (
        <div className="new-question">
            <div className='container-item'>
                <div className='item'>
                    <h1>{editarPerguntaID === -1 ? "Adicionar Nova Questão" : "Editar Questão"}</h1>
                    <div className="form-group">
                        <label htmlFor="nome">Digite o Problema</label>
                        <textarea className="pergunta" type="text" name="nome" ref={perguntaRef} value={pergunta} onChange={handlePerguntaChange} row="40" cols={100} placeholder="Digite a pergunta aqui..." style={{ resize: 'none', overflowY: 'auto'}} onWheel={handleScroll}/>
                        <label htmlFor="nome">Selecione Imagem</label>
                        <input className="input-imagem" type="file" ref={fileInputRef} onChange={handleFileChange} />
                        <label htmlFor="nome">Digite a Pergunta 1</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa1} onChange={handleAlternativa1Change} row="20" cols={100} placeholder="Digite a alternativa 1 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Digite a Pergunta 2</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa2} onChange={handleAlternativa2Change} row="20" cols={100} placeholder="Digite a alternativa 2 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Digite a Pergunta 3</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa3} onChange={handleAlternativa3Change} row="20" cols={100} placeholder="Digite a alternativa 3 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <label htmlFor="nome">Digite a Pergunta 4</label>
                        <textarea className="alternativa" type="text" name="nome" value={alternativa4} onChange={handleAlternativa4Change} row="20" cols={100} placeholder="Digite a alternativa 4 aqui..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                        <div className="container-selecao">
                            <label htmlFor="nome">Resp</label>
                            <select value={`Resposta ${resposta}`} onChange={handleEscolherResposta}>
                                <option value="">Selecione...</option>
                                <option value="Resposta 1">Resposta 1</option>
                                <option value="Resposta 2">Resposta 2</option>
                                <option value="Resposta 3">Resposta 3</option>
                                <option value="Resposta 4">Resposta 4</option>
                            </select>
                            <label htmlFor="nome">Disc</label>
                            <select value={disciplina} onChange={handleEscolherDisciplina}>
                                <option value="">Selecione...</option>
                                <option value="Matematica">Matemática</option>
                                <option value="Geografia">Geografia</option>
                            </select>
                            <label htmlFor="nome">Tur</label>
                            <select value={turma} onChange={handleEscolherTurma}>
                                <option value="">Selecione...</option>
                                <option value="6-ano">6º ano</option>
                                <option value="7-ano">7º ano</option>
                                <option value="8-ano">8º ano</option>
                                <option value="9-ano">9º ano</option>
                                <option value="1-ano">1º ano médio</option>
                                <option value="2-ano">2º ano médio</option>
                                <option value="3-ano">3º ano médio</option>
                            </select>
                        </div>

                        <button onClick={sendQuestion}>{!enviado ? (editarPerguntaID === -1 ? 'Adicionar Pergunta' : 'Editar Pergunta') : 'Pergunta Enviada'}</button>
                    </div>
                </div>
                <div className='item'>
                    <h1>Atualizar e Pesquisar</h1>
                    <div className='form-group-b'>
                            <div className='lista-items'>
                            <label htmlFor="nome">Pesquise</label>
                                <textarea className="pergunta-pesquisar" type="text" name="nome" value={pesquisa} onChange={handlePesquisaChange} row="40" cols={100} placeholder="Digite a pergunta a pesquisar..." style={{ resize: 'none', overflowY: 'hidden'}}/>
                            </div>
                            <div>
                            <label htmlFor="nome">Upload CSV</label>
                                <form onSubmit={handleSubmit}>
                                    <input type="file" onChange={handleFileUpload} />
                                    <button type="submit">Enviar</button>
                                </form>
                            </div>
                    </div>
                    <div className='form-group-b'>
                            <h3>Questão</h3>
                            <Question pergunta={pergunta} imageName={imageName}/>
                    </div>
                </div>
                <div className='item'>
                    <h1>Lista de questões ({dadosPesquisados && pesquisa.length > 0 ? dadosPesquisados.length : perguntas.length})</h1>
                    <div className='form-group-b'>
                            <div className="items-escolha">
                                <label>Disciplina:</label>
                                <select value={disciplinaPesquisada} onChange={handleEscolherDisciplinaPesquisa}>
                                    <option value="">Selecione</option>
                                    {props.disciplinasMinistradas?.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {disciplinaPesquisada && (
                                <div className="items-escolha">
                                    <label>Série:</label>
                                    <select value={turmaPesquisada} onChange={handleEscolherTurmaPesquisada}>
                                        <option value="">Selecione</option>
                                        {props.seriesMinistradas.map((item, index) => (
                                            <option key={index} value={item}>
                                                {`${item.charAt(0)} ano`}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            )}

                            <div className='lista-items ultima-coluna' >
                                {pesquisa.length === 0 ? (perguntas.map(pergunta => (
                                    <p className={`lista-perguntas-${pergunta.id % 2}`} key={pergunta.id} onClick={handleEditarPergunta}>
                                        {pergunta.id.toString().padStart(5, '0')}: {' '}
                                        {pergunta.pergunta}
                                    </p>
                                ))) :(
                                    dadosPesquisados.map(pergunta => (
                                        <p className={`lista-perguntas-${pergunta.id % 2}`} key={pergunta.id} onClick={handleEditarPergunta}>
                                            {pergunta.id.toString().padStart(5, '0')}: {' '}
                                            {pergunta.pergunta}
                                        </p>
                                    ))
                                )}
                            </div>
                    </div>
                </div>
            </div>
            <div>
              {erroEnvio ? (
                <div>
                  <p>Ocorreu um erro ao enviar a requisição. Deseja tentar novamente?</p>
                  <button onClick={enviarNovamente}>Tentar Novamente</button>
                </div>
              ) : ''}
            </div>
        </div>
    )
}

export default NewQuestion
