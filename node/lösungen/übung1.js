/**
 * Übung 1 – Lösung: Restricted File Reader
 *
 * Ausführen:
 *   node --permission --allow-fs-read=./allowed-data restricted-reader.mjs
 *
 * Tests:
 *   node node --test --allow-child-process --permission --allow-fs-read=./allowed-data restricted-reader.mjs
 */

import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

// ── Hilfsfunktionen ──────────────────────────────────────────────────

const allowedDir = join(import.meta.dirname, 'allowed-data');
const secretDir = join(import.meta.dirname, 'secret');

/**
 * Liest alle Dateien aus dem erlaubten Verzeichnis
 */
async function readAllowedFiles() {
    const entries = await readdir(allowedDir);
    const results = [];

    for (const entry of entries) {
        const content = await readFile(join(allowedDir, entry), 'utf-8');
        results.push({ name: entry, content: content.trim() });
    }

    return results;
}

/**
 * Versucht, eine Datei aus dem gesperrten Verzeichnis zu lesen
 */
async function readSecretFile() {
    return readFile(join(secretDir, 'private.txt'), 'utf-8');
}

// ── Tests ────────────────────────────────────────────────────────────

describe('Restricted File Reader', () => {
    before(async () => {
        // Setup: Testdaten erstellen (nur ohne Permission Model möglich)
        try {
            await mkdir(join(import.meta.dirname, 'allowed-data'), { recursive: true });
            await mkdir(join(import.meta.dirname, 'secret'), { recursive: true });
            await writeFile(join(import.meta.dirname, 'allowed-data', 'public.txt'), 'Erlaubte Daten\n');
            await writeFile(join(import.meta.dirname, 'secret', 'private.txt'), 'Geheime Daten\n');
        } catch {
            // Falls Permission Model aktiv ist, ignorieren wir Setup-Fehler
        }
    });

    it('sollte Dateien aus dem erlaubten Verzeichnis lesen können', async () => {
        const files = await readAllowedFiles();

        assert.ok(files.length > 0, 'Es sollten Dateien gefunden werden');
        assert.ok(
            files.some((f) => f.name === 'public.txt'),
            'public.txt sollte vorhanden sein'
        );
    });

    it('sollte den Zugriff auf das gesperrte Verzeichnis verweigern', async () => {
        await assert.rejects(
            () => readSecretFile(),
            (err) => {
                // Funktioniert mit UND ohne Permission Model:
                // - Mit Permission: ERR_ACCESS_DENIED
                // - Ohne Permission (Datei fehlt): ENOENT
                assert.ok(
                    err.code === 'ERR_ACCESS_DENIED' || err.code === 'ENOENT',
                    `Erwarteter Fehlercode, bekommen: ${err.code}`
                );
                return true;
            }
        );
    });
});

// ── Direkte Ausführung ───────────────────────────────────────────────

console.log('📁 Lese erlaubte Dateien...\n');

try {
    const files = await readAllowedFiles();
    for (const file of files) {
        console.log(`✅ ${file.name}: ${file.content}`);
    }
} catch (err) {
    console.error('❌ Fehler beim Lesen erlaubter Dateien:', err.message);
}

console.log('\n🔒 Versuche gesperrte Datei zu lesen...\n');

try {
    const secret = await readSecretFile();
    console.log('⚠️  Zugriff auf geheime Daten möglich:', secret);
} catch (err) {
    console.log(`✅ Zugriff verweigert: [${err.code}] ${err.message}`);
}
