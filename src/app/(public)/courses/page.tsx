import CoursesCatalog from '@/components/course/CoursesCatalog';
import JsonLd from '@/components/ui/JsonLd';
import { absUrl, breadcrumbJsonLd, getPublishedCourses, itemListJsonLd } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getPublishedCourses();

  return (
    <>
      <JsonLd
        data={itemListJsonLd(
          courses.map((c) => ({ name: c.title, url: absUrl(`/courses/${c.slug}`) })),
        )}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: absUrl('/') },
          { name: 'Corsi', url: absUrl('/courses') },
        ])}
      />
      <CoursesCatalog />
    </>
  );
}
