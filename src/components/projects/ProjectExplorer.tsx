import { AnimatePresence, MotionConfig } from 'motion/react';
import { useMemo, useState } from 'react';
import { categories, categoryLabels, type Filter, type Project } from '@/data/projects';
import ProjectCard from './ProjectCard';
import SegmentedControl, { type SegmentOption } from './SegmentedControl';

const filterOptions: SegmentOption<Filter>[] = (['all', ...categories] as const).map((value) => ({
  value,
  label: categoryLabels[value],
}));

interface Props {
  projects: Project[];
}

export default function ProjectExplorer({ projects }: Props) {
  const [filter, setFilter] = useState<Filter>('all');
  const [changed, setChanged] = useState(false);

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter, projects],
  );

  const handleChange = (next: Filter) => {
    setChanged(true);
    setFilter(next);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="reveal">
        <SegmentedControl options={filterOptions} value={filter} onChange={handleChange} label="Filter projects" />
      </div>
      <p className="sr-only" aria-live="polite">
        {changed ? `Showing ${visible.length} ${visible.length === 1 ? 'project' : 'projects'}` : ''}
      </p>
      <ul className="project-grid" role="list">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </AnimatePresence>
      </ul>
    </MotionConfig>
  );
}
