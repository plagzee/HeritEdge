"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaCog, FaUserCircle } from "react-icons/fa";
import { useSession } from "../../hooks/useSession";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, loading } = useSession();
  const router = useRouter();
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const refreshSession = () => {
    setIsProfileOpen(false);
    window.location.reload();
  };

  return (
    <nav className="w-full bg-gradient-to-r from-stone-900 to-stone-800 shadow-2xl sticky top-0 z-20 border-b border-stone-700/50 backdrop-blur-sm">
      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-amber-200 hover:text-amber-100 transition-colors duration-300 drop-shadow-lg">
          HeritEdge
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-stone-300 font-medium">
          <Link 
            href="/" 
            className="hover:text-amber-200 transition-colors duration-300 relative group"
            onClick={() => setIsOpen(false)}
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/dashboard" 
            className="hover:text-amber-200 transition-colors duration-300 relative group"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/archive" 
            className="hover:text-amber-200 transition-colors duration-300 relative group"
            onClick={() => setIsOpen(false)}
          >
            Archive
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            href="/about" 
            className="hover:text-amber-200 transition-colors duration-300 relative group"
            onClick={() => setIsOpen(false)}
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Profile/Auth Section */}
          {loading ? (
            <div className="w-10 h-10 border-2 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
          ) : user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-stone-700/50 transition-all duration-300"
              >
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border-2 border-amber-200/50"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-amber-200" />
                )}
                <span className="text-amber-200 font-medium">
                  {user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                </span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-stone-800 border border-stone-700 rounded-lg shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-stone-700">
                    <p className="text-amber-200 font-medium">{user.displayName || 'User'}</p>
                    <p className="text-stone-400 text-sm truncate">{user.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-4 py-2 text-stone-300 hover:text-amber-200 hover:bg-stone-700/50 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <FaUser className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    
                    
                    <button
                      onClick={refreshSession}
                      className="w-full flex items-center px-4 py-2 text-stone-300 hover:text-amber-200 hover:bg-stone-700/50 transition-colors text-left"
                    >
                      <FaUser className="w-4 h-4 mr-3" />
                      Refresh Session
                    </button>
                  </div>
                  
                  <div className="border-t border-stone-700 py-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center px-4 py-2 text-red-400 hover:text-red-300 hover:bg-stone-700/50 transition-colors text-left"
                    >
                      <FaSignOutAlt className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-4 px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-cream-50 rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 transform hover:scale-105 border border-amber-500/30"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-amber-200 text-2xl hover:text-amber-100 transition-all duration-300 transform hover:scale-110 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="relative w-6 h-6 flex items-center justify-center">
            <FaBars 
              className={`absolute transition-all duration-300 transform ${
                isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
              }`} 
            />
            <FaTimes 
              className={`absolute transition-all duration-300 transform ${
                isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
              }`} 
            />
          </div>
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div 
        className={`md:hidden bg-gradient-to-b from-stone-800 to-stone-900 shadow-2xl border-t border-stone-700/50 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`flex flex-col space-y-1 px-6 py-6 text-stone-300 font-medium transform transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
        }`}>
          <Link 
            href="/dashboard" 
            className="py-3 px-4 hover:text-amber-200 hover:bg-stone-700/50 rounded-lg transition-all duration-300 transform hover:translate-x-2" 
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            href="/about" 
            className="py-3 px-4 hover:text-amber-200 hover:bg-stone-700/50 rounded-lg transition-all duration-300 transform hover:translate-x-2" 
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          
          {/* Mobile Auth Section */}
          <div className="pt-4 mt-4 border-t border-stone-700">
            {loading ? (
              <div className="flex justify-center py-3">
                <div className="w-6 h-6 border-2 border-amber-200 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-4 py-3 bg-stone-700/30 rounded-lg">
                  {user.photoURL ? (
                    <img 
                      src={user.photoURL} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full border-2 border-amber-200/50"
                    />
                  ) : (
                    <FaUserCircle className="w-8 h-8 text-amber-200" />
                  )}
                  <div>
                    <p className="text-amber-200 font-medium">{user.displayName || 'User'}</p>
                    <p className="text-stone-400 text-xs truncate">{user.email}</p>
                  </div>
                </div>
                
                <Link
                  href="/settings"
                  className="flex items-center py-3 px-4 hover:text-amber-200 hover:bg-stone-700/50 rounded-lg transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <FaCog className="w-4 h-4 mr-3" />
                  Settings
                </Link>
                
                <button
                  onClick={() => {
                    refreshSession();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center py-3 px-4 hover:text-amber-200 hover:bg-stone-700/50 rounded-lg transition-all duration-300 text-left"
                >
                  <FaUser className="w-4 h-4 mr-3" />
                  Refresh Session
                </button>
                
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center py-3 px-4 text-red-400 hover:text-red-300 hover:bg-stone-700/50 rounded-lg transition-all duration-300 text-left"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="block px-4 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-cream-50 rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-300 text-center border border-amber-500/30 transform hover:scale-105"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}