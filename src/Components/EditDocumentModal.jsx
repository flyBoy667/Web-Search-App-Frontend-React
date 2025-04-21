import {useEffect, useState} from "react";
import {api} from "../Services/api.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const schema = z.object({
    doc_name: z.string()
        .min(2, {message: "Le nom du document doit contenir au moins 2 caractères."})
        .max(500, {message: "Le nom du document ne peut pas dépasser 500 caractères."}),
    doc_format: z.string()
        .min(2, {message: "Le format du document doit contenir au moins 2 caractères."})
        .max(30, {message: "Le format du document ne peut pas dépasser 30 caractères."}),
    file: z.any()
        .optional()
        .refine(file => !file || file instanceof File, {message: "Le fichier doit être valide"}),
    doc_type: z.string().min(1, "Veuillez sélectionner un type de doc"),
});

export function EditDocumentModal({isOpen, onClose, documentTypes, documentToEdit, onDocumentUpdated}) {
    const {
        register,
        handleSubmit,
        formState: {errors, isSubmitting},
        setValue,
        watch,
        reset
    } = useForm({
        mode: "onTouched",
        resolver: zodResolver(schema)
    });

    const file = watch("file");
    const [isDragging, setIsDragging] = useState(false);
    const [currentFileName, setCurrentFileName] = useState("");

    useEffect(() => {
        if (documentToEdit) {
            setValue("doc_name", documentToEdit.doc_name);
            setValue("doc_type", documentToEdit.doc_type_id?.toString() || "");
            setValue("doc_format", documentToEdit.doc_format || "pdf");
            setCurrentFileName(documentToEdit.file_name || "");
        }
    }, [documentToEdit, setValue]);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFile = e.dataTransfer.files[0];
            setValue("file", droppedFile);
            setCurrentFileName(droppedFile.name);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setValue("file", e.target.files[0]);
            setCurrentFileName(e.target.files[0].name);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("doc_name", data.doc_name);
            formData.append("doc_type_id", data.doc_type);
            formData.append("doc_format", data.doc_format);

            if (data.file) {
                formData.append("file", data.file);
            }

            const response = await api.put(`/api/document/${documentToEdit.doc_id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            alert("Document modifié avec succès !");
            onDocumentUpdated(response.data);
            reset();
            onClose();
        } catch (error) {
            console.error("Erreur lors de la modification :", error);
            alert("Erreur lors de la modification du document.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center">
                <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm transition-opacity"
                     onClick={onClose}></div>
                <div
                    className="w-full max-w-[600px] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all animate-slide-up">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-purple-900">Modifier le document</h3>
                        <button onClick={onClose}
                                className="rounded-full h-8 w-8 flex items-center justify-center text-purple-400 hover:text-purple-600 hover:bg-purple-100 transition-colors">
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                        <div className="grid gap-5 py-4">
                            {/* Nom */}
                            <div>
                                <label className="text-sm font-medium text-purple-900">Nom du document</label>
                                <input {...register("doc_name")}
                                       className={`w-full h-11 px-3 rounded-xl border ${errors.doc_name ? "border-pink-500" : "border-purple-100"}`}/>
                                {errors.doc_name && <p className="text-pink-500 text-xs">{errors.doc_name.message}</p>}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="text-sm font-medium text-purple-900">Type de document</label>
                                <select {...register("doc_type")}
                                        className={`w-full h-11 px-3 rounded-xl border ${errors.doc_type ? "border-pink-500" : "border-purple-100"}`}>
                                    <option value="">Sélectionner un type</option>
                                    {documentTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                                {errors.doc_type && <p className="text-pink-500 text-xs">{errors.doc_type.message}</p>}
                            </div>

                            {/* Format */}
                            <div>
                                <label className="text-sm font-medium text-purple-900">Format du document</label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center">
                                        <input {...register("doc_format")} type="radio" value="pdf"
                                               className="mr-2"/> PDF
                                    </label>
                                    <label className="flex items-center">
                                        <input {...register("doc_format")} type="radio" value="word"
                                               className="mr-2"/> Word
                                    </label>
                                </div>
                                {errors.doc_format &&
                                    <p className="text-pink-500 text-xs">{errors.doc_format.message}</p>}
                            </div>

                            {/* Fichier */}
                            <div>
                                <label className="text-sm font-medium text-purple-900">Fichier</label>
                                <div
                                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer ${isDragging ? "border-purple-500 bg-purple-50" : "border-purple-200 hover:border-purple-400 hover:bg-purple-50"} ${errors.file ? "border-pink-500" : ""}`}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        setIsDragging(true);
                                    }}
                                    onDragLeave={() => setIsDragging(false)}
                                    onDrop={handleDrop}
                                    onClick={() => document.getElementById("file-input").click()}
                                >
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    <p className="text-sm text-purple-800 mb-1">
                                        <span className="font-medium text-purple-600">Cliquez pour télécharger</span> ou
                                        glissez-déposez
                                    </p>
                                    {currentFileName && (
                                        <p className="text-xs text-purple-500 mt-2">
                                            {file ? "Nouveau fichier sélectionné : " : "Fichier actuel : "}
                                            {currentFileName}
                                        </p>
                                    )}
                                    {errors.file && <p className="text-pink-500 text-xs mt-1">{errors.file.message}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-right">
                            <button type="submit" disabled={isSubmitting}
                                    className="bg-purple-600 text-white px-5 py-2 rounded-xl hover:bg-purple-700 transition">
                                {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}