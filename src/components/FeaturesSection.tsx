'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  Bot,
  CheckCircle,
  Eye,
  FileCode,
  Globe,
  Target,
  Zap,
} from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Website GEO Analysis',
      description: 'Comprehensive AI-friendliness scoring with detailed breakdown of content structure, technical SEO, and AI readiness metrics.',
      benefits: ['AI compatibility scoring', 'Technical SEO analysis', 'Content structure evaluation', 'Detailed recommendations'],
    },
    {
      icon: FileCode,
      title: 'Structured Data Generation',
      description: 'Automatically generate FAQ JSON-LD, llm.txt, and ai-dataset.json files optimized for AI search engines.',
      benefits: ['FAQ Schema markup', 'LLM crawling instructions', 'AI dataset creation', 'One-click download'],
    },
    {
      icon: Target,
      title: 'AI Citation Optimization',
      description: 'Optimize your content to be cited by ChatGPT, Perplexity, and other generative AI engines with proven techniques.',
      benefits: ['Citation-ready content', 'Answer-optimized structure', 'AI-friendly formatting', 'Evidence paragraphs'],
    },
    {
      icon: Globe,
      title: 'Multi-Engine Compatibility',
      description: 'Ensure your website performs well across ChatGPT, Perplexity, Google SGE, Claude, and other AI search platforms.',
      benefits: ['Cross-platform optimization', 'AI crawler compatibility', 'Universal AI standards', 'Future-proof approach'],
    },
    {
      icon: Bot,
      title: 'AI Crawler Optimization',
      description: 'Configure proper access permissions and crawling guidelines for GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers.',
      benefits: ['Crawler access management', 'Robots.txt optimization', 'Sitemap for AI engines', 'Crawl budget optimization'],
    },
  ];

  const coreFeatures = [
    {
      icon: Eye,
      title: 'Real-time Analysis',
      description: 'Get instant AI-friendliness scores and optimization recommendations as soon as you enter your URL.',
      color: 'blue',
    },
    {
      icon: FileCode,
      title: 'Downloadable Assets',
      description: 'Generate and download optimized files including FAQ JSON-LD, llm.txt, and ai-dataset.json for immediate use.',
      color: 'green',
    },
    {
      icon: Zap,
      title: 'Proven Results',
      description: 'Based on research showing 750% increase in AI citations and 8.5x higher visibility in AI search results.',
      color: 'purple',
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 bg-gray-50 py-24">
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
            Complete GEO Optimization Suite
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Transform your website's AI search visibility with comprehensive analysis,
            automated optimization, and proven techniques that increase citations by 750%.
          </p>
        </motion.div>

        {/* Core Features Grid */}
        <div className="mb-20 grid gap-8 md:grid-cols-3">
          {coreFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${
                feature.color === 'blue'
                  ? 'bg-blue-100'
                  : feature.color === 'green'
                    ? 'bg-green-100'
                    : feature.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
              }`}
              >
                <feature.icon className={`h-6 w-6 ${
                  feature.color === 'blue'
                    ? 'text-blue-600'
                    : feature.color === 'green'
                      ? 'text-green-600'
                      : feature.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                }`}
                />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Detailed Features */}
        <div className="space-y-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Feature Content */}
              <div className="flex-1">
                <div className="mb-4 flex items-center">
                  <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                </div>

                <p className="mb-6 text-lg text-gray-600">
                  {feature.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Visualization */}
              <div className="flex-1">
                <div className="rounded-xl bg-white p-6 shadow-lg">
                  {index === 0 && (
                    /* GEO Analysis Feature */
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">AI-Friendliness Score</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Overall GEO Score</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{width: '85%'}}></div>
                            </div>
                            <span className="text-sm font-bold text-green-600">85/100</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">AI Readiness</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '92%'}}></div>
                            </div>
                            <span className="text-sm font-bold text-blue-600">92/100</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Content Structure</span>
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-yellow-500 h-2 rounded-full" style={{width: '78%'}}></div>
                            </div>
                            <span className="text-sm font-bold text-yellow-600">78/100</span>
                          </div>
                        </div>
                      </div>
                      <div className="rounded bg-blue-50 p-3">
                        <div className="text-xs font-medium text-blue-700">Optimization Potential</div>
                        <div className="text-xs text-blue-600">+15 points possible with recommended changes</div>
                      </div>
                    </div>
                  )}

                  {index === 1 && (
                    /* Structured Data Generation Feature */
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Generated Files</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between rounded bg-green-50 p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium">FAQ JSON-LD</span>
                          </div>
                          <span className="text-xs bg-green-100 px-2 py-1 rounded">Ready</span>
                        </div>
                        <div className="flex items-center justify-between rounded bg-green-50 p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium">llm.txt</span>
                          </div>
                          <span className="text-xs bg-green-100 px-2 py-1 rounded">Ready</span>
                        </div>
                        <div className="flex items-center justify-between rounded bg-green-50 p-3">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium">ai-dataset.json</span>
                          </div>
                          <span className="text-xs bg-green-100 px-2 py-1 rounded">Ready</span>
                        </div>
                      </div>
                      <div className="rounded bg-blue-50 p-3">
                        <div className="text-xs font-medium text-blue-700">Generated Assets</div>
                        <div className="text-xs text-blue-600">3 files ready for download and deployment</div>
                      </div>
                    </div>
                  )}

                  {index === 2 && (
                    /* AI Citation Optimization Feature */
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Citation Potential</h4>
                      <div className="space-y-3">
                        <div className="rounded bg-green-50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-700">ChatGPT</span>
                            <span className="text-xs bg-green-100 px-2 py-1 rounded">High</span>
                          </div>
                          <div className="text-xs text-green-600">Strong FAQ structure, clear answers</div>
                        </div>
                        <div className="rounded bg-yellow-50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-yellow-700">Perplexity</span>
                            <span className="text-xs bg-yellow-100 px-2 py-1 rounded">Medium</span>
                          </div>
                          <div className="text-xs text-yellow-600">Needs more source attribution</div>
                        </div>
                        <div className="rounded bg-blue-50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-700">Google SGE</span>
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded">High</span>
                          </div>
                          <div className="text-xs text-blue-600">Excellent structured data coverage</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {index === 3 && (
                    /* Multi-Engine Compatibility Feature */
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">AI Engine Compatibility</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700">ChatGPT</div>
                          <div className="text-xs text-green-600">✓ Optimized</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700">Perplexity</div>
                          <div className="text-xs text-green-600">✓ Optimized</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700">Google SGE</div>
                          <div className="text-xs text-green-600">✓ Optimized</div>
                        </div>
                        <div className="text-center p-2 bg-green-50 rounded">
                          <div className="text-sm font-medium text-green-700">Claude</div>
                          <div className="text-xs text-green-600">✓ Optimized</div>
                        </div>
                      </div>
                      <div className="rounded bg-blue-50 p-3">
                        <div className="text-xs font-medium text-blue-700">Universal Standards</div>
                        <div className="text-xs text-blue-600">Compatible with current and future AI engines</div>
                      </div>
                    </div>
                  )}

                  {index === 4 && (
                    /* AI Crawler Optimization Feature */
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-800">Crawler Access Status</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">GPTBot</span>
                          </div>
                          <span className="text-xs text-green-600">Allowed</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-sm">ClaudeBot</span>
                          </div>
                          <span className="text-xs text-green-600">Allowed</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            <span className="text-sm">PerplexityBot</span>
                          </div>
                          <span className="text-xs text-red-600">Blocked</span>
                        </div>
                      </div>
                      <div className="rounded bg-yellow-50 p-3">
                        <div className="text-xs font-medium text-yellow-700">Recommendation</div>
                        <div className="text-xs text-yellow-600">Allow PerplexityBot for better coverage</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Process Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 rounded-2xl bg-blue-50 p-8 text-center"
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Three-Asset Guarantee
          </h3>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600">
            Every operation generates three files: Result.xlsx (with multiple sheets),
            pipeline.json (reusable recipe), and report.json (quality audit).
            Nothing is lost, everything is traceable.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <div className="mb-2 text-3xl">📊</div>
              <div className="font-semibold">Result.xlsx</div>
              <div className="text-sm text-gray-600">Processed data with multiple sheets</div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="mb-2 text-3xl">🧩</div>
              <div className="font-semibold">pipeline.json</div>
              <div className="text-sm text-gray-600">Reusable execution recipe</div>
            </div>
            <div className="rounded-lg bg-white p-4">
              <div className="mb-2 text-3xl">📋</div>
              <div className="font-semibold">report.json</div>
              <div className="text-sm text-gray-600">Quality and audit report</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
