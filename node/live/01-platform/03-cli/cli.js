// Kleine CLI ganz ohne Dependencies
// Start: node --env-file=.env cli.js --name JSDays -v
//        node --run start       (Skript aus package.json, schneller als npm run)
//        node --run dev         (Watch-Mode)

import { parseArgs, styleText } from 'node:util';
import { join } from 'node:path';

// TODO 1: Umgebungsvariablen aus .env – ohne dotenv

// TODO 2: Argumente parsen mit util.parseArgs

// TODO 3: Farbige Ausgabe mit util.styleText (respektiert NO_COLOR)
