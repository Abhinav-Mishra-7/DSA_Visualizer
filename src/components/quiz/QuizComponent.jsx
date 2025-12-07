// src/components/quiz/QuizComponent.jsx

import { useState } from 'react';
import { Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { quizBank } from './questions/index';

const QuizComponent = ({ algorithm }) => {
  const slug = algorithm?.slug || 'bubble-sort';
  const questions = quizBank[slug] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null); 
  const [answers, setAnswers] = useState({});              
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  if (!questions.length) {
    return (
      <div className="flex-grow flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-full mb-6 animate-pulse">
            <Brain size={56} className="text-purple-500" />
          </div>
          <p className="text-text-secondary text-xl mb-3 font-semibold">
            Quiz not available
          </p>
          <p className="text-text-secondary/70 text-sm">
            Quiz questions for this algorithm will be added soon.
          </p>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];

  const handleOptionClick = (index) => {
    setSelectedIndex(index);

    setAnswers(prev => {
      const next = { ...prev, [question.id]: index };

      // recompute score from all stored answers
      let newScore = 0;
      questions.forEach(q => {
        if (next[q.id] === q.correctIndex) newScore += 1;
      });
      setScore(newScore);

      return next;
    });
  };

  const handleNext = () => {
    if (currentIndex === questions.length - 1) {
      setShowResults(true);
      return;
    }
    const nextIndex = Math.min(currentIndex + 1, questions.length - 1);
    setCurrentIndex(nextIndex);
    const nextQuestion = questions[nextIndex];
    setSelectedIndex(
      answers[nextQuestion.id] !== undefined ? answers[nextQuestion.id] : null
    );
  };

  const handlePrevious = () => {
    if (currentIndex === 0) return;
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    const prevQuestion = questions[prevIndex];
    setSelectedIndex(
      answers[prevQuestion.id] !== undefined ? answers[prevQuestion.id] : null
    );
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedIndex(null);
    setAnswers({});
    setScore(0);
    setShowResults(false);
  };

  const allAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="flex-grow flex flex-col h-full bg-gradient-to-br from-background via-background to-card/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 animate-pulse pointer-events-none opacity-30" />

      <div className="relative z-10 flex flex-col h-full">
        {/* HEADER */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-r from-background/80 to-card/40 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl">
              <Brain size={24} className="text-purple-500" />
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

          <div className="flex items-center gap-3 text-xs text-text-secondary/90 flex-wrap">
            <div className="px-3 py-1 bg-background/60 rounded border border-border/30">
              Question {currentIndex + 1} / {questions.length}
            </div>
            <span>•</span>
            <div className="px-3 py-1 bg-background/90 rounded border border-border/30">
              Score : <span className='relative top-0.25'>{score}</span>
            </div>
          </div>
        </div>

        {/* BODY */}
        {!showResults ? (
          <div className="flex-grow flex flex-col justify-between p-6 md:p-10 gap-6">
            <div className="max-w-5xl min-h-[440px] mx-auto bg-card/60 border border-border/50 rounded-2xl p-4 md:p-8 backdrop-blur-sm">
              <h2 className="text-lg md:text-2xl font-bold text-text-primary mb-6 leading-relaxed">
                {question.question}
              </h2>

              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedIndex === idx;
                  const isCorrect = question.correctIndex === idx;

                  let stateClass =
                    'border-border/50 hover:border-purple-500/60 hover:bg-purple-500/5';
                  if (selectedIndex !== null) {
                    if (isCorrect) stateClass = 'border-green-500 bg-green-500/10';
                    else if (isSelected) stateClass = 'border-red-500 bg-red-500/10';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 text-sm md:text-base cursor-pointer ${stateClass}`}
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-full border border-border/50">
                        {selectedIndex !== null && isSelected && (
                          isCorrect ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <XCircle size={16} className="text-red-600" />
                          )
                        )}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {selectedIndex !== null && (
                <p className="mt-4 text-xs md:text-sm text-text-secondary/80 bg-background/70 border border-border/40 rounded-xl px-4 py-3">
                  <span className="font-semibold text-text-primary">Explanation: </span>
                  {question.explanation}
                </p>
              )}
            </div>

            {/* NAVIGATION BUTTONS */}
            <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    currentIndex === 0
                        ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                        : 'border-border/60 text-text-primary hover:border-purple-500/60 hover:bg-purple-500/5'
                    }`}
                >
                    Previous
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === questions.length - 1 && !allAnswered}
                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold border transition-all cursor-pointer ${
                    currentIndex === questions.length - 1 && !allAnswered
                        ? 'border-border/40 text-text-secondary/40 cursor-not-allowed'
                        : 'border-purple-500 text-white bg-purple-500 hover:bg-purple-600'
                    }`}
                >
                    {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                </button>
            </div>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-6 md:p-10">
            <div className="max-w-md w-full bg-card/60 border border-border/50 rounded-2xl p-6 md:p-8 text-center shadow-lg">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center">
                <Brain size={32} className="text-purple-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                Quiz Completed!
              </h2>
              <p className="text-sm md:text-base text-text-secondary/80 mb-4">
                You scored{' '}
                <span className="font-semibold text-purple-500">{score}</span> out of{' '}
                <span className="font-semibold">{questions.length}</span>.
              </p>
              <p className="text-xs md:text-sm text-text-secondary/70 mb-6">
                Review the questions again or retake the quiz to strengthen your understanding of{' '}
                {algorithm?.name}.
              </p>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm md:text-base font-semibold shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="p-4 bg-card/50 border-t border-border/30 flex items-center justify-between text-xs text-text-secondary/90 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse" />
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