const { spawn } = require('child_process');
const path = require('path');
const os = require('os');

// Função para obter o IP local
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Iniciar o servidor
const server = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit'
});

// Iniciar o cliente
const client = spawn('npm', ['start'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit'
});

// Tratar encerramento
process.on('SIGINT', () => {
    server.kill();
    client.kill();
    process.exit();
});

// Mostrar mensagem de ajuda
const localIP = getLocalIP();
console.log('\n=== Quiz Escolar ===');
console.log('Para acessar o quiz:');
console.log(`1. No seu computador: http://localhost:3000`);
console.log(`2. Nos computadores dos alunos: http://${localIP}:3000`);
console.log('\nPara descobrir seu IP local:');
console.log('Windows: ipconfig');
console.log('Linux/Mac: ifconfig');
console.log('\nPressione Ctrl+C para encerrar\n'); 