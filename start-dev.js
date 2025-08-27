const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Shootic Backend in development mode...');
console.log('📁 Working directory:', process.cwd());
console.log('⏰ Started at:', new Date().toLocaleString());

const nodemon = spawn('npx', ['nodemon'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
});

nodemon.on('error', (error) => {
  console.error('❌ Error starting nodemon:', error.message);
  process.exit(1);
});

nodemon.on('close', (code) => {
  console.log(`\n👋 Nodemon process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  nodemon.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  nodemon.kill('SIGTERM');
});
