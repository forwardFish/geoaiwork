'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from '@/libs/I18nNavigation';

export function HeroSection() {
  const stats = [
    { number: '85%', label: 'of websites are not AI-optimized', source: 'AI Search Research' },
    { number: '750%', label: 'increase in AI citations after GEO', source: 'GeoAIWork Studies' },
    { number: '8.5x', label: 'higher AI search visibility', source: 'Platform Analytics' },
  ];

  const valueProps = [
    {
      icon: BarChart3,
      title: 'Comprehensive GEO Analysis',
      description: 'Deep website analysis for AI search engine compatibility and optimization.',
    },
    {
      icon: Bot,
      title: 'AI-Friendly Structured Data',
      description: 'Generate FAQ JSON-LD, llm.txt, and ai-dataset.json files automatically.',
    },
    {
      icon: Target,
      title: 'AI Citation Optimization',
      description: 'Optimize your content to be cited by ChatGPT, Perplexity, and other AI engines.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get your GEO analysis and optimization recommendations in seconds.',
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">

          {/* Main Hero Content */}
          <div className="mb-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <Sparkles className="h-4 w-4" />
                Professional GEO Optimization Platform
              </div>

              <h1 className="mb-6 text-5xl leading-tight font-bold text-gray-900 lg:text-7xl dark:text-white">
                Optimize Your Website for
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Search Engines
                </span>
              </h1>

              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-gray-600 lg:text-2xl dark:text-gray-300">
                The leading GEO (Generative Engine Optimization) platform. Analyze AI-friendliness, generate structured data,
                and dominate ChatGPT, Perplexity, and Google SGE search results.
              </p>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/analyze">
                <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg">
                  <Search className="h-5 w-5" />
                  Analyze Your Website Now
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stat.number}</div>
                  <div className="font-medium text-gray-600 dark:text-gray-400">{stat.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">{stat.source}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="bg-white/50 py-16 backdrop-blur-sm dark:bg-gray-800/50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
              See GeoAIWork in Action
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Watch how complex GEO optimization becomes simple with our AI-powered analysis
            </p>
          </motion.div>

          {/* Video Player */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="mx-auto max-w-4xl"
          >
            <div className="aspect-video overflow-hidden rounded-2xl bg-gray-900 shadow-2xl">
              <video
                controls
                poster="/assets/images/geo-demo-thumbnail.svg"
                className="h-full w-full object-cover"
                preload="metadata"
              >
                <source src="/assets/videos/geoaiwork-demo.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Video Description */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                See how to analyze and optimize any website for AI search engines in under 2 minutes
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl dark:text-white">
              Why Leading Brands Choose GeoAIWork
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              The only GEO platform that combines comprehensive analysis with enterprise-grade reliability
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-100 to-purple-100 transition-transform group-hover:scale-110 dark:from-blue-900/30 dark:to-purple-900/30">
                  <prop.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {prop.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {prop.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="mb-8 flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900 dark:text-white">5,000+ Websites Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-gray-900 dark:text-white">750% Citation Increase</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-gray-900 dark:text-white">Enterprise Secure</span>
              </div>
            </div>

            <blockquote className="mb-6 text-xl text-gray-600 italic dark:text-gray-300">
              "GeoAIWork transformed our AI search visibility. We now appear in ChatGPT answers regularly,
              driving 300% more qualified traffic to our site."
            </blockquote>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              — Alex Thompson, Content Marketing Director at TechFlow
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      {/*       <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
              Ready to Transform Your Excel Workflow?
            </h2>
            <p className="mb-8 text-xl text-blue-100">
              Join thousands of professionals who've already discovered the future of data processing
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/tool">
                <button className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all duration-300 hover:scale-105 hover:bg-gray-100 hover:shadow-lg">
                  <Upload className="h-5 w-5" />
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>

              <button className="flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-white/10">
                <MessageCircle className="h-5 w-5" />
                Schedule Demo
              </button>
            </div>

            <p className="mt-4 text-sm text-blue-100">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section> */}

    </div>
  );
}
