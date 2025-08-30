'use client'
const Experience = ({ experience }) => {
  if (!experience || experience.length === 0) return null;

  return (
    <section id="experience" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">My Experience</h2>
        <div className="relative border-l-2 border-gray-200">
          {experience.map((job, index) => (
            <div key={index} className="mb-10 ml-6">
              <span className="absolute flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full -left-3 ring-8 ring-white">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M20 10a10 10 0 11-20 0 10 10 0 0120 0zm-1 0a9 9 0 10-18 0 9 9 0 0018 0z"></path></svg>
              </span>
              <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900">
                {job.position} @ {job.company}
              </h3>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                {job.duration} • {job.location}
              </time>
              <p className="mb-4 text-base font-normal text-gray-500">{job.description}</p>
              <div className="flex flex-wrap gap-2">
                {job.technologies.map(tech => (
                   <span key={tech} className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;