import {useState} from "react"
import {EditDocumentModal} from "./EditDocumentModal.jsx";

const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))

    return parts.map((part, i) =>
        part.toLowerCase() === searchTerm.toLowerCase() ? (
            <mark key={i} className="bg-yellow-100 text-yellow-900 px-1 rounded-md">
                {part}
            </mark>
        ) : (
            part
        ),
    )
}

const extractContext = (content, searchTerm, contextLength = 150) => {
    if (!searchTerm || !content) return content.substring(0, contextLength) + "..."

    const lowerContent = content.toLowerCase()
    const lowerSearchTerm = searchTerm.toLowerCase()
    const index = lowerContent.indexOf(lowerSearchTerm)

    if (index === -1) return content.substring(0, contextLength) + "..."

    const start = Math.max(0, index - contextLength / 2)
    const end = Math.min(content.length, index + searchTerm.length + contextLength / 2)

    let excerpt = content.substring(start, end)

    if (start > 0) excerpt = "..." + excerpt
    if (end < content.length) excerpt = excerpt + "..."

    return excerpt
}

const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

export function DocumentTable({documents, searchTerm, onEdit, onDelete, documentTypes}) {
    const [tooltipVisible, setTooltipVisible] = useState({id: null, action: null})
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingDocument, setEditingDocument] = useState(null)

    const handleEditClick = (doc) => {
        setEditingDocument(doc);
        setShowEditModal(true);
    };

    if (!documents || documents.length === 0) {
        return (
            <div className="empty-state">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-purple-200 mb-4 animate-bounce-slow"
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
                <h3 className="text-xl font-medium text-purple-900 mb-2">Aucun document trouvé</h3>
                <p className="text-purple-600 max-w-md">
                    Essayez de modifier vos critères de recherche ou ajoutez de nouveaux documents.
                </p>
            </div>
        )
    }

    return (
        <div
            className="rounded-2xl overflow-hidden border border-purple-100 bg-white shadow-sm hover:shadow-md hover:shadow-purple-100/50 transition-all duration-200">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-purple-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                            Document
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
                            Aperçu du contenu
                        </th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-purple-700 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-100 bg-white">
                    {documents.map((doc) => (
                        <tr key={doc.doc_id} className="hover:bg-purple-50/50 transition-colors">
                            <td className="px-6 py-5 whitespace-nowrap">
                                <div className="flex flex-col space-y-1.5">
                                    <div className="font-medium text-gray-900 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0"
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
                                        <span className="truncate max-w-[200px]">{doc.doc_name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                      <span
                          className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                        {doc.doc_type}
                      </span>
                                        <div className="flex items-center text-purple-500">
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
                                                <circle cx="12" cy="12" r="10"/>
                                                <polyline points="12 6 12 12 16 14"/>
                                            </svg>
                                            {formatDate(doc.doc_updated_date)}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-5">
                                <div className="text-sm text-gray-700 line-clamp-2">
                                    {highlightText(extractContext(doc.doc_content, searchTerm), searchTerm)}
                                </div>
                            </td>
                            <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <div className="relative">
                                        <a
                                            href={`/api/documents/${doc.doc_id}/download`}
                                            download
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-purple-600 hover:bg-purple-100 hover:text-purple-700 focus:outline-none transition-colors"
                                            onMouseEnter={() => setTooltipVisible({id: doc.doc_id, action: "download"})}
                                            onMouseLeave={() => setTooltipVisible({id: null, action: null})}
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
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="7 10 12 15 17 10"/>
                                                <line x1="12" y1="15" x2="12" y2="3"/>
                                            </svg>
                                        </a>
                                        {tooltipVisible.id === doc.doc_id && tooltipVisible.action === "download" && (
                                            <div
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10 animate-fade-in">
                                                Télécharger
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => handleEditClick(doc)}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-amber-500 hover:bg-amber-50 hover:text-amber-600 focus:outline-none transition-colors"
                                            onMouseEnter={() => setTooltipVisible({id: doc.doc_id, action: "edit"})}
                                            onMouseLeave={() => setTooltipVisible({id: null, action: null})}
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
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                            </svg>
                                        </button>
                                        {tooltipVisible.id === doc.doc_id && tooltipVisible.action === "edit" && (
                                            <div
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10 animate-fade-in">
                                                Modifier
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <button
                                            onClick={() => onDelete(doc.doc_id)}
                                            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-pink-500 hover:bg-pink-50 hover:text-pink-600 focus:outline-none transition-colors"
                                            onMouseEnter={() => setTooltipVisible({id: doc.doc_id, action: "delete"})}
                                            onMouseLeave={() => setTooltipVisible({id: null, action: null})}
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
                                                <polyline points="3 6 5 6 21 6"/>
                                                <path
                                                    d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                <line x1="10" y1="11" x2="10" y2="17"/>
                                                <line x1="14" y1="11" x2="14" y2="17"/>
                                            </svg>
                                        </button>
                                        {tooltipVisible.id === doc.doc_id && tooltipVisible.action === "delete" && (
                                            <div
                                                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap z-10 animate-fade-in">
                                                Supprimer
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <EditDocumentModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                documentToEdit={editingDocument}
                documentTypes={documentTypes}
                onDocumentUpdated={(updatedDoc) => {
                    onEdit(updatedDoc);
                    setShowEditModal(false);
                }}
            />
        </div>
    )
}