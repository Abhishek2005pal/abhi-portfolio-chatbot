'use client';

const Navbar = ({ name, activeView, setActiveView }) => {
  // This is the list of links that will only show in the 'Portfolio' view
  const portfolioLinks = ['About', 'Experience', 'Skills', 'Projects', 'Certifications'];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Left Side: Your Name */}
          <span className="text-2xl text-gray-900 font-semibold">
            {name || 'Loading...'}
          </span>

          {/* Center: Inner Portfolio Links (Conditional) */}
          {activeView === 'portfolio' && (
            <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
              {portfolioLinks.map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-gray-900 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          )}

          {/* Right Side: Main View Toggles */}
          <div className="flex space-x-6 text-gray-900 font-medium">
            <button 
              onClick={() => setActiveView('portfolio')}
              className={`pb-1 border-b-2 transition-colors ${activeView === 'portfolio' ? 'border-gray-900' : 'border-transparent hover:border-gray-400'}`}
            >
              Portfolio
            </button>
            <button 
              onClick={() => setActiveView('chat')}
              className={`pb-1 border-b-2 transition-colors ${activeView === 'chat' ? 'border-gray-900' : 'border-transparent hover:border-gray-400'}`}
            >
              AI Chat
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;