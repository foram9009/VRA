import { Status } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const publishedWhere = { status: Status.PUBLISHED };

// ── Mock Fallback Data (Resiliency when database is offline/unreachable) ───
const mockPortfolios = [
  { id: 'mock-1', title: 'Branding & Identity', slug: 'branding-identity', coverImage: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg', category: { name: 'Branding', slug: 'branding' }, year: 2026 },
  { id: 'mock-2', title: 'Luxury E-Commerce', slug: 'luxury-ecommerce', coverImage: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-3.jpg', category: { name: 'Web Design', slug: 'web-design' }, year: 2026 },
  { id: 'mock-3', title: 'Interactive 3D Motion', slug: 'interactive-3d-motion', coverImage: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-5.jpg', category: { name: 'Motion', slug: 'motion' }, year: 2026 },
];

const mockTestimonials = [
  { id: 'mock-1', name: 'Sophia Loren', role: 'CEO', company: 'Aura Cosmetics', content: 'Working with Luxe was a transformative experience. Their attention to detail and design execution is absolute world-class.', avatar: '' },
  { id: 'mock-2', name: 'James Carter', role: 'Founder', company: 'Aether Labs', content: 'The 3D animations and layout responsiveness exceeded our highest expectations. A true award-caliber agency.', avatar: '' },
];

const mockClients = [
  { id: 'mock-client-1', name: 'Apex', logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg' },
  { id: 'mock-client-2', name: 'Nova', logoUrl: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample.jpg' },
];

const mockFaqs = [
  { id: 'mock-faq-1', question: 'What services do you offer?', answer: 'We specialize in brand strategy, UX/UI design, interactive web development, and custom 3D experiences.' },
  { id: 'mock-faq-2', question: 'How long does a typical project take?', answer: 'Branding projects take 4-6 weeks, while complex web experiences average 8-12 weeks.' },
];

const mockBlogs = [
  { id: 'mock-blog-1', title: 'The Future of Minimal Design', slug: 'future-minimal-design', coverImage: 'https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-2.jpg', excerpt: 'How whitespace and clean typography define luxury digital branding.', category: { name: 'Design Insights', slug: 'insights' }, createdAt: new Date(), readTime: 5 },
];

const mockTeam = [
  { name: 'Foram Patel', email: 'foram123patel@gmail.com', image: '' },
  { name: 'Kenil Patel', email: 'meetbhup@gmail.com', image: '' },
];

const mockServices = [
  { id: 'mock-service-1', title: 'Brand Strategy', description: 'Intentional branding built on positioning, user research, and luxury aesthetics.', features: ['Identity Systems', 'Brand Guidelines', 'Asset Production'] },
  { id: 'mock-service-2', title: 'UX/UI Design', description: 'Bespoke layouts, editorial design, and visual storytelling for web & mobile.', features: ['Bespoke Interfaces', 'High-Fidelity Wireframes', 'Interactive Prototypes'] },
  { id: 'mock-service-3', title: 'Interactive Web', description: 'Next-generation web applications powered by Next.js, WebGL, and GSAP.', features: ['Next.js 15 & React 19', '3D Scene (R3F) Integration', 'Lenis Smooth Scroll'] },
];

const mockCareers = [
  { id: 'mock-career-1', title: 'Senior Creative Frontend Engineer', location: 'Remote / NYC', type: 'Full-time' },
  { id: 'mock-career-2', title: 'Lead UI/UX Designer', location: 'London, UK / Hybrid', type: 'Full-time' },
];
// ──────────────────────────────────────────────────────────────────────────

export async function getHomeData() {
  try {
    const [portfolios, testimonials, clients, faqs, blogs] = await Promise.all([
      prisma.portfolio.findMany({ where: { status: Status.PUBLISHED }, take: 3 }),
      prisma.testimonial.findMany({ where: { status: Status.PUBLISHED }, take: 4 }),
      prisma.client.findMany({ where: { status: Status.PUBLISHED } }),
      prisma.fAQ.findMany({ where: { status: Status.PUBLISHED }, orderBy: { order: 'asc' } }),
      prisma.blog.findMany({ where: { status: Status.PUBLISHED }, take: 3, include: { author: true, category: true } }),
    ]);

    // Fallback if DB is empty
    return {
      portfolios: portfolios.length ? portfolios : mockPortfolios,
      testimonials: testimonials.length ? testimonials : mockTestimonials,
      clients: clients.length ? clients : mockClients,
      faqs: faqs.length ? faqs : mockFaqs,
      blogs: blogs.length ? blogs : mockBlogs,
    };
  } catch (error) {
    console.warn('[DB WARNING] Database connection failed or not configured. Using fallback home mock data.');
    return {
      portfolios: mockPortfolios,
      testimonials: mockTestimonials,
      clients: mockClients,
      faqs: mockFaqs,
      blogs: mockBlogs,
    };
  }
}

export async function getAboutData() {
  try {
    const [team] = await Promise.all([
      prisma.user.findMany({ where: { role: { in: ['ADMIN', 'EDITOR'] } }, select: { name: true, image: true, email: true } }),
    ]);
    return { team: team.length ? team : mockTeam };
  } catch (error) {
    console.warn('[DB WARNING] Database connection failed. Using fallback about team mock data.');
    return { team: mockTeam };
  }
}

export async function getServiceData() {
  try {
    const services = await prisma.service.findMany({ where: { status: Status.PUBLISHED } });
    return services.length ? services : mockServices;
  } catch (error) {
    console.warn('[DB WARNING] Database connection failed. Using fallback services mock data.');
    return mockServices;
  }
}

export async function getPortfolioData(category?: string) {
  const where = category && category !== 'all'
    ? { status: Status.PUBLISHED, categoryId: category }
    : publishedWhere;

  try {
    const [projects, categories] = await Promise.all([
      prisma.portfolio.findMany({ where, include: { category: true } }),
      prisma.portfolioCategory.findMany(),
    ]);

    return [
      projects.length ? projects : mockPortfolios,
      categories.length ? categories : [{ id: 'branding', name: 'Branding', slug: 'branding', description: null }],
    ] as [any[], any[]];
  } catch (error) {
    console.warn('[DB WARNING] Database connection failed. Using fallback portfolio mock data.');
    return [
      mockPortfolios,
      [{ id: 'branding', name: 'Branding', slug: 'branding', description: null }],
    ] as [any[], any[]];
  }
}

export async function getBlogData(category?: string, page = 1) {
  const skip = (page - 1) * 6;
  const where = category && category !== 'all'
    ? { status: Status.PUBLISHED, categoryId: category }
    : publishedWhere;

  try {
    const [posts, total, categories] = await Promise.all([
      prisma.blog.findMany({ where, skip, take: 6, include: { author: true, category: true } }),
      prisma.blog.count({ where }),
      prisma.blogCategory.findMany(),
    ]);

    return [
      posts.length ? posts : mockBlogs,
      total || mockBlogs.length,
      categories.length ? categories : [{ id: 'insights', name: 'Design Insights', slug: 'insights' }],
    ] as [any[], number, any[]];
  } catch (error) {
    console.warn('[DB WARNING] Database connection failed. Using fallback blog mock data.');
    return [
      mockBlogs,
      mockBlogs.length,
      [{ id: 'insights', name: 'Design Insights', slug: 'insights' }],
    ] as [any[], number, any[]];
  }
}

export async function getCareerData() {
  try {
    const careers = await prisma.career.findMany({ where: { status: Status.PUBLISHED } });
    return careers.length ? careers : mockCareers;
  } catch (error) {
    console.warn('[DB WARNING] Database connection failed. Using fallback career mock data.');
    return mockCareers;
  }
}
