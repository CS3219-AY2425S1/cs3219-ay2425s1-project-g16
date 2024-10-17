import { Router } from 'express';

import {
  searchQuestionsByTitle,
  getQuestions,
  getQuestionDetails,
  getRandomQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getTopics,
  getDifficulties,
} from '@/controller/question-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/topics', getTopics);
router.get('/difficulties', getDifficulties);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.post('/random', getRandomQuestion);

router.post('/create', createQuestion);
router.put('/:questionId', updateQuestion);
router.delete('/:questionId', deleteQuestion);

export default router;
