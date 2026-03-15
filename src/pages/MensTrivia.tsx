import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ArrowRight, CheckCircle2, XCircle, Trophy, Flame, Zap, Activity, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Link, useNavigate } from 'react-router-dom';

const ALL_QUESTIONS = [
  {
    id: 'q1',
    category: 'Hormones',
    difficulty: 'medium',
    question: "At what age do men typically begin to experience a gradual decline in testosterone levels?",
    options: ["20s", "30s", "40s", "50s"],
    correct: 1,
    explanation: "Testosterone levels generally peak during adolescence and early adulthood. After age 30, levels typically decline by about 1% per year. This is why optimization protocols often start in the mid-30s."
  },
  {
    id: 'q2',
    category: 'Symptoms',
    difficulty: 'easy',
    question: "Which of these is NOT a common symptom of suboptimal testosterone?",
    options: ["Brain fog", "Decreased muscle mass", "Increased resting heart rate", "Poor sleep quality"],
    correct: 2,
    explanation: "While low testosterone can affect cardiovascular health long-term, an acutely increased resting heart rate is not a typical direct symptom. Fatigue, brain fog, and muscle loss are the classic triad."
  },
  {
    id: 'q3',
    category: 'Longevity',
    difficulty: 'hard',
    question: "What percentage of men over 40 experience some form of erectile dysfunction?",
    options: ["10%", "25%", "40%", "60%"],
    correct: 2,
    explanation: "Studies show that approximately 40% of men experience some degree of ED by age 40, and the prevalence increases by about 10% per decade thereafter. It's often an early warning sign of endothelial dysfunction."
  },
  {
    id: 'q4',
    category: 'Metabolism',
    difficulty: 'medium',
    question: "Which biomarker is considered the gold standard for measuring long-term blood sugar control?",
    options: ["Fasting Glucose", "Insulin", "HbA1c", "Cortisol"],
    correct: 2,
    explanation: "HbA1c (Hemoglobin A1c) measures your average blood sugar levels over the past 2-3 months, making it a much more reliable indicator of metabolic health than a single fasting glucose snapshot."
  },
  {
    id: 'q5',
    category: 'Recovery',
    difficulty: 'easy',
    question: "During which phase of sleep does the body release the most human growth hormone (HGH)?",
    options: ["Light Sleep", "REM Sleep", "Deep Sleep (Slow-Wave)", "Wakefulness"],
    correct: 2,
    explanation: "Up to 70% of daily HGH pulses occur during Deep (Slow-Wave) sleep. This is why poor sleep quality directly sabotages muscle recovery and metabolic optimization."
  }
];

export function MensTrivia() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState(ALL_QUESTIONS.slice(0, 5)); // In a real app, we'd select these dynamically
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Adaptive logic simulation
  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    const isCorrect = index === questions[currentQuestionIdx].correct;
    if (isCorrect) {
      setScore(s => s + 1);
      setStreak(s => s + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const currentQ = questions[currentQuestionIdx];

  const getRank = () => {
    const percentage = score / questions.length;
    if (percentage === 1) return { title: "Apex Optimizer", color: "text-primary", bg: "bg-primary/10" };
    if (percentage >= 0.6) return { title: "Health Hacker", color: "text-success", bg: "bg-success/10" };
    return { title: "Protocol Beginner", color: "text-warning", bg: "bg-warning/10" };
  };

  return (
    <div className="min-h-screen bg-[#05070A] flex flex-col pt-20 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl rounded-full" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Header & Progress */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-surface-2 border border-surface-3 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                      <Brain className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-display font-bold text-white">Men's Health IQ</h1>
                      <p className="text-sm text-text-secondary">Question {currentQuestionIdx + 1} of {questions.length}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {streak >= 2 && (
                      <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold"
                      >
                        <Flame className="w-4 h-4" /> {streak} Streak
                      </motion.div>
                    )}
                    <div className="text-right">
                      <div className="text-sm font-bold text-white">Score: {score}</div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-surface-3 rounded-full mb-8 overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: `${(currentQuestionIdx / questions.length) * 100}%` }}
                    animate={{ width: `${((currentQuestionIdx + (isAnswered ? 1 : 0)) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <Card className="p-8 bg-[#0B0F14] border-surface-3 shadow-2xl relative overflow-hidden">
                  {/* Category Badge */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-2 text-text-secondary text-xs font-bold uppercase tracking-wider mb-6 border border-surface-3">
                    <Activity className="w-3.5 h-3.5" />
                    {currentQ.category}
                  </div>

                  <h2 className="text-2xl font-medium text-white mb-8 leading-relaxed">
                    {currentQ.question}
                  </h2>

                  <div className="space-y-3">
                    {currentQ.options.map((option, i) => {
                      const isCorrectOption = i === currentQ.correct;
                      const isSelectedOption = i === selectedAnswer;
                      
                      let buttonClass = "w-full text-left px-6 py-4 rounded-xl border-2 transition-all flex justify-between items-center group ";
                      
                      if (!isAnswered) {
                        buttonClass += "border-surface-3 bg-surface-2 hover:border-primary/50 hover:bg-surface-3 text-text-primary";
                      } else if (isCorrectOption) {
                        buttonClass += "border-success bg-success/10 text-success shadow-[0_0_15px_rgba(46,230,166,0.15)]";
                      } else if (isSelectedOption && !isCorrectOption) {
                        buttonClass += "border-danger bg-danger/10 text-danger";
                      } else {
                        buttonClass += "border-surface-3 bg-surface-2 opacity-40 text-text-secondary";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={isAnswered}
                          className={buttonClass}
                        >
                          <span className="font-medium text-lg">{option}</span>
                          
                          {isAnswered && isCorrectOption && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <CheckCircle2 className="w-6 h-6" />
                            </motion.div>
                          )}
                          {isAnswered && isSelectedOption && !isCorrectOption && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                              <XCircle className="w-6 h-6" />
                            </motion.div>
                          )}
                          {!isAnswered && (
                            <div className="w-6 h-6 rounded-full border-2 border-surface-3 group-hover:border-primary/50 transition-colors" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 32 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 rounded-xl bg-surface-2 border border-surface-3 mb-6 relative overflow-hidden">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                          <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-white block mb-1">Clinical Context</span>
                              <p className="text-sm text-text-secondary leading-relaxed">
                                {currentQ.explanation}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button 
                          className="w-full py-4 text-lg font-bold bg-primary hover:bg-primary-hover text-[#05070A] border-none shadow-[0_0_20px_rgba(6,182,212,0.3)]" 
                          onClick={handleNext}
                        >
                          {currentQuestionIdx < questions.length - 1 ? 'Next Question' : 'View Your Analysis'}
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card className="p-10 bg-[#0B0F14] border-surface-3 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-secondary to-primary" />
                  
                  <div className={`w-24 h-24 rounded-full ${getRank().bg} flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]`}>
                    <Trophy className={`w-12 h-12 ${getRank().color}`} />
                  </div>
                  
                  <h2 className="text-4xl font-display font-bold text-white mb-2">Knowledge Checked</h2>
                  <p className="text-xl text-text-secondary mb-8">
                    You scored <span className="text-white font-bold">{score}</span> out of {questions.length}
                  </p>
                  
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-2 border border-surface-3 mb-10">
                    <span className="text-sm text-text-secondary">Assigned Rank:</span>
                    <span className={`text-sm font-bold ${getRank().color}`}>{getRank().title}</span>
                  </div>
                  
                  <div className="p-6 rounded-xl bg-surface-2 border border-surface-3 mb-10 text-left relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-white">The Next Step: Baseline Diagnostics</h3>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed mb-4">
                        Trivia is fun, but real optimization requires data. Many men accept decline as a normal part of aging, but advanced clinical protocols can restore peak function. Find out exactly where your biomarkers stand.
                      </p>
                      <Link to="/patient/assessment" className="inline-flex items-center text-primary text-sm font-bold hover:text-primary-hover transition-colors">
                        Start your clinical assessment <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={() => navigate('/patient/assessment')}
                      className="w-full py-4 bg-primary hover:bg-primary-hover text-[#05070A] font-bold border-none"
                    >
                      Start Assessment
                    </Button>
                    <Button 
                      onClick={() => navigate('/directory')}
                      variant="outline" 
                      className="w-full py-4 border-surface-3 hover:border-white hover:text-white"
                    >
                      Browse Clinics
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
