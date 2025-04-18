import {useEffect, useState} from 'react';
import {loadQuestions, QuestionsArray} from './data/questions.ts';

const numQuestions = 10;

function App() {
  const [allQuestions, setAllQuestions] = useState<QuestionsArray>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuestionsArray>([]);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<'loading' | 'start' | 'quiz' | 'results'>('loading');
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    loadQuestions()
      .then(questions => {
        setAllQuestions(questions);
        setCurrentStep('start');
      })
      .catch((e) => setError(e.toString()));
  }, []);

  const startQuiz = () => {
    // Get 10 random questions
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, numQuestions);
    setQuizQuestions(selected);
    setUserAnswers(new Array(numQuestions).fill(-1));
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const calculateScore = () => {
    let newScore = 0;
    quizQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        newScore++;
      }
    });
    setScore(newScore);
    setCurrentStep('results');
  };

  const resetQuiz = () => {
    setCurrentStep('start');
  };

  // Loading state
  if (currentStep === 'loading') {
    return (
      <div className="dark:bg-gray-800 flex h-screen w-full justify-center">
        <p className="text-gray-600 text-center py-4">Loading questions...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dark:bg-gray-800 flex h-screen w-full justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
          <h2 className="text-red-700 text-xl font-semibold mb-2">Error Loading Questions</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  // Start screen
  if (currentStep === 'start') {
    return (
      <div className="dark:bg-gray-800 flex justify-center h-screen">
        <div className="bg-white rounded-lg shadow-md p-6 my-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz App</h1>
          <p className="text-gray-600 mb-6">
            This quiz contains {numQuestions} random questions from our database of {allQuestions.length} questions.
          </p>
          <button
            onClick={startQuiz}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Results screen
  if (currentStep === 'results') {
    return (
      <div className="dark:bg-gray-800 flex h-screen w-full justify-center overflow-hidden">
        <div className="bg-white rounded-lg shadow-md p-6 my-4 overflow-y-auto max-h-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Quiz Results</h1>
          <div className="text-center mb-6">
            <p className="text-5xl font-bold mb-2 text-blue-600">{score} / {numQuestions}</p>
            <p className="text-gray-600">
              {score === 10 ? 'Perfect score!' :
                score >= 7 ? 'Great job!' :
                  score >= 5 ? 'Good effort!' :
                    'Keep practicing!'}
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {quizQuestions.map((question, qIndex) => (
              <div key={qIndex} className={`p-4 rounded-lg border ${
                userAnswers[qIndex] === question.answer ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <p className="font-medium mb-2">{qIndex + 1}. {question.question}</p>
                <ul className="space-y-1 pl-4">
                  {question.options.map((option, oIndex) => (
                    <li key={oIndex} className={`
                      ${oIndex === question.answer ? 'text-green-700 font-medium' : ''}
                      ${oIndex === userAnswers[qIndex] && oIndex !== question.answer ? 'text-red-700 line-through' : ''}
                    `}>
                      {option}
                      {oIndex === question.answer && ' ✓'}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz interface
  return (
    <div className="dark:bg-gray-800 flex h-screen w-full justify-center overflow-hidden">
      <div className="rounded-lg shadow-md p-6 my-4 overflow-y-auto max-h-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quiz Questions</h1>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
            {userAnswers.filter(a => a !== -1).length} / {numQuestions} answered
          </span>
        </div>

        <div className="space-y-8 mb-8">
          {quizQuestions.map((question, qIndex) => (
            <div key={qIndex} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {qIndex + 1}. {question.question}
              </h2>
              <ul className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <li key={oIndex}>
                    <button
                      onClick={() => handleAnswerSelect(qIndex, oIndex)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        userAnswers[qIndex] === oIndex
                          ? 'bg-blue-100 border-blue-300 border'
                          : 'bg-white border-gray-200 border hover:bg-gray-100'
                      }`}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={calculateScore}
            disabled={userAnswers.includes(-1)}
            className={`py-2 px-6 rounded-lg font-semibold ${
              userAnswers.includes(-1)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white transition duration-200'
            }`}
          >
            {userAnswers.includes(-1) ? 'Answer All Questions to Continue' : 'Submit Answers'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
