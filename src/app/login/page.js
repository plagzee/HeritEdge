"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import { signInWithPopup, GoogleAuthProvider, GithubAuthProvider, TwitterAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase"; // You'll need to create this file
import Navbar from "../components/Navbar/page";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState("");

  const handleGoogleSignIn = async () => {
    setLoading("google");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful:", result.user);
      router.push("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Google sign in error:", error);
      alert("Sign in failed. Please try again.");
    } finally {
      setLoading("");
    }
  };

  const handleGithubSignIn = async () => {
    setLoading("github");
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("GitHub sign in successful:", result.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("GitHub sign in error:", error);
      alert("Sign in failed. Please try again.");
    } finally {
      setLoading("");
    }
  };

  const handleTwitterSignIn = async () => {
    setLoading("twitter");
    try {
      const provider = new TwitterAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Twitter sign in successful:", result.user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Twitter sign in error:", error);
      alert("Sign in failed. Please try again.");
    } finally {
      setLoading("");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-900 to-stone-800">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[80vh] px-8">
        <div className="w-full max-w-sm">
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-amber-200 mb-2">
              Sign In to HeritEdge
            </h1>
            <p className="text-stone-300 text-sm">
              Choose your preferred sign-in method
            </p>
          </div>

          <div className="space-y-4">
            
            <button
              onClick={handleGoogleSignIn}
              disabled={loading !== ""}
              className="w-full py-3 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FaGoogle className="mr-3 text-[#1e1e1e]" />
              {loading === "google" ? "Signing in..." : "Continue with Google"}
            </button>


          </div>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="text-stone-400 hover:text-amber-400 text-sm transition-colors"
            >
              ← Back to Home
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}