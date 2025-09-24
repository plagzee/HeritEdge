"use client";
import { useState, useEffect, useCallback } from "react";
import { FaBars, FaTimes, FaLanguage, FaArchive, FaPlus, FaBookOpen, FaUpload, FaSearch, FaHistory, FaCog, FaUser, FaHome, FaCopy, FaDownload } from "react-icons/fa";
import { MdTranslate, MdUploadFile } from "react-icons/md";
import Navbar from "../components/Navbar/page";
import { useSession } from "../hooks/useSession";
import LoadingSpinner from "../components/Loading/page";
import { useRouter } from "next/navigation";
import { useTranslation } from "../hooks/useTranslation";

export default function DashboardPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('translator');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    // Use the translation hook
    const { translateImage, isLoading, error, result, reset } = useTranslation();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const { user, loading } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    const handleImageSelect = useCallback((event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file size (10MB limit)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                alert('File size too large. Please select an image smaller than 10MB.');
                return;
            }

            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Invalid file type. Please select a valid image file (JPEG, PNG, WebP, GIF).');
                return;
            }

            // Read file as binary and store both file and binary data
            const reader = new FileReader();
            reader.onload = (e) => {
                const binaryData = e.target.result;
                setSelectedImage({
                    file: file,
                    binaryData: binaryData,
                    name: file.name,
                    type: file.type,
                    size: file.size
                });
            };
            reader.readAsArrayBuffer(file);

            // Create preview URL for display
            const previewReader = new FileReader();
            previewReader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            previewReader.readAsDataURL(file);

            // Reset previous results
            reset();
        }
    }, [reset]);

    const handleTranslate = useCallback(async () => {
        if (!selectedImage) {
            alert('Please select an image first');
            return;
        }

        await translateImage(selectedImage);
    }, [selectedImage, translateImage]);

    const clearSelection = useCallback(() => {
        setSelectedImage(null);
        setImagePreview(null);
        reset();
        // Reset file input
        const fileInput = document.getElementById('image-upload');
        if (fileInput) {
            fileInput.value = '';
        }
    }, [reset]);

    const copyToClipboard = useCallback(async (text, fieldName) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldName);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    }, []);

    const downloadResults = useCallback(() => {
        if (!result) return;
        
        const dataStr = JSON.stringify(result, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `language_analysis_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }, [result]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800">
            <Navbar />

            <div className="flex">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-stone-800 to-stone-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-stone-700/50`}>
                    <div className="flex items-center justify-between p-6 border-b border-stone-700/50">
                        <h2 className="text-xl font-bold text-amber-200">Dashboard</h2>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-amber-200 hover:text-amber-100 transition-colors"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="mt-6 px-4 space-y-2">
                        {/* Translator Section */}
                        <div className="mb-6">
                            <h3 className="px-4 py-2 text-sm font-semibold text-stone-400 uppercase tracking-wide">
                                Translator
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('translator')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'translator' ? 'bg-amber-600/20 text-amber-200 border-l-4 border-amber-400' : 'text-stone-300 hover:text-amber-200 hover:bg-stone-700/50'}`}
                                >
                                    <FaLanguage className="w-5 h-5 mr-3" />
                                    Image Translator
                                </button>
                            </div>
                        </div>

                        {/* Archive Section */}
                        <div className="mb-6">
                            <h3 className="px-4 py-2 text-sm font-semibold text-stone-400 uppercase tracking-wide">
                                Heritage Archive
                            </h3>
                            <div className="space-y-1">
                                <button
                                    onClick={() => router.push('/archive')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'archive' ? 'bg-amber-600/20 text-amber-200 border-l-4 border-amber-400' : 'text-stone-300 hover:text-amber-200 hover:bg-stone-700/50'}`}
                                >
                                    <FaArchive className="w-5 h-5 mr-3" />
                                    Browse Archive
                                </button>
                                <button
                                    onClick={() => setActiveTab('upload')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'upload' ? 'bg-amber-600/20 text-amber-200 border-l-4 border-amber-400' : 'text-stone-300 hover:text-amber-200 hover:bg-stone-700/50'}`}
                                >
                                    <FaUpload className="w-5 h-5 mr-3" />
                                    Upload Manuscript
                                </button>
                                <button
                                    onClick={() => setActiveTab('my-uploads')}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${activeTab === 'my-uploads' ? 'bg-amber-600/20 text-amber-200 border-l-4 border-amber-400' : 'text-stone-300 hover:text-amber-200 hover:bg-stone-700/50'}`}
                                >
                                    <FaBookOpen className="w-5 h-5 mr-3" />
                                    My Contributions
                                </button>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    {/* Mobile Header */}
                    <div className="lg:hidden bg-stone-800/50 border-b border-stone-700/50 px-4 py-3">
                        <button
                            onClick={toggleSidebar}
                            className="text-amber-200 hover:text-amber-100 transition-colors"
                        >
                            <FaBars className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 lg:p-8">
                        {/* Translator Tab */}
                        {activeTab === 'translator' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h1 className="text-3xl font-bold text-amber-200">Regional Language Analyzer</h1>
                                    <div className="flex space-x-3">
                                        {result && (
                                            <button
                                                onClick={downloadResults}
                                                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                                            >
                                                <FaDownload className="w-4 h-4" />
                                                <span>Download Results</span>
                                            </button>
                                        )}
                                        {selectedImage && (
                                            <button
                                                onClick={clearSelection}
                                                className="bg-stone-600 hover:bg-stone-500 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Clear Selection
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-6 border border-stone-700/50">
                                    {/* Image Upload Section */}
                                    <div className="mb-6">
                                        <label className="block text-amber-200 font-medium mb-4">Upload Image to Analyze</label>
                                        <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${selectedImage ? 'border-amber-500 bg-amber-50/5' : 'border-stone-600 hover:border-amber-500'}`}>
                                            <MdUploadFile className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-amber-200 mb-2">Choose an image with Regional Indian text</h3>
                                            <p className="text-stone-300 mb-4">Supports PNG, JPG, JPEG, WebP, GIF formats (Max 10MB)</p>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                id="image-upload"
                                                onChange={handleImageSelect}
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-lg transition-colors cursor-pointer inline-block"
                                            >
                                                Browse Images
                                            </label>
                                            {selectedImage && (
                                                <div className="mt-4 text-amber-200">
                                                    <p className="text-sm">Selected: {selectedImage.name}</p>
                                                    <p className="text-xs text-stone-400">
                                                        Size: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB | Type: {selectedImage.type}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Section */}
                                    {imagePreview && (
                                        <div className="mb-6 p-4 bg-stone-700/30 rounded-lg">
                                            <h3 className="text-amber-200 font-medium mb-4">Selected Image Preview</h3>
                                            <div className="flex justify-center">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="max-w-full max-h-64 object-contain rounded-lg border border-stone-600"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Analyze Button */}
                                    <button
                                        className={`w-full px-6 py-4 rounded-lg transition-colors flex items-center justify-center text-lg font-medium ${
                                            selectedImage && !isLoading 
                                                ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                                                : 'bg-stone-600 text-stone-400 cursor-not-allowed'
                                        }`}
                                        onClick={handleTranslate}
                                        disabled={!selectedImage || isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                                Analyzing Image...
                                            </>
                                        ) : (
                                            <>
                                                <MdTranslate className="w-6 h-6 mr-3" />
                                                Analyze Northeast Indian Languages
                                            </>
                                        )}
                                    </button>

                                    {/* Error Display */}
                                    {error && (
                                        <div className="mt-6 p-4 bg-red-900/20 border border-red-700/50 rounded-lg">
                                            <h3 className="text-red-400 font-medium mb-2">Analysis Error</h3>
                                            <p className="text-red-300">{error}</p>
                                        </div>
                                    )}

                                    {/* Analysis Result Section */}
                                    {result && (
                                        <div className="mt-6 space-y-6">
                                            {/* English Translation Section - Featured */}
                                            {result.english_translation && result.english_translation !== "none" && (
                                                <div className="p-6 bg-gradient-to-r from-emerald-900/20 to-teal-900/20 border border-emerald-600/30 rounded-xl">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-2xl font-bold text-emerald-200 flex items-center">
                                                            <MdTranslate className="w-6 h-6 mr-3" />
                                                            English Translation
                                                        </h3>
                                                        <button
                                                            onClick={() => copyToClipboard(result.english_translation, 'translation')}
                                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
                                                        >
                                                            <FaCopy className="w-4 h-4" />
                                                            <span>{copiedField === 'translation' ? 'Copied!' : 'Copy'}</span>
                                                        </button>
                                                    </div>
                                                    <div className="bg-stone-800/50 p-4 rounded-lg">
                                                        <p className="text-emerald-100 text-lg leading-relaxed whitespace-pre-wrap">
                                                            {result.english_translation}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Language Analysis Results */}
                                            <div className="p-6 bg-stone-700/30 rounded-xl">
                                                <h3 className="text-2xl font-bold text-amber-200 mb-6 flex items-center">
                                                    <FaLanguage className="w-6 h-6 mr-3" />
                                                    Language Analysis Results
                                                </h3>
                                                
                                                {/* Primary Language */}
                                                <div className="mb-6 p-4 bg-amber-600/10 border border-amber-600/30 rounded-lg">
                                                    <h4 className="text-amber-200 font-semibold mb-2">Primary Language</h4>
                                                    <p className="text-amber-100 text-lg font-medium">{result.languages?.primary_language || 'Unknown'}</p>
                                                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                        <div className="bg-stone-800/50 p-3 rounded">
                                                            <span className="text-stone-400">Script:</span>
                                                            <p className="text-amber-100 font-medium">{result.script || 'Unknown'}</p>
                                                        </div>
                                                        <div className="bg-stone-800/50 p-3 rounded">
                                                            <span className="text-stone-400">Confidence:</span>
                                                            <p className="text-amber-100 font-medium">{(result.confidence * 100).toFixed(1)}%</p>
                                                        </div>
                                                        <div className="bg-stone-800/50 p-3 rounded">
                                                            <span className="text-stone-400">Direction:</span>
                                                            <p className="text-amber-100 font-medium">{result.text_direction === 'ltr' ? 'Left-to-Right' : 'Right-to-Left'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detected Languages */}
                                                {result.languages?.detected_languages && result.languages.detected_languages.length > 0 && (
                                                    <div className="mb-6">
                                                        <h4 className="text-amber-200 font-semibold mb-4 text-lg">Detected Languages Details</h4>
                                                        <div className="space-y-4">
                                                            {result.languages.detected_languages.map((lang, index) => (
                                                                <div key={index} className="p-5 bg-stone-800/50 border border-stone-600/50 rounded-lg hover:bg-stone-800/70 transition-colors">
                                                                    <div className="flex justify-between items-start mb-3">
                                                                        <h5 className="text-xl text-amber-100 font-semibold">{lang.name}</h5>
                                                                        <div className="text-right">
                                                                            <div className="text-sm text-stone-400">Confidence</div>
                                                                            <div className="text-lg font-bold text-green-400">{(lang.confidence * 100).toFixed(1)}%</div>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                                                                        <div className="bg-stone-700/50 p-3 rounded">
                                                                            <span className="text-stone-400">Script:</span>
                                                                            <p className="text-stone-200 font-medium">{lang.script}</p>
                                                                        </div>
                                                                        <div className="bg-stone-700/50 p-3 rounded">
                                                                            <span className="text-stone-400">Text Percentage:</span>
                                                                            <p className="text-stone-200 font-medium">{lang.percentage}</p>
                                                                        </div>
                                                                        <div className="bg-stone-700/50 p-3 rounded">
                                                                            <span className="text-stone-400">Language Family:</span>
                                                                            <p className="text-stone-200 font-medium">{lang.linguistic_family}</p>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Additional Info */}
                                                                    {lang.additional_info && (
                                                                        <div className="mt-4 pt-4 border-t border-stone-600">
                                                                            {lang.additional_info.history && (
                                                                                <div className="mb-4">
                                                                                    <h6 className="text-amber-200 text-sm font-semibold mb-2 flex items-center">
                                                                                        <FaHistory className="w-4 h-4 mr-2" />
                                                                                        Historical Background
                                                                                    </h6>
                                                                                    <p className="text-stone-300 text-sm leading-relaxed bg-stone-700/30 p-3 rounded">{lang.additional_info.history}</p>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {lang.additional_info.cultural_significance && (
                                                                                <div className="mb-4">
                                                                                    <h6 className="text-amber-200 text-sm font-semibold mb-2 flex items-center">
                                                                                        <FaBookOpen className="w-4 h-4 mr-2" />
                                                                                        Cultural Significance
                                                                                    </h6>
                                                                                    <p className="text-stone-300 text-sm leading-relaxed bg-stone-700/30 p-3 rounded">{lang.additional_info.cultural_significance}</p>
                                                                                </div>
                                                                            )}
                                                                            
                                                                            {lang.additional_info.resources && lang.additional_info.resources.length > 0 && (
                                                                                <div>
                                                                                    <h6 className="text-amber-200 text-sm font-semibold mb-2 flex items-center">
                                                                                        <FaSearch className="w-4 h-4 mr-2" />
                                                                                        Additional Resources
                                                                                    </h6>
                                                                                    <div className="bg-stone-700/30 p-3 rounded space-y-2">
                                                                                        {lang.additional_info.resources.map((resource, idx) => (
                                                                                            <a
                                                                                                key={idx}
                                                                                                href={resource}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                                className="text-amber-400 hover:text-amber-300 text-sm underline block transition-colors"
                                                                                            >
                                                                                                🔗 {resource}
                                                                                            </a>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Analysis Notes */}
                                                {result.notes && (
                                                    <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
                                                        <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                                                            <FaCog className="w-4 h-4 mr-2" />
                                                            Analysis Notes
                                                        </h4>
                                                        <p className="text-blue-200 text-sm leading-relaxed">{result.notes}</p>
                                                    </div>
                                                )}

                                                {/* Additional Information */}
                                                {result.additional_info && result.additional_info !== result.notes && (
                                                    <div className="mt-4 p-4 bg-purple-900/20 border border-purple-700/50 rounded-lg">
                                                        <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                                                            <FaPlus className="w-4 h-4 mr-2" />
                                                            Additional Information
                                                        </h4>
                                                        <p className="text-purple-200 text-sm leading-relaxed">{result.additional_info}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Other tabs placeholder */}
                        {activeTab !== 'translator' && (
                            <div className="text-center py-16">
                                <h2 className="text-2xl font-bold text-amber-200 mb-4">
                                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')} Section
                                </h2>
                                <p className="text-stone-300">This section is coming soon...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}
        </div>
    );
}