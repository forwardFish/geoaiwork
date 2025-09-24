# AI可见度监控工具 产品需求文档 (PRD)

## 文档版本信息
- **版本**: v1.0.0
- **文档创建**: 2025-01-23
- **产品负责人**: AI可见度监控工具 产品团队
- **开发周期**: 2周 (AI可见度监控平台 MVP)
- **项目代号**: AIVisibility-MVP
- **目标域名**: geoaiwork.com

---

## 1. 项目概述

### 1.1 产品愿景
构建一款面向网站运营者的AI可见度监控与优化工具，帮助用户跟踪其网站在AI问答引擎（如ChatGPT、Gemini、Perplexity等）中的曝光情况，并指导其改进内容以提升在AI回答中的被引用机会。

### 1.2 核心价值主张
- **AI可见度监测 (AEO)**: 跟踪网站在AI问答引擎中的曝光和引用情况
- **问题监控系统**: 管理多个关键问题的持续监控和状态跟踪
- **竞争对手分析**: 了解哪些竞争对手在相同问题上获得AI引用
- **内容优化建议**: 基于AI回答结果提供具体的内容改进建议

### 1.3 核心功能模块
- **查询监测工具**: 模拟AI提问，检查网站在回答中的引用状态
- **问题管理列表**: 批量监控多个问题的AI可见度状态
- **可见度报告**: 直观展示引用状态、变化趋势和竞争对手情况
- **内容优化基础**: 提供AI回答内容分析和改进建议

### 1.4 AI可见度监控工具 成功指标

- **技术KPIs**:
  - AI查询响应时间 < 10秒
  - 问题监控准确率 > 95%
  - 平台并发用户支持 > 500
  - API可用性 > 99.5%

- **业务KPIs**:
  - 月活跃用户 > 5,000
  - 用户问题监控列表平均 > 15个问题
  - 付费转化率 > 10%
  - 用户留存率 (30天) > 65%

- **产品KPIs**:
  - 日问题查询量 > 2,000
  - AI引用状态检测准确率 > 90%
  - 用户满意度评分 > 4.3/5
  - 竞争对手识别准确度 > 85%

---

## 2. AI可见度监控工具 平台架构设计

### 2.1 技术架构概览

```
┌─────────────────────────────────────────────────────────┐
│            AI可见度监控工具前端 (Next.js 15)              │
├─────────────────────────────────────────────────────────┤
│  • 首页与产品介绍                                          │
│  • 问题监控仪表板                                          │
│  • AI查询结果展示                                         │
│  • 用户认证与账户管理                                       │
│  • Chrome插件接口                                         │
└─────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────┐
│               监控工具 API层 (Next.js API Routes)        │
├─────────────────────────────────────────────────────────┤
│  • /api/monitor - 问题监控管理                             │
│  • /api/query - AI查询执行                               │
│  • /api/analysis - 引用状态分析                           │
│  • /api/reports - 可见度报告生成                          │
│  • /api/competitors - 竞争对手分析                        │
│  • /api/optimization - 内容优化建议                       │
└─────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────┐
│                 监控工具 核心服务层                        │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AI查询       │  │ 引用检测      │  │ 问题管理      │  │
│  │ 引擎         │  │ 分析器        │  │ 系统         │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 任务调度     │  │ 报告生成      │  │ 内容优化     │  │
│  │ 系统         │  │ 器           │  │ 建议器       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────┐
│            数据层 (PostgreSQL + DrizzleORM)              │
├─────────────────────────────────────────────────────────┤
│  • 用户账户与订阅数据                                       │
│  • 问题监控列表                                           │
│  • AI查询结果历史                                         │
│  • 引用状态变化记录                                        │
│  • 竞争对手分析数据                                        │
│  • 内容优化建议记录                                        │
└─────────────────────────────────────────────────────────┘
```

### 2.2 AI可见度监控工具 技术栈选型

| 分类 | 技术选择 | 选择理由 | 监控工具应用场景 |
|----------|------------------|------------------|----------------------|
| **前端** | Next.js 15 + TypeScript | SSR支持SEO，开发效率高 | 监控仪表板与报告展示 |
| **样式** | Tailwind CSS 4 | 现代化设计，响应式友好 | 产品界面与营销页面 |
| **后端API** | Next.js API Routes | 全栈集成，部署简化 | AI查询与监控管理APIs |
| **数据库** | PostgreSQL + DrizzleORM | 关系型数据，类型安全 | 监控数据与结果存储 |
| **认证** | Clerk | 现代化认证，多种登录方式 | 用户注册、登录、订阅管理 |
| **AI集成** | OpenAI API + 多AI引擎 | 支持多种AI问答引擎 | ChatGPT、Perplexity等查询 |
| **任务调度** | Next.js Cron + Bull Queue | 定时监控任务 | 自动化问题监控检查 |
| **缓存** | Redis (可选) | 减少重复查询 | AI回答结果缓存 |
| **部署** | Vercel | 无服务器，自动扩容 | 快速全球部署 |
| **监控** | PostHog + Sentry | 用户行为+错误监控 | 产品使用数据分析 |

---

## 3. AI可见度监控工具 核心功能详细设计

### 3.1 功能模块1: 查询监测工具

#### 3.1.1 功能概述
核心功能，模拟AI问答引擎提问，检查指定网站是否在AI回答中被引用或提及。

#### 3.1.2 AI查询监测框架

```typescript
interface AIVisibilityQuery {
  // 基础信息
  queryId: string;
  targetDomain: string;
  question: string;
  createdAt: Date;

  // AI引擎设置
  aiEngines: ('chatgpt' | 'perplexity' | 'gemini' | 'bing')[];

  // 查询结果
  results: AIQueryResult[];

  // 引用状态
  citationStatus: {
    mentioned: boolean;
    citedSources: string[];
    competitorDomains: string[];
    snippets: string[];
  };
}

interface AIQueryResult {
  engine: string;
  query: string;
  response: string;
  timestamp: Date;

  // 分析结果
  analysis: {
    targetDomainMentioned: boolean;
    mentionCount: number;
    contextSnippets: string[];
    citationPosition: number | null;
    competitorsMentioned: string[];
    responseQuality: 'low' | 'medium' | 'high';
  };
}

interface MonitoringQuestion {
  id: string;
  userId: string;
  question: string;
  targetDomain: string;
  keywords: string[];

  // 监控设置
  frequency: 'daily' | 'weekly' | 'monthly';
  isActive: boolean;
  priority: 'high' | 'medium' | 'low';

  // 状态跟踪
  currentStatus: 'cited' | 'not_cited' | 'unknown';
  lastChecked: Date;
  statusHistory: StatusChange[];

  // 竞争对手
  competitorsDomains: string[];

  createdAt: Date;
  updatedAt: Date;
}

interface StatusChange {
  timestamp: Date;
  previousStatus: string;
  newStatus: string;
  aiEngine: string;
  changedBy: 'system' | 'user';
}
```

#### 3.1.3 AI查询引擎实现

```typescript
class AIVisibilityMonitor {
  private aiEngines: Map<string, AIEngine>;

  constructor() {
    this.aiEngines = new Map([
      ['chatgpt', new ChatGPTEngine()],
      ['perplexity', new PerplexityEngine()],
      ['gemini', new GeminiEngine()],
      ['bing', new BingAIEngine()],
    ]);
  }

  async queryAIEngines(
    question: string,
    targetDomain: string,
    engines: string[] = ['chatgpt']
  ): Promise<AIVisibilityQuery> {

    // 并行查询多个AI引擎
    const queryPromises = engines.map(async (engineName) => {
      const engine = this.aiEngines.get(engineName);
      if (!engine) throw new Error(`Unsupported AI engine: ${engineName}`);

      try {
        const response = await engine.query(question);
        return this.analyzeResponse(response, targetDomain, engineName);
      } catch (error) {
        return this.createErrorResult(engineName, error);
      }
    });

    const results = await Promise.allSettled(queryPromises);
    const successfulResults = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<AIQueryResult>).value);

    // 分析整体引用状态
    const citationStatus = this.analyzeCitationStatus(successfulResults, targetDomain);

    return {
      queryId: generateQueryId(),
      targetDomain,
      question,
      createdAt: new Date(),
      aiEngines: engines as any[],
      results: successfulResults,
      citationStatus
    };
  }

  private analyzeResponse(
    response: string,
    targetDomain: string,
    engine: string
  ): AIQueryResult {
    // 检测目标域名是否被提及
    const domainRegex = new RegExp(targetDomain.replace('.', '\\.'), 'gi');
    const mentions = response.match(domainRegex) || [];

    // 提取引用片段
    const snippets = this.extractContextSnippets(response, targetDomain);

    // 识别竞争对手域名
    const competitors = this.extractCompetitorDomains(response);

    // 计算引用位置 (0-100, 越小越好)
    const citationPosition = this.calculateCitationPosition(response, targetDomain);

    return {
      engine,
      query: response,
      response,
      timestamp: new Date(),
      analysis: {
        targetDomainMentioned: mentions.length > 0,
        mentionCount: mentions.length,
        contextSnippets: snippets,
        citationPosition,
        competitorsMentioned: competitors,
        responseQuality: this.assessResponseQuality(response)
      }
    };
  }

  private extractContextSnippets(response: string, domain: string): string[] {
    const sentences = response.split(/[.!?]+/);
    return sentences
      .filter(sentence =>
        sentence.toLowerCase().includes(domain.toLowerCase())
      )
      .map(sentence => sentence.trim())
      .slice(0, 3); // 限制最多3个片段
  }

  private extractCompetitorDomains(response: string): string[] {
    // 使用正则提取常见域名格式
    const domainRegex = /https?:\/\/([\w\.-]+\.[a-z]{2,})/gi;
    const matches = [...response.matchAll(domainRegex)];

    return [...new Set(matches.map(match => match[1]))]
      .filter(domain => domain !== 'example.com') // 过滤示例域名
      .slice(0, 5); // 限制最多5个竞争对手
  }

  private calculateCitationPosition(response: string, domain: string): number | null {
    const firstMention = response.toLowerCase().indexOf(domain.toLowerCase());
    if (firstMention === -1) return null;

    return Math.round((firstMention / response.length) * 100);
  }

  private analyzeCitationStatus(results: AIQueryResult[], targetDomain: string) {
    const mentioned = results.some(r => r.analysis.targetDomainMentioned);
    const allSnippets = results.flatMap(r => r.analysis.contextSnippets);
    const allCompetitors = [...new Set(results.flatMap(r => r.analysis.competitorsMentioned))];
    const citedSources = results
      .filter(r => r.analysis.targetDomainMentioned)
      .map(r => r.engine);

    return {
      mentioned,
      citedSources,
      competitorDomains: allCompetitors,
      snippets: allSnippets
    };
  }
}

// AI引擎抽象基类
abstract class AIEngine {
  abstract query(question: string): Promise<string>;

  protected async makeRequest(endpoint: string, payload: any): Promise<any> {
    // 通用请求处理逻辑
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getApiKey()}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return await response.json();
  }

  protected abstract getApiKey(): string;
}

// ChatGPT引擎实现
class ChatGPTEngine extends AIEngine {
  protected getApiKey(): string {
    return process.env.OPENAI_API_KEY!;
  }

  async query(question: string): Promise<string> {
    const response = await this.makeRequest('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: question
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  }
}

// Perplexity引擎实现
class PerplexityEngine extends AIEngine {
  protected getApiKey(): string {
    return process.env.PERPLEXITY_API_KEY!;
  }

  async query(question: string): Promise<string> {
    const response = await this.makeRequest('https://api.perplexity.ai/chat/completions', {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'user',
          content: question
        }
      ]
    });

    return response.choices[0].message.content;
  }
}
```

### 3.2 功能模块2: 问题管理与监控系统

#### 3.2.1 多问题监控管理

```typescript
class QuestionMonitorManager {
  async addQuestionToMonitoring(
    userId: string,
    question: string,
    targetDomain: string,
    options: Partial<MonitoringQuestion> = {}
  ): Promise<MonitoringQuestion> {

    // 验证问题是否已存在
    const existingQuestion = await this.findExistingQuestion(userId, question, targetDomain);
    if (existingQuestion) {
      throw new Error('This question is already being monitored for this domain');
    }

    // 创建新的监控问题
    const monitoringQuestion: MonitoringQuestion = {
      id: generateQuestionId(),
      userId,
      question: question.trim(),
      targetDomain: targetDomain.toLowerCase(),
      keywords: this.extractKeywords(question),
      frequency: options.frequency || 'weekly',
      isActive: true,
      priority: options.priority || 'medium',
      currentStatus: 'unknown',
      lastChecked: new Date(0), // 从未检查过
      statusHistory: [],
      competitorsDomains: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // 保存到数据库
    await db.insert(monitoringQuestionsSchema).values(monitoringQuestion);

    // 立即执行第一次查询
    await this.executeImmediateQuery(monitoringQuestion);

    return monitoringQuestion;
  }

  async executeScheduledMonitoring(frequency: 'daily' | 'weekly' | 'monthly'): Promise<void> {
    // 获取需要检查的问题
    const questionsToCheck = await this.getQuestionsForScheduledCheck(frequency);

    console.log(`Starting scheduled monitoring for ${questionsToCheck.length} questions`);

    // 并行处理，但限制并发数量以避免API限流
    const BATCH_SIZE = 5;
    for (let i = 0; i < questionsToCheck.length; i += BATCH_SIZE) {
      const batch = questionsToCheck.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(question => this.checkQuestionStatus(question))
      );

      // 批次间暂停，避免API限流
      if (i + BATCH_SIZE < questionsToCheck.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }

  private async checkQuestionStatus(question: MonitoringQuestion): Promise<void> {
    try {
      console.log(`Checking question: ${question.question}`);

      // 执行AI查询
      const queryResult = await new AIVisibilityMonitor().queryAIEngines(
        question.question,
        question.targetDomain,
        ['chatgpt', 'perplexity'] // 默认查询引擎
      );

      // 确定新状态
      const newStatus = queryResult.citationStatus.mentioned ? 'cited' : 'not_cited';

      // 记录状态变化
      if (newStatus !== question.currentStatus) {
        const statusChange: StatusChange = {
          timestamp: new Date(),
          previousStatus: question.currentStatus,
          newStatus,
          aiEngine: 'multiple',
          changedBy: 'system'
        };

        question.statusHistory.push(statusChange);

        // 发送通知给用户（如果状态从not_cited变为cited）
        if (newStatus === 'cited' && question.currentStatus === 'not_cited') {
          await this.notifyUserOfPositiveChange(question, queryResult);
        }
      }

      // 更新问题状态
      question.currentStatus = newStatus;
      question.lastChecked = new Date();
      question.updatedAt = new Date();

      // 更新竞争对手列表
      question.competitorsDomains = [
        ...new Set([
          ...question.competitorsDomains,
          ...queryResult.citationStatus.competitorDomains
        ])
      ].slice(0, 10); // 限制最多10个竞争对手

      // 保存到数据库
      await db.update(monitoringQuestionsSchema)
        .set({
          currentStatus: question.currentStatus,
          lastChecked: question.lastChecked,
          statusHistory: question.statusHistory,
          competitorsDomains: question.competitorsDomains,
          updatedAt: question.updatedAt
        })
        .where(eq(monitoringQuestionsSchema.id, question.id));

      // 保存查询结果历史
      await this.saveQueryResultHistory(question.id, queryResult);

    } catch (error) {
      console.error(`Error checking question ${question.id}:`, error);

      // 记录错误但不影响其他问题的检查
      await this.logMonitoringError(question.id, error);
    }
  }

  private async notifyUserOfPositiveChange(
    question: MonitoringQuestion,
    queryResult: AIVisibilityQuery
  ): Promise<void> {
    // 发送邮件通知
    const emailContent = {
      to: await this.getUserEmail(question.userId),
      subject: '🎉 Your website is now being cited by AI!',
      template: 'positive-citation-change',
      data: {
        question: question.question,
        domain: question.targetDomain,
        citedSources: queryResult.citationStatus.citedSources,
        snippets: queryResult.citationStatus.snippets.slice(0, 2)
      }
    };

    await this.sendNotificationEmail(emailContent);

    // 记录到用户通知表
    await db.insert(userNotificationsSchema).values({
      userId: question.userId,
      type: 'positive_citation_change',
      title: 'Website Now Cited by AI',
      content: `Your question "${question.question}" is now being answered with citations to ${question.targetDomain}`,
      isRead: false,
      createdAt: new Date()
    });
  }

  async generateVisibilityReport(
    userId: string,
    timeframe: '7d' | '30d' | '90d' = '30d'
  ): Promise<VisibilityReport> {
    const questions = await this.getUserQuestions(userId);

    const report: VisibilityReport = {
      userId,
      generatedAt: new Date(),
      timeframe,
      summary: {
        totalQuestions: questions.length,
        citedQuestions: questions.filter(q => q.currentStatus === 'cited').length,
        notCitedQuestions: questions.filter(q => q.currentStatus === 'not_cited').length,
        unknownQuestions: questions.filter(q => q.currentStatus === 'unknown').length,
        citationRate: 0,
        trends: await this.calculateTrends(questions, timeframe)
      },
      questionDetails: await Promise.all(
        questions.map(q => this.generateQuestionReport(q, timeframe))
      ),
      competitorAnalysis: await this.generateCompetitorAnalysis(questions),
      recommendations: await this.generateRecommendations(questions)
    };

    // 计算引用率
    const validQuestions = questions.filter(q => q.currentStatus !== 'unknown');
    if (validQuestions.length > 0) {
      report.summary.citationRate = Math.round(
        (report.summary.citedQuestions / validQuestions.length) * 100
      );
    }

    return report;
  }
}

interface VisibilityReport {
  userId: string;
  generatedAt: Date;
  timeframe: string;

  summary: {
    totalQuestions: number;
    citedQuestions: number;
    notCitedQuestions: number;
    unknownQuestions: number;
    citationRate: number; // 0-100
    trends: {
      weeklyChange: number; // +/- percentage
      topPerformingQuestions: string[];
      needsAttentionQuestions: string[];
    };
  };

  questionDetails: QuestionReport[];
  competitorAnalysis: CompetitorAnalysis;
  recommendations: OptimizationRecommendation[];
}

interface QuestionReport {
  questionId: string;
  question: string;
  currentStatus: string;
  statusChanges: number; // 状态变化次数
  lastCited: Date | null;
  competitorCount: number;
  aiEnginePerformance: {
    chatgpt: 'cited' | 'not_cited' | 'unknown';
    perplexity: 'cited' | 'not_cited' | 'unknown';
  };
  recommendedActions: string[];
}
```

---

## 4. AI可见度监控工具 用户界面设计

### 4.1 首页与营销页面设计

```tsx
// src/app/page.tsx - AI可见度监控工具首页
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Showcase */}
      <FeaturesSection />

      {/* Live Demo */}
      <LiveDemoSection />

      {/* Customer Testimonials */}
      <TestimonialsSection />

      {/* Pricing */}
      <PricingSection />

      {/* CTA */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          监控您的网站在
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            {" "}AI搜索引擎中的可见度
          </span>
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          追踪您的网站在ChatGPT、Perplexity、Gemini等AI问答引擎中的引用情况。了解竞争对手表现，获取内容优化建议，提升AI可见度。
        </p>

        {/* Question Monitoring Input */}
        <div className="max-w-2xl mx-auto mb-8">
          <QuestionMonitoringInput />
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <FeatureHighlight
            icon="🔍"
            title="AI查询监测"
            description="模拟AI提问，检查网站引用状态"
          />
          <FeatureHighlight
            icon="📊"
            title="多问题监控"
            description="批量监控多个关键问题的AI可见度"
          />
          <FeatureHighlight
            icon="🏆"
            title="竞争对手分析"
            description="了解竞争对手的AI引用表现"
          />
        </div>
      </div>
    </section>
  );
}

function QuestionMonitoringInput() {
  const [question, setQuestion] = useState('');
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  const handleStartMonitoring = async () => {
    if (!question.trim() || !domain.trim()) {
      toast.error('请输入要监控的问题和您的网站域名');
      return;
    }

    setIsAnalyzing(true);
    try {
      // 创建监控任务
      const response = await fetch('/api/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.trim(),
          targetDomain: domain.trim(),
          frequency: 'weekly'
        })
      });

      const data = await response.json();
      if (data.success) {
        // 跳转到监控仪表板
        router.push('/dashboard');
        toast.success('监控已添加到您的列表中');
      } else {
        toast.error('添加监控失败，请重试');
      }
    } catch (error) {
      toast.error('网络错误，请检查连接');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">免费开始监控</h3>

      <div className="space-y-4">
        {/* 问题输入 */}
        <div>
          <label className="block text-sm font-medium mb-2">要监控的问题</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="例如：最好的SEO工具有哪些？"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isAnalyzing}
          />
        </div>

        {/* 域名输入 */}
        <div>
          <label className="block text-sm font-medium mb-2">您的网站域名</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="例如：example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isAnalyzing}
          />
        </div>

        {/* 开始监控按钮 */}
        <button
          onClick={handleStartMonitoring}
          disabled={isAnalyzing || !question.trim() || !domain.trim()}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 transition-all"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-2">
              <Spinner className="w-5 h-5" />
              正在分析...
            </div>
          ) : (
            '🚀 开始免费监控'
          )}
        </button>
      </div>
    </div>
  );
}
```

### 4.2 监控仪表板

```tsx
// src/app/dashboard/page.tsx - 监控仪表板
export default function MonitoringDashboardPage() {
  const [questions, setQuestions] = useState<MonitoringQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadUserQuestions();
  }, []);

  const loadUserQuestions = async () => {
    try {
      const response = await fetch('/api/monitor/questions');
      const data = await response.json();
      if (data.success) {
        setQuestions(data.questions);
      }
    } catch (error) {
      toast.error('加载监控问题失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 AI可见度监控仪表板
          </h1>
          <p className="text-gray-600">
            监控您网站在AI问答引擎中的引用状态，跟踪可见度变化趋势
          </p>
        </div>

        {/* 概览统计卡片 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <OverviewCard
            title="监控问题总数"
            value={questions.length}
            icon="🔍"
            color="blue"
          />
          <OverviewCard
            title="被AI引用"
            value={questions.filter(q => q.currentStatus === 'cited').length}
            icon="✅"
            color="green"
          />
          <OverviewCard
            title="未被引用"
            value={questions.filter(q => q.currentStatus === 'not_cited').length}
            icon="❌"
            color="red"
          />
          <OverviewCard
            title="引用率"
            value={calculateCitationRate(questions)}
            suffix="%"
            icon="📈"
            color="purple"
          />
        </div>

        {/* 操作栏 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddQuestionModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              + 添加监控问题
            </button>
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="7d">过去7天</option>
              <option value="30d">过去30天</option>
              <option value="90d">过去90天</option>
            </select>
          </div>

          <button
            onClick={generateReport}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            📄 生成报告
          </button>
        </div>

        {/* 问题监控列表 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner className="w-8 h-8" />
          </div>
        ) : questions.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="暂无监控问题"
            description="添加您想要监控的问题，开始跟踪AI可见度"
            actionText="添加第一个问题"
            onAction={() => setShowAddQuestionModal(true)}
          />
        ) : (
          <div className="space-y-4">
            {questions.map(question => (
              <QuestionMonitorCard
                key={question.id}
                question={question}
                onUpdate={loadUserQuestions}
                timeframe={selectedTimeframe}
              />
            ))}
          </div>
        )}
      </div>

      {/* 添加问题模态框 */}
      {showAddQuestionModal && (
        <AddQuestionModal
          onClose={() => setShowAddQuestionModal(false)}
          onSuccess={loadUserQuestions}
        />
      )}
    </div>
  );
}

function QuestionMonitorCard({ question, onUpdate, timeframe }: {
  question: MonitoringQuestion;
  onUpdate: () => void;
  timeframe: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [queryHistory, setQueryHistory] = useState([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cited': return 'text-green-600 bg-green-50';
      case 'not_cited': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'cited': return '✅';
      case 'not_cited': return '❌';
      default: return '❓';
    }
  };

  const loadQueryHistory = async () => {
    if (!isExpanded) return;

    try {
      const response = await fetch(`/api/monitor/questions/${question.id}/history?timeframe=${timeframe}`);
      const data = await response.json();
      if (data.success) {
        setQueryHistory(data.history);
      }
    } catch (error) {
      console.error('加载查询历史失败:', error);
    }
  };

  useEffect(() => {
    loadQueryHistory();
  }, [isExpanded, timeframe]);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* 问题和状态 */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {question.question}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(question.currentStatus)}`}>
              {getStatusIcon(question.currentStatus)}
              {question.currentStatus === 'cited' ? '被引用' :
               question.currentStatus === 'not_cited' ? '未引用' : '未知'}
            </span>
          </div>

          {/* 基本信息 */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <span>🌐 {question.targetDomain}</span>
            <span>📅 {question.frequency === 'daily' ? '每日检查' :
                      question.frequency === 'weekly' ? '每周检查' : '每月检查'}</span>
            <span>🕒 上次检查: {formatRelativeTime(question.lastChecked)}</span>
            {question.competitorsDomains.length > 0 && (
              <span>🏆 {question.competitorsDomains.length} 个竞争对手</span>
            )}
          </div>

          {/* 状态历史简要 */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">最近变化:</span>
            <div className="flex gap-1">
              {question.statusHistory.slice(-10).map((change, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    change.newStatus === 'cited' ? 'bg-green-400' :
                    change.newStatus === 'not_cited' ? 'bg-red-400' : 'bg-gray-400'
                  }`}
                  title={`${formatDate(change.timestamp)}: ${change.previousStatus} → ${change.newStatus}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2">
          <button
            onClick={() => checkQuestionNow(question.id)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
            title="立即检查"
          >
            🔄
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            {isExpanded ? '📖' : '📄'}
          </button>
          <QuestionOptionsDropdown question={question} onUpdate={onUpdate} />
        </div>
      </div>

      {/* 展开的详细信息 */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Tabs defaultValue="history">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="history">查询历史</TabsTrigger>
              <TabsTrigger value="competitors">竞争对手</TabsTrigger>
              <TabsTrigger value="suggestions">优化建议</TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-4">
              <QueryHistoryView history={queryHistory} />
            </TabsContent>

            <TabsContent value="competitors" className="mt-4">
              <CompetitorAnalysisView
                competitors={question.competitorsDomains}
                question={question.question}
              />
            </TabsContent>

            <TabsContent value="suggestions" className="mt-4">
              <OptimizationSuggestions
                question={question}
                currentStatus={question.currentStatus}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </Card>
  );
}

function QueryHistoryView({ history }: { history: any[] }) {
  return (
    <div className="space-y-3">
      {history.length === 0 ? (
        <p className="text-gray-500 text-center py-4">暂无查询历史</p>
      ) : (
        history.map((record, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  record.mentioned ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {record.mentioned ? '✅ 被引用' : '❌ 未引用'}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDate(record.timestamp)}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {record.aiEngines.join(', ')}
              </div>
            </div>

            {record.mentioned && record.snippets.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">引用片段:</p>
                {record.snippets.slice(0, 2).map((snippet, i) => (
                  <blockquote key={i} className="text-sm bg-white p-2 rounded border-l-3 border-green-400 mb-1">
                    "{snippet}"
                  </blockquote>
                ))}
              </div>
            )}

            {record.competitorDomains.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">竞争对手:</p>
                <div className="flex flex-wrap gap-1">
                  {record.competitorDomains.slice(0, 3).map((domain, i) => (
                    <span key={i} className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                      {domain}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
```

---

## 5. AI可见度监控工具 API设计

### 5.1 RESTful API设计

#### 5.1.1 问题监控管理API

```typescript
// POST /api/monitor/questions - 添加监控问题
interface AddMonitoringQuestionRequest {
  question: string;
  targetDomain: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  priority?: 'high' | 'medium' | 'low';
  keywords?: string[];
}

interface AddMonitoringQuestionResponse {
  success: boolean;
  data?: {
    questionId: string;
    question: MonitoringQuestion;
    initialResult?: AIVisibilityQuery;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

// 实现示例
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { question, targetDomain, frequency, priority, keywords } = await request.json();

    // 验证输入
    if (!question?.trim() || !targetDomain?.trim()) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Question and domain are required'
        }
      }, { status: 400 });
    }

    // 检查用户配额
    const userQuota = await checkUserQuota(userId);
    if (!userQuota.canAddQuestion) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'QUOTA_EXCEEDED',
          message: 'Monitoring question quota exceeded'
        }
      }, { status: 429 });
    }

    // 添加监控问题
    const questionManager = new QuestionMonitorManager();
    const monitoringQuestion = await questionManager.addQuestionToMonitoring(
      userId,
      question.trim(),
      targetDomain.trim(),
      { frequency, priority, keywords }
    );

    // 立即执行第一次查询
    const aiMonitor = new AIVisibilityMonitor();
    const initialResult = await aiMonitor.queryAIEngines(
      question.trim(),
      targetDomain.trim(),
      ['chatgpt', 'perplexity']
    );

    return NextResponse.json({
      success: true,
      data: {
        questionId: monitoringQuestion.id,
        question: monitoringQuestion,
        initialResult
      }
    });

  } catch (error) {
    console.error('Add monitoring question failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'OPERATION_FAILED',
        message: 'Failed to add monitoring question'
      }
    }, { status: 500 });
  }
}

// GET /api/monitor/questions - 获取用户的监控问题列表
export async function GET(request: NextRequest) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status'); // 'cited', 'not_cited', 'unknown'
  const priority = searchParams.get('priority');

  try {
    const questions = await db.select()
      .from(monitoringQuestionsSchema)
      .where(
        and(
          eq(monitoringQuestionsSchema.userId, userId),
          status ? eq(monitoringQuestionsSchema.currentStatus, status) : undefined,
          priority ? eq(monitoringQuestionsSchema.priority, priority) : undefined,
          eq(monitoringQuestionsSchema.isActive, true)
        )
      )
      .orderBy(desc(monitoringQuestionsSchema.updatedAt));

    return NextResponse.json({
      success: true,
      data: {
        questions,
        count: questions.length
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { code: 'FETCH_FAILED', message: 'Failed to fetch questions' }
    }, { status: 500 });
  }
}
```

#### 5.1.2 AI查询执行API

```typescript
// POST /api/query/ai-visibility - 执行AI可见度查询
interface AIVisibilityQueryRequest {
  question: string;
  targetDomain: string;
  aiEngines?: ('chatgpt' | 'perplexity' | 'gemini' | 'bing')[];
  saveToHistory?: boolean;
  questionId?: string; // 关联到监控问题
}

interface AIVisibilityQueryResponse {
  success: boolean;
  data?: {
    queryId: string;
    query: AIVisibilityQuery;
    analysis: {
      mentioned: boolean;
      citationRate: number;
      competitorCount: number;
      suggestions: string[];
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { question, targetDomain, aiEngines = ['chatgpt'], saveToHistory = true, questionId } = await request.json();

  try {
    // 执行AI查询
    const monitor = new AIVisibilityMonitor();
    const result = await monitor.queryAIEngines(question, targetDomain, aiEngines);

    // 分析结果
    const analysis = {
      mentioned: result.citationStatus.mentioned,
      citationRate: result.citationStatus.mentioned ? 100 : 0,
      competitorCount: result.citationStatus.competitorDomains.length,
      suggestions: generateQuickSuggestions(result)
    };

    // 保存查询历史
    if (saveToHistory) {
      await db.insert(aiQueryHistorySchema).values({
        userId,
        questionId: questionId || null,
        question,
        targetDomain,
        queryResult: result,
        mentioned: result.citationStatus.mentioned,
        competitorDomains: result.citationStatus.competitorDomains,
        createdAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        queryId: result.queryId,
        query: result,
        analysis
      }
    });

  } catch (error) {
    console.error('AI visibility query failed:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'QUERY_FAILED',
        message: 'AI visibility query failed'
      }
    }, { status: 500 });
  }
}

// POST /api/query/batch - 批量查询多个问题
interface BatchQueryRequest {
  queries: {
    question: string;
    targetDomain: string;
    questionId?: string;
  }[];
  aiEngines?: string[];
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { queries, aiEngines = ['chatgpt'] } = await request.json();

  // 验证批量大小
  if (queries.length > 10) {
    return NextResponse.json({
      success: false,
      error: { code: 'BATCH_SIZE_EXCEEDED', message: 'Maximum 10 queries per batch' }
    }, { status: 400 });
  }

  const batchId = generateBatchId();

  // 启动后台处理
  processBatchQueries(batchId, queries, aiEngines, userId);

  return NextResponse.json({
    success: true,
    data: {
      batchId,
      status: 'processing',
      estimatedCompletionTime: queries.length * 15, // 每个查询15秒
      trackingUrl: `/api/query/batch/${batchId}/status`
    }
  });
}
```

#### 5.1.3 报告生成API

```typescript
// GET /api/reports/visibility - 生成AI可见度报告
interface VisibilityReportRequest {
  timeframe?: '7d' | '30d' | '90d';
  format?: 'json' | 'pdf' | 'csv';
  includeCompetitors?: boolean;
  questionIds?: string[]; // 特定问题的报告
}

export async function GET(request: NextRequest) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);

  const timeframe = (searchParams.get('timeframe') as any) || '30d';
  const format = searchParams.get('format') || 'json';
  const includeCompetitors = searchParams.get('includeCompetitors') === 'true';
  const questionIds = searchParams.get('questionIds')?.split(',');

  try {
    const questionManager = new QuestionMonitorManager();
    const report = await questionManager.generateVisibilityReport(
      userId,
      timeframe
    );

    // 如果指定了特定问题，过滤报告
    if (questionIds && questionIds.length > 0) {
      report.questionDetails = report.questionDetails.filter(
        q => questionIds.includes(q.questionId)
      );
      // 重新计算摘要统计
      report.summary = recalculateSummary(report.questionDetails);
    }

    // 根据格式返回
    switch (format) {
      case 'pdf':
        const pdfBuffer = await generatePDFReport(report);
        return new NextResponse(pdfBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="visibility-report-${timeframe}.pdf"`
          }
        });

      case 'csv':
        const csvContent = generateCSVReport(report);
        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="visibility-report-${timeframe}.csv"`
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            report,
            generatedAt: new Date().toISOString()
          }
        });
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { code: 'REPORT_GENERATION_FAILED', message: 'Failed to generate report' }
    }, { status: 500 });
  }
}

// POST /api/reports/competitor-analysis - 竞争对手分析报告
interface CompetitorAnalysisRequest {
  targetDomain: string;
  questions: string[];
  customCompetitors?: string[];
}

export async function POST(request: NextRequest) {
  const { userId } = auth();
  const { targetDomain, questions, customCompetitors } = await request.json();

  try {
    const competitorAnalyzer = new CompetitorVisibilityAnalyzer();
    const analysis = await competitorAnalyzer.analyzeCompetitors(
      targetDomain,
      questions,
      customCompetitors
    );

    // 保存分析结果
    await db.insert(competitorAnalysisSchema).values({
      userId,
      targetDomain,
      questions,
      competitors: analysis.competitors,
      analysis: analysis,
      createdAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: { code: 'COMPETITOR_ANALYSIS_FAILED', message: 'Competitor analysis failed' }
    }, { status: 500 });
  }
}
```

### 5.2 数据模型设计

基于现有DrizzleORM模式，扩展Schema.ts：

```typescript
// src/models/Schema.ts扩展

import {
  integer,
  json,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  decimal
} from 'drizzle-orm/pg-core';

// 监控问题表
export const monitoringQuestionsSchema = pgTable('monitoring_questions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }), // Clerk用户ID
  question: text('question').notNull(),
  targetDomain: varchar('target_domain', { length: 256 }).notNull(),
  keywords: json('keywords'), // string[]

  // 监控设置
  frequency: varchar('frequency', { length: 20 }).default('weekly'), // 'daily', 'weekly', 'monthly'
  isActive: boolean('is_active').default(true),
  priority: varchar('priority', { length: 20 }).default('medium'), // 'high', 'medium', 'low'

  // 状态跟踪
  currentStatus: varchar('current_status', { length: 20 }).default('unknown'), // 'cited', 'not_cited', 'unknown'
  lastChecked: timestamp('last_checked', { mode: 'date' }),
  statusHistory: json('status_history'), // StatusChange[]

  // 竞争对手
  competitorsDomains: json('competitors_domains'), // string[]

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// AI查询历史表
export const aiQueryHistorySchema = pgTable('ai_query_history', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }),
  questionId: integer('question_id').references(() => monitoringQuestionsSchema.id),

  // 查询内容
  question: text('question').notNull(),
  targetDomain: varchar('target_domain', { length: 256 }).notNull(),

  // 查询结果
  queryResult: json('query_result'), // AIVisibilityQuery对象
  mentioned: boolean('mentioned'), // 快速查询用
  competitorDomains: json('competitor_domains'), // string[]

  // 元数据
  aiEngines: json('ai_engines'), // string[]
  processingTime: integer('processing_time'), // 毫秒

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// 批量查询表
export const batchQueriesSchema = pgTable('batch_queries', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }),
  batchId: varchar('batch_id', { length: 100 }).unique().notNull(),

  queries: json('queries'), // 查询数组
  options: json('options'), // 查询选项

  // 状态跟踪
  status: varchar('status', { length: 20 }).default('processing'), // 'processing', 'completed', 'failed'
  completedCount: integer('completed_count').default(0),
  totalCount: integer('total_count').notNull(),
  results: json('results'), // 结果数组

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  completedAt: timestamp('completed_at', { mode: 'date' }),
});

// 竞争对手分析表
export const competitorAnalysisSchema = pgTable('competitor_analysis', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }),

  targetDomain: varchar('target_domain', { length: 256 }).notNull(),
  questions: json('questions'), // 分析的问题数组
  competitors: json('competitors'), // 竞争对手域名数组

  // 分析结果
  analysis: json('analysis'), // 完整分析结果

  // 摘要统计
  targetCitationRate: decimal('target_citation_rate', { precision: 5, scale: 2 }),
  avgCompetitorCitationRate: decimal('avg_competitor_citation_rate', { precision: 5, scale: 2 }),
  opportunitiesFound: integer('opportunities_found'),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// 用户订阅和配额表
export const userSubscriptionSchema = pgTable('user_subscriptions', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }).unique().notNull(),

  // 订阅信息
  plan: varchar('plan', { length: 50 }).default('free'), // 'free', 'pro', 'enterprise'
  subscriptionStatus: varchar('subscription_status', { length: 20 }).default('active'),

  // 配额设置
  questionQuota: integer('question_quota').default(10), // 监控问题配额
  queryQuota: integer('query_quota').default(100), // 月查询配额
  questionsUsed: integer('questions_used').default(0),
  queriesUsed: integer('queries_used').default(0),
  quotaResetDate: timestamp('quota_reset_date', { mode: 'date' }),

  // 支付信息
  stripeCustomerId: varchar('stripe_customer_id', { length: 256 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 256 }),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});

// 用户通知表
export const userNotificationsSchema = pgTable('user_notifications', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 256 }),

  type: varchar('type', { length: 50 }), // 'positive_citation_change', 'negative_citation_change', 'quota_warning'
  title: varchar('title', { length: 256 }),
  content: text('content'),

  // 状态
  isRead: boolean('is_read').default(false),
  readAt: timestamp('read_at', { mode: 'date' }),

  // 关联数据
  relatedQuestionId: integer('related_question_id').references(() => monitoringQuestionsSchema.id),
  metadata: json('metadata'), // 额外数据

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
});

// 系统配置表（AI引擎配置等）
export const systemConfigSchema = pgTable('system_config', {
  id: serial('id').primaryKey(),
  configKey: varchar('config_key', { length: 100 }).unique().notNull(),
  configValue: json('config_value'),
  description: text('description'),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow(),
});
```

### 5.3 Webhook & 实时通知

```typescript
// Webhook处理器，用于处理AI引擎状态变化或外部集成
export async function POST(request: NextRequest) {
  const signature = request.headers.get('webhook-signature');
  const payload = await request.text();

  // 验证webhook签名
  if (!verifyWebhookSignature(signature, payload)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(payload);

  switch (event.type) {
    case 'ai_engine_status_change':
      await handleAIEngineStatusChange(event.data);
      break;

    case 'user_subscription_updated':
      await updateUserSubscription(event.data);
      break;

    case 'scheduled_monitoring_trigger':
      await triggerScheduledMonitoring(event.data);
      break;

    default:
      console.log('Unhandled webhook event:', event.type);
  }

  return NextResponse.json({ success: true });
}

// Server-Sent Events for real-time updates
export async function GET(request: NextRequest) {
  const { userId } = auth();
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get('questionId');

  // 设置SSE响应头
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // 发送初始连接确认
      controller.enqueue(encoder.encode(`data: {"type": "connected", "timestamp": "${new Date().toISOString()}"}\n\n`));

      // 监听数据库变化或使用轮询
      const interval = setInterval(async () => {
        try {
          const updates = await getRealtimeUpdates(userId, questionId);
          if (updates.length > 0) {
            for (const update of updates) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`));
            }
          }
        } catch (error) {
          controller.enqueue(encoder.encode(`data: {"type": "error", "message": "Update failed"}\n\n`));
        }
      }, 5000); // 每5秒检查一次

      // 清理函数
      return () => {
        clearInterval(interval);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## 6. AI可见度监控工具 商业模式与定价

### 6.1 订阅方案

```typescript
interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  limits: PlanLimits;
  popular?: boolean;
}

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PlanLimits {
  monitoringQuestions: number;
  monthlyQueries: number;
  aiEngines: string[];
  reportFormats: string[];
  competitorTracking: number;
  support: 'community' | 'email' | 'priority';
  historyRetention: string;
}

const AI_VISIBILITY_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: '免费版',
    description: '适合个人用户和小型网站运营者',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      { name: '问题监控', included: true, description: '最多监控3个问题' },
      { name: 'AI查询检测', included: true, description: '仅ChatGPT引擎' },
      { name: '基础可见度报告', included: true },
      { name: '竞争对手分析', included: false },
      { name: '历史数据分析', included: false },
      { name: '内容优化建议', included: false },
      { name: '邮件通知', included: false },
      { name: 'API访问', included: false }
    ],
    limits: {
      monitoringQuestions: 3,
      monthlyQueries: 30,
      aiEngines: ['chatgpt'],
      reportFormats: ['在线查看'],
      competitorTracking: 0,
      support: 'community',
      historyRetention: '7天'
    }
  },
  {
    id: 'pro',
    name: '专业版',
    description: '适合内容营销人员和SEO专业人士',
    monthlyPrice: 39,
    yearlyPrice: 390, // 节省2个月
    popular: true,
    features: [
      { name: '免费版所有功能', included: true },
      { name: '扩展问题监控', included: true, description: '最多50个问题' },
      { name: '多AI引擎支持', included: true, description: 'ChatGPT、Perplexity、Gemini' },
      { name: '竞争对手分析', included: true, description: '最多10个竞争对手' },
      { name: '历史趋势分析', included: true },
      { name: 'AI驱动优化建议', included: true },
      { name: '邮件和推送通知', included: true },
      { name: '高级报告导出', included: true, description: 'PDF、CSV格式' }
    ],
    limits: {
      monitoringQuestions: 50,
      monthlyQueries: 1500,
      aiEngines: ['chatgpt', 'perplexity', 'gemini'],
      reportFormats: ['在线查看', 'PDF', 'CSV'],
      competitorTracking: 10,
      support: 'email',
      historyRetention: '90天'
    }
  },
  {
    id: 'enterprise',
    name: '企业版',
    description: '适合代理公司和大型组织',
    monthlyPrice: 99,
    yearlyPrice: 990,
    features: [
      { name: '专业版所有功能', included: true },
      { name: '无限问题监控', included: true },
      { name: '所有AI引擎支持', included: true, description: '包括Bing、Claude等' },
      { name: '无限竞争对手跟踪', included: true },
      { name: 'API访问', included: true, description: '高频率限制' },
      { name: '白标报告', included: true },
      { name: '团队协作', included: true, description: '最多10个用户' },
      { name: '优先客服支持', included: true },
      { name: 'Chrome插件', included: true }
    ],
    limits: {
      monitoringQuestions: -1, // 无限制
      monthlyQueries: 10000,
      aiEngines: ['chatgpt', 'perplexity', 'gemini', 'bing', 'claude'],
      reportFormats: ['在线查看', 'PDF', 'CSV', 'JSON API'],
      competitorTracking: -1, // 无限制
      support: 'priority',
      historyRetention: '1年'
    }
  }
];
```

### 6.2 功能对比表

| 功能特性 | 免费版 | 专业版 | 企业版 |
|----------|----------|----------|----------|
| **监控问题数量** | 3个 | 50个 | 无限制 |
| **月查询配额** | 30次 | 1500次 | 10000次 |
| **AI引擎支持** | ChatGPT | ChatGPT + Perplexity + Gemini | 所有引擎 |
| **监控频率** | 仅手动 | 每周自动 | 每日自动 |
| **竞争对手分析** | ❌ | 10个 | 无限制 |
| **历史数据** | 7天 | 90天 | 1年 |
| **报告导出** | 在线查看 | PDF/CSV | 白标报告 |
| **邮件通知** | ❌ | ✅ | ✅ |
| **API访问** | ❌ | ❌ | ✅ |
| **Chrome插件** | ❌ | ❌ | ✅ |
| **团队协作** | ❌ | ❌ | 10用户 |
| **客户支持** | 社区 | 邮件 | 优先支持 |

### 6.3 收入模式策略

```typescript
interface AIVisibilityRevenueStrategy {
  primaryModel: 'freemium_saas';

  revenueStreams: {
    subscriptions: {
      target: '85%'; // 85%的收入来自订阅
      plans: ['pro', 'enterprise'];
      averageLifetimeValue: {
        pro: 468; // $39 × 12个月
        enterprise: 1188; // $99 × 12个月
      };
    };

    payPerQuery: {
      target: '10%'; // 10%来自超量查询费
      pricing: {
        extraQueries: 1; // 每次额外查询$1
        queryPacks: 25; // 50次查询包$25
      };
    };

    apiAccess: {
      target: '3%'; // 3%来自API使用
      pricing: {
        perRequest: 0.05; // 每次API请求$0.05
        monthlyApiPlan: 29; // $29/月1000次请求
      };
    };

    whiteLabel: {
      target: '2%'; // 2%来自白标服务
      pricing: {
        setupFee: 500; // 一次性设置费用
        monthlyFee: 199; // 月费
      };
    };
  };

  customerAcquisition: {
    freeToProConversion: '18%'; // 目标18%免费转专业版
    proToEnterpriseUpgrade: '8%'; // 8%专业版升企业版
    averageTimeToConvert: '21 days';
    churnRate: {
      monthly: '6%';
      yearly: '12%';
    };
  };

  growthStrategy: {
    viralCoefficient: 0.3; // 每个用户平均推荐0.3个新用户
    contentMarketing: '40% of acquisition';
    paidAdvertising: '35% of acquisition';
    referralProgram: '15% of acquisition';
    partnerChannels: '10% of acquisition';
  };
}
```

### 6.4 定价心理学与优化

```typescript
interface PricingOptimization {
  psychologicalPricing: {
    // 使用$39而不是$40，$99而不是$100
    endDigits: [9]; // 以9结尾
    avoidance: [0, 5]; // 避免整数和以5结尾
  };

  valueAnchoring: {
    // 突出专业版的性价比
    popularPlan: 'pro';
    savingsHighlight: '节省2个月费用';
    featureComparison: '比免费版多获得50倍监控能力';
  };

  planPositioning: {
    free: {
      role: 'lead_magnet';
      goal: 'demonstrate_value';
      limitationsDesign: 'encourage_upgrade';
    };
    pro: {
      role: 'primary_conversion_target';
      goal: 'maximize_revenue_per_user';
      features: 'meet_80_percent_needs';
    };
    enterprise: {
      role: 'premium_anchor';
      goal: 'justify_pro_pricing';
      features: 'enterprise_requirements';
    };
  };

  timeBasedIncentives: {
    yearlyDiscount: 0.17; // 17% discount for yearly
    seasonalPromotions: [
      { month: 11, discount: 0.25, name: 'Black Friday' },
      { month: 12, discount: 0.20, name: 'Year End' },
      { month: 1, discount: 0.15, name: 'New Year' }
    ];
    limitedTimeOffers: {
      newUserDiscount: 0.30; // 30% off first 3 months
      upgradeIncentive: 0.20; // 20% off when upgrading
    };
  };
}
```

### 6.5 订阅管理与计费

```typescript
// Stripe集成示例
class SubscriptionManager {
  async createSubscription(userId: string, planId: string, billingCycle: 'monthly' | 'yearly') {
    const user = await this.getUser(userId);

    // 创建或获取Stripe客户
    let stripeCustomer = await stripe.customers.retrieve(user.stripeCustomerId);
    if (!stripeCustomer) {
      stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.fullName,
        metadata: { userId }
      });

      // 保存客户ID
      await this.updateUser(userId, { stripeCustomerId: stripeCustomer.id });
    }

    // 获取价格ID
    const priceId = this.getPriceId(planId, billingCycle);

    // 创建订阅
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [{ price: priceId }],
      billing_cycle_anchor: this.getNextBillingDate(),
      metadata: {
        userId,
        planId,
        billingCycle
      }
    });

    // 更新用户订阅信息
    await db.update(userSubscriptionSchema)
      .set({
        plan: planId,
        subscriptionStatus: 'active',
        stripeSubscriptionId: subscription.id,
        quotaResetDate: new Date(subscription.current_period_end * 1000),
        updatedAt: new Date()
      })
      .where(eq(userSubscriptionSchema.userId, userId));

    return subscription;
  }

  async handleQuotaUsage(userId: string, queryCount: number = 1) {
    const subscription = await this.getUserSubscription(userId);

    // 检查是否超出配额
    if (subscription.queriesUsed + queryCount > subscription.queryQuota) {
      // 提供超量计费选项
      const overage = (subscription.queriesUsed + queryCount) - subscription.queryQuota;
      const overageFee = overage * 1; // $1 per extra query

      // 创建一次性费用
      await stripe.invoiceItems.create({
        customer: subscription.stripeCustomerId,
        amount: overageFee * 100, // cents
        currency: 'usd',
        description: `额外查询费用: ${overage}次查询`
      });

      throw new Error(`QUOTA_EXCEEDED:需要支付额外费用$${overageFee}`);
    }

    // 更新使用量
    await db.update(userSubscriptionSchema)
      .set({
        queriesUsed: subscription.queriesUsed + queryCount,
        updatedAt: new Date()
      })
      .where(eq(userSubscriptionSchema.userId, userId));
  }

  async resetMonthlyQuotas() {
    // 重置所有用户的月度配额
    await db.update(userSubscriptionSchema)
      .set({
        queriesUsed: 0,
        quotaResetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30天后
        updatedAt: new Date()
      })
      .where(lte(userSubscriptionSchema.quotaResetDate, new Date()));
  }
}
```

### 6.6 增长策略

```typescript
interface GrowthStrategy {
  acquisition: {
    contentMarketing: {
      blogPosts: [
        'AI搜索引擎优化完整指南',
        '如何让ChatGPT引用你的网站',
        '2024年AI可见度监控最佳实践',
        'Perplexity vs ChatGPT: 内容引用对比分析'
      ];
      seoKeywords: [
        'AI搜索引擎优化',
        'ChatGPT SEO',
        'AI可见度监控',
        'Perplexity优化'
      ];
    };

    partnerProgram: {
      commission: 0.3; // 30%佣金
      cookieDuration: '90天';
      targetPartners: [
        'SEO工具开发者',
        '数字营销顾问',
        'AI内容创作者',
        '技术博客主'
      ];
    };

    freeTrialOptimization: {
      trialLength: '14天';
      onboardingSequence: [
        '注册即可获得3个监控问题',
        '第1天：添加第一个监控问题',
        '第3天：查看首次AI查询结果',
        '第7天：分析竞争对手表现',
        '第12天：升级提醒和优惠'
      ];
    };
  };

  retention: {
    onboardingFlow: {
      step1: '设置第一个监控问题',
      step2: '查看AI查询结果',
      step3: '了解竞争对手情况',
      step4: '设置通知偏好',
      step5: '探索高级功能'
    };

    engagementFeatures: {
      weeklyDigest: 'AI可见度周报',
      trendAlerts: 'AI引用趋势变化提醒',
      competitorUpdates: '竞争对手新动向通知',
      improvementSuggestions: '个性化优化建议'
    };

    churnPrevention: {
      exitIntentPopup: '特别优惠挽留',
      usageAnalytics: '识别使用量下降用户',
      proactiveSupport: '主动客户成功服务',
      featureEducation: '使用技巧和最佳实践'
    };
  };

  monetization: {
    upsellTriggers: [
      '接近问题配额限制时',
      '频繁使用竞争对手分析功能',
      '多次导出报告需求',
      '询问API访问功能'
    ];

    addOnServices: {
      customReports: '$29/月 - 定制报告服务',
      dataIntegration: '$49/月 - 第三方数据整合',
      advancedAnalytics: '$19/月 - 高级分析功能',
      prioritySupport: '$15/月 - 优先技术支持'
    };
  };
}
```

---

## 7. 实施时间线与里程碑

### 7.1 GeoAIWork.com 14天开发计划

| 天数 | 主要任务 | 具体内容 | 验收标准 |
|-----|-----------|------------------|---------------------|
| **第1天** | 项目初始化 | • 创建Next.js项目<br>• 配置TypeScript、Tailwind<br>• 设置基础目录结构 | 项目运行，开发环境完备 |
| **第2天** | 数据库与认证设置 | • 设置PostgreSQL + DrizzleORM<br>• 配置Clerk认证<br>• 创建基础数据模型 | 认证工作，数据库连接 |
| **第3天** | 核心分析引擎 | • 实现URL验证<br>• 开发网页抓取功能<br>• 基础HTML解析功能 | 能够抓取和解析基础网站内容 |
| **第4天** | GEO评分算法 | • 实现5大类评分<br>• AI就绪度检测<br>• 结构化数据识别 | 能够为网站生成GEO评分 |
| **第5天** | 内容优化器 | • FAQ检测和提取<br>• 内容结构分析<br>• AI友好度内容评分 | 能够识别优化机会 |
| **第6天** | 结构化数据生成器 | • FAQ JSON-LD生成<br>• LLM.txt文件创建<br>• AI数据集生成 | 生成标准优化文件 |
| **第7天** | AI集成 | • OpenAI API集成<br>• 内容建议生成<br>• 回退算法 | AI驱动建议工作 |
| **第8天** | 竞争对手分析 | • 竞争对手识别<br>• 对比分析<br>• 机会识别 | 能够分析和对比竞争对手 |
| **第9天** | 前端 - 营销页面 | • 首页hero区域<br>• 定价页面<br>• 功能展示 | 营销站点完成并响应式 |
| **第10天** | 前端 - 分析界面 | • 分析工作台UI<br>• 结果展示组件<br>• 文件下载功能 | 分析界面完全功能 |
| **第11天** | API开发 | • RESTful API端点<br>• 认证中间件<br>• 限流 | APIs与前端正确工作 |
| **第12天** | 用户仪表板 | • 用户账户管理<br>• 分析历史<br>• 订阅处理 | 用户体验流程完整 |
| **第13天** | 测试与优化 | • 端到端测试<br>• 性能优化<br>• Bug修复 | 所有功能测试并性能良好 |
| **第14天** | 部署与启动 | • 生产部署<br>• 域名配置<br>• 启动准备 | GeoAIWork.com上线并功能正常 |

### 7.2 日常任务分解

#### 第1-2天: 基础设置
```bash
# 第1天
npx create-next-app@latest geoaiwork --typescript --tailwind --app
cd geoaiwork
npm install @clerk/nextjs drizzle-orm postgres playwright cheerio openai

# 创建目录结构
mkdir -p src/{components,lib,types,utils}
mkdir -p src/app/api/{analyze,competitors,generate}
mkdir -p tests/{unit,integration,e2e}

# 第2天
# 设置认证和数据库
npm install drizzle-kit @types/pg
# 配置Clerk认证
# 设置PostgreSQL数据库架构
```

#### 第3-5天: 核心分析引擎
```typescript
// src/lib/analyzers/GeoAnalyzer.ts
export class GeoAIWorkAnalyzer {
  async analyzeWebsite(url: string): Promise<GeoAIWorkAnalysis> {
    // 网站分析逻辑实现
  }
}

// src/lib/scrapers/WebScraper.ts
export class WebScraper {
  async scrapeWebsite(url: string): Promise<PageData> {
    // 网页抓取逻辑实现
  }
}

// src/lib/scoring/ScoreCalculator.ts
export class ScoreCalculator {
  calculateGeoScore(pageData: PageData): ScoreResult {
    // 评分算法实现
  }
}
```

#### 第6-8天: 高级功能
```typescript
// src/lib/generators/StructuredDataGenerator.ts
// src/lib/optimizers/ContentOptimizer.ts
// src/lib/competitors/CompetitorAnalyzer.ts
```

#### 第9-12天: 前端开发
```typescript
// src/app/page.tsx - 首页
// src/app/analyze/page.tsx - 分析工作台
// src/app/dashboard/page.tsx - 用户仪表板
// src/components/ui/* - 可重用UI组件
```

### 7.3 质量保证检查清单

```markdown
## GeoAIWork 启动检查清单

### 技术质量
- [ ] 所有核心功能按规格工作
- [ ] API端点测试并文档化
- [ ] 认证系统安全且功能正常
- [ ] 数据库查询优化
- [ ] 前端在所有设备响应式
- [ ] 性能指标达到目标（<5秒分析时间）
- [ ] 错误处理全面
- [ ] 安全最佳实践实施

### 用户体验
- [ ] 用户引导流程流畅
- [ ] 分析结果清晰呈现
- [ ] 文件下载正确工作
- [ ] 订阅管理功能正常
- [ ] 帮助文档完整
- [ ] 联系/支持系统就绪

### 业务需求
- [ ] 定价方案正确实施
- [ ] 支付处理工作（Stripe）
- [ ] 使用跟踪和配额系统
- [ ] 分析和监控到位
- [ ] 法律页面（隐私、条款）就绪
- [ ] 邮件通知配置

### 启动就绪
- [ ] 域名geoaiwork.com配置
- [ ] SSL证书安装
- [ ] CDN和性能优化
- [ ] 备份和灾难恢复
- [ ] 监控和告警设置
- [ ] 启动公告材料就绪
```

---

## 8. 风险评估与缓解

### 8.1 技术风险

| 风险项目 | 概率 | 影响 | 缓解策略 |
|-----------|-------------|--------|-------------------|
| 网站被抓取阻止 | 高 | 中 | 实施多种抓取方法，遵守robots.txt，用户代理轮换 |
| AI API限流 | 中 | 中 | 本地算法回退，支持多AI提供商 |
| 数据库性能问题 | 中 | 高 | 查询优化，适当索引，缓存层 |
| 第三方服务依赖 | 低 | 高 | 多提供商选项，优雅降级 |

### 8.2 业务风险

| 风险项目 | 概率 | 影响 | 缓解策略 |
|-----------|-------------|--------|-------------------|
| 市场接受度低 | 中 | 高 | 强力营销，免费层级，用户教育 |
| 竞争对手快速跟随 | 高 | 中 | 持续创新，先发优势 |
| AI搜索算法变化 | 中 | 高 | 关注AI趋势，灵活架构 |
| 定价策略不匹配 | 中 | 中 | 市场研究，A/B测试，反馈收集 |

### 8.3 运营风险

| 风险项目 | 概率 | 影响 | 缓解策略 |
|-----------|-------------|--------|-------------------|
| 扩展性挑战 | 中 | 高 | 云原生架构，自动扩展 |
| 数据隐私合规 | 低 | 高 | GDPR合规，清晰隐私政策 |
| 客户支持负载 | 中 | 中 | 自助服务文档，聊天机器人，分层支持 |

---

## 文档总结

此全面的GeoAIWork.com产品需求文档提供了：

### ✅ 完整平台设计
1. **专业GEO分析引擎** - 全面的AI搜索优化分析
2. **智能内容优化器** - AI驱动的内容优化建议
3. **自动化资源生成** - FAQ、llm.txt、ai-dataset.json文件生成
4. **竞争对手分析系统** - 深度竞争情报和基准测试

### 🎯 技术实施方案
1. **基于现代技术栈** - Next.js 15、TypeScript、Tailwind CSS、PostgreSQL
2. **完整API规格** - 详细接口规格和数据模型
3. **专业UI/UX设计** - 分析工作台和营销页面
4. **可扩展架构** - 支持未来增长和功能扩展

### 📈 商业策略
1. **明确目标市场** - 国际SEO专业人士、内容创作者、营销人员
2. **免费增值商业模式** - 免费层级与付费升级
3. **竞争定位** - GEO优化的先发优势
4. **增长路线图** - 从MVP到全功能平台

此PRD已准备好立即开发，可指导创建GeoAIWork.com作为领先的GEO优化平台，服务全球市场。