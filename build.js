// build.js
import { execSync } from 'child_process';

console.log('Building frontend for production...');
execSync('vite build', { stdio: 'inherit' });
console.log('Build completed!');