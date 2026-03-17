import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, Search, Filter, MoreVertical, Clock, 
  AlertTriangle, Activity, Calendar, MessageSquare, 
  FileText, Phone, Mail, User, Sparkles, ShieldCheck, X,
  Plus, ArrowRight, CheckCircle2
} from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { useAuth } from '@/src/lib/auth/AuthContext';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

type Patient = {
  id: string;
  name: string;
  intent: string;
  score: number;
  time: string;
  stage: 'intake' | 'triage' | 'consult' | 'treating';
  risk: 'high' | 'medium' | 'low';
  riskReason?: string;
  intentSignal?: string;
  budget: string;
  urgency: string;
  aiSummary: string;
  notes: { id: string; text: string; date: string }[];
  nextAppointment?: string;
};

const stages = [
  { id: 'intake', label: 'Intake / New', color: 'bg-primary' },
  { id: 'triage', label: 'Triage / Review', color: 'bg-warning' },
  { id: 'consult', label: 'Consult Scheduled', color: 'bg-secondary' },
  { id: 'treating', label: 'Enrolled / Treating', color: 'bg-success' }
] as const;

export function ClinicPipeline() {
  const { user, role } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'schedule'>('overview');
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    if (!user) return;

    let q = query(collection(db, 'leads'));
    if (role === 'clinic') {
      q = query(collection(db, 'leads'), where('clinicId', '==', user.uid));
    }

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const leadsData = await Promise.all(snapshot.docs.map(async (leadDoc) => {
        const lead = leadDoc.data();
        let patientData: any = {};
        
        if (lead.patientId) {
          const patientSnap = await getDoc(doc(db, 'patients', lead.patientId));
          if (patientSnap.exists()) patientData = patientSnap.data();
        }

        const statusToStage = (status: string): Patient['stage'] => {
          if (status === 'new') return 'intake';
          if (status === 'contacted') return 'triage';
          if (status === 'scheduled') return 'consult';
          if (status === 'treating') return 'treating';
          return 'intake';
        };

        return {
          id: leadDoc.id,
          name: patientData.firstName ? `${patientData.firstName} ${patientData.lastName?.charAt(0) || ''}.` : 'Unknown Patient',
          intent: lead.treatmentInterest || 'General',
          score: lead.score || 85,
          time: lead.createdAt ? 'Active' : 'New',
          stage: statusToStage(lead.status || 'new'),
          risk: lead.score < 70 ? 'high' : lead.score < 85 ? 'medium' : 'low',
          riskReason: lead.score < 70 ? 'Low AI qualification score' : undefined,
          intentSignal: lead.intentSignal || 'Active engagement',
          budget: lead.budget || 'Unknown',
          urgency: lead.urgency || 'Unknown',
          aiSummary: lead.aiSummary || 'Patient shows strong clinical fit. Recommend immediate follow-up for consultation scheduling.',
          notes: lead.notes || []
        } as Patient;
      }));
      
      setPatients(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, role]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedPatient) return;
    
    try {
      const leadRef = doc(db, 'leads', selectedPatient.id);
      const newNoteObj = { 
        id: Date.now().toString(), 
        text: newNote, 
        date: new Date().toLocaleString() 
      };
      
      await updateDoc(leadRef, {
        notes: [newNoteObj, ...(selectedPatient.notes || [])]
      });
      
      setNewNote('');
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleMoveStage = async (patientId: string, currentStage: Patient['stage']) => {
    const stageOrder: Patient['stage'][] = ['intake', 'triage', 'consult', 'treating'];
    const currentIndex = stageOrder.indexOf(currentStage);
    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) return;

    const nextStage = stageOrder[currentIndex + 1];
    const statusMap: Record<Patient['stage'], string> = {
      intake: 'new',
      triage: 'contacted',
      consult: 'scheduled',
      treating: 'treating'
    };

    try {
      const leadRef = doc(db, 'leads', patientId);
      await updateDoc(leadRef, { 
        status: statusMap[nextStage],
        updatedAt: serverTimestamp()
      });

      // Log audit event
      await addDoc(collection(db, 'auditEvents'), {
        clinicId: user?.uid,
        action: `Stage Transition: ${currentStage} -> ${nextStage}`,
        entityId: patientId,
        entityName: patients.find(p => p.id === patientId)?.name || 'Patient',
        timestamp: serverTimestamp(),
        type: 'info'
      });
    } catch (error) {
      console.error("Error moving stage:", error);
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedId);

  return (
    <div className="h-auto min-h-[calc(100vh-8rem)] md:h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex-none flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Patient Pipeline</h1>
          <p className="text-text-secondary mt-1">Manage patient flow, intent signals, and operational stages.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              className="w-full pl-9 pr-4 py-2 bg-surface-2 border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-secondary/50"
            />
          </div>
          <Button variant="outline" className="border-surface-3 text-white hover:bg-surface-2 hidden sm:flex">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Link to="/dashboard/leads" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-black font-bold whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" /> New Patient
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Board Area */}
      <div className="flex-grow flex overflow-hidden gap-6">
        
        {/* Kanban Board */}
        <div className="flex-grow overflow-x-auto hide-scrollbar flex gap-6 pb-4">
          {stages.map(stage => {
            const stagePatients = patients.filter(p => p.stage === stage.id);
            
            return (
              <div key={stage.id} className="w-80 flex-shrink-0 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.color} shadow-[0_0_8px_currentColor]`} /> 
                    {stage.label}
                  </h3>
                  <span className="text-xs font-mono font-bold text-text-secondary bg-surface-2 border border-surface-3 px-2 py-1 rounded-md">
                    {stagePatients.length}
                  </span>
                </div>
                
                <div className="space-y-3 flex-grow overflow-y-auto hide-scrollbar pr-1">
                  {stagePatients.map((patient) => (
                    <Card 
                      key={patient.id} 
                      onClick={() => setSelectedId(patient.id)}
                      className={`p-4 cursor-pointer transition-all duration-200 ${
                        selectedId === patient.id 
                          ? 'bg-surface-2 border-primary shadow-[0_0_15px_rgba(53,212,255,0.1)]' 
                          : 'bg-[#0B0F14] border-surface-3 hover:border-surface-4 hover:bg-surface-1'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white">{patient.name}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center gap-1 ${
                          patient.score >= 90 ? 'bg-success/10 text-success border-success/20' :
                          patient.score >= 80 ? 'bg-warning/10 text-warning border-warning/20' :
                          'bg-danger/10 text-danger border-danger/20'
                        }`}>
                          <ShieldCheck className="w-3 h-3" /> {patient.score}
                        </span>
                      </div>
                      
                      <p className="text-xs font-medium text-text-secondary mb-3">{patient.intent}</p>
                      
                      {patient.risk === 'high' && (
                        <div className="mb-3 px-2 py-1.5 rounded bg-danger/10 border border-danger/20 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                          <span className="text-[10px] font-bold text-danger uppercase tracking-wider leading-tight">
                            Risk: {patient.riskReason}
                          </span>
                        </div>
                      )}
                      
                      {patient.intentSignal && patient.risk !== 'high' && (
                        <div className="mb-3 px-2 py-1.5 rounded bg-primary/5 border border-primary/10 flex items-start gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-tight">
                            Signal: {patient.intentSignal}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-text-secondary pt-2 border-t border-surface-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {patient.time}
                        </span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === patient.id ? 'text-primary translate-x-1' : ''}`} />
                      </div>
                    </Card>
                  ))}
                  
                  {stagePatients.length === 0 && (
                    <div className="p-6 text-center border-2 border-dashed border-surface-3 rounded-xl bg-surface-1/30">
                      <p className="text-sm text-text-secondary">No patients in this stage</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Dossier Side Panel */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: 20 }}
              animate={{ width: '100%', maxWidth: 400, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: 20 }}
              className="fixed md:relative right-0 top-0 bottom-0 z-50 md:z-auto flex-shrink-0 border-l border-surface-3 bg-[#0B0F14] flex flex-col rounded-l-2xl overflow-hidden shadow-2xl w-full md:w-[400px]"
            >
              {/* Dossier Header */}
              <div className="p-6 border-b border-surface-3 bg-surface-1/50 relative">
                <button 
                  onClick={() => setSelectedId(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-surface-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPatient.name}</h2>
                    <p className="text-sm text-text-secondary">{selectedPatient.intent}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold">
                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-surface-3 text-white hover:bg-surface-2">
                    <Phone className="w-4 h-4 mr-2" /> Call
                  </Button>
                </div>
              </div>

              {/* Dossier Tabs */}
              <div className="flex border-b border-surface-3 bg-surface-1/30">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'notes', label: 'Notes', icon: FileText },
                  { id: 'schedule', label: 'Schedule', icon: Calendar }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                      activeTab === tab.id 
                        ? 'border-primary text-primary bg-primary/5' 
                        : 'border-transparent text-text-secondary hover:text-white hover:bg-surface-2/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Dossier Content */}
              <div className="flex-grow overflow-y-auto p-6">
                
                {activeTab === 'overview' && (
                  <div className="space-y-6 animate-in fade-in">
                    
                    {/* AI Summary */}
                    <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Sparkles className="w-16 h-16 text-secondary" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          <h3 className="text-sm font-bold text-white">AI Copilot Summary</h3>
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {selectedPatient.aiSummary}
                        </p>
                      </div>
                    </div>

                    {/* Qualification Data */}
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Qualification Profile</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-surface-1 border border-surface-3">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">AI Score</span>
                          <span className="text-lg font-display font-bold text-success">{selectedPatient.score}/100</span>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-1 border border-surface-3">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Budget</span>
                          <span className="text-lg font-display font-bold text-white">{selectedPatient.budget}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-1 border border-surface-3">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Urgency</span>
                          <span className="text-lg font-display font-bold text-white">{selectedPatient.urgency}</span>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-1 border border-surface-3">
                          <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block mb-1">Stage</span>
                          <span className="text-sm font-bold text-white capitalize">{selectedPatient.stage}</span>
                        </div>
                      </div>
                    </div>

                    {/* Intent & Risk */}
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Signals & Alerts</h3>
                      <div className="space-y-2">
                        {selectedPatient.risk === 'high' && (
                          <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-danger block">High Conversion Risk</span>
                              <span className="text-xs text-danger/80">{selectedPatient.riskReason}</span>
                            </div>
                          </div>
                        )}
                        {selectedPatient.intentSignal && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex items-start gap-3">
                            <Activity className="w-5 h-5 text-primary shrink-0" />
                            <div>
                              <span className="text-sm font-bold text-primary block">Recent Intent Signal</span>
                              <span className="text-xs text-primary/80">{selectedPatient.intentSignal}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-surface-3 space-y-2">
                      <Button 
                        className="w-full bg-surface-2 hover:bg-surface-3 text-white justify-between"
                        onClick={() => handleMoveStage(selectedPatient.id, selectedPatient.stage)}
                        disabled={selectedPatient.stage === 'treating'}
                      >
                        Move to Next Stage <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" className="w-full border-surface-3 text-white hover:bg-surface-2 justify-between">
                        Send Intake Forms <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="space-y-3">
                      <textarea 
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a clinical or operational note..."
                        className="w-full h-24 p-3 bg-surface-2 border border-surface-3 rounded-lg text-sm text-white focus:outline-none focus:border-primary/50 resize-none placeholder:text-text-secondary/50"
                      />
                      <Button 
                        onClick={handleAddNote}
                        disabled={!newNote.trim()}
                        className="w-full bg-primary hover:bg-primary/90 text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save Note
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Previous Notes</h3>
                      {selectedPatient.notes.length > 0 ? (
                        <div className="space-y-3">
                          {selectedPatient.notes.map(note => (
                            <div key={note.id} className="p-3 rounded-lg bg-surface-1 border border-surface-3">
                              <p className="text-sm text-white mb-2">{note.text}</p>
                              <span className="text-xs text-text-secondary font-mono">{note.date}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-text-secondary text-center py-4">No notes added yet.</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6 animate-in fade-in">
                    {selectedPatient.nextAppointment ? (
                      <div className="p-4 rounded-xl bg-surface-1 border border-surface-3 text-center">
                        <Calendar className="w-8 h-8 text-primary mx-auto mb-3" />
                        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-1">Next Appointment</h3>
                        <p className="text-lg font-bold text-white">{selectedPatient.nextAppointment}</p>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" variant="outline" className="flex-1 border-surface-3 text-white hover:bg-surface-2">Reschedule</Button>
                          <Button size="sm" variant="outline" className="flex-1 border-danger/30 text-danger hover:bg-danger/10">Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 rounded-xl bg-surface-1 border border-surface-3 border-dashed text-center">
                        <Calendar className="w-8 h-8 text-text-secondary mx-auto mb-3 opacity-50" />
                        <h3 className="text-sm font-bold text-white mb-1">No Upcoming Appointments</h3>
                        <p className="text-xs text-text-secondary mb-4">Schedule a consult or follow-up.</p>
                        <Button className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
                          Schedule Now
                        </Button>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Appointment History</h3>
                      <p className="text-sm text-text-secondary text-center py-4">No past appointments.</p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}

