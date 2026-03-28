const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.jsx') || file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
let matchedFiles = [];

for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    let modified = content;
    
    // Replace typical React currency uses
    modified = modified.replace(/>\$\{/g, '>₹{');
    modified = modified.replace(/>\$/g, '>₹');
    // For spaces before
    modified = modified.replace(/>\s\$\{/g, '> ₹{');
    modified = modified.replace(/>\s\$/g, '> ₹');

    // Replace "$XXX" strings
    modified = modified.replace(/"\$"/g, '"₹"');
    modified = modified.replace(/'\$'/g, '\'₹\'');

    // Replace USD syntax e.g. ($)
    modified = modified.replace(/\(\$\)/g, '(₹)');

    // Replace strings like `$${price}`
    modified = modified.replace(/`\$\$\{/g, '`₹${');

    // In JSX strings like `<span className="...">$` where we have text nodes starting with $ 
    // Handled by `>` above. What if it's `{'$'}`?
    modified = modified.replace(/\{'\$'\}/g, "{'₹'}");
    modified = modified.replace(/\{"\$"\}/g, '{"₹"}');

    if (modified !== content) {
        fs.writeFileSync(file, modified);
        matchedFiles.push(file);
    }
}
console.log('Modified files:', matchedFiles.join(', '));
