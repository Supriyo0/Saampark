import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { allServices } from '@/lib/data/services';
import { ServiceDetail } from '@/components/features/ServiceDetail/ServiceDetail';

interface Props {
  params: {
    entity: string;
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const currentPath = `/${params.entity}/${params.category}/${params.slug}`;
  const service = allServices.find(s => s.href === currentPath);
  
  if (!service) return { title: 'Service Not Found' };
  
  return {
    title: service.name,
    description: service.description,
  };
}

export default function ServicePage({ params }: Props) {
  const currentPath = `/${params.entity}/${params.category}/${params.slug}`;
  const service = allServices.find(s => s.href === currentPath);

  if (!service) {
    notFound();
  }

  return (
    <div style={{ paddingTop: 'calc(var(--nav-height) + 28px)' }}>
      <ServiceDetail service={service} />
    </div>
  );
}
