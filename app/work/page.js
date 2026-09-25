const projects = [
  {
    title: 'Project Atlas',
    type: 'Product platform',
    description: 'A focused product experience for organizing complex workflows into clear, actionable systems.',
    tags: ['Product design', 'React', 'Systems'],
    image: '/assets/images/project-atlas.jpg',
  },
  {
    title: 'ContriHub',
    type: 'Developer platform',
    description: 'A contribution-focused platform built to make collaboration, discovery, and project momentum easier.',
    tags: ['Community', 'Node.js', 'API design'],
    image: '/assets/images/project-contrihub.jpg',
  },
];

export default function Work() {
  return (
    <main>
      <section id="work" className="work page-section">
        <div className="work-heading scroll-reveal">
          <div>
            <span className="section-label">SELECTED WORK</span>
            <h1>Systems with<br /><span>purpose.</span></h1>
          </div>
          <p>Selected projects where product thinking, dependable engineering, and clear interfaces meet.</p>
        </div>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card scroll-reveal" key={project.title}>
              <div className="project-image-wrap">
                <img src={project.image} alt="" className="project-image" />
                <span className="project-arrow" aria-hidden="true">↗</span>
              </div>
              <div className="project-card-body">
                <span className="project-type">{project.type}</span>
                <h2>{project.title}</h2>
                <p>{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
