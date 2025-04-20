import {useEffect, useState} from 'react';
import {loadQuestions, QuestionsArray} from './data/questions.ts';

const numQuestions = 15;
const valuesQuestions = 5;

function App() {
  const [allQuestions, setAllQuestions] = useState<QuestionsArray>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuestionsArray>([]);
  const [error, setError] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<'loading' | 'start' | 'quiz' | 'results'>('loading');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
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
    // Filter Australian values questions
    const australianValuesQuestions = allQuestions.filter(q => q.section === 'Australian values');
    // Filter all other questions
    const otherQuestions = allQuestions.filter(q => q.section !== 'Australian values');

    // Shuffle and select from each set
    const selectedValuesQuestions = [...australianValuesQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, valuesQuestions);

    const selectedOtherQuestions = [...otherQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, numQuestions);

    // Combine the two sets and shuffle again to mix them
    const selected = [...selectedValuesQuestions, ...selectedOtherQuestions]
      .sort(() => 0.5 - Math.random());

    setQuizQuestions(selected);
    setUserAnswers(new Array(selected.length).fill(-1));
    setCurrentStep('quiz');
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
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
            This quiz contains {numQuestions + valuesQuestions} random questions from the list
            of {allQuestions.length} questions.
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
            <p className="text-5xl font-bold mb-2 text-blue-600">{score} / {quizQuestions.length}</p>
            <p className="text-gray-600">
              {score === quizQuestions.length ? 'Perfect score!' :
                score >= Math.floor(quizQuestions.length * 0.7) ? 'Great job!' :
                  score >= Math.floor(quizQuestions.length * 0.5) ? 'Good effort!' :
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

  // Quiz interface - single question at a time
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const answeredCount = userAnswers.filter(a => a !== -1).length;
  const allQuestionsAnswered = !userAnswers.includes(-1);

  return (
    <div className="dark:bg-gray-800 flex h-screen w-full justify-center overflow-hidden">
      <div className="bg-white rounded-lg shadow-md p-6 my-4 w-full max-w-3xl">
        <div className="flex justify-between items-center mb-6">
          <h1
            className="text-2xl font-bold text-gray-800">Question {currentQuestionIndex + 1} of {quizQuestions.length}</h1>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
            {answeredCount} / {quizQuestions.length} answered
          </span>
        </div>

        <div className="mb-8">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQuestion.question}
            </h2>
            <ul className="space-y-2">
              {currentQuestion.options.map((option, oIndex) => (
                <li key={oIndex}>
                  <button
                    onClick={() => handleAnswerSelect(oIndex)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      userAnswers[currentQuestionIndex] === oIndex
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
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`py-2 px-4 rounded-lg font-medium ${
              currentQuestionIndex === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700 transition duration-200'
            }`}
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {quizQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentQuestionIndex === index
                    ? 'bg-blue-600 text-white'
                    : userAnswers[index] !== -1
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            )).slice(0, Math.min(10, quizQuestions.length))}
            {quizQuestions.length > 10 && (
              <span className="w-8 h-8 flex items-center justify-center">...</span>
            )}
          </div>

          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <button
              onClick={goToNextQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={calculateScore}
              disabled={!allQuestionsAnswered}
              className={`py-2 px-4 rounded-lg font-medium ${
                !allQuestionsAnswered
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white transition duration-200'
              }`}
            >
              Finish
            </button>
          )}
        </div>

        {!allQuestionsAnswered && currentQuestionIndex === quizQuestions.length - 1 && (
          <div className="mt-4 text-center text-amber-600">
            Please answer all questions before submitting.
          </div>
        )}

        {answeredCount === quizQuestions.length && currentQuestionIndex !== quizQuestions.length - 1 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={calculateScore}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Submit All Answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
