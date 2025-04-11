import React, { useState } from 'react'
import './Quiz.css'
import QuizQuestion from '../core/QuizQuestion';
import QuizData from '../data/quizData';

interface QuizState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  selectedAnswer: string | null
  score: number
}

const Quiz: React.FC = () => {
  const initialQuestions: QuizQuestion[] = QuizData.map((item) => ({
    question: item.question,
    options: item.options,
    correctAnswer: item.correctAnswer,
  }))

  const [state, setState] = useState<QuizState>({
    questions: initialQuestions,
    currentQuestionIndex: 0,  // Initialize the current question index.
    selectedAnswer: null,  // Initialize the selected answer.
    score: 0,  // Initialize the score.
  });

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  }


  const handleButtonClick = (): void => {
    // Task3: Implement the logic for button click, such as moving to the next question.
    setState((prevState) => {
      const isCorrect = prevState.selectedAnswer === prevState.questions[prevState.currentQuestionIndex].correctAnswer;
      const updatedScore = isCorrect ? prevState.score + 1 : prevState.score;

      const nextQuestionIndex = prevState.currentQuestionIndex + 1;

      return {
        ...prevState,
        score: updatedScore,
        currentQuestionIndex: nextQuestionIndex,
        selectedAnswer: null,
      };
    });
  }

  const { questions, currentQuestionIndex, selectedAnswer, score } = state;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score} out of {questions.length}</p>
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
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? 'selected' : ''}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>

      <button onClick={handleButtonClick}>Next Question</button>
    </div>
  );
};

export default Quiz;