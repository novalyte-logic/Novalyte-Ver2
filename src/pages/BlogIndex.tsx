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
  },
  {
    id: "hair-restoration-protocols",
    title: "Advanced Hair Restoration: Beyond Finasteride",
    excerpt: "A deep dive into topical compounds, micro-needling, and PRP therapies for aggressive androgenetic alopecia.",
    category: "Hormone Optimization",
    author: "Dr. Marcus Thorne",
    date: "Sep 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "shockwave-therapy-ed",
    title: "Shockwave Therapy for Erectile Dysfunction",
    excerpt: "How low-intensity extracorporeal shockwave therapy (LI-ESWT) is replacing PDE5 inhibitors for long-term vascular repair.",
    category: "Longevity & Aging",
    author: "Dr. Sarah Jenkins",
    date: "Sep 02, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "bpc157-tb500-recovery",
    title: "BPC-157 & TB-500: The Ultimate Recovery Stack",
    excerpt: "Accelerating tissue repair, reducing inflammation, and overcoming chronic injuries with targeted peptide therapy.",
    category: "Performance",
    author: "Dr. Marcus Thorne",
    date: "Aug 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800"
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
            
            {/* The Ultimate Guide (Pillar Content) */}
            {searchQuery === "" && activeCategory === "All" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-16"
              >
                <Card className="overflow-hidden bg-[#0B0F14] border-surface-3">
                  <div className="relative h-72 md:h-96 w-full overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2000" 
                      alt="Men's Health Optimization"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/60 to-transparent" />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded bg-primary text-black text-xs font-bold uppercase tracking-wider">
                      Ultimate Guide
                    </div>
                  </div>
                  <div className="p-8 md:p-12 relative -mt-20 z-10">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                      The Ultimate Guide to Men's Health Optimization: TRT, Peptides, and Beyond
                    </h2>
                    
                    <div className="max-w-none">
                      <p className="text-xl text-text-secondary leading-relaxed mb-8">
                        The standard of care for men's health is rapidly evolving. We are moving away from the outdated model of simply treating symptoms when they become unbearable, and shifting toward a proactive approach: <strong>optimization</strong>. Whether you are looking for <span className="text-white font-semibold">Testosterone Replacement Therapy online</span>, exploring <span className="text-white font-semibold">healing peptides</span>, or seeking <span className="text-white font-semibold">metabolic optimization</span>, this guide covers the foundational pillars of modern men's health.
                      </p>

                      {/* Soft Nudge */}
                      <div className="bg-surface-1 border border-primary/20 rounded-xl p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div>
                          <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            Not sure where to start?
                          </h4>
                          <p className="text-sm text-text-secondary">
                            Take our comprehensive clinical assessment to get a personalized protocol recommendation and match with a top-tier provider.
                          </p>
                        </div>
                        <Link to="/patient/assessment" className="shrink-0">
                          <Button className="bg-primary text-black hover:bg-primary-hover font-bold">
                            Take Free Assessment
                          </Button>
                        </Link>
                      </div>

                      <h3 className="text-2xl font-bold text-white mt-10 mb-4">1. Testosterone Replacement Therapy (TRT)</h3>
                      <img 
                        src="https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=1200" 
                        alt="Testosterone Replacement Therapy" 
                        className="w-full h-64 object-cover rounded-xl mb-6"
                      />
                      <p className="text-lg text-text-secondary leading-relaxed mb-4">
                        For decades, men suffering from fatigue, brain fog, loss of libido, and muscle wasting were told their levels were "normal for their age." Today, the best <Link to="/directory" className="text-primary hover:underline font-semibold">TRT clinics near me</Link> and online providers focus on symptom resolution rather than just static reference ranges.
                      </p>
                      <p className="text-lg text-text-secondary leading-relaxed mb-6">
                        Modern <strong>Testosterone Replacement Therapy (TRT)</strong> utilizes bioidentical hormones delivered via precise injections or compounded creams. When monitored correctly, TRT can restore energy, improve cognitive function, and enhance body composition.
                      </p>

                      <h3 className="text-2xl font-bold text-white mt-10 mb-4">2. Peptide Therapy for Healing and Longevity</h3>
                      <img 
                        src="https://images.unsplash.com/photo-1532187863486-abf9db61b15c?auto=format&fit=crop&q=80&w=1200" 
                        alt="Peptide Therapy" 
                        className="w-full h-64 object-cover rounded-xl mb-6"
                      />
                      <p className="text-lg text-text-secondary leading-relaxed mb-4">
                        Peptides are short chains of amino acids that act as signaling molecules in the body. The <span className="text-white font-semibold">best peptide clinics</span> utilize these compounds to target specific biological processes.
                      </p>
                      <ul className="list-disc pl-6 text-lg text-text-secondary leading-relaxed mb-6 space-y-3 marker:text-primary">
                        <li><strong className="text-white">BPC-157 & TB-500:</strong> Known as the "healing peptides," these are often prescribed for rapid recovery from joint, tendon, and muscle injuries.</li>
                        <li><strong className="text-white">CJC-1295 & Ipamorelin:</strong> Growth hormone secretagogues that stimulate the body's natural production of GH, aiding in fat loss, sleep quality, and anti-aging.</li>
                        <li><strong className="text-white">PT-141:</strong> A targeted peptide for enhancing libido and treating erectile dysfunction when traditional PDE5 inhibitors fall short.</li>
                      </ul>

                      <h3 className="text-2xl font-bold text-white mt-10 mb-4">3. GLP-1 Agonists for Metabolic Health</h3>
                      <p className="text-lg text-text-secondary leading-relaxed mb-4">
                        The introduction of GLP-1 and GIP receptor agonists (like Semaglutide and Tirzepatide) has revolutionized weight management. For men struggling with visceral fat and metabolic syndrome, <span className="text-white font-semibold">GLP-1 weight loss for men</span> offers a powerful tool to reset insulin sensitivity.
                      </p>
                      <p className="text-lg text-text-secondary leading-relaxed mb-6">
                        Elite clinics often combine GLP-1 therapies with TRT and muscle-preserving peptides to ensure that weight lost is primarily fat, not lean muscle mass.
                      </p>

                      <h3 className="text-2xl font-bold text-white mt-10 mb-4">4. Advanced Hair Restoration</h3>
                      <p className="text-lg text-text-secondary leading-relaxed mb-4">
                        Hair loss is a primary concern for many men, especially those optimizing their androgens. Modern <span className="text-white font-semibold">hair restoration clinics</span> have moved beyond generic solutions. Today's protocols include topical Finasteride/Minoxidil compounds (to minimize systemic side effects), PRP (Platelet-Rich Plasma) therapy, and advanced micro-needling techniques.
                      </p>

                      <div className="mt-12 pt-8 border-t border-surface-3">
                        <h4 className="text-xl font-bold text-white mb-4">Next Steps in Your Optimization Journey</h4>
                        <p className="text-lg text-text-secondary leading-relaxed mb-6">
                          True health optimization requires a personalized approach. Whether you are looking for a local specialist in our <Link to="/directory" className="text-primary hover:underline font-semibold">Clinic Directory</Link> or you are a healthcare professional looking to join the <Link to="/workforce" className="text-primary hover:underline font-semibold">Workforce Network</Link>, Novalyte is your partner in modern medicine.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
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
                <Link to="/contact">
                  <Button className="w-full">Subscribe</Button>
                </Link>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
