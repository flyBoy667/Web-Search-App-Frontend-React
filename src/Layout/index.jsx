import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "Kankou Moussa - Recherche de Documents",
    description: "Application de recherche de documents pour Kankou Moussa",
}

export default function RootLayout({ children }) {
    return (
        <html lang="fr">
        <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">{children}</main>
        </body>
        </html>
    )
}
