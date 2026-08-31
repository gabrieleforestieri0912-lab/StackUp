import type { MetadataRoute } from 'next';
import { getPublishedCourses, siteUrl } from '@/lib/seo';
import { GUIDE_CARDS, PATHS, ALL_RESOURCES } from '@/data/landingData';
import { AI_SKILLS } from '@/data/aiSkillsData';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/courses`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/paths`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/guide`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/resources`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.2 },
  ];

  const courses = await getPublishedCourses();
  const courseRoutes: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${base}/courses/${c.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const pathRoutes: MetadataRoute.Sitemap = PATHS.map((p) => ({
    url: `${base}${p.href}`,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = GUIDE_CARDS.map((g) => ({
    url: `${base}${g.href}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = ALL_RESOURCES.map((r) => ({
    url: `${base}${r.href}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const aiSkillRoutes: MetadataRoute.Sitemap = AI_SKILLS.map((s) => ({
    url: `${base}${s.href}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...courseRoutes,
    ...pathRoutes,
    ...guideRoutes,
    ...resourceRoutes,
    ...aiSkillRoutes,
  ];
}
