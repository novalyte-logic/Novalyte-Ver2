import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { Activity, Brain, Heart, Moon, Zap, Camera, CheckCircle2, ChevronRight, Shield, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';

// --- Data Generation & Constants ---

const generateEndocrineData = (interventionAge: number) => {
  const data = [];
  for (let age = 30; age <= 70; age += 2) {
    const natural = Math.max(300, 900 - (age - 30) * 12); // Declines from 900 to 420
    let optimized = natural;
    if (age >= interventionAge) {
      const yearsOnProtocol = age - interventionAge;
      // Ramps up and stabilizes around 850-1000
      optimized = Math.min(950, natural + yearsOnProtocol * 150 + 200);
    }
    data.push({ age, natural, optimized });
  }
  return data;
};

const METABOLIC_PROFILES = {
  standard: [
    { metric: 'Insulin Sensitivity', value: 40 },
    { metric: 'Lean Mass', value: 30 },
    { metric: 'Visceral Fat Loss', value: 20 },
    { metric: 'Cognitive Focus', value: 50 },
    { metric: 'Cardio Health', value: 45 },
  ],
  lifestyle: [
    { metric: 'Insulin Sensitivity', value: 65 },
    { metric: 'Lean Mass', value: 60 },
    { metric: 'Visceral Fat Loss', value: 55 },
    { metric: 'Cognitive Focus', value: 70 },
    { metric: 'Cardio Health', value: 75 },
  ],
  optimized: [
    { metric: 'Insulin Sensitivity', value: 95 },
    { metric: 'Lean Mass', value: 90 },
    { metric: 'Visceral Fat Loss', value: 85 },
    { metric: 'Cognitive Focus', value: 95 },
    { metric: 'Cardio Health', value: 90 },
  ]
};

const generateSleepData = (stressLevel: number) => {
  const data = [];
  const hours = 8;
  for (let i = 0; i <= hours * 4; i++) { // 15 min intervals
    const hour = i / 4;
    // Base wave: cycles of ~90 mins (1.5 hours)
    let depth = Math.sin(hour * Math.PI * (1 / 0.75)) * 40 + 50; 
    
    // Apply stress: higher stress = less depth, more erratic, more awakenings
    if (stressLevel > 50) {
      const stressFactor = (stressLevel - 50) / 50;
      depth = depth * (1 - stressFactor * 0.5) - (Math.random() * 20 * stressFactor);
      // Random awakenings
      if (Math.random() < stressFactor * 0.2) depth = 10; 
    } else {
      const optimizationFactor = (50 - stressLevel) / 50;
      depth = depth + (optimizationFactor * 20);
    }
    
    depth = Math.max(5, Math.min(95, depth));
    
    data.push({
      time: `${Math.floor(hour)}h ${Math.floor((hour % 1) * 60)}m`,
      depth: depth,
      // For visual reference: >80 Deep, 50-80 Light, 20-50 REM, <20 Awake
    });
  }
  return data;
};

// --- Custom Tooltips ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0F14]/95 backdrop-blur-md border border-surface-3 p-4 rounded-xl shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.name}:</span>
            <span className="text-white font-mono">{Math.round(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// --- Main Component ---

export function VisualIntelligence() {
  // State for simulations
  const [interventionAge, setInterventionAge] = useState(40);
  const [metabolicMode, setMetabolicMode] = useState<'standard' | 'lifestyle' | 'optimized'>('optimized');
  const [stressLevel, setStressLevel] = useState(20);
  
  // State for snapshot interaction
  const [isScanning, setIsScanning] = useState(false);
  const [snapshotReady, setSnapshotReady] = useState(false);

  // Memoized Data
  const endocrineData = useMemo(() => generateEndocrineData(interventionAge), [interventionAge]);
  const sleepData = useMemo(() => generateSleepData(stressLevel), [stressLevel]);

  const handleSnapshot = () => {
    setIsScanning(true);
    setSnapshotReady(false);
    setTimeout(() => {
      setIsScanning(false);
      setSnapshotReady(true);
      setTimeout(() => setSnapshotReady(false), 5000); // Hide after 5s
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#05070A] font-sans text-text-primary pt-24 pb-32 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-secondary/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-bold tracking-wide uppercase">Interactive Data Storytelling</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
              Visual <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Intelligence</span>
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed">
              Explore the biological impact of clinical optimization through interactive simulations and real-time data models.
            </p>
          </motion.div>
        </div>

        <div className="space-y-12">
          
          {/* Simulation 1: Endocrine Trajectory */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-1 bg-[#0B0F14] border-surface-3 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-6 md:p-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-4 space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white">The Endocrine Trajectory</h2>
                    <p className="text-text-secondary leading-relaxed">
                      Natural testosterone decline begins at age 30. Adjust the intervention age to see how clinical optimization alters the biological trajectory, restoring levels to peak physiological ranges.
                    </p>
                    
                    <div className="pt-6 border-t border-surface-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Intervention Age</span>
                        <span className="text-primary font-mono font-bold">{interventionAge} yrs</span>
                      </div>
                      <input 
                        type="range" 
                        min="30" 
                        max="60" 
                        step="2"
                        value={interventionAge}
                        onChange={(e) => setInterventionAge(parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                      <div className="flex justify-between mt-2 text-xs text-text-secondary">
                        <span>Age 30</span>
                        <span>Age 60</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={endocrineData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A25" vertical={false} />
                        <XAxis 
                          dataKey="age" 
                          stroke="#6C7293" 
                          tick={{ fill: '#6C7293', fontSize: 12 }}
                          tickFormatter={(val) => `${val}y`}
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          stroke="#6C7293" 
                          tick={{ fill: '#6C7293', fontSize: 12 }}
                          domain={[200, 1200]}
                          axisLine={false}
                          tickLine={false}
                        />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Line 
                          type="monotone" 
                          dataKey="natural" 
                          name="Natural Decline" 
                          stroke="#4B5563" 
                          strokeWidth={2} 
                          strokeDasharray="5 5"
                          dot={false} 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="optimized" 
                          name="Novalyte Protocol" 
                          stroke="#06B6D4" 
                          strokeWidth={3} 
                          dot={false}
                          activeDot={{ r: 6, fill: '#06B6D4', stroke: '#05070A', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Simulation 2: Metabolic Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-1 bg-[#0B0F14] border-surface-3 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-6 md:p-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  
                  <div className="lg:col-span-8 h-[450px] w-full order-2 lg:order-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={METABOLIC_PROFILES[metabolicMode]}>
                        <PolarGrid stroke="#1A1A25" />
                        <PolarAngleAxis 
                          dataKey="metric" 
                          tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 500 }} 
                        />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Radar 
                          name="Optimization Score" 
                          dataKey="value" 
                          stroke="#8B5CF6" 
                          strokeWidth={2}
                          fill="#8B5CF6" 
                          fillOpacity={0.3} 
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                      <Heart className="w-6 h-6 text-secondary" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white">The Metabolic Matrix</h2>
                    <p className="text-text-secondary leading-relaxed">
                      Observe the multi-system impact of different interventions. While diet and exercise provide a baseline, advanced peptide therapies (like GLP-1s + Secretagogues) maximize the entire metabolic envelope.
                    </p>
                    
                    <div className="pt-6 border-t border-surface-3 space-y-3">
                      <button 
                        onClick={() => setMetabolicMode('standard')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${metabolicMode === 'standard' ? 'bg-surface-3 border-white/20 text-white' : 'bg-surface-1 border-transparent text-text-secondary hover:bg-surface-2'}`}
                      >
                        <span className="font-medium">Standard Care (Baseline)</span>
                        {metabolicMode === 'standard' && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                      </button>
                      <button 
                        onClick={() => setMetabolicMode('lifestyle')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${metabolicMode === 'lifestyle' ? 'bg-surface-3 border-white/20 text-white' : 'bg-surface-1 border-transparent text-text-secondary hover:bg-surface-2'}`}
                      >
                        <span className="font-medium">Diet & Exercise Only</span>
                        {metabolicMode === 'lifestyle' && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                      </button>
                      <button 
                        onClick={() => setMetabolicMode('optimized')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${metabolicMode === 'optimized' ? 'bg-secondary/10 border-secondary/30 text-secondary' : 'bg-surface-1 border-transparent text-text-secondary hover:bg-surface-2'}`}
                      >
                        <span className="font-bold">Novalyte Protocol</span>
                        {metabolicMode === 'optimized' && <CheckCircle2 className="w-4 h-4 text-secondary" />}
                      </button>
                    </div>
                  </div>
                  
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Simulation 3: Sleep Architecture */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-1 bg-[#0B0F14] border-surface-3 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="p-6 md:p-10 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-4 space-y-6">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20">
                      <Moon className="w-6 h-6 text-teal-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Sleep Architecture</h2>
                    <p className="text-text-secondary leading-relaxed">
                      High cortisol and systemic inflammation destroy deep sleep phases. Adjust the stress/inflammation slider to see how it fragments sleep architecture, reducing restorative REM and Deep cycles.
                    </p>
                    
                    <div className="pt-6 border-t border-surface-3">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Systemic Stress Load</span>
                        <span className="text-teal-400 font-mono font-bold">{stressLevel}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="5"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(parseInt(e.target.value))}
                        className="w-full h-2 bg-surface-3 rounded-lg appearance-none cursor-pointer accent-teal-400"
                      />
                      <div className="flex justify-between mt-2 text-xs text-text-secondary">
                        <span>Optimized</span>
                        <span>High Stress</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-8 h-[350px] w-full relative">
                    {/* Y-Axis Labels (Custom overlay for clarity) */}
                    <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs font-bold text-text-secondary py-4 z-10 pointer-events-none">
                      <span>AWAKE</span>
                      <span>REM</span>
                      <span>LIGHT</span>
                      <span className="text-teal-400">DEEP</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sleepData} margin={{ top: 20, right: 0, left: 60, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorDepth" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1A1A25" vertical={false} />
                        <XAxis 
                          dataKey="time" 
                          stroke="#6C7293" 
                          tick={{ fill: '#6C7293', fontSize: 12 }}
                          axisLine={false}
                          tickLine={false}
                          minTickGap={30}
                        />
                        <YAxis hide domain={[0, 100]} reversed /> {/* Reversed so 100 (Deep) is at the bottom visually */}
                        <RechartsTooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="depth" 
                          name="Sleep Depth"
                          stroke="#2DD4BF" 
                          strokeWidth={2}
                          fillOpacity={1} 
                          fill="url(#colorDepth)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

        </div>

        {/* Snapshot Interaction */}
        <div className="mt-20 text-center relative">
          <AnimatePresence mode="wait">
            {!isScanning && !snapshotReady && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button 
                  size="lg" 
                  onClick={handleSnapshot}
                  className="bg-white text-black hover:bg-gray-200 font-bold px-8 h-14 text-lg shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Capture Intelligence Snapshot
                </Button>
                <p className="text-text-secondary text-sm mt-4">
                  Generate a personalized report based on your current simulation parameters.
                </p>
              </motion.div>
            )}

            {isScanning && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="relative w-24 h-24 mb-4">
                  <div className="absolute inset-0 border-4 border-surface-3 rounded-full" />
                  <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                  <SlidersHorizontal className="w-8 h-8 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-white">Analyzing Parameters...</h3>
                <p className="text-primary text-sm mt-2 font-mono">Compiling biological vectors</p>
              </motion.div>
            )}

            {snapshotReady && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className="inline-block p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30 text-left max-w-md w-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Snapshot Captured</h3>
                      <p className="text-xs text-text-secondary font-mono">ID: NVL-{Math.floor(Math.random() * 10000)}</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Intervention Target:</span>
                      <span className="text-white font-bold">{interventionAge} Years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Metabolic Protocol:</span>
                      <span className="text-white font-bold capitalize">{metabolicMode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">Systemic Stress:</span>
                      <span className="text-white font-bold">{stressLevel}%</span>
                    </div>
                  </div>
                  <Link to="/contact">
                    <Button className="w-full">
                      Download Full Report
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
