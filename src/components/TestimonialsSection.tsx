'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Digital Marketing Manager',
      company: 'TechFlow Solutions',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      content: 'GeoAIWork transformed our AI search visibility. We\'re now featured in ChatGPT answers regularly, driving 300% more qualified traffic. The GEO analysis showed us exactly what to optimize.',
      rating: 5,
      highlight: '300% more traffic',
    },
    {
      name: 'Michael Rodriguez',
      role: 'SEO Director',
      company: 'GlobalRetail Inc',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'The structured data generation is incredible. Our FAQ schema now gets picked up by every AI engine. Perplexity cites us 5x more often since we implemented the recommendations.',
      rating: 5,
      highlight: '5x more citations',
    },
    {
      name: 'Emily Watson',
      role: 'Content Strategy Lead',
      company: 'SaaS Growth Co',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'The AI-friendliness audit revealed gaps we never knew existed. After optimization, we appear in Google SGE results consistently. Our organic AI traffic increased by 400%.',
      rating: 5,
      highlight: '400% AI traffic growth',
    },
    {
      name: 'David Kim',
      role: 'Head of Growth',
      company: 'FinTech Innovations',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The downloadable files saved us weeks of development time. The FAQ JSON-LD and llm.txt files work perfectly. Our AI search rankings improved immediately after implementation.',
      rating: 5,
      highlight: 'Instant AI rankings',
    },
    {
      name: 'Lisa Park',
      role: 'Marketing Director',
      company: 'E-commerce Plus',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
      content: 'Our product pages now get cited by Claude and ChatGPT regularly. The AI citation optimization techniques actually work. We\'ve seen a 250% increase in AI-driven conversions.',
      rating: 5,
      highlight: '250% more conversions',
    },
    {
      name: 'Alex Thompson',
      role: 'VP of Marketing',
      company: 'B2B SaaS Corp',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      content: 'GeoAIWork gave us a competitive edge we didn\'t know was possible. While competitors struggle with AI search, we\'re dominating. Our thought leadership content gets featured in AI answers daily.',
      rating: 5,
      highlight: 'Daily AI features',
    },
  ];

  const stats = [
    { number: '5,000+', label: 'Websites Optimized' },
    { number: '750%', label: 'Avg Citation Increase' },
    { number: '300+', label: 'Companies Trust Us' },
    { number: '8.5x', label: 'Higher AI Visibility' },
  ];

  return (
    <section id="testimonials" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Trusted by Forward-Thinking Marketers
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            See how marketing teams across industries are dominating AI search results
            with comprehensive GEO optimization strategies.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-3xl font-bold text-blue-600 md:text-4xl">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-gray-50 p-6 transition-shadow hover:shadow-lg"
            >
              {/* Quote Icon */}
              <Quote className="mb-4 h-8 w-8 text-blue-600" />

              {/* Content */}
              <p className="mb-6 leading-relaxed text-gray-700">
                "
                {testimonial.content}
                "
              </p>

              {/* Highlight */}
              <div className="mb-4 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {testimonial.highlight}
              </div>

              {/* Rating */}
              <div className="mb-4 flex items-center">
                {[...new Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="mr-4 h-12 w-12 rounded-full"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
