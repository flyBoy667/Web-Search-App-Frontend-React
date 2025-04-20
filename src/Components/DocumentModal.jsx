import {useEffect, useState} from "react"

export function DocumentModal({isOpen, onClose, onSave, document, documentTypes}) {
    const [formData, setFormData] = useState({
        doc_id: "",
        doc_name: "",
        doc_type: "",
        doc_content: "",
        doc_format: "pdf",
        doc_file_full_path: "",
        doc_insert_date: "",
        doc_updated_date: "",
    })
    const [file, setFile] = useState(null)
    const [errors, setErrors] = useState({})
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        if (document) {
            setFormData({
                ...document,
            })
        } else {
            // Reset form for new document
            setFormData({
                doc_id: "",
                doc_name: "",
                doc_type: "",
                doc_content: "",
                doc_format: "pdf",
                doc_file_full_path: "",
                doc_insert_date: new Date().toISOString(),
                doc_updated_date: new Date().toISOString(),
            })
        }
        setFile(null)
        setErrors({})
    }, [document, isOpen])

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            setFile(selectedFile)

            // Extract file format
            const format = selectedFile.name.split(".").pop().toLowerCase()
            if (format === "pdf" || format === "docx" || format === "doc") {
                setFormData((prev) => ({
                    ...prev,
                    doc_format: format === "doc" || format === "docx" ? "word" : "pdf",
                }))
            }
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0]
            setFile(droppedFile)

            // Extract file format
            const format = droppedFile.name.split(".").pop().toLowerCase()
            if (format === "pdf" || format === "docx" || format === "doc") {
                setFormData((prev) => ({
                    ...prev,
                    doc_format: format === "doc" || format === "docx" ? "word" : "pdf",
                }))
            }
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.doc_name.trim()) newErrors.doc_name = "Le nom du document est requis"
        if (!formData.doc_type) newErrors.doc_type = "Le type de document est requis"
        if (!formData.doc_content.trim()) newErrors.doc_content = "Le contenu du document est requis"
        if (!document && !file) newErrors.file = "Le fichier est requis"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        // In a real application, you would upload the file here
        // and get the file path from the server response

        // For now, we'll just simulate it
        const documentData = {
            ...formData,
            doc_updated_date: new Date().toISOString(),
        }

        if (!document) {
            // For new documents, set insert date
            documentData.doc_insert_date = new Date().toISOString()
        }

        // If we have a file, we would normally upload it and get the path
        if (file) {
            documentData.doc_file_full_path = `/uploads/${file.name}`
        }

        onSave(documentData)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <div
                    className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"
                    onClick={onClose}
                ></div>

                <div
                    className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-purple-900">
                            {document ? "Modifier le document" : "Ajouter un nouveau document"}
                        </h3>
                        <button
                            type="button"
                            className="rounded-full h-8 w-8 flex items-center justify-center text-purple-400 hover:text-purple-600 hover:bg-purple-100 transition-colors"
                            onClick={onClose}
                        >
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
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 py-4">
                            <div className="space-y-2">
                                <label htmlFor="doc_name" className="block text-sm font-medium text-purple-900">
                                    Nom du document
                                </label>
                                <input
                                    id="doc_name"
                                    name="doc_name"
                                    value={formData.doc_name}
                                    onChange={handleChange}
                                    className={`w-full h-11 px-3 rounded-xl border ${
                                        errors.doc_name ? "border-pink-500" : "border-purple-100"
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm`}
                                    placeholder="Entrez le nom du document"
                                />
                                {errors.doc_name && <p className="text-pink-500 text-xs mt-1">{errors.doc_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="doc_type" className="block text-sm font-medium text-purple-900">
                                    Type de document
                                </label>
                                <select
                                    id="doc_type"
                                    value={formData.doc_type}
                                    onChange={(e) => handleSelectChange("doc_type", e.target.value)}
                                    className={`w-full h-11 px-3 rounded-xl border ${
                                        errors.doc_type ? "border-pink-500" : "border-purple-100"
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm`}
                                >
                                    <option value="">Sélectionner un type</option>
                                    {documentTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.doc_type && <p className="text-pink-500 text-xs mt-1">{errors.doc_type}</p>}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="doc_content" className="block text-sm font-medium text-purple-900">
                                    Contenu du document
                                </label>
                                <textarea
                                    id="doc_content"
                                    name="doc_content"
                                    value={formData.doc_content}
                                    onChange={handleChange}
                                    rows={5}
                                    className={`w-full px-3 py-2 rounded-xl border ${
                                        errors.doc_content ? "border-pink-500" : "border-purple-100"
                                    } focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none shadow-sm`}
                                    placeholder="Entrez le contenu textuel du document"
                                ></textarea>
                                {errors.doc_content &&
                                    <p className="text-pink-500 text-xs mt-1">{errors.doc_content}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-purple-900">Format du document</label>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input
                                            id="pdf"
                                            type="radio"
                                            name="doc_format"
                                            value="pdf"
                                            checked={formData.doc_format === "pdf"}
                                            onChange={() => handleSelectChange("doc_format", "pdf")}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                                        />
                                        <label htmlFor="pdf" className="ml-2 block text-sm text-gray-700">
                                            PDF
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="word"
                                            type="radio"
                                            name="doc_format"
                                            value="word"
                                            checked={formData.doc_format === "word"}
                                            onChange={() => handleSelectChange("doc_format", "word")}
                                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-purple-300"
                                        />
                                        <label htmlFor="word" className="ml-2 block text-sm text-gray-700">
                                            Word
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="file" className="block text-sm font-medium text-purple-900">
                                    Fichier
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                                        isDragging
                                            ? "border-purple-500 bg-purple-50"
                                            : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"
                                    } ${errors.file ? "border-pink-500" : ""}`}
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById("file").click()}
                                >
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 mx-auto text-purple-300 mb-3"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                        <polyline points="17 8 12 3 7 8"/>
                                        <line x1="12" y1="3" x2="12" y2="15"/>
                                    </svg>
                                    <p className="text-sm text-purple-800 mb-1">
                                        <span className="font-medium text-purple-600">Cliquez pour télécharger</span> ou
                                        glissez-déposez
                                    </p>
                                    <p className="text-xs text-purple-500">PDF, DOC ou DOCX (max. 10MB)</p>

                                    {file && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-purple-500"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path
                                                    d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                                                <polyline points="14 2 14 8 20 8"/>
                                            </svg>
                                            <span className="text-purple-800 font-medium">{file.name}</span>
                                            <span
                                                className="ml-2 text-xs px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                                        </div>
                                    )}
                                </div>
                                {errors.file && <p className="text-pink-500 text-xs mt-1">{errors.file}</p>}
                            </div>

                            {document && (
                                <div className="flex items-center gap-4 text-xs text-purple-500 mt-2">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5 mr-1"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span>Créé le: {new Date(document.doc_insert_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5 mr-1"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                                            <line x1="16" y1="2" x2="16" y2="6"/>
                                            <line x1="8" y1="2" x2="8" y2="6"/>
                                            <line x1="3" y1="10" x2="21" y2="10"/>
                                        </svg>
                                        <span>Modifié le: {new Date(document.doc_updated_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-purple-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2.5 text-sm font-medium text-purple-700 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-purple-100/50 active:scale-95"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 active:scale-95"
                            >
                                {document ? "Mettre à jour" : "Ajouter"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
