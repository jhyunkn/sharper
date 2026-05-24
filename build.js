const fs = require('fs');

fs.mkdirSync('dist', { recursive: true });
let h = fs.readFileSync('index.html', 'utf8');

const readerTuning = String.raw`
/* Specimen card density tuning only */
.reader-head{padding:14px 24px!important;grid-template-columns:38px 1fr 38px!important}
.reader-title{font-size:9px!important;letter-spacing:.20em!important}
.reader-body{padding:30px 30px 118px!important}
.reader h1{font-size:34px!important;line-height:.98!important;margin:10px 0 0!important;letter-spacing:-.01em!important}
.reader .lead{font-size:18px!important;line-height:1.46!important;margin:18px 0 0!important}
.rq{margin:30px 0!important;padding-left:18px!important;border-left-width:1.5px!important}
.rq blockquote{font-size:28px!important;line-height:1.12!important}
.rq .author{margin-top:22px!important;font-size:8px!important;letter-spacing:.14em!important;line-height:1.45!important}
.rq .author:before{width:24px!important}
.reader-section{margin-top:26px!important;padding-top:24px!important}
.reader-section p{font-size:18px!important;line-height:1.46!important;margin:16px 0!important}
.orig-btn{margin-top:16px!important;font-size:8px!important;letter-spacing:.14em!important;padding-bottom:4px!important}
.orig-text{margin-top:14px!important;font-size:20px!important;line-height:1.35!important}
`;

h = h.replace('</style>', readerTuning + '</style>');
fs.writeFileSync('dist/index.html', h);
