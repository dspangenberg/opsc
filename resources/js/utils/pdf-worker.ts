import { pdfjs } from 'react-pdf';

// Use direct import for the worker script
// @ts-ignore
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.js';

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
