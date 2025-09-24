// Note: Do not pass icon components from a Server Component to a Client Component.
// Keep this page free of non-serializable values (functions React components).
import { setRequestLocale } from 'next-intl/server';
import { AboutPageClient } from './AboutPageClient';

type IAboutProps = {
  params: Promise<{ locale: string }>;
};

export default async function About(props: IAboutProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const stats = [
    { number: '50,000+', label: 'Hours Saved Weekly', description: 'Across all users' },
    { number: '10,000+', label: 'Happy Professionals', description: 'Growing daily' },
    { number: '2M+', label: 'Rows Processed', description: 'Clean & accurate' },
    { number: '98%', label: 'Success Rate', description: 'Enterprise grade' },
  ];

  const timeline = [
    {
      year: '2023',
      title: 'The Breaking Point',
      description: 'After countless late nights debugging VLOOKUP formulas and recovering from Excel crashes, we knew there had to be a better way.',
      icon: 'Clock',
    },
    {
      year: '2024',
      title: 'Vision Born',
      description: 'What if data processing could be as simple as having a conversation? We started building the AI workbench we wished existed.',
      icon: 'Lightbulb',
    },
    {
      year: 'Now',
      title: 'Transforming Teams',
      description: '10,000+ professionals have discovered the joy of natural language data processing. No formulas, just results.',
      icon: 'Rocket',
    },
  ];

  const values = [
    {
      icon: 'MessageCircle',
      title: 'Simplicity First',
      description: 'Complex data operations should be as simple as describing what you need in plain English.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: 'Shield',
      title: 'Privacy by Design',
      description: 'Your sensitive data never leaves your browser. Complete privacy and security guaranteed.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: 'Users',
      title: 'Inclusive Access',
      description: 'From Excel novices to data scientists - powerful tools accessible to everyone.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: 'Zap',
      title: 'Lightning Fast',
      description: 'What used to take hours now happens in seconds. Time is your most valuable asset.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const testimonials = [
    {
      quote: 'SheetAlly transformed our monthly reporting from a 2-day nightmare into a 30-minute conversation. It\'s incredible.',
      author: 'Sarah Chen',
      role: 'Finance Director, TechCorp',
      rating: 5,
    },
    {
      quote: 'I went from Excel anxiety to Excel confidence. Natural language commands make me feel like a data wizard.',
      author: 'Mike Rodriguez',
      role: 'Operations Manager, StartupXYZ',
      rating: 5,
    },
    {
      quote: 'Finally, a tool that understands what I mean, not just what I type. Game changer for our team.',
      author: 'Lisa Park',
      role: 'Data Analyst, Enterprise Inc',
      rating: 5,
    },
  ];

  return (
    <AboutPageClient
      stats={stats}
      timeline={timeline}
      values={values}
      testimonials={testimonials}
    />
  );
}
