// Kleine CLI ganz ohne Dependencies
// Start: node --env-file=.env cli.js --name JSDays -v
//        node --run start       (Skript aus package.json, schneller als npm run)
//        node --run dev         (Watch-Mode)

import { parseArgs, styleText } from 'node:util';
import { join } from 'node:path';

// #region 1: Umgebungsvariablen aus .env – ohne dotenv
// Fallback, falls ohne --env-file gestartet
if (!process.env.GREETING) {
  process.loadEnvFile(join(import.meta.dirname, '.env'));
}
// #endregion

// #region 2: Argumente parsen mit util.parseArgs
const { values, positionals } = parseArgs({
  options: {
    name: { type: 'string', short: 'n', default: 'Welt' },
    verbose: { type: 'boolean', short: 'v', default: false },
  },
  allowPositionals: true,
});
// #endregion

// #region 3: Farbige Ausgabe mit util.styleText (respektiert NO_COLOR)
console.log(styleText(['bold', 'green'], `${process.env.GREETING}, ${values.name}!`));

if (values.verbose) {
  console.log(styleText('dim', JSON.stringify({ values, positionals, port: process.env.PORT })));
}
// #endregion
