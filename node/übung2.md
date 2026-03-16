# Übung 2: CSV Transform-Stream

## Aufgabe

Implementiere einen **Transform-Stream**, der eine CSV-Datei zeilenweise verarbeitet und transformiert.

### Anforderungen

1. Lies die Datei `input.csv` als Stream ein
2. Erstelle einen **Transform-Stream**, der:
   - Die Header-Zeile unverändert durchlässt
   - Den Preis (Spalte 3) um 10% erhöht
   - Eine neue Spalte `discounted` hinzufügt (`true` wenn Originalpreis > 20)
3. Schreibe das Ergebnis in `output.csv`
4. Nutze `stream.pipeline()` für die Verknüpfung

### Erwartete Eingabe (`input.csv`)

```csv
id,title,price,author
1,JavaScript: The Good Parts,18.50,Douglas Crockford
2,Node.js Design Patterns,35.99,Mario Casciaro
3,Clean Code,27.45,Robert C. Martin
```

### Erwartete Ausgabe (`output.csv`)

```csv
id,title,price,author,discounted
1,JavaScript: The Good Parts,20.35,Douglas Crockford,false
2,Node.js Design Patterns,39.59,Mario Casciaro,true
3,Clean Code,30.20,Robert C. Martin,true
```

### Tipps

- Nutze `new Transform({ transform(chunk, encoding, callback) { ... } })`
- Achte darauf, dass Chunks **mehrere Zeilen** enthalten können
- Verwende `flush()` für Aufräumarbeiten am Ende

### Bonusaufgabe

Füge einen **AbortController** hinzu, der die Pipeline nach 2 Sekunden abbricht.

## Lösung

→ Siehe `loesung/csv-transform.mjs`
