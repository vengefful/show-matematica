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
    const [turmasSelecionadas, setTurmasSelecionadas] = useState([]);
    const fileInputRef = useRef(null);
    const perguntaRef = useRef();
    const [erroEnvio, setErroEnvio] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvError, setCsvError] = useState('');
    const [csvSuccess, setCsvSuccess] = useState('');

    const turmasDisponiveis = [
        { value: 'EMMAT1A', label: 'EMMAT1A' },
        { value: 'EMMAT1B', label: 'EMMAT1B' },
        { value: 'EMMAT1C', label: 'EMMAT1C' },
        { value: 'EMMAT2A', label: 'EMMAT2A' },
        { value: 'EMMAT2B', label: 'EMMAT2B' },
        { value: 'EMMAT2C', label: 'EMMAT2C' },
        { value: 'EMMAT3A', label: 'EMMAT3A' },
        { value: 'EMMAT3B', label: 'EMMAT3B' },
        { value: 'EMMAT3C', label: 'EMMAT3C' }
    ];

    const getPerguntaById = (id) => {
        api.get(`/api/pergunta/${id}`)
        .then(response => {
            setDadosPesquisados(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar pergunta:', error);
        })
    }

    useEffect(() => {
        const carregarPerguntas = async () => {
            try {
                console.log('Carregando lista de perguntas...');
                const response = await fetch('/api/perguntas');
                const data = await response.json();
                
                console.log('Perguntas recebidas:', data);
                
                if (data && data.length > 0) {
                    setPerguntas(data);
                } else {
                    console.log('Nenhuma pergunta encontrada');
                }
            } catch (error) {
                console.error('Erro ao carregar perguntas:', error);
            }
        };

        carregarPerguntas();
    }, []);

    useEffect(() => {
        if (disciplinaPesquisada === ''){
            api.get('/api/perguntas')
            .then(response => {
                setPerguntas(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar perguntas:', error);
            })
        }
        else {
            if (turmaPesquisada === '') {
                api.get(`/api/perguntas/${disciplinaPesquisada}`)
                .then(response => {
                    setPerguntas(response.data.perguntas);
                })
                .catch(error => {
                    console.error('Erro ao buscar perguntas:', error);
                })
            }
            else {
                api.get(`/api/perguntas/${disciplinaPesquisada}/${turmaPesquisada}`)
                .then(response => {
                    setPerguntas(response.data.perguntas);
                })
                .catch(error => {
                    console.error('Erro ao buscar perguntas:', error);
                })
            }
        }
    }, [enviado, disciplinaPesquisada, turmaPesquisada]);

    useEffect(() => {
        if (pesquisa && !isNaN(pesquisa)){
            getPerguntaById(pesquisa);
        }
        else if (pesquisa && pesquisa.trim() !== ''){
            if (disciplinaPesquisada === ''){
                api.get(`/api/search-pergunta?text=${pesquisa}`)
                .then(response => {
                    setDadosPesquisados(response.data);
                })
                .catch(error => {
                    console.error('Erro ao buscar perguntas:', error);
                })
            } else {
                if (turmaPesquisada === ''){
                    api.get(`/api/search-pergunta/${disciplinaPesquisada}?text=${pesquisa}`)
                    .then(response => {
                        setDadosPesquisados(response.data);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar perguntas:', error);
                    })
                } else {
                    api.get(`/api/search-pergunta/${disciplinaPesquisada}/${turmaPesquisada}?text=${pesquisa}`)
                    .then(response => {
                        setDadosPesquisados(response.data);
                    })
                    .catch(error => {
                        console.error('Erro ao buscar perguntas:', error);
                    })
                }
            }
        } else {
            setDadosPesquisados([]);
        }
    }, [pesquisa, disciplinaPesquisada, turmaPesquisada]);

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

    const handleTurmaChange = (e) => {
        const selectedTurma = e.target.value;
        if (selectedTurma && !turmasSelecionadas.includes(selectedTurma)) {
            setTurmasSelecionadas([...turmasSelecionadas, selectedTurma]);
        }
    };

    const removeTurma = (turmaToRemove) => {
        setTurmasSelecionadas(turmasSelecionadas.filter(turma => turma !== turmaToRemove));
    };

    const sendQuestion = async () => {
        try {
            // Validar campos obrigatórios
            if (!disciplina) {
                setErroEnvio(true);
                setCsvError('Por favor, selecione uma disciplina antes de enviar a pergunta');
                return;
            }

            if (!pergunta || !alternativa1 || !alternativa2 || !alternativa3 || !alternativa4 || !resposta || turmasSelecionadas.length === 0) {
                setErroEnvio(true);
                setCsvError('Por favor, preencha todos os campos obrigatórios');
                return;
            }

            setEnviado(true);
            setErroEnvio(false);
            setCsvError('');

            const response = await api.post('/api/addquestion', {
                pergunta,
                alternativa1,
                alternativa2,
                alternativa3,
                alternativa4,
                resposta,
                disciplina,
                turmas: turmasSelecionadas
            });

            // Limpar formulário após sucesso
            setPergunta('');
            setAlternativa1('');
            setAlternativa2('');
            setAlternativa3('');
            setAlternativa4('');
            setResposta(0);
            setDisciplina('');
            setTurmasSelecionadas([]);
            setEditarPerguntaID(-1);

            // Recarregar lista de perguntas
            const perguntasResponse = await api.get('/api/perguntas');
            setPerguntas(perguntasResponse.data);

            setEnviado(false);
        } catch (error) {
            console.error('Erro ao enviar pergunta:', error);
            setErroEnvio(true);
            setEnviado(false);
            if (error.response?.data?.mensagem) {
                setCsvError(error.response.data.mensagem);
            } else if (error.response?.data?.error) {
                setCsvError(error.response.data.error);
            } else {
                setCsvError('Erro ao enviar pergunta');
            }
        }
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

    const handleCsvUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type !== 'text/csv') {
                setCsvError('Por favor, selecione um arquivo CSV válido');
                return;
            }
            setCsvFile(file);
            setCsvError('');
        }
    };

    const processCsv = async () => {
        if (!csvFile) {
            setCsvError('Por favor, selecione um arquivo CSV');
            return;
        }

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            setCsvError('');
            setCsvSuccess('');
            
            const response = await api.post('/api/uploadCSV', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setCsvSuccess(`Questões importadas com sucesso! Total: ${response.data.total}`);
            setCsvFile(null);
            
            // Recarregar lista de perguntas
            const perguntasResponse = await api.get('/api/perguntas');
            setPerguntas(perguntasResponse.data);
        } catch (error) {
            console.error('Erro ao processar arquivo CSV:', error);
            if (error.response?.data?.error) {
                const errorData = error.response.data;
                if (errorData.linha) {
                    setCsvError(`Erro na linha ${errorData.linha}: ${errorData.error}`);
                } else if (errorData.header) {
                    setCsvError(`Erro no cabeçalho: ${errorData.error}\nCabeçalho encontrado: ${errorData.header.join(';')}\nCabeçalho esperado: ${errorData.expected.join(';')}`);
                } else {
                    setCsvError(errorData.error);
                }
            } else {
                setCsvError('Erro ao processar arquivo CSV');
            }
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

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Turmas</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg"
                                onChange={handleTurmaChange}
                                value=""
                            >
                                <option value="">Selecione uma turma</option>
                                {turmasDisponiveis.map((turma, index) => (
                                    <option key={index} value={turma.value}>
                                        {turma.label}
                                    </option>
                                ))}
                            </select>
                            
                            <div className="mt-2 flex flex-wrap gap-2">
                                {turmasSelecionadas.map((turma, index) => (
                                    <div key={index} className="flex items-center bg-blue-100 rounded px-2 py-1">
                                        <span>{turma}</span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeTurma(turma);
                                            }}
                                            className="ml-2 text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Importar Questões via CSV</label>
                            <input 
                                type="file" 
                                accept=".csv" 
                                onChange={handleCsvUpload}
                                className="input-csv"
                            />
                            {csvError && <p className="error-message">{csvError}</p>}
                            {csvSuccess && <p className="success-message">{csvSuccess}</p>}
                            {csvFile && (
                                <button onClick={processCsv} className="button-import">
                                    Importar CSV
                                </button>
                            )}
                            <p className="csv-instructions">
                                Formato do CSV (use ponto e vírgula como separador):<br/>
                                pergunta;alternativa1;alternativa2;alternativa3;alternativa4;resposta;turma<br/>
                                Exemplo:<br/>
                                Qual é 2+2?;3;4;5;6;2;EMMAT1A
                            </p>
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
                                <label>Turma:</label>
                                <select value={turmaPesquisada} onChange={handleEscolherTurmaPesquisada}>
                                    <option value="">Selecione</option>
                                    {turmasDisponiveis.map((turma, index) => (
                                        <option key={index} value={turma.value}>
                                            {turma.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className='lista-items ultima-coluna'>
                            {pesquisa.length === 0 ? (
                                perguntas.map(pergunta => (
                                    <p className={`lista-perguntas-${pergunta.id % 2}`} key={pergunta.id} onClick={handleEditarPergunta}>
                                        {pergunta.id.toString().padStart(5, '0')}: {' '}
                                        {pergunta.pergunta}
                                    </p>
                                ))
                            ) : (
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
