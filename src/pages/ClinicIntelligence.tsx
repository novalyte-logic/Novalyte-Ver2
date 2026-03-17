import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  BrainCircuit, TrendingUp, Activity, BarChart2, Sparkles, 
  Users, DollarSign, Target, CalendarCheck, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Zap, ChevronRight
} from 'lucide-react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';
import { AIService } from '@/src/services/ai';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// --- Mock Data for Charts (Still useful for visualization) ---
const showRateData = [
  { month: 'Oct', rate: 68, industryAvg: 65 },
  { month: 'Nov', rate: 72, industryAvg: 65 },
  { month: 'Dec', rate: 70, industryAvg: 66 },
  { month: 'Jan', rate: 75, industryAvg: 66 },
  { month: 'Feb', rate: 82, industryAvg: 67 },
  { month: 'Mar', rate: 85, industryAvg: 67 },
];

const sourceData = [
  { source: 'Organic', volume: 145, conversion: 22 },
  { source: 'Paid Social', volume: 210, conversion: 14 },
  { source: 'Directory', volume: 85, conversion: 38 },
  { source: 'Referrals', volume: 42, conversion: 65 },
];

const treatmentMixData = [
  { name: 'TRT', value: 45, color: '#06B6D4' },
  { name: 'Peptides', value: 25, color: '#8B5CF6' },
  { name: 'Weight Loss', value: 20, color: '#14B8A6' },
  { name: 'Longevity', value: 10, color: '#F59E0B' },
];

const retentionData = [
  { month: 'M1', retention: 100 },
  { month: 'M3', retention: 85 },
  { month: 'M6', retention: 72 },
  { month: 'M9', retention: 65 },
  { month: 'M12', retention: 58 },
];

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B0F14] border border-surface-3 p-3 rounded-lg shadow-xl">
        <p className="text-white font-bold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-text-secondary">{entry.name}:</span>
            <span className="text-white font-mono">{entry.value}{entry.name.includes('rate') || entry.name.includes('conversion') || entry.name.includes('retention') ? '%' : ''}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface IntelligenceInsight {
  id: string;
  type: 'growth' | 'efficiency' | 'retention';
  title: string;
  description: string;
  impact: string;
  action: string;
  createdAt: any;
}

export function ClinicIntelligence() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState('30d');
  const [insights, setInsights] = useState<IntelligenceInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'intelligenceInsights'),
      where('clinicId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as IntelligenceInsight[];
      setInsights(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header & Actions */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Strategic Intelligence</h1>
          <p className="text-text-secondary mt-1">AI-interpreted performance, acquisition, and retention analytics.</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-surface-1 border border-surface-3 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary/50 w-full sm:w-auto"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold">
            Export Report
          </Button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-grow overflow-y-auto hide-scrollbar pb-8">
        <div className="space-y-6">
          
          {/* AI Interpretation Hero */}
          <Card className="p-8 bg-[#0B0F14] border-secondary/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <BrainCircuit className="w-48 h-48 text-secondary" />
            </div>
            <div className="relative z-10 max-w-4xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-secondary" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Executive Summary</h2>
              </div>
              <p className="text-2xl font-display font-bold text-white leading-tight mb-6">
                {loading ? 'Analyzing clinic performance...' : (insights[0]?.description || 'Your show rate is up 12% this month, driven by automated SMS triage. However, Paid Social leads are converting 15% lower than average. Consider shifting $2,500 of ad spend to the Novalyte Directory.')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/dashboard/leads">
                  <Button className="bg-secondary hover:bg-secondary/90 text-white font-bold">
                    {loading ? 'Loading...' : (insights[0]?.action || 'Review Ad Spend Allocation')}
                  </Button>
                </Link>
                <Link to="/dashboard/settings">
                  <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2">
                    View Triage Settings
                  </Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Show Rate', value: '85%', trend: '+12%', isPositive: true, icon: CalendarCheck, color: 'text-primary', bg: 'bg-primary/10' },
              { label: 'Avg Patient Value', value: '$3,240', trend: '+5.2%', isPositive: true, icon: DollarSign, color: 'text-success', bg: 'bg-success/10' },
              { label: 'Blended CAC', value: '$345', trend: '+18%', isPositive: false, icon: Target, color: 'text-warning', bg: 'bg-warning/10' },
              { label: '12-Mo Retention', value: '58%', trend: '+2%', isPositive: true, icon: Users, color: 'text-secondary', bg: 'bg-secondary/10' },
            ].map((kpi, i) => (
              <Card key={i} className="p-6 bg-surface-1 border-surface-3">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-bold ${kpi.isPositive ? 'text-success' : 'text-danger'}`}>
                    {kpi.isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {kpi.trend}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-display font-bold text-white mb-1">{kpi.value}</h3>
                  <p className="text-sm font-medium text-text-secondary">{kpi.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Row 1: Show Rates & Source Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Show Rate Trends */}
            <Card className="p-6 bg-[#0B0F14] border-surface-3 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Show-Rate Trends</h3>
                <p className="text-sm text-text-secondary">Your clinic vs. Industry Average</p>
              </div>
              <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={showRateData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3A" vertical={false} />
                    <XAxis dataKey="month" stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                    <Line type="monotone" dataKey="rate" name="Your Clinic" stroke="#06B6D4" strokeWidth={3} dot={{ r: 4, fill: '#06B6D4', strokeWidth: 2, stroke: '#0B0F14' }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="industryAvg" name="Industry Avg" stroke="#6C7293" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Source Analysis */}
            <Card className="p-6 bg-[#0B0F14] border-surface-3 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Acquisition Source Analysis</h3>
                <p className="text-sm text-text-secondary">Lead Volume vs. Conversion Rate</p>
              </div>
              <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3A" vertical={false} />
                    <XAxis dataKey="source" stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" orientation="left" stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                    <Bar yAxisId="left" dataKey="volume" name="Lead Volume" fill="#14B8A6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar yAxisId="right" dataKey="conversion" name="Conversion Rate" fill="#8B5CF6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Charts Row 2: Treatment Mix & Retention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Treatment Mix */}
            <Card className="p-6 bg-[#0B0F14] border-surface-3 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Treatment Mix (Revenue)</h3>
                <p className="text-sm text-text-secondary">Distribution of revenue by protocol category</p>
              </div>
              <div className="flex-grow min-h-[300px] flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={treatmentMixData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={110}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {treatmentMixData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '12px', color: '#94A3B8' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Retention Curve */}
            <Card className="p-6 bg-[#0B0F14] border-surface-3 flex flex-col">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Patient Retention Curve</h3>
                <p className="text-sm text-text-secondary">Percentage of active patients over 12 months</p>
              </div>
              <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={retentionData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2F3A" vertical={false} />
                    <XAxis dataKey="month" stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#6C7293" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="retention" name="Retention Rate" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRetention)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Decision-Oriented Insights */}
          <div className="mt-8">
            <h3 className="text-xl font-display font-bold text-white mb-4">Actionable Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {insights.length > 0 ? insights.map((insight) => (
                <Card key={insight.id} className="p-5 bg-surface-1 border-surface-3 hover:border-surface-4 transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${
                      insight.type === 'growth' ? 'bg-success/10 text-success' : 
                      insight.type === 'efficiency' ? 'bg-warning/10 text-warning' : 
                      'bg-secondary/10 text-secondary'
                    } flex items-center justify-center shrink-0`}>
                      {insight.type === 'growth' ? <TrendingUp className="w-5 h-5" /> : 
                       insight.type === 'efficiency' ? <AlertTriangle className="w-5 h-5" /> : 
                       <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
                      <p className="text-sm text-text-secondary mb-3">{insight.description}</p>
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        {insight.action} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              )) : (
                <>
                  <Card className="p-5 bg-surface-1 border-surface-3 hover:border-surface-4 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center text-warning shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">High CAC on Paid Social</h4>
                        <p className="text-sm text-text-secondary mb-3">Your Customer Acquisition Cost for Facebook/IG leads has spiked 18% in the last 14 days. Conversion from these sources is dropping.</p>
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          Review Campaign Targeting <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-5 bg-surface-1 border-surface-3 hover:border-surface-4 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center text-success shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white mb-1 group-hover:text-primary transition-colors">Peptide Upsell Opportunity</h4>
                        <p className="text-sm text-text-secondary mb-3">22% of your active TRT patients have expressed interest in weight management. A targeted email campaign could yield high ROI.</p>
                        <span className="text-xs font-bold text-primary flex items-center gap-1">
                          Draft Outreach Campaign <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
