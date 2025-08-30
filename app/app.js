'use client'; // This directive makes it a Client Component

import { useEffect, useState } from 'react';

export default function Home() {
  // State variables to hold our data - This logic remains the same
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Fetch data from the API when the component mounts - This logic remains the same
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`)
        ]);

        const profileData = await profileRes.json();
        const projectsData = await projectsRes.json();
        
        setProfile(profileData);
        setProjects(projectsData);
        setFilteredProjects(projectsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to handle filter button clicks - This logic remains the same
  const handleFilterClick = (skill) => {
    setActiveFilter(skill);
    if (skill.toLowerCase() === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project =>
        project.technologies.some(tech => tech.toLowerCase() === skill.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  // If data is not yet loaded, show a loading message
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg text-gray-500">Loading portfolio...</p>
      </div>
    );
  }

  // --- JSX with Tailwind CSS classes ---
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        
        <header className="text-center border-b border-gray-200 pb-8 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">{profile.name}</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">{profile.bio}</p>
          <div className="mt-6 flex justify-center gap-x-6">
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-800 transition-colors">GitHub →</a>
            <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-800 transition-colors">LinkedIn →</a>
          </div>
        </header>

        <nav className="flex flex-wrap justify-center gap-2 mb-12">
          <button
            onClick={() => handleFilterClick('all')}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          >
            All
          </button>
          {profile.skills.map(skill => (
            <button
              key={skill}
              onClick={() => handleFilterClick(skill)}
              className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${activeFilter === skill ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
            >
              {skill}
            </button>
          ))}
        </nav>

        <main>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">My Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map(project => (
              <div key={project.title} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                  <p className="mt-2 text-gray-600">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                   <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                    View Project →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
        
        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">Made with ❤️ in {profile.location} as of {new Date().getFullYear()}.</p>
        </footer>
      </div>
    </div>
  );
}