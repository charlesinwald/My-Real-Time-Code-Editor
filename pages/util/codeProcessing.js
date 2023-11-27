import hljs from 'highlight.js';

// import javascript from 'highlight.js/lib/languages/javascript';
// import css from 'highlight.js/lib/languages/css'
// import html from 'highlight.js/lib/languages/html'


export const highlightSyntax = (code, language) => {
  switch (language) {
    case 'javascript':
        return hljs.highlight(code, { language: 'javascript' }).value;
    case 'css':
        return hljs.highlight(code, { language: 'css' }).value;
    case 'html':
        return hljs.highlight(code, { language: 'html' }).value;
    default:
        return hljs.highlight(code, { language: 'javascript' }).value;
  }
}


export const checkErrors = (code, language) => {

};