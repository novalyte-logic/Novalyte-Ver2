import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Tag, Sparkles, Shield, 
  ChevronRight, Share2, Bookmark, Activity, ArrowRight
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

// Mock data for the premium article
const ARTICLE_DATA = {
  id: "future-of-trt",
  title: "The Future of Testosterone Replacement: Moving Beyond the Numbers",
  category: "Hormone Optimization",
  author: {
    name: "Dr. Marcus Thorne",
    role: "Chief Medical Officer",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400"
  },
  date: "Oct 12, 2026",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1532187863486-abf9db61b15c?auto=format&fit=crop&q=80&w=2000",
  aiSummary: "Novalyte's clinical intelligence engine highlights that modern endocrinology is shifting from simple reference ranges to comprehensive symptom resolution, metabolic markers, and continuous monitoring. This protocol reduces long-term cardiovascular risks while maximizing cognitive and physical performance.",
  targetAudience: "patient",
  content: `
    <h2>The Paradigm Shift in Hormone Optimization</h2>
    <p>For decades, the standard of care in testosterone replacement therapy (TRT) has been dictated by static reference ranges. If a patient fell within the "normal" range—regardless of their age, symptoms, or baseline—they were often denied treatment or given suboptimal dosing.</p>
    <p>Today, elite longevity clinics are abandoning this outdated model. The new standard is <strong>symptom resolution and metabolic optimization</strong>.</p>
    
    <h3>Why Reference Ranges Are Flawed</h3>
    <p>The "normal" reference range for testosterone has been steadily declining over the past 30 years. What was considered average in 1990 is now considered high. Furthermore, these ranges do not account for androgen receptor sensitivity, SHBG levels, or free testosterone availability.</p>
    <ul>
      <li><strong>Population-based, not individual-based:</strong> Ranges are based on a sick population, not an optimized one.</li>
      <li><strong>Ignores Free Testosterone:</strong> Total testosterone is only part of the picture.</li>
      <li><strong>Symptom Disconnect:</strong> Many men experience severe hypogonadal symptoms even when their total testosterone is technically "normal."</li>
    </ul>

    <h3>The Novalyte Protocol</h3>
    <p>At Novalyte-certified clinics, we look at the complete endocrine matrix. This includes:</p>
    <ol>
      <li>Comprehensive blood panels (including sensitive estradiol, free T, SHBG, DHT, and thyroid markers).</li>
      <li>Continuous metabolic monitoring.</li>
      <li>Symptom tracking via the Novalyte Patient App.</li>
    </ol>
    <p>By continuously monitoring these markers, we can adjust protocols in real-time, ensuring optimal performance and minimizing side effects.</p>

    <blockquote>
      "The goal is not to reach a specific number on a lab test. The goal is to restore vitality, cognitive function, and metabolic health."
      <br/>— Dr. Marcus Thorne
    </blockquote>

    <h3>The Role of Peptides in Modern TRT</h3>
    <p>Testosterone alone is often not enough. Modern protocols frequently incorporate peptides like Kisspeptin-10 or Enclomiphene to maintain testicular function and fertility, alongside growth hormone secretagogues (like Ipamorelin/CJC-1295) to accelerate recovery and fat loss.</p>
    <p>This multi-pathway approach ensures that the body's natural feedback loops are respected, preventing the shutdown of endogenous production that plagued older TRT models.</p>
  `,
  relatedArticles: [
    {
      id: "glp1-muscle-preservation",
      title: "GLP-1 Agonists and Lean Mass: The Protocol for Preservation",
      category: "Metabolic Health",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
    },
    {
      id: "longevity-biomarkers",
      title: "5 Biomarkers Every Man Over 40 Should Track",
      category: "Longevity & Aging",
      image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
    }
  ]
};

export function BlogDetail() {
  const { id } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pb-24">
      
      {/* Editorial Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <img 
          src={ARTICLE_DATA.image} 
          alt={ARTICLE_DATA.title} 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070A]/90 to-transparent" />
        
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/blog" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Intelligence
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="px-3 py-1 rounded bg-surface-2 border border-surface-3 flex items-center gap-1.5 backdrop-blur-md">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-bold text-white tracking-wide uppercase">{ARTICLE_DATA.category}</span>
                </div>
                <div className="px-3 py-1 rounded bg-surface-2 border border-surface-3 flex items-center gap-1.5 backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="text-xs font-bold text-text-secondary tracking-wide uppercase">{ARTICLE_DATA.readTime}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight leading-tight">
                {ARTICLE_DATA.title}
              </h1>
              
              <div className="flex items-center justify-between border-t border-surface-3 pt-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={ARTICLE_DATA.author.image} 
                    alt={ARTICLE_DATA.author.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-surface-3"
                  />
                  <div>
                    <p className="text-white font-bold">{ARTICLE_DATA.author.name}</p>
                    <p className="text-sm text-text-secondary">{ARTICLE_DATA.author.role} • {ARTICLE_DATA.date}</p>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-3">
                  <button className="w-10 h-10 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-all">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Article Content */}
          <div className="lg:col-span-8 lg:col-start-3">
            
            {/* AI Context Block */}
            <Card className="p-6 md:p-8 bg-gradient-to-br from-[#0B0F14] to-[#05070A] border-secondary/30 relative overflow-hidden mb-12 shadow-[0_0_30px_rgba(139,92,246,0.05)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-secondary" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-white">Novalyte AI Context</h3>
                </div>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {ARTICLE_DATA.aiSummary}
                </p>
              </div>
            </Card>

            {/* Rich Text Content */}
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:font-display prose-headings:font-bold prose-headings:text-white
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-surface-3
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-p:text-text-secondary prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-bold
                prose-ul:text-text-secondary prose-ul:my-6 prose-li:my-2
                prose-ol:text-text-secondary prose-ol:my-6 prose-li:my-2
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-surface-2 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-white prose-blockquote:font-medium prose-blockquote:my-10"
              dangerouslySetInnerHTML={{ __html: ARTICLE_DATA.content }}
            />

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t border-surface-3 mt-16 pt-8">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Share this protocol</span>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center text-text-secondary hover:text-white hover:border-primary/50 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Context-Aware CTA */}
            <Card className="mt-12 p-8 bg-gradient-to-br from-[#0B0F14] to-[#05070A] border-primary/30 relative overflow-hidden text-center">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
              <div className="relative z-10 max-w-xl mx-auto">
                <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="text-3xl font-display font-bold text-white mb-4">Ready to Optimize Your Health?</h3>
                <p className="text-text-secondary text-lg mb-8">
                  Stop guessing with outdated reference ranges. Get a personalized clinical assessment and match with a top-tier provider in the Novalyte network.
                </p>
                <Link to="/patient/assessment" className="block">
                  <Button className="w-full sm:w-auto px-8 h-14 text-lg font-bold bg-white text-black hover:bg-gray-200">
                    Start Your Assessment
                  </Button>
                </Link>
              </div>
            </Card>

          </div>
        </div>
      </div>

      {/* Related Resources */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 pt-16 border-t border-surface-3">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-display font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary" /> Related Protocols
          </h2>
          <Link to="/blog" className="text-primary hover:text-primary-hover text-sm font-bold flex items-center gap-1 hidden sm:flex">
            View All Insights <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ARTICLE_DATA.relatedArticles.map((article, i) => (
            <Link key={i} to={`/blog/${article.id}`}>
              <Card className="overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all group cursor-pointer h-full flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">{article.category}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xl mb-3 group-hover:text-primary transition-colors leading-snug">{article.title}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-primary font-bold text-sm mt-4 group-hover:gap-3 transition-all">
                    Read Protocol <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <Link to="/blog" className="text-primary hover:text-primary-hover text-sm font-bold flex items-center justify-center gap-1 sm:hidden mt-8">
          View All Insights <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
