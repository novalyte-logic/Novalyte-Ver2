import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Calendar, FileText, CheckCircle2, AlertCircle, 
  ChevronRight, Brain, Zap, Shield, Heart, Clock, ArrowRight,
  MessageSquare, Settings, LogOut
} from 'lucide-react';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { Card } from '@/src/components/ui/Card';
import { Button } from '@/src/components/ui/Button';

export function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [clinics, setClinics] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const patientId = localStorage.getItem('novalyte_patient_id');
    if (!patientId) {
      navigate('/patient/assessment');
      return;
    }

    const fetchPatientData = async () => {
      try {
        const patientDoc = await getDoc(doc(db, 'patients', patientId));
        if (patientDoc.exists()) {
          setPatient({ id: patientDoc.id, ...patientDoc.data() });
        } else {
          localStorage.removeItem('novalyte_patient_id');
          navigate('/patient/assessment');
          return;
        }

        // Fetch bookings
        const bookingIds = JSON.parse(localStorage.getItem('novalyte_booking_ids') || '[]');
        const bookingsData = [];
        const clinicIds = new Set<string>();
        
        for (const id of bookingIds) {
          const bDoc = await getDoc(doc(db, 'bookings', id));
          if (bDoc.exists()) {
            const data = bDoc.data();
            bookingsData.push({ id: bDoc.id, ...data });
            if (data.clinicId) clinicIds.add(data.clinicId);
          }
        }
        
        bookingsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        setBookings(bookingsData);

        // Fetch clinics
        const clinicsData: Record<string, any> = {};
        for (const cid of clinicIds) {
          const cDoc = await getDoc(doc(db, 'clinics', cid));
          if (cDoc.exists()) {
            clinicsData[cid] = cDoc.data();
          }
        }
        setClinics(clinicsData);

        // Fetch assessments
        const assessmentIds = JSON.parse(localStorage.getItem('novalyte_assessment_ids') || '[]');
        const assessmentsData = [];
        for (const id of assessmentIds) {
          const aDoc = await getDoc(doc(db, 'assessments', id));
          if (aDoc.exists()) {
            assessmentsData.push({ id: aDoc.id, ...aDoc.data() });
          }
        }
        
        assessmentsData.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return dateB - dateA;
        });
        setAssessments(assessmentsData);

      } catch (error) {
        console.error("Error fetching patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('novalyte_patient_id');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const latestBooking = bookings[0];
  const latestClinic = latestBooking ? clinics[latestBooking.clinicId] : null;

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col">
      {/* Header */}
      <header className="h-20 border-b border-surface-3/50 bg-surface-1/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-secondary" />
          <span className="font-display font-bold text-xl tracking-tight text-white">
            Novalyte <span className="text-secondary">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-secondary bg-surface-2/50 px-3 py-1.5 rounded-full border border-surface-3">
            <Shield className="w-3 h-3 text-success" /> HIPAA Aligned
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="border-surface-3 text-text-secondary hover:text-white">
            <LogOut className="w-4 h-4 mr-2" /> Exit
          </Button>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
            Welcome back, {patient?.firstName}
          </h1>
          <p className="text-text-secondary">Your personalized health optimization command center.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Active Protocol / Next Steps */}
            <Card className="p-6 md:p-8 bg-surface-1/80 border-surface-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[64px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="w-5 h-5 text-secondary" />
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">Current Status</h2>
                </div>

                {latestBooking ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-surface-2 border border-surface-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider border border-primary/20">
                            Action Required
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-1">Complete Intake Forms</h3>
                        <p className="text-sm text-text-secondary">Required before your consultation with {latestClinic?.name || 'your clinic'}.</p>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90 text-black font-bold whitespace-nowrap">
                        Start Intake
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-xl bg-surface-2 border border-surface-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-secondary" />
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary uppercase tracking-wider">Next Appointment</p>
                            <p className="font-bold text-white">Consultation</p>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary mb-1">
                          {new Date(latestBooking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(latestBooking.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                        </p>
                        <p className="text-sm text-text-secondary">with {latestClinic?.name || 'Apex Longevity'}</p>
                      </div>

                      <div className="p-5 rounded-xl bg-surface-2 border border-surface-3">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-success" />
                          </div>
                          <div>
                            <p className="text-xs text-text-secondary uppercase tracking-wider">Lab Results</p>
                            <p className="font-bold text-white">Pending Upload</p>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">Please upload your recent comprehensive blood panel.</p>
                        <button className="text-sm text-success font-medium hover:underline flex items-center">
                          Upload Labs <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-text-secondary" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Active Consultations</h3>
                    <p className="text-text-secondary mb-6">You haven't booked a consultation with a clinic yet.</p>
                    <Link to="/directory">
                      <Button className="bg-secondary hover:bg-secondary-hover text-white">
                        Browse Clinics
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>

            {/* Educational Content / Retention Loop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-6 bg-surface-1/80 border-surface-3 hover:border-secondary/50 transition-colors cursor-pointer group">
                <Brain className="w-8 h-8 text-secondary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Men's Health IQ</h3>
                <p className="text-sm text-text-secondary mb-4">Test your knowledge and learn more about health optimization protocols.</p>
                <Link to="/mens-trivia" className="text-secondary font-medium flex items-center text-sm group-hover:underline">
                  Play Trivia <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Card>

              <Card className="p-6 bg-surface-1/80 border-surface-3 hover:border-primary/50 transition-colors cursor-pointer group">
                <Activity className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Symptom Checker</h3>
                <p className="text-sm text-text-secondary mb-4">Re-evaluate your symptoms to track progress or identify new limiters.</p>
                <Link to="/symptom-checker" className="text-primary font-medium flex items-center text-sm group-hover:underline">
                  Start Check <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Card>
            </div>

          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            
            {/* Clinical Profile Summary */}
            <Card className="p-6 bg-surface-1/80 border-surface-3">
              <h3 className="text-lg font-bold text-white mb-4">Clinical Profile</h3>
              
              {assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments[0].aiScore && (
                    <div className="mb-4 p-4 rounded-xl bg-surface-2 border border-surface-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-secondary uppercase tracking-wider">Clinical Score</span>
                        <span className="text-lg font-bold text-secondary">{assessments[0].aiScore}/100</span>
                      </div>
                      <div className="w-full h-2 bg-surface-3 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary transition-all duration-1000" 
                          style={{ width: `${assessments[0].aiScore}%` }}
                        />
                      </div>
                      <p className="text-sm text-text-secondary mt-3">{assessments[0].aiRationale}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Primary Goal</p>
                    <p className="font-medium text-white">{assessments[0].treatmentInterest}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Reported Symptoms</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {assessments[0].symptoms?.map((sym: string, i: number) => (
                        <span key={i} className="px-2 py-1 rounded bg-surface-2 text-xs text-text-secondary border border-surface-3">
                          {sym}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-surface-3">
                    <Link to="/patient/assessment" className="text-sm text-secondary hover:underline flex items-center">
                      Update Profile <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-secondary">No assessment data found.</p>
              )}
            </Card>

            {/* Support & Resources */}
            <Card className="p-6 bg-surface-1/80 border-surface-3">
              <h3 className="text-lg font-bold text-white mb-4">Resources</h3>
              <div className="space-y-3">
                <Link to="/ask-ai" className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-surface-3 hover:border-secondary/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-text-secondary group-hover:text-secondary" />
                    <span className="text-sm font-medium text-white">Ask Novalyte AI</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </Link>
                <Link to="/marketplace" className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-surface-3 hover:border-primary/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-text-secondary group-hover:text-primary" />
                    <span className="text-sm font-medium text-white">Shop Supplements</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </Link>
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-surface-3 hover:border-surface-3 transition-colors group">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-text-secondary" />
                    <span className="text-sm font-medium text-white">Account Settings</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
