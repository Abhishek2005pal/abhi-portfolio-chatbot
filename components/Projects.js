'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const Projects = ({ skills, projects }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const projectsRef = useRef(null);
  
  const projectTechs = useMemo(() => {
    if (!projects) return [];
    const allTechs = projects.flatMap(p => p.technologies);
    return [...new Set(allTechs)];
  }, [projects]);
  
  const filteredProjects = activeFilter.toLowerCase() === 'all'
    ? projects
    : projects.filter(project =>
        project.technologies.some(tech => tech.toLowerCase() === activeFilter.toLowerCase())
      );

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.project-card').forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('fade-in');
            }, index * 150);
          });
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = projectsRef.current; // Fix for useEffect warning
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Use the variable in cleanup
      }
    };
  }, [filteredProjects]);
  
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="section-heading text-white">Projects</h2>
        {/* Fix for apostrophe error */}
        <p className="text-center text-white/80 mb-12">Here are some of the projects I&apos;m proud of.</p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === 'all' 
              ? 'bg-white text-indigo-900 shadow-lg' 
              : 'glass-card text-indigo-900 hover:shadow-md'}`}
          >
            All
          </button>
          {projectTechs.map(skill => (
            <button
              key={skill}
              onClick={() => setActiveFilter(skill)}
              className={`px-5 py-2 rounded-full transition-all duration-300 ${activeFilter === skill 
                ? 'bg-white text-indigo-900 shadow-lg' 
                : 'glass-card text-indigo-900 hover:shadow-md'}`}
            >
              {skill}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" ref={projectsRef}>
          {filteredProjects.map((project, index) => (
            <div 
              key={project.title} 
              className="project-card glass-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 opacity-0"
            >
              <div className="h-40 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-6">{project.description}</p>
                <div className="mb-6 flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="bg-white/50 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {tech}
                    </span>
                  ))}
                </div>
                <div>
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
                  >
                    View Project →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
