const express = require('express');
const app = express();
const port = 3000;

let quizQuestions = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    correctAnswer: 2,
  },
  {
    question: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Austen", "Hemingway"],
    correctAnswer: 0,
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    correctAnswer: 1,
  },
  {
    question: "What is Java?",
    options: [
      "A programming language",
      "A type of coffee",
      "A database system",
      "A web browser",
    ],
    correctAnswer: 0,
  },
];

let userAnswers = [];

app.use(express.static('public')); // Serve static files like HTML, CSS, JS

app.get('/api/questions', (req, res) => {
  res.json(quizQuestions);
});

app.post('/api/submit', express.json(), (req, res) => {
  const answers = req.body.answers;  // Array of answers (indices of selected options)
  let score = 0;

  answers.forEach((answer, index) => {
    if (answer === quizQuestions[index].correctAnswer) {
      score++;
    }
  });

  const result = score >= quizQuestions.length / 2 ? 'Pass' : 'Fail';
  userAnswers = answers;

  res.json({ score, result, totalQuestions: quizQuestions.length });
});

app.get('/api/results', (req, res) => {
  if (userAnswers.length === 0) {
    return res.json({ score: 0, result: 'No attempts yet', totalQuestions: quizQuestions.length });
  }

  const score = userAnswers.filter((answer, index) => answer === quizQuestions[index].correctAnswer).length;
  const result = score >= quizQuestions.length / 2 ? 'Pass' : 'Fail';

  res.json({ score, result, totalQuestions: quizQuestions.length });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
