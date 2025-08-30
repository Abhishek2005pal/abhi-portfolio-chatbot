'use client';

import { useEffect, useRef } from 'react';

const Skills = ({ skills }) => {
  const skillsRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const skillItems = entry.target.querySelectorAll('.skill-item');
          skillItems.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('fade-in');
            }, index * 100);
          });
        }
      },
      { threshold: 0.1 }
    );
    
    const currentRef = skillsRef.current; // Fix for useEffect warning
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); // Use the variable in cleanup
      }
    };
  }, []);
  
  if (!skills || skills.length === 0) return null;

  return (
    <section id="skills" className="py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="section-heading text-white">Technical Skills</h2>
        
        <div className="flex flex-wrap justify-center gap-4" ref={skillsRef}>
          {skills.map((skill, index) => (
            <div 
              key={skill} 
              className="skill-item skill-tag opacity-0"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;

