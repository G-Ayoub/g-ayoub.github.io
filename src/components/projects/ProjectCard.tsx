import { motion } from 'motion/react';
import type { Ref } from 'react';
import { categoryLabels, type Project } from '@/data/projects';
import { icons } from '@/lib/icons';
import { springs } from '@/lib/motion';

interface Props {
  project: Project;
  ref?: Ref<HTMLLIElement>;
}

/** A project tile. `layout` lets it glide to its new slot when the grid re-flows. */
export default function ProjectCard({ project, ref }: Props) {
  const Icon = icons[project.icon];
  const tags = project.stack ?? project.categories.map((c) => categoryLabels[c]);
  return (
    <motion.li
      ref={ref}
      layout
      className="card"
      style={{ borderRadius: 22 }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ ...springs.layout, opacity: { duration: 0.2 } }}
    >
      <div className="card-top">
        <div className="card-icon" aria-hidden="true">
          <Icon strokeWidth={1.8} />
        </div>
        {project.years && <span className="card-years">{project.years}</span>}
      </div>
      <h3>{project.title}</h3>
      {project.metric && <p className="card-metric">{project.metric}</p>}
      <p>{project.summary}</p>
      <ul className="tags" aria-label={project.stack ? 'Stack' : 'Categories'}>
        {tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </motion.li>
  );
}
