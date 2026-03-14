import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, ArrowRight, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Link } from 'react-router-dom';

export function MensTrivia() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const questions = [
    {
      question: "At what age do men typically begin to experience a gradual decline in testosterone levels?",
      options: ["20s", "30s", "40s", "50s"],
      correct: 1,
      explanation: "Testosterone levels generally peak during adolescence and early adulthood. After age 30, levels typically decline by about 1% per year."
    },
    {
      question: "Which of these is NOT a common symptom of suboptimal testosterone?",
      options: ["Brain fog", "Decreased muscle mass", "Increased heart rate", "Poor sleep quality"],
      correct: 2,
      explanation: "While low testosterone can affect cardiovascular health long-term, an acutely increased resting heart rate is not a typical direct symptom. Fatigue, brain fog, and muscle loss are classic signs."
    },
    {
      question: "What percentage of men over 40 experience some form of erectile dysfunction?",
      options: ["10%", "25%", "40%", "60%"],
      correct: 2,
      explanation: "Studies show that approximately 40% of men experience some degree of ED by age 40, and the prevalence increases by about 10% per decade thereafter."
    }
  ];

  const handleAnswer = (index: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(index);
    setIsAnswered(true);
    
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
        
        <div className="w-full max-w-2xl relative z-10">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-2 border border-surface-3 mb-4">
                    <Brain className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-display font-bold mb-2">Men's Health IQ</h1>
                  <p className="text-text-secondary">Test your knowledge on optimization and longevity.</p>
                  
                  <div className="flex justify-center gap-2 mt-6">
                    {questions.map((_, i) => (
                      <div key={i} className={`w-8 h-1.5 rounded-full ${i === currentQuestion ? 'bg-primary' : i < currentQuestion ? 'bg-success' : 'bg-surface-3'}`} />
                    ))}
                  </div>
                </div>

                <Card className="p-8 bg-surface-1 border-surface-3">
                  <h2 className="text-xl font-medium text-text-primary mb-8 leading-relaxed">
                    {questions[currentQuestion].question}
                  </h2>

                  <div className="space-y-3">
                    {questions[currentQuestion].options.map((option, i) => {
                      let buttonClass = "w-full text-left px-6 py-4 rounded-xl border transition-all ";
                      
                      if (!isAnswered) {
                        buttonClass += "border-surface-3 bg-surface-2 hover:border-primary/50 hover:bg-surface-3";
                      } else if (i === questions[currentQuestion].correct) {
                        buttonClass += "border-success bg-success/10 text-success";
                      } else if (i === selectedAnswer) {
                        buttonClass += "border-danger bg-danger/10 text-danger";
                      } else {
                        buttonClass += "border-surface-3 bg-surface-2 opacity-50";
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={isAnswered}
                          className={buttonClass}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{option}</span>
                            {isAnswered && i === questions[currentQuestion].correct && <CheckCircle2 className="w-5 h-5" />}
                            {isAnswered && i === selectedAnswer && i !== questions[currentQuestion].correct && <XCircle className="w-5 h-5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-6"
                    >
                      <div className="p-4 rounded-lg bg-surface-2 border border-surface-3 mb-6">
                        <p className="text-sm text-text-secondary">
                          <span className="font-semibold text-text-primary">AI Insight: </span>
                          {questions[currentQuestion].explanation}
                        </p>
                      </div>
                      <Button className="w-full" onClick={handleNext}>
                        {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                      </Button>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <Card glow="cyan" className="p-12 bg-surface-1 border-surface-3">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-12 h-12 text-primary" />
                  </div>
                  <h2 className="text-4xl font-display font-bold mb-2">Quiz Complete!</h2>
                  <p className="text-xl text-text-secondary mb-8">
                    You scored {score} out of {questions.length}
                  </p>
                  
                  <div className="p-6 rounded-xl bg-surface-2 border border-surface-3 mb-8 text-left">
                    <h3 className="font-semibold text-text-primary mb-2">What this means for you</h3>
                    <p className="text-text-secondary text-sm">
                      Understanding your biology is the first step to optimization. Many men accept decline as a normal part of aging, but advanced clinical protocols can restore peak function.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/patient/assessment" className="flex-grow">
                      <Button variant="primary" className="w-full">
                        Start Clinical Assessment
                      </Button>
                    </Link>
                    <Link to="/directory" className="flex-grow">
                      <Button variant="outline" className="w-full">
                        Browse Clinics
                      </Button>
                    </Link>
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
