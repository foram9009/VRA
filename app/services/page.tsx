import Section from '@/components/ui/Section';
import { getServiceData } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function Services() {
  const services = await getServiceData();

  return (
    <>
      <div className="pt-32 pb-16 container-custom">
        <h1 className="heading-xl mb-4 reveal">What We Do</h1>
        <p className="text-2xl text-text-secondary max-w-2xl reveal">End-to-end digital solutions tailored to scale your brand.</p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <div key={i} className="bg-card p-8 rounded-xl border border-white/5 hover:border-primary/30 transition-all duration-300 reveal group">
              <h3 className="text-xl font-medium mb-3 text-primary group-hover:translate-x-1 transition-transform">{service.title}</h3>
              <p className="text-text-secondary leading-relaxed mb-4">{typeof service.description === 'string' ? service.description : JSON.stringify(service.description)}</p>
              <ul className="space-y-2">
                {(Array.isArray(service.features) ? service.features : []).map((f: any, idx: number) => (
                  <li key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                    {typeof f === 'string' ? f : f.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
