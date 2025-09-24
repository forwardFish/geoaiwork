'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Bot,
  CheckCircle,
  Download,
  FileCode,
  Globe,
  Loader2,
  Search,
  Target,
  TrendingUp,
  AlertTriangle,
  Copy,
  Zap,
} from 'lucide-react';

interface AnalysisResult {
  url: string;
  overallScore: number;
  aiReadiness: number;
  contentStructure: number;
  technicalSeo: number;
  structuredData: number;
  recommendations: string[];
  keyFindings: {
    title: string;
    status: 'good' | 'warning' | 'error';
    description: string;
  }[];
  generatedFiles: {
    faqJsonLd: string;
    llmTxt: string;
    aiDatasetJson: string;
  };
  aiEngineCompatibility: {
    chatgpt: 'high' | 'medium' | 'low';
    perplexity: 'high' | 'medium' | 'low';
    googleSge: 'high' | 'medium' | 'low';
    claude: 'high' | 'medium' | 'low';
  };
}

export function AnalyzeWorkbench() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError(null);

      // Call our GEO analysis API
      const response = await fetch('/api/analyze-geo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const analysisResult = await response.json();
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const downloadFile = (content: string, filename: string, type: string = 'application/json') => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompatibilityColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-green-50 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const getStatusIcon = (status: 'good' | 'warning' | 'error') => {
    switch (status) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            GEO Analysis Tool
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Analyze your website's AI-friendliness and optimization for ChatGPT, Perplexity,
            and other generative AI search engines.
          </p>
        </div>

        {/* Analysis Input */}
        <div className="mb-12">
          <div className="mx-auto max-w-2xl">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="mb-6">
                <label htmlFor="url" className="mb-2 block text-sm font-medium text-gray-700">
                  Website URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isAnalyzing}
                  />
                  <Globe className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700">{error}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-semibold transition-all duration-300 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                {isAnalyzing ? 'Analyzing Website...' : 'Analyze Website'}
              </button>

              <p className="mt-4 text-center text-sm text-gray-500">
                Analysis includes AI-friendliness scoring, structured data generation, and optimization recommendations
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Overall Scores */}
            <div className="mb-12 grid gap-6 md:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow-lg text-center">
                <div className="mb-2 flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(result.overallScore)}`}>
                  {result.overallScore}/100
                </div>
                <div className="text-sm text-gray-600">Overall GEO Score</div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Bot className="h-8 w-8 text-green-600" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(result.aiReadiness)}`}>
                  {result.aiReadiness}/100
                </div>
                <div className="text-sm text-gray-600">AI Readiness</div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg text-center">
                <div className="mb-2 flex items-center justify-center">
                  <FileCode className="h-8 w-8 text-purple-600" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(result.contentStructure)}`}>
                  {result.contentStructure}/100
                </div>
                <div className="text-sm text-gray-600">Content Structure</div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow-lg text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(result.structuredData)}`}>
                  {result.structuredData}/100
                </div>
                <div className="text-sm text-gray-600">Structured Data</div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Key Findings */}
              <div className="rounded-xl bg-white p-8 shadow-lg">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">Key Findings</h3>
                <div className="space-y-4">
                  {result.keyFindings.map((finding, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50">
                      {getStatusIcon(finding.status)}
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{finding.title}</div>
                        <div className="text-sm text-gray-600">{finding.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Engine Compatibility */}
              <div className="rounded-xl bg-white p-8 shadow-lg">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">AI Engine Compatibility</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${getCompatibilityColor(result.aiEngineCompatibility.chatgpt)}`}>
                    <div className="font-semibold">ChatGPT</div>
                    <div className="text-sm capitalize">{result.aiEngineCompatibility.chatgpt}</div>
                  </div>
                  <div className={`p-4 rounded-lg border ${getCompatibilityColor(result.aiEngineCompatibility.perplexity)}`}>
                    <div className="font-semibold">Perplexity</div>
                    <div className="text-sm capitalize">{result.aiEngineCompatibility.perplexity}</div>
                  </div>
                  <div className={`p-4 rounded-lg border ${getCompatibilityColor(result.aiEngineCompatibility.googleSge)}`}>
                    <div className="font-semibold">Google SGE</div>
                    <div className="text-sm capitalize">{result.aiEngineCompatibility.googleSge}</div>
                  </div>
                  <div className={`p-4 rounded-lg border ${getCompatibilityColor(result.aiEngineCompatibility.claude)}`}>
                    <div className="font-semibold">Claude</div>
                    <div className="text-sm capitalize">{result.aiEngineCompatibility.claude}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8 rounded-xl bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">Optimization Recommendations</h3>
              <div className="space-y-3">
                {result.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-gray-700">{recommendation}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Files */}
            <div className="mt-8 rounded-xl bg-white p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">Generated Optimization Files</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileCode className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">FAQ JSON-LD</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Structured FAQ markup for better AI understanding
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadFile(result.generatedFiles.faqJsonLd, 'faq-schema.json')}
                      className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.generatedFiles.faqJsonLd)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Bot className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">llm.txt</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    LLM crawling instructions and site overview
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadFile(result.generatedFiles.llmTxt, 'llm.txt', 'text/plain')}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.generatedFiles.llmTxt)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold">ai-dataset.json</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    AI training dataset with key information
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadFile(result.generatedFiles.aiDatasetJson, 'ai-dataset.json')}
                      className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm hover:bg-purple-200"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    <button
                      onClick={() => copyToClipboard(result.generatedFiles.aiDatasetJson)}
                      className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}