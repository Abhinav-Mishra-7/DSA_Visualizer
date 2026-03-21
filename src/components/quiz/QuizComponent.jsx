// src/components/quiz/QuizComponent.jsx

import { useEffect, useMemo, useRef, useState } from 'react';
import { Brain, CheckCircle, XCircle, RefreshCw, Loader } from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000';

function normalizeQuestion(q, idx) {
  return {
    id: q.id ?? q.questionId ?? idx + 1,
    question: q.question ?? '',
    options: Array.isArray(q.options) ? q.options : [],
    correctIndex:
      q.correctIndex ?? q.answer ?? q.correctOptionIndex ?? q.correct ?? -1,
    explanation: q.explanation ?? ''
  };
}

const QuizComponent = ({ algorithm, isActive = false }) => {
  const algoKey = useMemo(
    () => algorithm?.slug || algorithm?.name || 'unknown-algorithm',
    [algorithm]
  );

  const algoNameForApi = useMemo(
    () => algorithm?.name || algorithm?.slug || 'unknown',
    [algorithm]
  );

  const quizCacheRef = useRef(new Map()); // algoKey -> normalizedQuestions

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState({}); // qid -> selectedIndex
  const [showResults, setShowResults] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [resultJson, setResultJson] = useState(null);

  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizError, setQuizError] = useState(null);

  useEffect(() => {
    // Reset quiz view when algorithm changes, but keep quizCache across tab switching.
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedByQuestionId({});
    setShowResults(false);
    setResultJson(null);
    setQuizError(null);

    const cached = quizCacheRef.current.get(algoKey);
    if (cached?.length) setQuestions(cached);
  }, [algoKey]);

  useEffect(() => {
    // Lazy load: only fetch when Quiz tab is active for the first time.
    if (!isActive) return;
    if (!algorithm) return;

    const cached = quizCacheRef.current.get(algoKey);
    if (cached?.length) {
      setQuestions(cached);
      return;
    }

    let cancelled = false;
    const fetchQuiz = async () => {
      setIsLoadingQuiz(true);
      setQuizError(null);

      try {
        const url = `${API_BASE_URL}/quiz/get-quiz/${encodeURIComponent(
          algoNameForApi
        )}`;

        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        if (!response.ok) {
          throw new Error(data?.message || `HTTP ${response.status}`);
        }

        const rawQuestions =
          data?.questions ||
          data?.quiz?.questions ||
          data?.data?.questions ||
          [];

        const normalizedQuestions = rawQuestions.map(normalizeQuestion);

        if (!normalizedQuestions.length) {
          throw new Error(data?.message || 'Quiz not available');
        }

        if (cancelled) return;
        setQuestions(normalizedQuestions);
        quizCacheRef.current.set(algoKey, normalizedQuestions);
      } catch (err) {
        if (cancelled) return;
        setQuizError(err?.message || 'Failed to load quiz');
      } finally {
        if (!cancelled) setIsLoadingQuiz(false);
      }
    };

    fetchQuiz();

    return () => {
      cancelled = true;
    };
  }, [algoKey, algoNameForApi, algorithm, isActive]);

  const question = questions[currentIndex];

  const answeredCount = useMemo(() => {
    if (!questions.length) return 0;
    return questions.reduce((acc, q) => {
      const val = selectedByQuestionId[q.id];
      return acc + (val === undefined ? 0 : 1);
    }, 0);
  }, [questions, selectedByQuestionId]);

  const resultByQuestionId = useMemo(() => {
    const map = new Map();
    const rows = resultJson?.results || resultJson?.questionResults || [];
    for (const r of rows) {
      if (r?.questionId !== undefined) map.set(r.questionId, r);
    }
    return map;
  }, [resultJson]);

  const currentResult = question ? resultByQuestionId.get(question.id) : null;

  const computedCorrectIndex = useMemo(() => {
    if (!question) return null;
    const correctIndex =
      currentResult?.correctIndex ??
      currentResult?.answer ??
      question.correctIndex;
    const n = Number(correctIndex);
    return Number.isFinite(n) ? n : -1;
  }, [question, currentResult]);

  const computedSelectedOptionIndex = useMemo(() => {
    if (!question) return -1;
    if (currentResult?.selectedOptionIndex !== undefined) {
      const n = Number(currentResult.selectedOptionIndex);
      return Number.isFinite(n) ? n : -1;
    }

    const v = selectedByQuestionId[question.id];
    if (typeof v === 'number') return v;
    const n = Number(v);
    return Number.isFinite(n) ? n : -1;
  }, [question, currentResult, selectedByQuestionId]);

  const explanationToShow = useMemo(() => {
    if (!question) return '';
    return currentResult?.explanation ?? question.explanation ?? '';
  }, [question, currentResult]);

  const handleOptionClick = (index) => {
    if (!question || showResults) return;
    setSelectedByQuestionId((prev) => ({
      ...prev,
      [question.id]: index
    }));
  };

  const handleSubmit = async () => {
    if (!questions.length || !algorithm) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setQuizError(null);

    try {
      const payload = {
        algorithm: algoNameForApi,
        answers: questions.map((q) => ({
          questionId: q.id,
          // IMPORTANT: if user did not select an option, send -1.
          selectedOptionIndex:
            typeof selectedByQuestionId[q.id] === 'number'
              ? selectedByQuestionId[q.id]
              : -1
        }))
      };

      const response = await fetch(`${API_BASE_URL}/quiz/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || 'Quiz verification failed');
      }

      setResultJson(data);
      setShowResults(true);
      setCurrentIndex(0);
    } catch (err) {
      setQuizError(err?.message || 'Quiz verification failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!questions.length) return;
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    if (!questions.length) return;
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedByQuestionId({});
    setShowResults(false);
    setShowDetailedReview(false);
    setResultJson(null);
    setQuizError(null);
  };

  const handleReviewAnswers = () => {
    setCurrentIndex(0);
    setShowDetailedReview(true);
  };

  const totalQuestions = questions.length;
  const scoreCorrect =
    resultJson?.score?.correct ??
    resultJson?.score?.correctCount ??
    resultJson?.score?.value ??
    null;

  if (!algorithm) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-full mb-6 animate-pulse">
            <Brain size={56} className="text-accent" />
          </div>
          <p className="text-text-secondary text-xl mb-3 font-semibold">
            Algorithm data not available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col h-full bg-gradient-to-br from-background via-background to-card/30 relative overflow-y-auto overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 animate-pulse pointer-events-none opacity-30" />

      <div className="relative z-10 flex flex-col h-full">
        {/* HEADER */}
        <div className="pt-2 px-6 border-b border-border/50 bg-gradient-to-r from-background/80 to-card/40 backdrop-blur-sm flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-accent/40 to-accent/5 rounded-xl">
              <Brain size={24} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-text-secondary/90 uppercase tracking-widest font-bold mb-1">
                Quiz Practice
              </p>
              <p className="text-lg md:text-xl font-bold text-text-primary">
                {algorithm?.name} Quiz
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-text-secondary/90 flex-wrap">
            <div className="px-3 py-1 bg-background/60 rounded border border-border/30">
              Question {totalQuestions ? currentIndex + 1 : 0} / {totalQuestions || 0}
            </div>
            <span>•</span>
            {showResults ? (
              <div className="px-3 py-1 bg-background/90 rounded border border-border/30">
                Score : <span className="relative top-0.25 text-accent">
                  {scoreCorrect !== null ? `${scoreCorrect}/${totalQuestions}` : '—'}
                </span>
              </div>
            ) : (
              <div className="px-3 py-1 bg-background/90 rounded border border-border/30">
                Answered : <span className="relative top-0.25">{answeredCount}</span> /{' '}
                {totalQuestions || 0}
              </div>
            )}
          </div>
        </div>

        {/* BODY */}
        {!isLoadingQuiz && !quizError && questions.length === 0 && !isActive ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
            <div className="max-w-md w-full bg-card/60 border border-border/50 rounded-2xl p-6 md:p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-pink-500/20 flex items-center justify-center">
                <Brain size={32} className="text-blue-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                Quiz not available
              </h2>
              <p className="text-sm md:text-base text-text-secondary/80 mb-1">
                No questions loaded for {algorithm?.name}.
              </p>
              <p className="text-xs md:text-sm text-text-secondary/70">
                Backend may not have quizzes for this algorithm yet.
              </p>
            </div>
          </div>
        ) : quizError ? (
          <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
            <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8 text-center shadow-lg">
              <h2 className="text-xl md:text-2xl font-bold text-blue-300 mb-3">
                Failed to load quiz
              </h2>
              <p className="text-xs md:text-sm text-text-secondary/90 mb-0.5">{quizError}</p>
            </div>
          </div>
        ) : questions.length === 0 && (isLoadingQuiz || isActive) ? (
          <div className="flex-grow flex items-center justify-center p-6 md:p-10">
            <div className="flex items-center gap-3 text-text-secondary/90">
              <Loader size={22} className="animate-spin text-accent" />
              <span className="text-sm md:text-base font-semibold">Loading quiz...</span>
            </div>
          </div>
        ) : !showResults ? (
          <div className="flex-grow flex flex-col justify-between p-3.5 gap-6">
            <div className="max-w-5xl min-h-[360px] mx-auto bg-card/60 border border-border/50 rounded-2xl p-4 md:p-4 backdrop-blur-sm">
              <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-4 leading-relaxed">
                {question?.question}
              </h2>

              <div className="space-y-3">
                {question?.options?.map((opt, idx) => {
                  const isSelected = selectedByQuestionId?.[question.id] === idx;

                  const stateClass = isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-border/50 hover:border-blue-500/60 hover:bg-blue-500/5';

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-sm md:text-base cursor-pointer ${stateClass}`}
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full border border-border/50">
                        {isSelected ? (
                          <CheckCircle size={16} className="text-blue-600" />
                        ) : null}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 || isSubmitting}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    currentIndex === 0 || isSubmitting
                      ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                      : 'border-border/60 text-text-primary hover:border-blue-500/60 hover:bg-blue-500/5'
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1 || isSubmitting}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    currentIndex === questions.length - 1 || isSubmitting
                      ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                      : 'text-white bg-gradient-to-br from-accent to-accent/50 hover:bg-blue-400'
                  }`}
                >
                  Next
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !questions.length}
                  className={`px-6 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    isSubmitting || !questions.length
                      ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                      : 'border-accent text-white bg-accent hover:bg-accent/90'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader size={16} className="animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Quiz'
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : !showDetailedReview ? (
          <div className="flex-grow flex items-center justify-center px-3 py-4">
            {/* SCORE SUMMARY VIEW */}
            <div className="max-w-2xl w-full">
              <div className="bg-gradient-to-br from-card/80 to-card/40 border border-accent/30 rounded-2xl p-4 md:p-6 text-center shadow-lg relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -ml-16 -mb-16 animate-pulse" />

                <div className="relative z-10">
                  <div className="mx-auto mb-2 md:mb-3 w-16 h-16 rounded-full bg-gradient-to-br from-accent/40 to-accent/10 flex items-center justify-center animate-bounce">
                    <Brain size={32} className="text-accent" />
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent via-text-primary to-accent bg-clip-text text-transparent mb-1">
                    Awesome!
                  </h2>
                  <p className="text-xs md:text-sm text-text-secondary/90 mb-3 font-medium">
                    You completed <span className="text-accent font-bold">{algorithm?.name}</span>
                  </p>

                  {/* Score container with progress bar */}
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-3 mb-3">
                    {/* Score Display */}
                    <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/40 rounded-lg p-3">
                      <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/90 mb-1">
                        Score
                      </p>
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span className="text-3xl md:text-4xl font-bold text-accent">
                          {scoreCorrect !== null ? scoreCorrect : '—'}
                        </span>
                        <span className="text-lg md:text-xl text-text-secondary/60 font-semibold">
                          /{totalQuestions}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm font-bold text-accent mt-0.5">
                        {scoreCorrect !== null ? (
                          <>
                            {Math.round((scoreCorrect / totalQuestions) * 100)}%
                          </>
                        ) : (
                          '—'
                        )}
                      </p>
                    </div>

                    {/* Performance Level */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-lg p-3 flex flex-col justify-center items-center">
                      <p className="text-xs uppercase tracking-widest font-bold text-text-secondary/90 mb-1">
                        Stars
                      </p>
                      <div className="flex gap-0.5 justify-center mb-1">
                        {scoreCorrect && totalQuestions && (
                          <>
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-sm ${
                                  i < Math.ceil((scoreCorrect / totalQuestions) * 5)
                                    ? 'text-accent'
                                    : 'text-text-secondary/30'
                                }`}
                              >
                                ⭐
                              </span>
                            ))}
                          </>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary/80 font-semibold">
                        {scoreCorrect === totalQuestions
                          ? 'Perfect'
                          : scoreCorrect && scoreCorrect >= Math.ceil(totalQuestions * 0.8)
                          ? 'Expert'
                          : scoreCorrect && scoreCorrect >= Math.ceil(totalQuestions * 0.6)
                          ? 'Good'
                          : 'Start'}
                      </p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-text-secondary/80">Progress</p>
                      <p className="text-xs font-bold text-accent">
                        {scoreCorrect !== null ? Math.round((scoreCorrect / totalQuestions) * 100) : 0}%
                      </p>
                    </div>
                    <div className="w-full bg-text-secondary/10 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all duration-1000"
                        style={{
                          width: scoreCorrect && totalQuestions ? `${(scoreCorrect / totalQuestions) * 100}%` : '0%'
                        }}
                      />
                    </div>
                  </div>

                  {/* Motivational Message */}
                  <p className="text-sm md:text-base text-text-secondary/90 mb-3 leading-snug font-bold px-1">
                    {scoreCorrect === totalQuestions
                      ? '🎉 Perfect! You\'ve mastered this!'
                      : scoreCorrect && scoreCorrect >= Math.ceil(totalQuestions * 0.7)
                      ? '🌟 Excellent work! Well done!'
                      : scoreCorrect && scoreCorrect >= Math.ceil(totalQuestions * 0.5)
                      ? '📚 Good effort! Keep it up!'
                      : '💪 Great try! Review to improve!'}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-col md:flex-row gap-2 justify-center">
                    <button
                      onClick={handleReviewAnswers}
                      className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-accent via-accent to-purple-500 text-white text-xs md:text-sm font-bold shadow-md shadow-accent/40 hover:shadow-accent/60 hover:scale-[1.02] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>📋</span>
                      <span className="hidden sm:inline">Review</span>
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-2 rounded-lg border border-accent/50 text-accent hover:bg-accent/10 hover:border-accent text-xs md:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>🔄</span>
                      <span className="hidden sm:inline">Retry</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col justify-between p-6 md:p-5 gap-6">
            <div className="max-w-5xl min-h-[360px] mx-auto bg-card/60 border border-border/50 rounded-2xl p-4 md:p-5 backdrop-blur-sm">
              <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-6 leading-relaxed">
                {question?.question}
              </h2>

              <div className="space-y-3">
                {question?.options?.map((opt, idx) => {
                  const isCorrect = idx === computedCorrectIndex;
                  const isSelected = idx === computedSelectedOptionIndex;

                  let stateClass =
                    'border-border/50 hover:border-purple-500/60 hover:bg-purple-500/5';
                  if (isCorrect) stateClass = 'border-green-500 bg-green-500/10';
                  else if (isSelected && !isCorrect)
                    stateClass = 'border-red-500 bg-red-500/10';

                  return (
                    <div key={idx}>
                      <div
                        className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-sm md:text-base ${
                          isCorrect ? 'cursor-default' : 'cursor-default'
                        } ${stateClass}`}
                      >
                        <div className="w-6 h-6 flex items-center justify-center rounded-full border border-border/50">
                          {isCorrect ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : isSelected && !isCorrect ? (
                            <XCircle size={16} className="text-red-600" />
                          ) : null}
                        </div>
                        <span className="flex-1">{opt}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="mt-4 text-xs md:text-sm text-text-secondary/80 bg-background/70 border border-border/40 rounded-xl px-4 py-3">
                <span className="font-semibold text-text-primary">Explanation: </span>
                {explanationToShow}
              </p>
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
              <div className="flex justify-between items-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                      : 'border-border/60 text-text-primary hover:border-blue-500/60 hover:bg-blue-500/5'
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === questions.length - 1}
                  className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    currentIndex === questions.length - 1
                      ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                      : 'text-white bg-gradient-to-br from-accent to-accent/50 hover:bg-blue-600'
                  }`}
                >
                  Next
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs md:text-sm font-semibold shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw size={16} />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="p-4 bg-card/50 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary/90 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-50 animate-pulse" />
            <span>💡 Use this quiz to reinforce your understanding of {algorithm?.name}.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-secondary/90">✨ Interactive learning experience</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizComponent;



// // src/components/quiz/QuizComponent.jsx

// import { useState } from 'react';
// import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
// import { quizBank } from './questions/index';

// const QuizComponent = ({ algorithm }) => {
//   const slug = algorithm?.slug || 'bubble-sort';
//   const questions = quizBank[slug] || [];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [selectedIndex, setSelectedIndex] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResults, setShowResults] = useState(false);

//   if (!questions.length) {
//     return (
//       <div className="flex-grow flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="inline-block p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-full mb-6 animate-pulse">
//             <Brain size={56} className="text-purple-500" />
//           </div>
//           <p className="text-text-secondary text-xl mb-3 font-semibold">
//             Quiz not available
//           </p>
//           <p className="text-text-secondary/70 text-sm">
//             Quiz questions for this algorithm will be added soon.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const question = questions[currentIndex];

//   const handleOptionClick = (index) => {
//     if (selectedIndex !== null) return; // already answered

//     setSelectedIndex(index);
//     if (index === question.correctIndex) {
//       setScore((prev) => prev + 1);
//     }

//     // move to next question after a short delay
//     setTimeout(() => {
//       if (currentIndex < questions.length - 1) {
//         setCurrentIndex((prev) => prev + 1);
//         setSelectedIndex(null);
//       } else {
//         setShowResults(true);
//       }
//     }, 1200);
//   };

//   const handleReset = () => {
//     setCurrentIndex(0);
//     setSelectedIndex(null);
//     setScore(0);
//     setShowResults(false);
//   };

//   return (
//     <div className="flex-grow flex flex-col h-full bg-gradient-to-br from-background via-background to-card/30 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 animate-pulse pointer-events-none opacity-30" />

//       <div className="relative z-10 flex flex-col h-full">
//         {/* HEADER */}
//         <div className="p-4 px-6 border-b border-border/50 bg-gradient-to-r from-background/80 to-card/40 backdrop-blur-sm">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl">
//               <Brain size={24} className="text-purple-500" />
//             </div>
//             <div>
//               <p className="text-xs text-text-secondary/90 uppercase tracking-widest font-bold mb-1">
//                 Quiz Practice
//               </p>
//               <p className="text-lg md:text-xl font-bold text-text-primary">
//                 {algorithm?.name} Quiz
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
//             <div className="px-3 py-1 bg-background/60 rounded border border-border/30">
//               Question {currentIndex + 1} / {questions.length}
//             </div>
//             <span>•</span>
//             <div className="px-3 py-1 bg-background/60 rounded border border-border/30">
//               Score: {score}
//             </div>
//           </div>
//         </div>

//         {/* BODY */}
//         {!showResults ? (
//           <div className="flex-grow flex flex-col justify-center p-6 md:p-10">
//             <div className="max-w-4xl mx-auto bg-card/60 border border-border/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
//               <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-6 leading-relaxed">
//                 {question.question}
//               </h2>

//               <div className="space-y-3">
//                 {question.options.map((opt, idx) => {
//                   const isSelected = selectedIndex === idx;
//                   const isCorrect = question.correctIndex === idx;

//                   let stateClass = 'border-border/50 hover:border-purple-500/60 hover:bg-purple-500/5';
//                   if (selectedIndex !== null) {
//                     if (isCorrect) stateClass = 'border-green-500 bg-green-500/10';
//                     else if (isSelected) stateClass = 'border-red-500 bg-red-500/10';
//                   }

//                   return (
//                     <button
//                       key={idx}
//                       onClick={() => handleOptionClick(idx)}
//                       disabled={selectedIndex !== null}
//                       className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-sm md:text-base cursor-pointer ${stateClass}`}
//                     >
//                       <div className="w-6 h-6 flex items-center justify-center rounded-full border border-border/50">
//                         {selectedIndex !== null && isSelected && (
//                           isCorrect ? (
//                             <CheckCircle size={16} className="text-green-500" />
//                           ) : (
//                             <XCircle size={16} className="text-red-500" />
//                           )
//                         )}
//                       </div>
//                       <span className="flex-1">{opt}</span>
//                     </button>
//                   );
//                 })}
//               </div>

//                             {selectedIndex !== null && (
//                 <p className="mt-4 text-xs md:text-sm text-text-secondary/80 bg-background/70 border border-border/40 rounded-xl px-4 py-3">
//                   <span className="font-semibold text-text-primary">Explanation: </span>
//                   {question.explanation}
//                 </p>
//               )}
//             </div>
//           </div>
//         ) : (
//           <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
//             <div className="max-w-md w-full bg-card/60 border border-border/50 rounded-2xl p-6 md:p-8 text-center shadow-lg">
//               <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center">
//                 <Brain size={32} className="text-purple-500" />
//               </div>
//               <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
//                 Quiz Completed!
//               </h2>
//               <p className="text-sm md:text-base text-text-secondary/80 mb-4">
//                 You scored <span className="font-semibold text-purple-500">{score}</span> out of{' '}
//                 <span className="font-semibold">{questions.length}</span>.
//               </p>
//               <p className="text-xs md:text-sm text-text-secondary/70 mb-6">
//                 Keep practicing to master {algorithm?.name}.
//               </p>

//               <button
//                 onClick={handleReset}
//                 className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm md:text-base font-semibold shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200"
//               >
//                 <RefreshCw size={16} />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         )}

//         {/* FOOTER */}
//         <div className="p-4 bg-card/50 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary/90 flex-wrap gap-3">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
//             <span>💡 Practice quizzes help you remember {algorithm?.name} better.</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-text-secondary/90">✨ Interactive learning experience</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizComponent;




// import { Brain, CheckCircle, XCircle, RefreshCw, Share2 } from 'lucide-react';
// import { useState } from 'react';

// const QuizComponent = ({ algorithm }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResults, setShowResults] = useState(false);

//   // Quiz questions for different algorithms
//   const quizData = {
//     'bubble-sort': [
//       {
//         question: "What is the time complexity of Bubble Sort?",
//         options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
//         correct: 1,
//         explanation: "Bubble Sort has O(n²) time complexity for all cases."
//       },
//       {
//         question: "Bubble Sort is _____ stable",
//         options: ["Always", "Never", "Sometimes", "None"],
//         correct: 0,
//         explanation: "Bubble Sort is stable - equal elements maintain order."
//       },
//       {
//         question: "Best case scenario for Bubble Sort?",
//         options: ["Reverse sorted", "Already sorted", "Random order", "Duplicates"],
//         correct: 1,
//         explanation: "Already sorted array requires only n-1 comparisons."
//       }
//     ],
//     'selection-sort': [
//       {
//         question: "Maximum number of swaps in Selection Sort?",
//         options: ["n-1", "n²", "n log n", "n"],
//         correct: 0,
//         explanation: "Selection Sort makes at most n-1 swaps."
//       },
//       {
//         question: "Selection Sort works best when?",
//         options: ["Already sorted", "Memory writes expensive", "Nearly sorted", "Random"],
//         correct: 1,
//         explanation: "Fewer swaps make it ideal when writes are costly."
//       }
//     ],
//     'insertion-sort': [
//       {
//         question: "Best case time complexity of Insertion Sort?",
//         options: ["O(n²)", "O(n log n)", "O(n)", "O(1)"],
//         correct: 2,
//         explanation: "Already sorted array takes O(n) time."
//       },
//       {
//         question: "Is Insertion Sort stable?",
//         options: ["Yes", "No"],
//         correct: 0,
//         explanation: "Insertion Sort maintains relative order of equal elements."
//       }
//     ],
//     'bucket-sort': [
//       {
//         question: "Bucket Sort works best with?",
//         options: ["Reverse sorted", "Uniform distribution", "Duplicates", "Nearly sorted"],
//         correct: 1,
//         explanation: "Uniformly distributed data gives O(n) performance."
//       },
//       {
//         question: "Bucket Sort time complexity (average)?",
//         options: ["O(n log n)", "O(n + k)", "O(n²)", "O(k log n)"],
//         correct: 1,
//         explanation: "O(n + k) where k is number of buckets."
//       }
//     ],
//     'bfs': [
//       {
//         question: "BFS uses which data structure?",
//         options: ["Stack", "Queue", "Tree", "Linked List"],
//         correct: 1,
//         explanation: "BFS uses Queue for level-order traversal."
//       },
//       {
//         question: "BFS is best for finding?",
//         options: ["Longest path", "Cycle detection", "Shortest path (unweighted)", "Topological sort"],
//         correct: 2,
//         explanation: "BFS finds shortest path in unweighted graphs."
//       }
//     ],
//     'dfs': [
//       {
//         question: "DFS uses which data structure?",
//         options: ["Queue", "Stack/Recursion", "Priority Queue", "Linked List"],
//         correct: 1,
//         explanation: "DFS uses Stack or recursion for depth-first traversal."
//       },
//       {
//         question: "DFS is best for?",
//         options: ["Shortest path", "Cycle detection", "Level order", "BFS replacement"],
//         correct: 1,
//         explanation: "DFS excels at cycle detection and topological sorting."
//       }
//     ]
//   };

//   const questions = quizData[algorithm?.slug] || quizData['bubble-sort'];
//   const question = questions[currentQuestion];

//   const handleAnswer = (index) => {
//     setSelectedAnswer(index);
//     if (index === question.correct) {
//       setScore(score + 1);
//     }
//     setTimeout(() => {
//       if (currentQuestion < questions.length - 1) {
//         setCurrentQuestion(currentQuestion + 1);
//       } else {
//         setShowResults(true);
//       }
//       setSelectedAnswer(null);
//     }, 1500);
//   };

//   const resetQuiz = () => {
//     setCurrentQuestion(0);
//     setScore(0);
//     setShowResults(false);
//     setSelectedAnswer(null);
//   };

//   if (!questions.length) {
//     return (
//       <div className="flex-grow flex items-center justify-center p-8">
//         <div className="text-center">
//           <div className="inline-block p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-full mb-6 animate-pulse">
//             <Brain size={56} className="text-purple-500" />
//           </div>
//           <p className="text-text-secondary text-xl mb-3 font-semibold">
//             Quiz coming soon
//           </p>
//           <p className="text-text-secondary/70 text-sm">
//             Practice questions for this algorithm will be added soon.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-grow flex flex-col h-full bg-gradient-to-br from-background via-background to-card/30 relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 animate-pulse pointer-events-none opacity-30" />

//       <div className="relative z-10 flex flex-col h-full">
//         {/* HEADER */}
//         <div className="p-6 border-b border-border/50 bg-gradient-to-r from-background/80 to-card/40 backdrop-blur-sm">
//           <div className="flex items-center gap-4 mb-6">
//             <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl">
//               <Brain size={24} className="text-purple-500" />
//             </div>
//             <div>
//               <p className="text-xs text-text-secondary/70 uppercase tracking-widest font-bold mb-1">
//                 Quiz Practice
//               </p>
//               <p className="text-lg md:text-xl font-bold text-text-primary">
//                 {algorithm?.name} Quiz
//               </p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 text-sm text-text-secondary/60">
//             <div className="flex items-center gap-1">
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
//               Question {currentQuestion + 1} of {questions.length}
//             </div>
//             <span>•</span>
//             <div>Score: {score}/{currentQuestion}</div>
//           </div>
//         </div>

//         {/* QUESTION */}
//         {!showResults ? (
//           <div className="flex-grow flex flex-col justify-center p-8">
//             <div className="max-w-2xl mx-auto">
//               <div className="bg-card/50 border border-border/50 rounded-2xl p-8 backdrop-blur-sm mb-8">
//                 <h2 className="text-2xl font-bold text-text-primary mb-8 leading-relaxed">
//                   {question.question}
//                 </h2>
                
//                 <div className="space-y-3">
//                   {question.options.map((option, index) => (
//                     <button
//                       key={index}
//                       onClick={() => handleAnswer(index)}
//                       disabled={selectedAnswer !== null}
//                       className={`w-full p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 text-left group ${
//                         selectedAnswer === null
//                           ? 'border-border/50 hover:border-purple-500/50 hover:bg-purple-500/5'
//                           : selectedAnswer === question.correct
//                           ? 'border-green-500 bg-green-500/10 text-green-600 border-2'
//                           : selectedAnswer === index
//                           ? 'border-red-500 bg-red-500/10 text-red-600 border-2'
//                           : 'border-border/30'
//                       }`}
//                     >
//                       <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
//                         selectedAnswer === index
//                           ? selectedAnswer === question.correct
//                             ? 'bg-green-500'
//                             : 'bg-red-500'
//                           : 'bg-transparent border-2 border-border/50 group-hover:border-purple-500/50'
//                       }`}>
//                         {selectedAnswer === index && (
//                           selectedAnswer === question.correct ? (
//                             <CheckCircle size={16} className="text-white" />
//                           ) : (
//                             <XCircle size={16} className="text-white" />
//                           )
//                         )}
//                       </div>
//                       <span className="font-medium">{option}</span>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="flex-grow flex items-center justify-center p-12">
//             <div className="text-center max-w-md">
//               <div className="inline-block p-8 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-3xl mb-8 shadow-2xl">
//                 <Brain size={64} className="text-purple-500 mx-auto mb-4" />
//                 <div className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
//                   {Math.round((score / questions.length) * 100)}%
//                 </div>
//                 <p className="text-xl font-bold text-text-primary mt-2">
//                   {score}/{questions.length} Correct
//                 </p>
//               </div>
//               <button
//                 onClick={resetQuiz}
//                 className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 mx-auto"
//               >
//                 <RefreshCw className="w-5 h-5 animate-spin" />
//                 Try Again
//               </button>
//             </div>
//           </div>
//         )}

//         {/* FOOTER */}
//         <div className="p-6 bg-card/50 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary/70">
//           <div className="flex items-center gap-2">
//             <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
//             <span>💡 Test your {algorithm?.name} knowledge</span>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="text-text-secondary/50">✨ Interactive learning</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizComponent;