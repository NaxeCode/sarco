import { useState, useRef, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";
import "./App.css";

import "./App.css";

function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [targetFormat, setTargetFormat] = useState<string>("");
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [convertedFileUrl, setConvertedFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    };

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    // Available output formats for conversion
    const videoFormats = [
        { value: "mkv", label: "MKV" },
        { value: "avi", label: "AVI" },
        { value: "webm", label: "WebM" },
        { value: "mov", label: "MOV" },
        { value: "flv", label: "FLV" }
    ];

    const imageFormats = [
        { value: "png", label: "PNG" },
        { value: "jpg", label: "JPG" },
        { value: "gif", label: "GIF" },
        { value: "bmp", label: "BMP" },
        { value: "tiff", label: "TIFF" }
    ];

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setConvertedFileUrl(null);
        setError(null);
        setTargetFormat("");
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

        // Mock implementation of conversion
        setTimeout(() => {
            try {
                const fakeBlob = new Blob([`Converted ${selectedFile.name} to ${targetFormat}`], 
                                         { type: `application/${targetFormat}` });
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
        setTargetFormat("");
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getAvailableFormats = () => {
        if (!selectedFile) return [];
        const fileType = selectedFile.type;
        if (fileType.startsWith("video/")) return videoFormats;
        if (fileType.startsWith("image/")) return imageFormats;
        return [];
    };

    return (
        <div className="container">
            <div className="theme-toggle-container">
                <span className="theme-toggle-icon" aria-hidden="true">
                    {theme === "dark" ? <FaMoon /> : <FaSun />}
                </span>
                <label className="theme-toggle-label">
                    <input 
                        type="checkbox" 
                        checked={theme === "dark"} 
                        onChange={toggleTheme} 
                        className="theme-toggle-input"
                    />
                    <span className="theme-toggle-slider"></span>
                </label>
            </div>
            <h1>Media Converter</h1>
            
            <div className="upload-section">
                <h2>Upload a media file</h2>
                <input 
                    type="file" 
                    accept="video/*,image/*" 
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
            
            {selectedFile && (
                <div className="conversion-section">
                    <h2>Convert to format</h2>
                    <select 
                        value={targetFormat} 
                        onChange={handleFormatChange}
                        className="format-select"
                        disabled={isConverting}
                    >
                        <option value="" disabled>Select format</option>
                        {getAvailableFormats().map(format => (
                            <option key={format.value} value={format.value}>
                                {format.label}
                            </option>
                        ))}
                    </select>
                    
                    <button 
                        onClick={handleConversion} 
                        disabled={!targetFormat || isConverting}
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
            )}
            
            {error && <div className="error-message">{error}</div>}
            
            {isConverting && (
                <div className="converting-indicator">
                    <p>Converting your media, please wait...</p>
                    <div className="progress-bar"></div>
                </div>
            )}
            
            {convertedFileUrl && (
                <div className="result-section">
                    <h2>Conversion Complete!</h2>
                    <p>Your file has been converted to {targetFormat} format.</p>
                    <a 
                        href={convertedFileUrl} 
                        download={`converted-file.${targetFormat}`}
                        className="download-link"
                    >
                        Download Converted File
                    </a>
                </div>
            )}
        </div>
    );
}

export default App;