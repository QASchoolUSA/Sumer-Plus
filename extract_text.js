const fs = require('fs');
const data = JSON.parse(fs.readFileSync('Tax Questionnaire Consulting .json'));
const text = data.Pages.map(p => p.Texts.map(t => {
    try {
        return decodeURIComponent(t.R[0].T);
    } catch (e) {
        return t.R[0].T;
    }
}).join(' ')).join('\n\n');
fs.writeFileSync('extracted_full.txt', text);
