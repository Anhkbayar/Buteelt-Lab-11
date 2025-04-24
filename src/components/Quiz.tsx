import React, { useState } from 'react';
import './Quiz.css';
import QuizQuestion from '../core/QuizQuestion';
import QuizData from '../data/quizData';

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
  userAnswers: (string | null)[];
}

const Quiz: React.FC = () => {
  const initialQuestions: QuizQuestion[] = QuizData.map((item) => ({
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer
  }));

  const [state, setState] = useState<QuizState>({
    questions: initialQuestions,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    userAnswers: Array(initialQuestions.length).fill(null),
  });

  const handleOptionSelect = (option: string): void => {
    // Only allow selection if the question hasn't been answered yet
    if (state.userAnswers[state.currentQuestionIndex] === null) {
      setState(prevState => ({
        ...prevState,
        selectedAnswer: option
      }));
    }
  };

  const handleButtonClick = (): void => {
    setState(prevState => {
      if (prevState.selectedAnswer === null) {
        return prevState;
      }

      const currentQuestion = prevState.questions[prevState.currentQuestionIndex];
      const isCorrect = prevState.selectedAnswer === currentQuestion.correctAnswer;
      
      const isFirstAnswer = prevState.userAnswers[prevState.currentQuestionIndex] === null;
      const newScore = isFirstAnswer ? 
        (isCorrect ? prevState.score + 1 : prevState.score) : 
        prevState.score;

      const newUserAnswers = [...prevState.userAnswers];
      newUserAnswers[prevState.currentQuestionIndex] = prevState.selectedAnswer;

      return {
        ...prevState,
        score: newScore,
        currentQuestionIndex: prevState.currentQuestionIndex + 1,
        selectedAnswer: null,
        userAnswers: newUserAnswers
      };
    });
  };

  const handleBackClick = (): void => {
    setState(prevState => {
      if (prevState.currentQuestionIndex === 0) {
        return prevState;
      }
      return {
        ...prevState,
        currentQuestionIndex: prevState.currentQuestionIndex - 1,
        selectedAnswer: prevState.userAnswers[prevState.currentQuestionIndex - 1]
      };
    });
  };

  const handleRestartClick = (): void => {
    setState({
      questions: initialQuestions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      userAnswers: Array(initialQuestions.length).fill(null)
    });
  };

  const { questions, currentQuestionIndex, selectedAnswer, score, userAnswers } = state;
  const currentQuestion = questions[currentQuestionIndex];
  const nextText = currentQuestionIndex === questions.length - 1 ? "Submit Answers" : "Next Question";

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score} out of {questions.length}</p>
        <div className="answer-review">
          <h3>Answer Review:</h3>
          <ul>
            {questions.map((question, index) => (
              <li key={index} className={userAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'}>
                <p><strong>Q{index + 1}:</strong> {question.question}</p>
                <p>Your answer: <span> {userAnswers[index]}</span></p>
                <p>Correct answer: <span>{question.correctAnswer}</span></p>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={handleRestartClick}>Restart</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Current score: {score}</h2>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => {
          const isAnswered = userAnswers[currentQuestionIndex] !== null;
          const isCurrentSelection = option === selectedAnswer;
          const isPreviouslySelected = option === userAnswers[currentQuestionIndex];

          let className = 'option';
          if (isAnswered) {
            className = isPreviouslySelected ? 'selected' : 'disabled';
          } else if (isCurrentSelection) {
            className = 'selected';
          }

          return (
            <li
              key={option}
              onClick={() => !isAnswered && handleOptionSelect(option)}
              className={className}
            >
              {option}
              {isPreviouslySelected}
            </li>
          );
        })}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>
      <div className='buttons'>
        <button onClick={handleBackClick} disabled={currentQuestionIndex === 0}>
          Previous Question
        </button>
        <button 
          onClick={handleButtonClick} 
          disabled={selectedAnswer === null && userAnswers[currentQuestionIndex] === null}
        >
          {nextText}
        </button>
      </div>
    </div>
  );
};

export default Quiz;