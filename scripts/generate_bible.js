const fs = require('fs');
const path = require('path');

const IGNORE_DIRS = ['node_modules', '.git', 'dist'];
const ROOT_DIR = path.resolve('.');

function walkSync(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function (name) {
        const filePath = path.join(currentDirPath, name);
        const stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory() && !IGNORE_DIRS.includes(name)) {
            walkSync(filePath, callback);
        }
    });
}

const fileCards = [];

walkSync(ROOT_DIR, (filePath, stat) => {
    // skip binaries and images
    if (/\.(png|jpg|webp|zip|mp3|ogg|sqlite|lock)$/i.test(filePath)) return;
    
    let content = '';
    try {
        content = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
        return;
    }

    const relPath = path.relative(ROOT_DIR, filePath);
    
    // Dependencies
    const deps = [];
    const importRegex = /import\s+.*?from\s+['"](.*?)['"]/g;
    const requireRegex = /require\(['"](.*?)['"]\)/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) deps.push(match[1]);
    while ((match = requireRegex.exec(content)) !== null) deps.push(match[1]);

    // Secrets
    const secretKeys = ['password', 'token', 'api_key', 'secret', 'cookie', 'authorization', 'bearer', 'auth'];
    const foundSecrets = [];
    
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        const lowerLine = line.toLowerCase();
        if (secretKeys.some(key => lowerLine.includes(key)) && (line.includes('=') || line.includes(':'))) {
             // Redact
             let redacted = line.replace(/(['"])(.*?)(['"])/g, '$1********$3');
             redacted = redacted.replace(/=[^\s'"]+/g, '=********');
             foundSecrets.push(`Line ${i+1}: ${redacted.trim()}`);
        }
    });

    let purpose = "Не определено. Требует ручного анализа.";
    if (relPath.endsWith('.ts') || relPath.endsWith('.js')) {
        purpose = "Исполняемый код / логика.";
    } else if (relPath.endsWith('.json') || relPath.endsWith('.env') || relPath.endsWith('.yaml')) {
        purpose = "Конфигурационный файл.";
    } else if (relPath.endsWith('.md')) {
        purpose = "Документация.";
    }

    fileCards.push(
        `### Файл: ${relPath}\n` +
        `- **Полный путь**: ${filePath}\n` +
        `- **Размер**: ${stat.size} bytes\n` +
        `- **Назначение**: ${purpose}\n` +
        `- **Зависимости**: ${deps.length > 0 ? deps.join(', ') : 'Нет явных импортов'}\n` +
        `- **Секреты (замаскированы)**:\n  ` +
        (foundSecrets.length > 0 ? foundSecrets.join('\n  ') : 'Не найдено') +
        `\n`
    );
});

const output = `# Project Bible: Groza Bot\n\n` + fileCards.join('\n---\n\n');
fs.writeFileSync(path.join(ROOT_DIR, 'Docs', 'PROJECT_BIBLE.md'), output, 'utf8');
console.log('Project Bible successfully generated with ' + fileCards.length + ' files.');
