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
//end zuvhun neg asuult baisniig buh asuultaar damjdag bolgoson
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

  const handRestartClick =():void =>{
    setState({
      questions: initialQuestions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0
    })
  }

  const { questions, currentQuestionIndex, selectedAnswer, score } = state;
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score} out of {questions.length}</p>
        <button onClick={handRestartClick}>Restart</button>
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
            // style={{
            //   border: selectedAnswer === option 
            //     ? '2px solid #007bff' 
            //     : '1px solid #fffff',
            //   padding: '8px',
            //   margin: '4px',
            //   cursor: 'pointer',
            //   borderRadius: '4px'
            // }}
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