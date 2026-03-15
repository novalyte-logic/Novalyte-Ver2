import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, ArrowRight, Activity, Shield, Sparkles, Clock, User, Tag } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

const CATEGORIES = [
  "All",
  "Hormone Optimization",
  "Peptide Therapy",
  "Longevity & Aging",
  "Metabolic Health",
  "Cognitive Performance",
  "Clinic Operations"
];

const FEATURED_POST = {
  id: "future-of-trt",
  title: "The Future of Testosterone Replacement: Moving Beyond the Numbers",
  excerpt: "Why modern endocrinology is shifting from simple reference ranges to comprehensive symptom resolution, metabolic markers, and continuous monitoring.",
  category: "Hormone Optimization",
  author: "Dr. Marcus Thorne",
  date: "Oct 12, 2026",
  readTime: "8 min read",
  image: "https://images.unsplash.com/photo-1532187863486-abf9db61b15c?auto=format&fit=crop&q=80&w=1200"
};

const POSTS = [
  {
    id: "glp1-muscle-preservation",
    title: "GLP-1 Agonists and Lean Mass: The Protocol for Preservation",
    excerpt: "How elite clinics are combining Tirzepatide with targeted peptide therapies to prevent muscle wasting during rapid weight loss.",
    category: "Metabolic Health",
    author: "Dr. Sarah Jenkins",
    date: "Oct 08, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "cognitive-peptides-executive",
    title: "Cognitive Peptides for Executive Performance",
    excerpt: "An analysis of Dihexa, Semax, and Cerebrolysin in high-stress environments. What the data says about neuro-regeneration.",
    category: "Cognitive Performance",
    author: "Novalyte Medical Board",
    date: "Oct 05, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "clinic-revenue-optimization",
    title: "The $1M Clinic Blueprint: Optimizing Patient LTV",
    excerpt: "How top-performing men's health clinics use continuous monitoring and subscription models to increase patient retention and revenue.",
    category: "Clinic Operations",
    author: "James Carter",
    date: "Oct 01, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "longevity-biomarkers",
    title: "5 Biomarkers Every Man Over 40 Should Track",
    excerpt: "Beyond standard lipid panels. Why ApoB, hs-CRP, and fasting insulin are the true predictors of healthspan.",
    category: "Longevity & Aging",
    author: "Dr. Marcus Thorne",
    date: "Sep 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "sleep-architecture-testosterone",
    title: "Sleep Architecture and Endocrine Function",
    excerpt: "The bidirectional relationship between deep sleep phases and natural testosterone production. Protocols for optimization.",
    category: "Hormone Optimization",
    author: "Dr. Sarah Jenkins",
    date: "Sep 22, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "scaling-telehealth",
    title: "Scaling Telehealth in Men's Medicine",
    excerpt: "Navigating compliance, asynchronous care, and patient experience in the modern digital clinic.",
    category: "Clinic Operations",
    author: "Novalyte Operations Team",
    date: "Sep 15, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
  }
];

export function BlogIndex() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPosts = POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pt-24 pb-24">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide uppercase">Novalyte Intelligence</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Clinical Insights & <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Operational Intelligence
              </span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed mb-10">
              Authoritative research, protocols, and strategies for men's health optimization and the clinics that deliver it.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-text-secondary" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-4 rounded-xl bg-[#0B0F14] border border-surface-3 text-white placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Search protocols, research, or operational guides..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Featured Post (Only show if no search and All category) */}
            {searchQuery === "" && activeCategory === "All" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Link to={`/blog/${FEATURED_POST.id}`} className="block group">
                  <Card className="overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all">
                    <div className="relative h-72 md:h-96 w-full overflow-hidden">
                      <img 
                        src={FEATURED_POST.image} 
                        alt={FEATURED_POST.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/40 to-transparent" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded bg-primary text-black text-xs font-bold uppercase tracking-wider">
                        Featured Report
                      </div>
                    </div>
                    <div className="p-8 relative -mt-20 z-10">
                      <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                        <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> {FEATURED_POST.category}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {FEATURED_POST.readTime}</span>
                      </div>
                      <h2 className="text-3xl font-display font-bold text-white mb-4 group-hover:text-primary transition-colors leading-tight">
                        {FEATURED_POST.title}
                      </h2>
                      <p className="text-lg text-text-secondary mb-6 leading-relaxed">
                        {FEATURED_POST.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-3 flex items-center justify-center text-white font-bold">
                            {FEATURED_POST.author.charAt(4)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{FEATURED_POST.author}</p>
                            <p className="text-xs text-text-secondary">{FEATURED_POST.date}</p>
                          </div>
                        </div>
                        <div className="text-primary font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )}

            {/* Category Filter (Mobile/Tablet) */}
            <div className="lg:hidden flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                    activeCategory === category 
                      ? 'bg-primary text-black' 
                      : 'bg-surface-2 text-text-secondary hover:bg-surface-3 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Article Grid */}
            <div>
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-display font-bold text-white">
                  {searchQuery ? 'Search Results' : (activeCategory === 'All' ? 'Latest Insights' : activeCategory)}
                </h3>
                <span className="text-text-secondary text-sm">{filteredPosts.length} Articles</span>
              </div>

              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {filteredPosts.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                    >
                      <Link to={`/blog/${post.id}`} className="block group h-full">
                        <Card className="h-full flex flex-col overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all">
                          <div className="h-48 relative overflow-hidden">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white">
                              {post.category}
                            </div>
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors leading-snug">
                              {post.title}
                            </h3>
                            <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                              {post.excerpt}
                            </p>
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-surface-3">
                              <div className="flex items-center gap-2 text-xs text-text-secondary">
                                <User className="w-3.5 h-3.5" />
                                <span>{post.author}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.readTime}</span>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#0B0F14] rounded-xl border border-surface-3">
                  <Search className="w-12 h-12 text-surface-3 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No articles found</h3>
                  <p className="text-text-secondary">Try adjusting your search or category filter.</p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Desktop Categories */}
            <div className="hidden lg:block">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">Topics</h3>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeCategory === category 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-surface-1 text-text-secondary border border-transparent hover:bg-surface-2 hover:text-white'
                    }`}
                  >
                    {category}
                    {activeCategory === category && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Conversion CTA */}
            <Card className="p-6 bg-gradient-to-br from-[#0B0F14] to-[#05070A] border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">Ready to Optimize?</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Stop guessing. Get a personalized clinical assessment and match with a top-tier provider.
                </p>
                <Link to="/patient/assessment" className="block">
                  <Button className="w-full bg-white text-black hover:bg-gray-200 font-bold">
                    Start Assessment
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Clinic Conversion CTA */}
            <Card className="p-6 bg-gradient-to-br from-[#0B0F14] to-[#05070A] border-secondary/20 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-xl font-display font-bold text-white mb-2">For Clinic Operators</h3>
                <p className="text-sm text-text-secondary mb-6">
                  Join the Novalyte network to access qualified patient leads and operational intelligence.
                </p>
                <Link to="/clinics/apply" className="block">
                  <Button variant="outline" className="w-full border-secondary/50 text-white hover:bg-secondary/10">
                    Apply to Network
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Newsletter CTA */}
            <Card className="p-6 bg-surface-1 border-surface-3">
              <h3 className="font-bold text-white mb-2">Clinical Briefing</h3>
              <p className="text-sm text-text-secondary mb-4">
                Get the latest protocols and research delivered to your inbox weekly.
              </p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-4 py-2 rounded-lg bg-surface-2 border border-surface-3 text-white placeholder-text-secondary focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Button className="w-full">Subscribe</Button>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
