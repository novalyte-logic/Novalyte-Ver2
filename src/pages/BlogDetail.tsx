import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Tag, Sparkles, Shield, 
  ChevronRight, Share2, Bookmark, Activity, ArrowRight
} from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

// Mock data for the premium articles
const ARTICLES_DB: Record<string, any> = {
  "future-of-trt": {
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
      <p>For decades, the standard of care in testosterone replacement therapy (TRT) has been dictated by static reference ranges. If a patient fell within the "normal" range—regardless of their age, symptoms, or baseline—they were often denied treatment or given suboptimal dosing. If you're looking for <a href="/directory">TRT clinics near me</a>, it's crucial to find providers who understand this shift.</p>
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
      <p>Testosterone alone is often not enough. Modern protocols frequently incorporate peptides like Kisspeptin-10 or Enclomiphene to maintain testicular function and fertility, alongside growth hormone secretagogues (like Ipamorelin/CJC-1295) to accelerate recovery and fat loss. The <a href="/directory">best peptide clinics</a> integrate these seamlessly.</p>
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
  },
  "glp1-muscle-preservation": {
    id: "glp1-muscle-preservation",
    title: "GLP-1 Agonists and Lean Mass: The Protocol for Preservation",
    category: "Metabolic Health",
    author: {
      name: "Dr. Sarah Jenkins",
      role: "Head of Metabolic Health",
      image: "https://images.unsplash.com/photo-1594824436998-d58d20a7b48f?auto=format&fit=crop&q=80&w=400"
    },
    date: "Oct 08, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "Novalyte's clinical intelligence engine highlights the critical importance of combining GLP-1 therapies (like Semaglutide and Tirzepatide) with targeted resistance training, high protein intake, and specific peptide protocols to prevent sarcopenia (muscle loss) during rapid weight reduction.",
    targetAudience: "patient",
    content: `
      <h2>The Double-Edged Sword of GLP-1 Weight Loss</h2>
      <p>GLP-1 receptor agonists have undeniably changed the landscape of obesity and metabolic syndrome treatment. However, <a href="/directory">GLP-1 weight loss for men</a> comes with a significant caveat: without proper intervention, up to 40% of the weight lost can be lean muscle mass.</p>
      <p>For men optimizing their health, losing muscle is unacceptable. It lowers basal metabolic rate, decreases insulin sensitivity, and negatively impacts androgen production.</p>
      
      <h3>The Novalyte Muscle Preservation Protocol</h3>
      <p>To combat this, elite clinics employ a multi-faceted approach to ensure that weight loss is almost exclusively adipose tissue (fat).</p>
      
      <h4>1. Nutritional Periodization</h4>
      <p>GLP-1s drastically reduce appetite. While a caloric deficit is necessary for fat loss, protein intake must remain high. We recommend a minimum of 1.2g of protein per pound of target body weight, often supplemented with essential amino acids (EAAs) to stimulate muscle protein synthesis even in a deficit.</p>
      
      <h4>2. Targeted Peptide Therapy</h4>
      <p>This is where modern medicine shines. To signal the body to retain muscle, we frequently utilize:</p>
      <ul>
        <li><strong>Growth Hormone Secretagogues (CJC-1295 / Ipamorelin):</strong> These peptides stimulate the pituitary to release natural growth hormone, which is highly anti-catabolic and lipolytic (fat-burning).</li>
        <li><strong>Testosterone Optimization:</strong> Ensuring testosterone levels are optimized (often via <a href="/directory">Testosterone Replacement Therapy online</a> or in-clinic) provides the necessary anabolic signal to hold onto lean tissue.</li>
      </ul>

      <h4>3. Resistance Training Mandate</h4>
      <p>Cardio alone is insufficient. A structured, progressive overload resistance training program is non-negotiable when on a GLP-1 protocol. The mechanical tension on the muscle fibers signals the body that the tissue is necessary for survival, preventing its breakdown for energy.</p>

      <blockquote>
        "We don't just want you to be smaller. We want you to be leaner, stronger, and metabolically bulletproof."
        <br/>— Dr. Sarah Jenkins
      </blockquote>

      <h3>Monitoring and Adjusting</h3>
      <p>Using DEXA scans or advanced bioimpedance scales, we track body composition, not just total weight. If lean mass begins to drop, the protocol is immediately adjusted—either by lowering the GLP-1 dose, increasing anabolic support, or adjusting macros.</p>
    `,
    relatedArticles: [
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement: Moving Beyond the Numbers",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1532187863486-abf9db61b15c?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "longevity-biomarkers",
        title: "5 Biomarkers Every Man Over 40 Should Track",
        category: "Longevity & Aging",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "cognitive-peptides-executive": {
    id: "cognitive-peptides-executive",
    title: "Cognitive Peptides for Executive Performance",
    category: "Cognitive Performance",
    author: {
      name: "Novalyte Medical Board",
      role: "Research Division",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=400"
    },
    date: "Oct 05, 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "An analysis of neurogenic and nootropic peptides (Dihexa, Semax, Cerebrolysin) used by high-performing executives to combat brain fog, enhance neuroplasticity, and maintain peak cognitive function under extreme stress.",
    targetAudience: "patient",
    content: `
      <h2>The Executive Edge: Beyond Caffeine and Modafinil</h2>
      <p>In high-stakes environments, cognitive endurance is just as critical as physical stamina. While traditional stimulants provide a temporary boost, they often lead to adrenal fatigue and disrupted sleep architecture. The new frontier in executive health focuses on <strong>neuro-regeneration and neuroplasticity</strong> through targeted peptide therapy.</p>
      
      <h3>Understanding Cognitive Peptides</h3>
      <p>Cognitive peptides work by upregulating Brain-Derived Neurotrophic Factor (BDNF), reducing neuroinflammation, and promoting synaptogenesis (the formation of new neural connections). The <a href="/directory">best peptide clinics</a> are now incorporating these into their executive health protocols.</p>
      
      <h4>1. Dihexa: The Synapse Builder</h4>
      <p>Originally developed to treat cognitive decline, Dihexa is a potent angiotensin IV analog. Research suggests it is orders of magnitude more effective than BDNF at promoting dendritic spine formation. For executives, this translates to faster learning, improved memory consolidation, and enhanced problem-solving capabilities.</p>
      
      <h4>2. Semax: The Stress Buffer</h4>
      <p>Semax is a synthetic peptide based on a fragment of adrenocorticotropic hormone (ACTH). It is administered intranasally and rapidly crosses the blood-brain barrier.</p>
      <ul>
        <li><strong>Focus and Clarity:</strong> It modulates dopamine and serotonin receptors, providing clean, jitter-free focus.</li>
        <li><strong>Neuroprotection:</strong> It protects neurons from hypoxic damage and oxidative stress, making it invaluable during periods of extreme sleep deprivation or high stress.</li>
      </ul>

      <h4>3. Cerebrolysin: The Comprehensive Repair Matrix</h4>
      <p>Unlike single-molecule peptides, Cerebrolysin is a complex mixture of neurotrophic factors derived from porcine brain tissue. It mimics the action of endogenous neurotrophic factors, promoting survival and repair of neurons. It is often used in intensive "brain reboot" protocols.</p>

      <blockquote>
        "We are no longer just trying to stay awake. We are actively upgrading the hardware of the brain."
      </blockquote>

      <h3>Integrating Peptides into a High-Performance Lifestyle</h3>
      <p>Peptides are not magic bullets. They must be layered on top of a solid foundation. This means:</p>
      <ol>
        <li><strong>Optimized Sleep:</strong> Without deep, restorative sleep, neuroplasticity cannot occur.</li>
        <li><strong>Hormonal Balance:</strong> Low testosterone or thyroid dysfunction will negate the benefits of cognitive peptides. Consider exploring <a href="/directory">Testosterone Replacement Therapy online</a> to ensure your baseline is optimized.</li>
        <li><strong>Nutritional Support:</strong> Adequate intake of Omega-3s, choline, and B-vitamins is required for neurotransmitter synthesis.</li>
      </ol>
    `,
    relatedArticles: [
      {
        id: "longevity-biomarkers",
        title: "5 Biomarkers Every Man Over 40 Should Track",
        category: "Longevity & Aging",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "sleep-architecture-testosterone",
        title: "Sleep Architecture and Endocrine Function",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "longevity-biomarkers": {
    id: "longevity-biomarkers",
    title: "5 Biomarkers Every Man Over 40 Should Track",
    category: "Longevity & Aging",
    author: {
      name: "Dr. Marcus Thorne",
      role: "Chief Medical Officer",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
    },
    date: "Sep 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "A comprehensive guide to the top 5 biomarkers men over 40 should monitor to optimize longevity, prevent chronic disease, and maintain peak performance.",
    targetAudience: "patient",
    content: `
      <h2>Beyond the Basic Metabolic Panel</h2>
      <p>Standard blood work is designed to detect disease, not optimize health. For men over 40, a proactive approach to longevity requires tracking specific biomarkers that provide a deeper understanding of metabolic, hormonal, and cardiovascular health.</p>
      
      <h3>1. ApoB (Apolipoprotein B)</h3>
      <p>While LDL cholesterol is commonly measured, ApoB is a far more accurate predictor of cardiovascular risk. It measures the total number of atherogenic particles in the blood. Optimizing ApoB is crucial for long-term heart health.</p>
      
      <h3>2. Free Testosterone and SHBG</h3>
      <p>Total testosterone only tells part of the story. Free testosterone is the bioavailable hormone that your body can actually use. Sex Hormone Binding Globulin (SHBG) binds to testosterone, making it inactive. Tracking both is essential for evaluating the need for <a href="/directory">Testosterone Replacement Therapy</a>.</p>
      
      <h3>3. hs-CRP (High-Sensitivity C-Reactive Protein)</h3>
      <p>Chronic, low-grade inflammation is a driver of aging and many chronic diseases. hs-CRP is a sensitive marker of systemic inflammation. Keeping this marker low through diet, exercise, and targeted supplementation is a key longevity strategy.</p>
      
      <h3>4. Fasting Insulin and HbA1c</h3>
      <p>Insulin resistance often develops years before changes in fasting glucose are seen. Tracking fasting insulin and HbA1c provides a clear picture of metabolic health and the risk of developing type 2 diabetes.</p>
      
      <h3>5. DHEA-S</h3>
      <p>Dehydroepiandrosterone sulfate (DHEA-S) is an adrenal hormone that declines with age. It plays a role in immune function, mood, and body composition. Monitoring DHEA-S levels can help identify adrenal fatigue and guide optimization protocols.</p>
    `,
    relatedArticles: [
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "sleep-architecture-testosterone",
        title: "Sleep Architecture and Endocrine Function",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "sleep-architecture-testosterone": {
    id: "sleep-architecture-testosterone",
    title: "Sleep Architecture and Endocrine Function",
    category: "Hormone Optimization",
    author: {
      name: "Dr. Sarah Jenkins",
      role: "Endocrinology Specialist",
      image: "https://images.unsplash.com/photo-1594824436998-d40d59f5bb38?auto=format&fit=crop&q=80&w=200"
    },
    date: "Sep 22, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "An exploration of the bidirectional relationship between deep sleep phases and natural testosterone production, with actionable protocols for optimization.",
    targetAudience: "patient",
    content: `
      <h2>The Foundation of Hormonal Health</h2>
      <p>Sleep is not merely a period of rest; it is an active state of physiological repair and hormonal regulation. For men, the quality and architecture of sleep directly impact testosterone production and overall endocrine function.</p>
      
      <h3>The Role of Deep Sleep</h3>
      <p>The majority of daily testosterone release occurs during sleep, specifically during the first period of slow-wave (deep) sleep. Disruptions to this sleep phase, whether from sleep apnea, stress, or poor sleep hygiene, can significantly blunt testosterone production.</p>
      
      <h3>Cortisol and the Circadian Rhythm</h3>
      <p>Elevated evening cortisol levels, often driven by chronic stress or late-night screen time, interfere with the natural circadian rhythm and suppress the nocturnal release of testosterone. Managing stress and optimizing the sleep environment are critical for hormonal balance.</p>
      
      <h3>Protocols for Sleep Optimization</h3>
      <ul>
        <li><strong>Consistent Sleep Schedule:</strong> Go to bed and wake up at the same time every day to regulate your circadian rhythm.</li>
        <li><strong>Light Management:</strong> Maximize morning sunlight exposure and minimize blue light exposure in the evening.</li>
        <li><strong>Temperature Control:</strong> Keep the bedroom cool (around 65°F or 18°C) to facilitate the drop in core body temperature required for deep sleep.</li>
        <li><strong>Targeted Supplementation:</strong> Consider supplements like magnesium bisglycinate, L-theanine, or apigenin to support relaxation and sleep quality.</li>
      </ul>
    `,
    relatedArticles: [
      {
        id: "longevity-biomarkers",
        title: "5 Biomarkers Every Man Over 40 Should Track",
        category: "Longevity & Aging",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "scaling-telehealth": {
    id: "scaling-telehealth",
    title: "Scaling Telehealth in Men's Medicine",
    category: "Clinic Operations",
    author: {
      name: "Novalyte Operations Team",
      role: "Practice Management",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
    },
    date: "Sep 15, 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "A guide for clinic operators on navigating compliance, asynchronous care, and patient experience when scaling a men's health telehealth practice.",
    targetAudience: "provider",
    content: `
      <h2>The Digital Transformation of Men's Health</h2>
      <p>Telehealth has revolutionized access to men's health services, particularly for treatments like <a href="/directory">Testosterone Replacement Therapy</a> and peptide protocols. However, scaling a telehealth practice requires careful navigation of regulatory landscapes and a focus on patient experience.</p>
      
      <h3>Navigating Compliance</h3>
      <p>Compliance is the cornerstone of any successful telehealth operation. This includes adhering to state-specific regulations regarding telemedicine, prescribing controlled substances, and maintaining HIPAA-compliant communication platforms.</p>
      
      <h3>The Power of Asynchronous Care</h3>
      <p>Asynchronous care models, where patients and providers communicate without being present at the same time, offer significant scalability. This approach is particularly effective for routine follow-ups, lab reviews, and medication management.</p>
      
      <h3>Optimizing the Patient Experience</h3>
      <p>In a digital environment, the user experience is paramount. This involves seamless onboarding, intuitive patient portals, and responsive communication channels. Building trust and engagement through digital touchpoints is essential for patient retention.</p>
      
      <h3>Leveraging the Novalyte Network</h3>
      <p>For providers looking to scale, joining the <a href="/workforce">Novalyte Workforce</a> offers access to a steady stream of qualified patients and a robust infrastructure for managing telehealth operations.</p>
    `,
    relatedArticles: [
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "cognitive-peptides-executive",
        title: "Cognitive Peptides: The Executive Edge",
        category: "Performance",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "hair-restoration-protocols": {
    id: "hair-restoration-protocols",
    title: "Advanced Hair Restoration: Beyond Finasteride",
    category: "Hormone Optimization",
    author: {
      name: "Dr. Marcus Thorne",
      role: "Chief Medical Officer",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
    },
    date: "Sep 10, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "A deep dive into topical compounds, micro-needling, and PRP therapies for aggressive androgenetic alopecia, moving beyond traditional oral medications.",
    targetAudience: "patient",
    content: `
      <h2>Rethinking Hair Loss Treatment</h2>
      <p>For decades, oral finasteride and topical minoxidil have been the standard of care for androgenetic alopecia. However, concerns about systemic side effects and varying efficacy have driven the development of more advanced, targeted therapies.</p>
      
      <h3>Topical Compounded Formulations</h3>
      <p>Compounding pharmacies are now creating customized topical solutions that combine multiple active ingredients, such as dutasteride, minoxidil, and retinoic acid. These formulations deliver high concentrations of medication directly to the scalp, minimizing systemic absorption and potential side effects.</p>
      
      <h3>Micro-needling and Exosomes</h3>
      <p>Micro-needling creates controlled micro-injuries in the scalp, stimulating blood flow and the release of growth factors. When combined with exosomes—vesicles containing potent regenerative signals—this therapy can significantly enhance hair follicle regeneration.</p>
      
      <h3>Platelet-Rich Plasma (PRP) Therapy</h3>
      <p>PRP involves drawing a patient's blood, isolating the platelet-rich plasma, and injecting it into the scalp. The concentrated growth factors in PRP stimulate dormant hair follicles and prolong the growth phase of the hair cycle. Many <a href="/directory">top-tier clinics</a> now offer advanced PRP protocols.</p>
    `,
    relatedArticles: [
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "longevity-biomarkers",
        title: "5 Biomarkers Every Man Over 40 Should Track",
        category: "Longevity & Aging",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "shockwave-therapy-ed": {
    id: "shockwave-therapy-ed",
    title: "Shockwave Therapy for Erectile Dysfunction",
    category: "Longevity & Aging",
    author: {
      name: "Dr. Sarah Jenkins",
      role: "Endocrinology Specialist",
      image: "https://images.unsplash.com/photo-1594824436998-d40d59f5bb38?auto=format&fit=crop&q=80&w=200"
    },
    date: "Sep 02, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "An overview of how low-intensity extracorporeal shockwave therapy (LI-ESWT) is replacing PDE5 inhibitors for long-term vascular repair and improved erectile function.",
    targetAudience: "patient",
    content: `
      <h2>Addressing the Root Cause of ED</h2>
      <p>While PDE5 inhibitors (like Viagra and Cialis) are effective for managing the symptoms of erectile dysfunction, they do not address the underlying vascular issues. Low-intensity extracorporeal shockwave therapy (LI-ESWT) offers a regenerative approach to ED treatment.</p>
      
      <h3>How LI-ESWT Works</h3>
      <p>LI-ESWT uses acoustic waves to stimulate neovascularization—the formation of new blood vessels—in the penile tissue. This improves blood flow and restores natural erectile function, offering a potential long-term solution rather than a temporary fix.</p>
      
      <h3>The Treatment Protocol</h3>
      <p>A typical LI-ESWT protocol involves a series of short, painless sessions over several weeks. The therapy is non-invasive and has a high safety profile, making it an attractive option for men seeking alternatives to medication.</p>
      
      <h3>Combining Therapies for Optimal Results</h3>
      <p>For maximum efficacy, LI-ESWT is often combined with other optimization strategies, such as <a href="/directory">Testosterone Replacement Therapy</a> and lifestyle modifications, to address both vascular and hormonal components of sexual health.</p>
    `,
    relatedArticles: [
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "longevity-biomarkers",
        title: "5 Biomarkers Every Man Over 40 Should Track",
        category: "Longevity & Aging",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "clinic-revenue-optimization": {
    id: "clinic-revenue-optimization",
    title: "The $1M Clinic Blueprint: Optimizing Patient LTV",
    category: "Clinic Operations",
    author: {
      name: "James Carter",
      role: "Practice Growth Consultant",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200"
    },
    date: "Oct 01, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "A strategic overview of how top-performing men's health clinics use continuous monitoring and subscription models to increase patient retention and lifetime value (LTV).",
    targetAudience: "provider",
    content: `
      <h2>Moving Beyond the Transactional Model</h2>
      <p>The traditional fee-for-service model in men's health is inherently flawed. It incentivizes episodic care rather than continuous optimization. The most successful clinics are shifting towards subscription-based models that prioritize long-term patient outcomes and predictable recurring revenue.</p>
      
      <h3>The Power of Subscriptions</h3>
      <p>A subscription model aligns the clinic's financial incentives with the patient's health goals. Patients pay a monthly fee that covers their medications, regular lab work, and ongoing consultations. This ensures adherence to protocols and allows for proactive adjustments.</p>
      
      <h3>Continuous Monitoring and Engagement</h3>
      <p>Patient retention is driven by engagement. Clinics that utilize wearable data, regular check-ins, and personalized health dashboards see significantly higher lifetime value (LTV). The <a href="/workforce">Novalyte platform</a> provides tools to facilitate this continuous monitoring.</p>
      
      <h3>Upselling and Cross-Selling</h3>
      <p>Once a patient is established on a core protocol (like TRT), there are opportunities to introduce complementary therapies, such as peptides for recovery or specialized longevity supplements. This requires a deep understanding of the patient's goals and a consultative approach.</p>
      
      <h3>Building a High-Performance Team</h3>
      <p>Scaling a clinic requires a team that understands both the clinical and business aspects of men's health. Sourcing top talent through specialized networks like the <a href="/workforce">Novalyte Workforce</a> is critical for maintaining quality of care while expanding operations.</p>
    `,
    relatedArticles: [
      {
        id: "scaling-telehealth",
        title: "Scaling Telehealth in Men's Medicine",
        category: "Clinic Operations",
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      }
    ]
  },
  "bpc157-tb500-recovery": {
    id: "bpc157-tb500-recovery",
    title: "BPC-157 & TB-500: The Ultimate Recovery Stack",
    category: "Performance",
    author: {
      name: "Dr. Marcus Thorne",
      role: "Chief Medical Officer",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
    },
    date: "Aug 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=2000",
    aiSummary: "An in-depth look at how the combination of BPC-157 and TB-500 peptides accelerates tissue repair, reduces systemic inflammation, and helps athletes and executives overcome chronic injuries.",
    targetAudience: "patient",
    content: `
      <h2>The New Standard in Injury Recovery</h2>
      <p>For decades, the standard protocol for soft tissue injuries was RICE (Rest, Ice, Compression, Elevation) followed by NSAIDs and physical therapy. While helpful, these methods often fail to address the underlying need for rapid cellular repair. Enter the world of regenerative peptides, specifically the powerful combination of BPC-157 and TB-500.</p>
      
      <h3>BPC-157: The Body Protection Compound</h3>
      <p>BPC-157 is a pentadecapeptide derived from human gastric juice. It is renowned for its profound healing effects on tendons, ligaments, muscles, and the gastrointestinal tract. It works by upregulating growth hormone receptors and promoting angiogenesis (the formation of new blood vessels), delivering vital nutrients directly to the site of injury.</p>
      
      <h3>TB-500: The Cellular Migrator</h3>
      <p>TB-500 is a synthetic fraction of Thymosin Beta-4, a naturally occurring protein. Its primary mechanism of action is the upregulation of actin, a cellular protein essential for cell structure and movement. This allows for rapid migration of healing cells to damaged tissues, significantly reducing inflammation and preventing the formation of fibrotic scar tissue.</p>
      
      <h3>The Synergistic Stack</h3>
      <p>When used together, BPC-157 and TB-500 create a synergistic effect that accelerates healing far beyond what either peptide can achieve alone. BPC-157 builds the new vascular network, while TB-500 drives the necessary cellular components through that network to repair the damage.</p>
      
      <h3>Clinical Applications</h3>
      <ul>
        <li><strong>Tendonitis and Ligament Tears:</strong> Accelerates healing of notoriously slow-healing avascular tissues.</li>
        <li><strong>Muscle Tears and Strains:</strong> Reduces recovery time and minimizes scar tissue formation, preserving muscle function.</li>
        <li><strong>Post-Surgical Recovery:</strong> Often used off-label to speed up healing after orthopedic surgeries.</li>
        <li><strong>Gut Health:</strong> BPC-157 is highly effective in treating leaky gut syndrome and inflammatory bowel conditions.</li>
      </ul>
      
      <p>If you are struggling with a nagging injury that is holding back your performance, consider consulting with a <a href="/directory">specialized peptide clinic</a> to explore if this recovery stack is right for you.</p>
    `,
    relatedArticles: [
      {
        id: "future-of-trt",
        title: "The Future of Testosterone Replacement",
        category: "Hormone Optimization",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
      },
      {
        id: "cognitive-peptides-executive",
        title: "Cognitive Peptides: The Executive Edge",
        category: "Performance",
        image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800"
      }
    ]
  }
};

export function BlogDetail() {
  const { id } = useParams();
  
  // Fallback to future-of-trt if article not found
  const article = ARTICLES_DB[id as string] || ARTICLES_DB["future-of-trt"];

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pb-24">
      
      {/* Editorial Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <img 
          src={article.image} 
          alt={article.title} 
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
                  <span className="text-xs font-bold text-white tracking-wide uppercase">{article.category}</span>
                </div>
                <div className="px-3 py-1 rounded bg-surface-2 border border-surface-3 flex items-center gap-1.5 backdrop-blur-md">
                  <Clock className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="text-xs font-bold text-text-secondary tracking-wide uppercase">{article.readTime}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-8 tracking-tight leading-tight">
                {article.title}
              </h1>
              
              <div className="flex items-center justify-between border-t border-surface-3 pt-6">
                <div className="flex items-center gap-4">
                  <img 
                    src={article.author.image} 
                    alt={article.author.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-surface-3"
                  />
                  <div>
                    <p className="text-white font-bold">{article.author.name}</p>
                    <p className="text-sm text-text-secondary">{article.author.role} • {article.date}</p>
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
                  {article.aiSummary}
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
              dangerouslySetInnerHTML={{ __html: article.content }}
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
          {article.relatedArticles.map((relatedArticle: any, i: number) => (
            <Link key={i} to={`/blog/${relatedArticle.id}`}>
              <Card className="overflow-hidden bg-[#0B0F14] border-surface-3 hover:border-primary/30 transition-all group cursor-pointer h-full flex flex-col">
                <div className="h-48 relative overflow-hidden">
                  <img src={relatedArticle.image} alt={relatedArticle.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-primary" />
                    <span className="text-white font-bold text-xs uppercase tracking-wider">{relatedArticle.category}</span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-xl mb-3 group-hover:text-primary transition-colors leading-snug">{relatedArticle.title}</h3>
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
