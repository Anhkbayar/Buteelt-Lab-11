import React, { useState } from 'react'
import './Quiz.css'
import QuizQuestion from '../core/QuizQuestion'
import quizData from '../data/quizData'

  interface QuizState {
    questions: QuizQuestion[]
    currentQuestionIndex: number
    selectedAnswer: string | null
    isQuizFinished: boolean
    userAnswers: string[]
  }

  const Quiz: React.FC = () => {
    const initialQuestions: QuizQuestion[] = quizData.map((item) => ({
      question: item.question,
      options: item.options,
      correctAnswer: item.correctAnswer
    }));

  const [state, setState] = useState<QuizState>({
    questions: initialQuestions,
    currentQuestionIndex: 0,
    selectedAnswer: null,
    isQuizFinished: false,
    userAnswers: Array(initialQuestions.length).fill(null)
  })

  const handleOptionSelect = (option: string): void => {
    setState(prev => ({ ...prev, selectedAnswer: option }))
  }

  const handleNextQuestion = (): void => {
    const { currentQuestionIndex, questions, selectedAnswer, userAnswers } = state;
  
    // Update the current answer in userAnswers array
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswer || '';  // default to '' if null
  
    if (currentQuestionIndex + 1 >= questions.length) {
      setState(prev => ({
        ...prev,
        isQuizFinished: true,
        userAnswers: updatedUserAnswers
      }));
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: currentQuestionIndex + 1,
        selectedAnswer: userAnswers[currentQuestionIndex + 1], // Load the next question's saved answer
        userAnswers: updatedUserAnswers
      }));
    }
  };
  
  const handlePreviousQuestion = (): void => {
    if (state.currentQuestionIndex > 0) {
      // Save the current answer before moving back
      const updatedUserAnswers = [...state.userAnswers];
      updatedUserAnswers[state.currentQuestionIndex] = state.selectedAnswer || '';
  
      setState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
        selectedAnswer: updatedUserAnswers[prev.currentQuestionIndex - 1], // Load the previous question's saved answer
        userAnswers: updatedUserAnswers
      }));
    }
  };

  const handleRestart = (): void => {
    setState({
      questions: initialQuestions,
      currentQuestionIndex: 0,
      selectedAnswer: null,
      isQuizFinished: false,
      userAnswers: Array(initialQuestions.length).fill(null)
    })
  }

  const { questions, currentQuestionIndex, selectedAnswer, isQuizFinished, userAnswers } = state

  if (isQuizFinished) {
    // Calculate number of correct answers
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (userAnswers[index] === question.correctAnswer ? 1 : 0)
    }, 0)

    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>You got {correctAnswers} out of {questions.length} questions correct!</p>

        <h3>Questions Review:</h3>
        {questions.map((question, index) => (
          <div key={index}>
            <h4>Question {index + 1}: {question.question}</h4>
            <p>Your answer: {userAnswers[index] || 'Not answered'}</p>
            <p>Correct answer: {question.correctAnswer}</p>
            <hr />
          </div>
        ))}

        <button onClick={handleRestart}>Restart Quiz</button>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div>
      <h2>Quiz Question {currentQuestionIndex + 1} of {questions.length}:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map(option => (
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

      <button
        onClick={handlePreviousQuestion}
        disabled={currentQuestionIndex === 0}
      >
        Previous Question
      </button>

      <button onClick={handleNextQuestion}>
        {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
      </button>
    </div>
  )
}

export default Quiz