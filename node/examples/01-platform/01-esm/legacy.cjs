// CommonJS lädt ES-Module – synchron, ohne Flag (Node 20.19+ / 22.12+)
// Start: node legacy.cjs

// #region 5: require(esm)
const math = require('./math.js');

console.log('Namespace:', math);
console.log('Named Export:', math.multiply(6, 7));
console.log('Default Export:', math.default);

// Funktioniert nicht, wenn das Modul top-level await nutzt:
try {
  require('./index.js');
} catch (err) {
  console.log('Fehler:', err.code);
}
// #endregion
