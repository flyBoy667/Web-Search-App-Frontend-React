import {useEffect, useState} from "react"
import TypeModal from "../../Components/TypeModal.jsx";
import {DocumentModal} from "../../Components/DocumentModal.jsx";
import {DocumentTable} from "../../Components/DocumentTable.jsx";
import {api} from "../../Services/api.js";

export default function HomePage() {
    const [searchText, setSearchText] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const [documentTypes, setDocumentTypes] = useState([])
    const [documents, setDocuments] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false)
    const [isTypeModalOpen, setIsTypeModalOpen] = useState(false)
    const [editingDocument, setEditingDocument] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)

    useEffect(() => {
        // Fetch document types from your backend
        fetchDocumentTypes()
        // Fetch initial documents
        fetchDocuments()
    }, [])

    const fetchDocumentTypes = async () => {
        try {
            const response = await api.get("/api/document-type")
            const data = await response.data
            setDocumentTypes(data)
        } catch (error) {
            console.error("Error fetching document types:", error)
        }
    }

    const fetchDocuments = async () => {
        try {
            const response = await api.get("/api/document")
            const data = await response.data
            setDocuments(data)
            setSearchResults(data)
        } catch (error) {
            console.error("Error fetching documents:", error)
        }
    }

    const handleSearch = async () => {
        setLoading(true)
        try {
            const queryParams = new URLSearchParams()
            if (searchText) queryParams.append("query", searchText)
            if (selectedType) queryParams.append("type", selectedType)

            const response = await fetch(`/api/search?${queryParams.toString()}`)
            const data = await response.json()
            setSearchResults(data)
        } catch (error) {
            console.error("Error searching documents:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddDocument = () => {
        setEditingDocument(null)
        setIsDocumentModalOpen(true)
    }

    const handleEditDocument = (document) => {
        setEditingDocument(document)
        setIsDocumentModalOpen(true)
    }

    const handleDeleteDocument = async (docId) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce document ?")) {
            try {
                await api.delete(`/api/document/${docId}`)
                fetchDocuments()
            } catch (error) {
                console.error("Error deleting document:", error)
            }
        }
    }

    const handleDocumentSave = async (documentData) => {
        try {
            await api.post('/api/document', {
                body: JSON.stringify(documentData),
            })

            // Refresh documents after save
            fetchDocuments()
            setIsDocumentModalOpen(false)
        } catch (error) {
            console.error("Error saving document:", error)
            alert("error lors de l'ajout")
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <header className="mb-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-purple-900 tracking-tight">Kankou Moussa</h1>
                            <p className="text-purple-600 mt-1">Système de gestion documentaire</p>
                        </div>
                        <button
                            onClick={handleAddDocument}
                            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 active:scale-95"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 5v14M5 12h14"/>
                            </svg>
                            Nouveau document
                        </button>
                    </div>
                </header>

                {/* Search Section */}
                <div
                    className="relative rounded-2xl border border-purple-100 bg-white p-6 shadow-sm transition-all duration-200 mb-8 animate-fade-in hover:shadow-md hover:shadow-purple-100/50">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.3-4.3"/>
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher dans les documents..."
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                className="w-full pl-10 h-12 rounded-xl border border-purple-100 bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all px-3 shadow-sm"
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <div className="w-full md:w-64 relative">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                                    className="w-full flex items-center justify-between h-12 rounded-xl border border-purple-100 bg-white px-3 text-gray-900 hover:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm"
                                >
                  <span className="block truncate">
                    {selectedType
                        ? documentTypes.find((type) => type.id === selectedType)?.name || "Tous les types"
                        : "Tous les types"}
                  </span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-4 w-4 text-purple-400 transition-transform ${isTypeDropdownOpen ? "rotate-180" : ""}`}
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m6 9 6 6 6-6"/>
                                    </svg>
                                </button>
                                {isTypeDropdownOpen && (
                                    <div
                                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div
                                            className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-purple-50"
                                            onClick={() => {
                                                setSelectedType("")
                                                setIsTypeDropdownOpen(false)
                                            }}
                                        >
                                            Tous les types
                                        </div>
                                        {documentTypes.map((type) => (
                                            <div
                                                key={type.id}
                                                className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900 hover:bg-purple-50"
                                                onClick={() => {
                                                    setSelectedType(type.id)
                                                    setIsTypeDropdownOpen(false)
                                                }}
                                            >
                                                {type.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className={`h-12 px-6 rounded-xl font-medium text-white transition-all duration-200 shadow-md shadow-purple-200/50 ${
                                loading
                                    ? "bg-purple-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-300/50 active:scale-95"
                            }`}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Recherche...
                                </div>
                            ) : (
                                "Rechercher"
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-purple-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            <span
                                className="text-sm text-purple-600">{searchResults.length} document(s) trouvé(s)</span>
                        </div>
                        <button
                            onClick={() => setIsTypeModalOpen(true)}
                            className="inline-flex items-center justify-center rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-purple-100/50 active:scale-95"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-2 text-purple-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                            </svg>
                            Gérer les types
                        </button>
                    </div>
                </div>

                <div className="animate-slide-up">
                    <DocumentTable
                        documents={searchResults}
                        searchTerm={searchText}
                        onEdit={handleEditDocument}
                        onDelete={handleDeleteDocument}
                    />
                </div>
            </div>

            <DocumentModal
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                onSave={handleDocumentSave}
                document={editingDocument}
                documentTypes={documentTypes}
            />

            <TypeModal
                isOpen={isTypeModalOpen}
                onClose={() => setIsTypeModalOpen(false)}
                documentTypes={documentTypes}
            />
        </div>
    )
}
