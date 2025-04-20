const title = "Kankou Moussa - Recherche de Documents";
const description = "Application de recherche de documents pour Kankou Moussa";

export function Layout({children}) {
    return (
        <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
            <header className="px-4 py-6 text-center">
                <h1 className="text-3xl font-bold text-purple-800 mb-2">{title}</h1>
                <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
            </header>

            <div className="container mx-auto px-4 pb-8">
                {children}
            </div>
        </main>
    );
}