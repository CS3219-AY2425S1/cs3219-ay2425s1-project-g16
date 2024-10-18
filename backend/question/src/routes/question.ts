import { Router } from 'express';

import {
  createQuestion,
  deleteQuestion,
  getQuestionDetails,
  getQuestions,
  getRandomQuestion,
  searchQuestionsByTitle,
  updateQuestion,
} from '@/controller/question-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.post('/random', getRandomQuestion);

router.post('/create', createQuestion);
router.put('/:questionId', updateQuestion);
router.delete('/:questionId', deleteQuestion);

export default router;
