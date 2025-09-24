"use client";
import Link from "next/link";
import { FaBookOpen } from "react-icons/fa";
import Navbar from "../components/Navbar/page";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-8 py-12 min-h-[80vh] flex items-center">
        <div className="w-full">
          
          <div className="text-center mb-8">
            <FaBookOpen className="text-2xl text-amber-400 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-amber-200">About HeritEdge</h1>
          </div>

          <div className="text-stone-300 leading-relaxed space-y-4 text-center">
            <p>
              <strong className="text-amber-200">HeritEdge</strong> addresses the critical challenge of preserving India{"'"}s cultural heritage. 
              Ancient manuscripts, oral traditions, and native languages are disappearing due to limited documentation and accessibility.
            </p>
            
            <p>
              Our platform combines <strong className="text-amber-100">AI-powered language translation</strong> with 
              <strong className="text-amber-100"> digital archiving</strong> to make regional heritage accessible worldwide. 
              Users can upload manuscripts, translate tribal languages, and access a community-driven archive of cultural knowledge.
            </p>
            
            <p>
              By bridging traditional wisdom with modern technology, we ensure cultural preservation for future generations 
              while supporting researchers and communities in maintaining their cultural identity.
            </p>
          </div>

          <div className="text-center mt-8 space-x-4">
            <Link
              href="/dashboard"
              className="inline-block px-5 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 transition-colors"
            >
              Upload Manuscript
            </Link>
            <Link
              href="/dashboard"
              className="inline-block px-5 py-2 border border-amber-600 text-amber-200 text-sm rounded-lg hover:bg-amber-600/10 transition-colors"
            >
              Browse Archive
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}