'use client';

import { useEffect, useRef } from 'react';

const About = ({ about, stats, education }) => {
  const statsRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = statsRef.current; // Fix for useEffect warning
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Use the variable in cleanup
      }
    };
  }, []);
  
  if (!about) return null;

  return (
    <section id="about" className="py-20">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="section-heading text-white">About Me</h2>
        
        <div className="glass-card rounded-2xl shadow-xl p-8 mb-12">
          <p className="text-center text-lg text-gray-800">{about}</p>
        </div>
        
        {/* Stats Section */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-12 mb-16 opacity-0" ref={statsRef}>
          {[
            { value: stats.projects, label: 'Projects' },
            { value: stats.yearsExperience, label: 'Years Experience' },
            { value: stats.problemsSolved, label: 'Problems Solved' }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl shadow-lg animate-float" style={{ animationDelay: `${index * 0.2}s` }}>
              <p className="text-5xl font-bold text-indigo-600">{stat.value}</p>
              <p className="text-gray-800 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Education Section */}
        <div className="glass-card rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-indigo-900 mb-4">Education</h3>
          {education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <p className="text-xl font-medium text-gray-800">{edu.degree}</p>
              <p className="mt-1 text-gray-700">
                <span className="font-medium">{edu.institution}</span> ({edu.duration})
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
