import {useEffect, useState} from "react"
import {api} from "../Services/api.js";

export default function TypeModal({isOpen, onClose, documentTypes}) {
    const [types, setTypes] = useState([])
    const [newType, setNewType] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        if (documentTypes) {
            setTypes([...documentTypes])
        }
    }, [documentTypes, isOpen])
    

    const handleDeleteType = (id) => {
        setTypes(types.filter((type) => type.id !== id))
    }

    const handleSubmit = async () => {
        try {
            if (!newType.trim()) {
                setError("Le nom du type est requis")
                return
            }

            // Check if type already exists
            if (types.some((type) => type.name.toLowerCase() === newType.toLowerCase())) {
                setError("Ce type existe déjà")
                return
            }

            setTypes([...types, {id: `temp-${Date.now()}`, name: newType}])
            setNewType("")
            setError("")
            const response = await api.post('/api/document-type', {
                    name: newType
                }
            )
        } catch (err) {
            console.log(err)
            alert("Une erreur est survenue")
        }
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
                    className="w-full max-w-[500px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-purple-900">Gérer les types de documents</h3>
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

                    <div className="py-4">
                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="text"
                                placeholder="Nouveau type de document"
                                value={newType}
                                onChange={(e) => setNewType(e.target.value)}
                                className={`flex-1 h-11 px-3 rounded-xl border ${
                                    error ? "border-pink-500" : "border-purple-100"
                                } focus:outline-none focus:ring-2 focus:ring-purple-500/50 shadow-sm`}
                                onKeyDown={(e) => e.key === "Enter" && handleAddType()}
                            />
                        </div>

                        {error && <p className="text-pink-500 text-xs mb-4">{error}</p>}

                        <div className="border rounded-xl border-purple-100 overflow-hidden">
                            {types.length === 0 ? (
                                <div className="p-6 text-center text-purple-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-10 w-10 mx-auto text-purple-200 mb-2"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                                    </svg>
                                    Aucun type de document défini
                                </div>
                            ) : (
                                <div className="divide-y divide-purple-100">
                                    {types.map((type) => (
                                        <div key={type.id}
                                             className="flex items-center justify-between p-3.5 hover:bg-purple-50">
                                            <span className="text-purple-900">{type.name}</span>
                                            <button
                                                onClick={() => handleDeleteType(type.id)}
                                                className="text-purple-400 hover:text-pink-500 focus:outline-none p-1.5 rounded-full hover:bg-pink-50 transition-colors"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
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
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
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
                            onClick={handleSubmit}
                            className="px-4 py-2.5 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-200 shadow-md shadow-purple-200/50 hover:shadow-lg hover:shadow-purple-300/50 active:scale-95"
                        >
                            Enregistrer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
