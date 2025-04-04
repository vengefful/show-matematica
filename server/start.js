const { exec } = require('child_process');
const os = require('os');

// Função para obter o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Ignora interfaces locais e IPv6
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

console.log('Iniciando servidor...');

// Iniciar o servidor
const server = exec('node server.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Erro ao iniciar o servidor: ${error}`);
        return;
    }
    console.log(`Saída do servidor: ${stdout}`);
    if (stderr) {
        console.error(`Erros do servidor: ${stderr}`);
    }
});

// Mostrar o IP local quando o servidor estiver pronto
server.stdout.on('data', (data) => {
    console.log(data);
    if (data.includes('Servidor rodando')) {
        const ip = getLocalIP();
        console.log('\n==========================================');
        console.log('Para os alunos acessarem o jogo:');
        console.log(`1. Conecte-se à mesma rede WiFi do notebook`);
        console.log(`2. Abra o navegador e acesse: http://${ip}:3000`);
        console.log('\nPara acessar localmente:');
        console.log(`1. Conecte-se à rede WiFi do hotspot`);
        console.log(`2. Abra o navegador e acesse:`);
        console.log(`   - http://localhost:5000`);
        console.log(`   - ou http://${ip}:5000`);
        console.log('\nPara descobrir seu IP local, use o comando ipconfig no Windows');
        console.log('==========================================\n');
    }
});

// Tratar encerramento do servidor
process.on('SIGINT', () => {
    console.log('\nEncerrando servidor...');
    server.kill();
    process.exit();
});

// Tratar erros não capturados
process.on('uncaughtException', (err) => {
    console.error('Erro não capturado:', err);
    server.kill();
    process.exit(1);
});

// Tratar rejeições de promessas não tratadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Promessa rejeitada não tratada:', reason);
    server.kill();
    process.exit(1);
}); 