import React, { useState } from 'react'
import './Quiz.css'
import QuizQuestion from '../core/QuizQuestion';
import QuizData from '../data/quizData';

interface QuizState {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  selectedAnswer: string | null
  score: number
  userAnswer: (string | null)[]
}
//end zuvhun neg asuult baisniig buh asuultaar damjdag bolgoson
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
    userAnswer: Array(initialQuestions.length).fill(null),
  });


  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({
      ...prevState,
      selectedAnswer: option,
      userAnswers: prevState.userAnswer.map((answer, index) =>
        index === prevState.currentQuestionIndex ? option : answer
      )
    }));
  };


  const handleButtonClick = (): void => {
    setState((prevState) => {
      if (prevState.selectedAnswer === null) return prevState;

      const isAlreadyAnswered = prevState.userAnswer[prevState.currentQuestionIndex] !== null;

      const isCorrect = prevState.selectedAnswer ===
        prevState.questions[prevState.currentQuestionIndex].correctAnswer;
      const updatedScore = isAlreadyAnswered ?
        prevState.score :
        (isCorrect ? prevState.score + 1 : prevState.score);

      const nextQuestionIndex = prevState.currentQuestionIndex + 1;
      const updatedUserAnswers = [...prevState.userAnswer];
      updatedUserAnswers[prevState.currentQuestionIndex] = prevState.selectedAnswer;

      return {
        ...prevState,
        score: updatedScore,
        currentQuestionIndex: nextQuestionIndex,
        selectedAnswer: null,
        userAnswer: updatedUserAnswers
      };
    });
  }

  const handleBackClick = (): void => {
    setState((prevState) => {
      let prevQuestionIndex;
      if (prevState.currentQuestionIndex === 0) {
        prevQuestionIndex = prevState.currentQuestionIndex;
      } else {
        prevQuestionIndex = prevState.currentQuestionIndex - 1;
      }

      return {
        ...prevState,
        currentQuestionIndex: prevQuestionIndex,
        selectedAnswer: prevState.userAnswer[prevState.currentQuestionIndex - 1],
      };
    });
  };


  const handRestartClick = (): void => {
    setState({
      questions: initialQuestions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      score: 0,
      userAnswer: Array(initialQuestions.length).fill(null)
    })
  }

  const { questions, currentQuestionIndex, selectedAnswer, score } = state;
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
              <li key={index} className= {state.userAnswer[index] ===question.correctAnswer ? 'correct' : 'incorrect'}>
                <p><strong>Q{index + 1}:</strong> {question.question}</p>
                <p>Your answer: <span> {state.userAnswer[index]}</span></p>
                <p>Correct answer: <span>{question.correctAnswer}</span></p>
              </li>
            ))}
          </ul>
        </div>
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
            className={selectedAnswer === option ? 'selected' : 'option'}
          >
            {option}
          </li>
        ))}
      </ul>

      <h3>Selected Answer:</h3>
      <p>{selectedAnswer ?? 'No answer selected'}</p>
      <div className='buttons'>
        <button onClick={handleBackClick}>Previous Question</button>
        <button onClick={handleButtonClick}>{nextText}</button>
      </div>
    </div>
  );
};

export default Quiz;