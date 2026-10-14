// Moderne ESM-Features
// Start: node index.js

// #region 2: JSON importieren mit Import Attributes
import config from './config.json' with { type: 'json' };
// #endregion

// #region 1: import.meta statt __dirname und __filename
console.log('Datei:       ', import.meta.filename);
console.log('Verzeichnis: ', import.meta.dirname);
console.log('URL:         ', import.meta.url);
console.log('Hauptmodul?  ', import.meta.main);
console.log('Auflösen:    ', import.meta.resolve('./math.js'));
// #endregion

// #region 2: JSON importieren mit Import Attributes
console.log('Config:', config);
// #endregion

// #region 3: Top-level await und dynamischer Import
const { add } = await import('./math.js');
console.log('2 + 3 =', add(2, 3));

// Optionale Abhängigkeiten nur bei Bedarf laden
const { styleText } = config.colors
  ? await import('node:util')
  : { styleText: (_, text) => text };
console.log(styleText('green', 'dynamisch geladen'));
// #endregion

// #region 4: process.getBuiltinModule – Built-ins ohne import (z. B. in CJS/ESM-Libs)
const os = process.getBuiltinModule('node:os');
console.log('CPUs:', os.availableParallelism());
// #endregion
