import { useState, useRef } from "react";
import "./App.css";

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState<string>("mkv");
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Available output formats for conversion
    const outputFormats = [
        { value: "mkv", label: "MKV" },
        { value: "avi", label: "AVI" },
        { value: "webm", label: "WebM" },
        { value: "mov", label: "MOV" },
        { value: "flv", label: "FLV" }
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setConvertedFileUrl(null);
        setError(null);
    };

    const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetFormat(event.target.value);
        setConvertedFileUrl(null);
        setError(null);
    };

    const handleConversion = () => {
        if (!selectedFile) {
            setError("Please select a file to convert");
            return;
        }

        setIsConverting(true);
        setError(null);

        // In a real application, you would use a backend API to handle the conversion
        // This is a mock implementation that simulates conversion after a delay
        setTimeout(() => {
            try {
                // In a real implementation, this would be the URL to the converted file
                // For this demo, we're creating a fake object URL
                const fakeBlob = new Blob([`Converted ${selectedFile.name} to ${targetFormat}`], 
                                         { type: `video/${targetFormat}` });
                const url = URL.createObjectURL(fakeBlob);
                
                setConvertedFileUrl(url);
                setIsConverting(false);
            } catch (err) {
                setError("Conversion failed. Please try again.");
                setIsConverting(false);
            }
        }, 2000);
    };

    const resetForm = () => {
        setSelectedFile(null);
        setConvertedFileUrl(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container">
            <h1>Video Converter</h1>
            
            <div className="upload-section">
                <h2>Upload a video</h2>
                <input 
                    type="file" 
                    accept="video/*" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="file-input"
                />
                
                {selectedFile && (
                    <div className="file-info">
                        <p>Selected file: {selectedFile.name}</p>
                        <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                )}
            </div>
            
            <div className="conversion-section">
                <h2>Convert to format</h2>
                <select 
                    value={targetFormat} 
                    onChange={handleFormatChange}
                    className="format-select"
                    disabled={isConverting}
                >
                    {outputFormats.map(format => (
                        <option key={format.value} value={format.value}>
                            {format.label}
                        </option>
                    ))}
                </select>
                
                <button 
                    onClick={handleConversion} 
                    disabled={!selectedFile || isConverting}
                    className="convert-button"
                >
                    {isConverting ? "Converting..." : "Convert"}
                </button>
                
                <button 
                    onClick={resetForm} 
                    disabled={isConverting}
                    className="reset-button"
                >
                    Reset
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {isConverting && (
                <div className="converting-indicator">
                    <p>Converting your video, please wait...</p>
                    <div className="progress-bar"></div>
                </div>
            )}
            
            {convertedFileUrl && (
                <div className="result-section">
                    <h2>Conversion Complete!</h2>
                    <p>Your video has been converted to {targetFormat} format.</p>
                    <a 
                        href={convertedFileUrl} 
                        download={`converted-video.${targetFormat}`}
                        className="download-link"
                    >
                        Download Converted Video
                    </a>
                </div>
            )}
        </div>
    );
}

export default App;