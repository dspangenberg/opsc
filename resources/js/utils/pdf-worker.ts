import { pdfjs } from 'react-pdf'

// Use CDN worker instead of local file for better compatibility
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
