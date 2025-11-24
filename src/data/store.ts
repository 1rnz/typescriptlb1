import { Professor, Classroom, Course, ScheduledLesson } from "../types/schedule.types";

export const professors: Professor[] = [];
export const classrooms: Classroom[] = [];
export const courses: Course[] = [];
export const schedule: ScheduledLesson[] = [];

export let nextLessonId: number = 1;

/**
 * Інкрементує та повертає наступний доступний ID для уроку.
 * @returns {number} Наступний ID.
 */
export function incrementLessonId(): number {
    return nextLessonId++;
}