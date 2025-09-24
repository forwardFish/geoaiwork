'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock,
  Database,
  Heart,
  Lightbulb,
  MessageCircle,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from '@/libs/I18nNavigation';

type Stat = {
  number: string;
  label: string;
  description: string;
};

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  icon: string; // icon key; map to actual icon in client to avoid passing functions from server
};

type Value = {
  icon: string; // icon key; map to actual icon in client to avoid passing functions from server
  title: string;
  description: string;
  gradient: string;
};

type Testimonial = {
  quote: string;
  author: string;
  role: string;
  rating: number;
};

type AboutPageClientProps = {
  stats: Stat[];
  timeline: TimelineItem[];
  values: Value[];
  testimonials: Testimonial[];
};

export function AboutPageClient({ stats, timeline, values, testimonials }: AboutPageClientProps) {
  // Map of icon keys to actual Lucide icon components
  const ICONS: Record<string, LucideIcon> = {
    Clock,
    Lightbulb,
    Rocket,
    MessageCircle,
    Shield,
    Users,
    Zap,
  };

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Heart className="h-4 w-4" />
                Our Story
              </div>

              <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 lg:text-7xl dark:text-white">
                From Excel Expert to
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Anyone
                </span>
              </h1>

              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600 lg:text-2xl dark:text-gray-300">
                Born from countless 3 AM battles with crashed spreadsheets and broken formulas,
                SheetAlly transforms data processing from technical nightmare to natural conversation.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto grid max-w-6xl grid-cols-2 gap-8 lg:grid-cols-4"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="group text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-2 text-4xl font-bold text-blue-600 transition-colors group-hover:text-purple-600 dark:text-blue-400">
                    {stat.number}
                  </div>
                  <div className="mb-1 font-semibold text-gray-900 dark:text-white">{stat.label}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="bg-white/50 py-20 backdrop-blur-sm dark:bg-gray-800/50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
              The Journey to Simplicity
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Every great solution starts with a problem worth solving
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 transform bg-gradient-to-b from-blue-200 to-purple-200"></div>

            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`relative mb-16 flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                {/* Content */}
                <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                    <div className="mb-3 text-2xl font-bold text-blue-600 dark:text-blue-400">{item.year}</div>
                    <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="absolute left-1/2 flex h-16 w-16 -translate-x-1/2 transform items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-transform duration-300 group-hover:scale-110">
                  {(() => {
                    const IconComponent = ICONS[item.icon] || Sparkles;
                    return <IconComponent className="h-8 w-8 text-white" />;
                  })()}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
              Our Core Values
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              These principles guide every feature we build and every decision we make
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                  <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r ${value.gradient} transition-transform duration-300 group-hover:scale-110`}>
                    {(() => {
                      const IconComponent = ICONS[value.icon] || Sparkles;
                      return <IconComponent className="h-8 w-8 text-white" />;
                    })()}
                  </div>
                  <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="mb-8">
              <Target className="mx-auto mb-6 h-20 w-20 text-white/80" />
            </div>

            <h2 className="mb-8 text-4xl font-bold lg:text-5xl">
              Our Mission
            </h2>

            <p className="mb-12 text-xl leading-relaxed text-blue-100">
              To democratize data processing by removing the barriers between human intent and digital execution.
              Every person should be able to clean, transform, and analyze their data as easily as having a conversation.
            </p>

            <blockquote className="mb-8 border-l-4 border-white/30 pl-6 text-left">
              <p className="mb-4 text-lg text-blue-100 italic">
                "Data should serve people, not the other way around. When someone says 'remove duplicates but keep the latest',
                the computer should just do it—without requiring a degree in Excel wizardry."
              </p>
              <footer className="text-white/80">
                — The SheetAlly Team
              </footer>
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-20 dark:bg-gray-800/50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
              Loved by Professionals
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Real stories from real users who've transformed their data workflows
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="h-full rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800">
                  {/* Stars */}
                  <div className="mb-4 flex gap-1">
                    {[...new Array(testimonial.rating)].map((_, i) => (
                      <Sparkles key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="mb-6 text-gray-600 italic dark:text-gray-300">
                    "
                    {testimonial.quote}
                    "
                  </p>

                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold text-gray-900 lg:text-5xl dark:text-white">
              Ready to Transform Your Data Workflow?
            </h2>
            <p className="mb-12 text-xl text-gray-600 dark:text-gray-300">
              Join thousands of professionals who've already discovered the future of Excel processing
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/tool">
                <motion.button
                  className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Database className="h-5 w-5" />
                  Try SheetAlly Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </Link>

              <Link href="/">
                <motion.button
                  className="flex items-center gap-2 rounded-xl border-2 border-gray-200 px-8 py-4 text-lg font-semibold text-gray-700 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageCircle className="h-5 w-5" />
                  Learn More
                </motion.button>
              </Link>
            </div>

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              No credit card required • Start in seconds • Your data stays private
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
