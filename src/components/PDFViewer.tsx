'use client';

interface PDFViewerProps {
    pdfPath: string;
}

export default function PDFViewer({pdfPath}: PDFViewerProps) {
    // Ensure the path starts with a forward slash for the public directory
    const fullPath = pdfPath.startsWith('/') ? pdfPath : `/${pdfPath}`;

    return (
        <object
            data={fullPath}
            type="application/pdf"
            style={{
                width: '100%',
                height: 'calc(100vh - 64px)', // Subtract AppBar height
                border: 'none'
            }}
        >
            <p>Your browser does not support PDFs. Please download the PDF to view it:
                <a href={fullPath}>Download PDF</a>
            </p>
        </object>
    );
}