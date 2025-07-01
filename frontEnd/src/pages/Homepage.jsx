import { UrlForm } from "../components/UrlForm.jsx"


export const HomePage = () => {
    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc] px-2">
            <div className="w-full max-w-sm sm:max-w-md md:max-w-lg p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl bg-white border border-[#e5e7eb]">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-[#1e293b] drop-shadow">🔗 URL Shortener</h2>
                <UrlForm />
            </div>
        </div>


    )
}