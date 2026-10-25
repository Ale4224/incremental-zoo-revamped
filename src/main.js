import './style.css';
import { Game } from './game/game.js';
import { mountApp } from './ui/app.js';
import { openHelp } from './ui/dialogs.js';

const game = new Game();
mountApp(document.getElementById('app'), game);

const hadSave = game.load();
game.start();

// Save when the tab is hidden or closed, in addition to the regular autosave.
const flush = () => game.save();
window.addEventListener('pagehide', flush);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flush();
});

if (!hadSave) openHelp({ firstTime: true });

// Handy for debugging in the console.
window.IZ = game;
