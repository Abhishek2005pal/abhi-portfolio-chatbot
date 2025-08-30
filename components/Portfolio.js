import About from './About';
// import Certifications from './Certifications'; // <-- 1. IMPORT IT
import Certifications from './Certificate';
import Experience from './Experience';
import Header from './Header';
import Projects from './Projects';
import Skills from './Skills';

const Portfolio = ({ profile }) => {
  if (!profile) return null;

  return (
    <>
      <Header profile={profile} />
      <About about={profile.about} stats={profile.stats} education={profile.education} />
      <Experience experience={profile.experience} />
      <Skills skills={profile.skills} />
      <Projects skills={profile.skills} projects={profile.projects} />
      <Certifications certifications={profile.certifications} /> {/* <-- 2. ADD IT HERE */}
    </>
  );
};

export default Portfolio;