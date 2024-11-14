import { Router } from 'express';

import { createAttempt, getAttempts } from '@/controller/attempted-controller';
import {
  createQuestion,
  deleteQuestion,
  getDifficulties,
  getQuestionDetails,
  getQuestions,
  getTopics,
  searchQuestionsByTitle,
  updateQuestion,
} from '@/controller/question-controller';
import { fetchRandomQuestionByIncreasingAttemptCount } from '@/controller/unattempted-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/topics', getTopics);
router.get('/difficulties', getDifficulties);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.post('/random', fetchRandomQuestionByIncreasingAttemptCount);

router.post('/attempts', getAttempts);
router.post('/newAttempt', createAttempt);

// ======================================
// CRUD
// ======================================
router.post('/create', createQuestion);
router.put('/:questionId', updateQuestion);
router.delete('/:questionId', deleteQuestion);

export default router;
