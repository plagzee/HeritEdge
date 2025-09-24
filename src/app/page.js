import Link from "next/link";
import { FaBookOpen, FaLanguage, FaArchive } from "react-icons/fa";
import { MdUploadFile } from "react-icons/md";
import Navbar from "./components/Navbar/page";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 flex flex-col">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between flex-1 px-8 md:px-16 lg:px-32 py-12">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-amber-100 leading-tight drop-shadow-lg">
            Preserving Heritage, <br /> 
            <span className="text-amber-200">Empowering Discovery</span>
          </h2>
          <p className="text-lg text-stone-300 leading-relaxed">
            HeritEdge is a digital heritage platform to preserve manuscripts, 
            translate native languages, and make cultural knowledge 
            accessible to everyone.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-cream-50 font-semibold rounded-xl shadow-lg hover:from-amber-600 hover:to-amber-500 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-stone-700 border-2 border-amber-600 text-amber-200 font-semibold rounded-xl shadow-lg hover:bg-stone-600 hover:border-amber-500 transition-all duration-300"
            >
              View Archive
            </Link>
          </div>
        </div>

        {/* Hero Illustration */}
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-600/20 rounded-full blur-3xl"></div>
            <img 
              className="relative text-amber-600 w-60 h-60 drop-shadow-2xl filter brightness-110 contrast-110" 
              src="/logo_nobg.png"
              alt="HeritEdge Logo"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 md:px-16 lg:px-32 py-16 bg-stone-800/50 text-center backdrop-blur-sm">
        <h3 className="text-3xl font-black text-amber-100 mb-10 drop-shadow-md">Our Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-stone-700 to-stone-800 border border-stone-600 hover:border-amber-600/50 group">
            <FaLanguage className="text-amber-400 w-12 h-12 mx-auto mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-xl font-semibold text-amber-100 mb-2">Language Identification</h4>
            <p className="text-stone-300 leading-relaxed">
              Identify cultural languages using Artificial Intelligence & providing translations for native tribe languages.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-stone-700 to-stone-800 border border-stone-600 hover:border-amber-600/50 group">
            <MdUploadFile className="text-amber-400 w-12 h-12 mx-auto mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-xl font-semibold text-amber-100 mb-2">Manuscript Upload</h4>
            <p className="text-stone-300 leading-relaxed">
              Upload manuscripts, texts, and cultural documents to build a digital heritage archive.
            </p>
          </div>
          
          <div className="p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-stone-700 to-stone-800 border border-stone-600 hover:border-amber-600/50 group">
            <FaArchive className="text-amber-400 w-12 h-12 mx-auto mb-4 drop-shadow-lg group-hover:scale-110 transition-transform duration-300" />
            <h4 className="text-xl font-semibold text-amber-100 mb-2">Heritage Archive</h4>
            <p className="text-stone-300 leading-relaxed">
              Access a community-driven archive of translated manuscripts, preserving history for future generations.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Heritage Section */}
      <section className="px-8 md:px-16 lg:px-32 py-16 bg-gradient-to-r from-stone-900 to-stone-800">
        <div className="text-center max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-amber-200 mb-6">
            Bridging Ancient Wisdom with Modern Technology
          </h3>
          <p className="text-stone-300 text-lg leading-relaxed">
            Every manuscript tells a story. Every language carries the soul of a culture. 
            Join us in preserving the irreplaceable heritage of Assam and beyond, 
            ensuring these treasures remain accessible for generations to come.
          </p>
          <div className="mt-8">
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 text-amber-300 border border-amber-600 rounded-xl hover:bg-amber-600/10 transition-all duration-300"
            >
              <FaBookOpen className="mr-2" />
              Learn More About Our Mission
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-stone-900 to-black text-stone-400 text-center py-8 mt-auto border-t border-stone-700">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-amber-200 font-medium text-lg">
              HeritEdge
            </p>
            <p className="text-stone-400 text-sm mt-2 md:mt-0">
              Preserving Roots, Bridging Futures.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-stone-800">
            <p className="text-xs text-stone-500">
              Digitally preserving the cultural heritage of Assam and beyond
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}