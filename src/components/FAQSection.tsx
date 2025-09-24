'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What is GEO (Generative Engine Optimization) and how is it different from SEO?',
      answer: 'GEO is the practice of optimizing your website to be cited and featured by AI search engines like ChatGPT, Perplexity, Google SGE, and Claude. Unlike traditional SEO that focuses on ranking in search results, GEO focuses on being the source that AI engines cite and recommend to users. It requires different optimization techniques like structured data, FAQ schemas, and AI-friendly content formatting.',
    },
    {
      question: 'Which AI search engines does GeoAIWork help optimize for?',
      answer: 'GeoAIWork optimizes your website for all major AI search engines including ChatGPT, Perplexity, Google SGE (Search Generative Experience), Claude, Bing Chat, and other generative AI platforms. Our analysis considers the unique requirements and preferences of each AI engine to maximize your visibility across all platforms.',
    },
    {
      question: 'How accurate is your AI-friendliness scoring system?',
      answer: 'Our scoring system analyzes over 150+ factors that influence AI engine citations, including content structure, FAQ presence, structured data implementation, technical SEO elements, and AI crawler accessibility. The system is continuously updated based on research and testing with actual AI engines, providing accuracy rates of 95%+ in predicting citation potential.',
    },
    {
      question: 'What structured data files does GeoAIWork generate and why are they important?',
      answer: 'GeoAIWork generates three essential files: FAQ JSON-LD schema (helps AI engines understand your questions and answers), llm.txt file (provides crawling instructions and site context for AI bots), and ai-dataset.json (structured information optimized for AI training). These files significantly improve your chances of being cited by AI engines.',
    },
    {
      question: 'How long does it take to see results from GEO optimization?',
      answer: 'Initial improvements can be seen within 2-4 weeks after implementing our recommendations. Most clients see a 200-400% increase in AI citations within 30-60 days. The timeline depends on your current AI-friendliness score, content quality, and how quickly you implement the suggested optimizations.',
    },
    {
      question: 'Can GeoAIWork analyze websites in languages other than English?',
      answer: 'Currently, GeoAIWork is optimized for English-language websites targeting international markets. However, the structured data files and technical optimizations work across languages. We\'re planning to add support for additional languages based on user demand.',
    },
    {
      question: 'Do I need technical knowledge to implement the GEO recommendations?',
      answer: 'Not at all! Our recommendations come with step-by-step implementation guides suitable for marketers and content creators. The generated files (FAQ JSON-LD, llm.txt, ai-dataset.json) can be easily added to your website by copying and pasting the provided code. For more complex changes, we include detailed instructions or suggest consulting with a developer.',
    },
    {
      question: 'How often should I run a GEO analysis on my website?',
      answer: 'We recommend running a GEO analysis monthly for active websites, or whenever you make significant content updates. AI search algorithms evolve rapidly, and regular analysis ensures your optimization stays current with the latest ranking factors and citation preferences.',
    },
    {
      question: 'What makes content \'AI-citation worthy\' according to your analysis?',
      answer: 'AI-citation worthy content typically has clear question-answer structure, authoritative information with proper attribution, FAQ sections, step-by-step guides, and factual data that AI engines can verify. Our analysis identifies gaps in your content structure and provides specific recommendations to make your content more likely to be cited.',
    },
    {
      question: 'Is there a free version of GeoAIWork available?',
      answer: 'Yes! GeoAIWork offers free GEO analysis with basic optimization recommendations and generated structured data files. You can analyze your website, get your AI-friendliness score, and download the essential files at no cost. Premium features include advanced analysis, competitor comparisons, and priority support.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="scroll-mt-20 bg-gray-50 py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about GEO optimization and AI search visibility
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset"
              >
                <div className="flex items-center justify-between">
                  <h3 className="pr-8 text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index
                      ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        )
                      : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                  </div>
                </div>
              </button>

              <motion.div
                initial={false}
                animate={{
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        {/*  <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-blue-50 rounded-xl p-8"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Still have questions?
          </h3>
          <p className="text-gray-600 mb-6">
            Our team is here to help you get the most out of SheetAlly's data processing capabilities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-100 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
