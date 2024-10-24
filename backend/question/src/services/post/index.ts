import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/index';
import { questions } from '@/lib/db/schema';

import { ICreateQuestionPayload, IDeleteQuestionPayload, IUpdateQuestionPayload } from './types';

export const createQuestionService = async (payload: ICreateQuestionPayload) => {
  try {
    const [newQuestion] = await db
      .insert(questions)
      .values({
        title: payload.title,
        description: payload.description,
        difficulty: payload.difficulty,
        topic: payload.topics.map(String),
      })
      .returning();

    return { success: true, code: 201, data: newQuestion };
  } catch (error) {
    console.error('Error creating question:', error);
    return { success: false, code: 500, message: 'Failed to create question' };
  }
};

export const updateQuestionService = async (payload: IUpdateQuestionPayload) => {
  try {
    const updateSet: Partial<typeof questions.$inferInsert> = {};

    if (payload.title !== undefined) updateSet.title = payload.title;
    if (payload.description !== undefined) updateSet.description = payload.description;
    if (payload.difficulty !== undefined) updateSet.difficulty = payload.difficulty;
    if (payload.topics !== undefined && Array.isArray(payload.topics))
      updateSet.topic = payload.topics.map(String);

    const [updatedQuestion] = await db
      .update(questions)
      .set(updateSet)
      .where(eq(questions.id, Number(payload.id)))
      .returning();

    if (!updatedQuestion) {
      return { success: false, code: 404, message: 'Question not found' };
    }

    return { success: true, code: 200, data: updatedQuestion };
  } catch (error) {
    console.error('Error updating question:', error);
    return { success: false, code: 500, message: 'Failed to update question' };
  }
};

export const deleteQuestionService = async (payload: IDeleteQuestionPayload) => {
  try {
    const [deletedQuestion] = await db
      .delete(questions)
      .where(eq(questions.id, payload.id))
      .returning();

    if (!deletedQuestion) {
      return { success: false, code: 404, message: 'Question not found' };
    }

    return { success: true, code: 200, message: 'Question deleted successfully' };
  } catch (error) {
    console.error('Error deleting question:', error);
    return { success: false, code: 500, message: 'Failed to delete question' };
  }
};
