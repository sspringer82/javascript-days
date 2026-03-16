# Übung 1: Restricted File Reader

## Aufgabe

Erstelle ein Skript `restricted-reader.mjs`, das:

1. **Nur Lesezugriff** auf das Verzeichnis `./allowed-data/` hat
2. Alle Dateien in diesem Verzeichnis auflistet und deren Inhalt ausgibt
3. **Versucht**, auf ein anderes Verzeichnis (`./secret/`) zuzugreifen – dies sollte fehlschlagen

### Anforderungen

- Nutze ausschließlich ESM-Syntax (`import`/`export`)
- Nutze `node:fs/promises` für Dateioperationen
- Schreibe **mindestens 2 Tests** mit `node:test` und `node:assert`
- Starte das Skript mit dem **Permission Model**

### Dateien erstellen

```bash
mkdir allowed-data secret
echo "Erlaubte Daten" > allowed-data/public.txt
echo "Geheime Daten" > secret/private.txt
```

### Ausführen

```bash
# Mit eingeschränkten Rechten starten
node --permission --allow-fs-read=./allowed-data restricted-reader.mjs
```

### Erwartetes Verhalten

- ✅ Lesen von `./allowed-data/public.txt` funktioniert
- ❌ Lesen von `./secret/private.txt` wirft `ERR_ACCESS_DENIED`

### Bonusaufgabe

Schreibe einen Test, der überprüft, dass der `ERR_ACCESS_DENIED`-Fehler korrekt geworfen wird.

## Lösung

→ Siehe `loesung/restricted-reader.mjs`
