const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

const readerTuning = String.raw`
/* Specimen card density tuning only */
.reader-head{padding:14px 24px!important;grid-template-columns:38px 1fr 38px!important}
.reader-title{font-size:9px!important;letter-spacing:.20em!important}
.reader-body{padding:30px 30px 118px!important}
.reader h1{font-size:34px!important;line-height:.98!important;margin:10px 0 0!important;letter-spacing:-.01em!important}
.reader h1.compact-title{font-size:29px!important;line-height:.96!important;max-width:300px!important}
.row-title.compact-title{font-size:27px!important;line-height:1!important}
.reader .lead{font-size:18px!important;line-height:1.46!important;margin:18px 0 0!important}
.rq{margin:30px 0!important;padding-left:18px!important;border-left-width:1.5px!important}
.rq blockquote{font-size:27px!important;line-height:1.12!important}
.rq .author{margin-top:22px!important;font-size:8px!important;letter-spacing:.14em!important;line-height:1.45!important}
.rq .author:before{width:24px!important}
.context-block{border-top:1px solid var(--soft);padding-top:18px;margin-top:22px;font-family:var(--serif);font-style:italic;font-size:17px;line-height:1.45;color:var(--warm)}
.reader-section{margin-top:26px!important;padding-top:24px!important}
.reader-section p{font-size:18px!important;line-height:1.46!important;margin:16px 0!important}
.orig-btn{margin-top:16px!important;font-size:8px!important;letter-spacing:.14em!important;padding-bottom:4px!important}
.orig-text{margin-top:14px!important;font-size:20px!important;line-height:1.35!important}
`;

h = h.replace("q:'Order and simplification are the first steps toward mastery.',author:'Thomas Mann · The Magic Mountain · 1924',read:['Your manager needs fewer unknowns and clearer tradeoffs.','Most upward friction is a UX problem in disguise. Give your manager the decision, the constraint, and the risk.']", "q:'Hans Castorp enters the sanatorium for a short visit and remains there far longer than planned.',author:'Thomas Mann · The Magic Mountain · 1924',context:'Historical context: Thomas Mann published The Magic Mountain in 1924; the novel follows the young engineer Hans Castorp in a high-altitude sanatorium in Davos, Switzerland, in the years before World War I, where his planned short visit becomes a prolonged stay shaped by illness, time, and ideological debate.',read:['Your manager needs fewer unknowns and clearer tradeoffs.','Most upward friction is a UX problem in disguise. Give your manager the decision, the constraint, and the risk.']");
h = h.replace(/<div class=\"row-title\">\$\{p\.t\}<\/div>/g, '<div class="row-title ${p.id===\'manage-up\'?\'compact-title\':\'\'}">${p.t}</div>');
h = h.replace(/<h1>\$\{p\.t\}<\/h1><p class=\"lead\">/g, '<h1 class="${id===\'manage-up\'?\'compact-title\':\'\'}">${p.t}</h1><p class="lead">');
h = h.replace(/<\/div><div class=\"reader-section\"><div class=\"kicker ink\">Dive deeper<\/div>\$\{p\.read\.map/g, '</div>${p.context?`<div class="context-block">${p.context}</div>`:""}<div class="reader-section"><div class="kicker ink">Dive deeper</div>${p.read.map');
h = h.replace('</style>', readerTuning + '</style>');
fs.writeFileSync('dist/index.html', h);
