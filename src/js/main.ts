import Game from './game';

const foreground = document.getElementById('game-foreground') as HTMLCanvasElement;
const background = document.getElementById('game-background') as HTMLCanvasElement;

new Game(foreground, background).start();
