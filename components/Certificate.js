'use client';

const Certifications = ({ certifications }) => {
  if (!certifications || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Licenses & Certifications</h2>
          <p className="mt-4 text-lg text-slate-600">My commitment to continuous learning and skill development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, index) => (
            <div key={index} className="group relative flex flex-col bg-slate-50 border border-slate-200 rounded-xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-slate-900">{cert.title}</h3>
                    <p className="mt-1 text-md font-semibold text-slate-700">{cert.issuer}</p>
                    <p className="mt-2 text-sm text-slate-500">{cert.date}</p>
                </div>
                <div className="mt-6">
                    <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-semibold text-slate-900 hover:text-sky-600 transition-colors"
                    >
                        Show Credential
                        <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </a>
                </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;