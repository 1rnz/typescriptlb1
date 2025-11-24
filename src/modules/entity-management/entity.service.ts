import { Professor, Course, Classroom } from "../../types/schedule.types";
import { professors, classrooms, courses } from "../../data/store";

/**
 * Додає нового професора.
 * @param {Professor} prof Об'єкт професора.
 * @returns {void}
 */
export function addProfessor(prof: Professor): void {
  if (professors.some((p: Professor) => p.id === prof.id)) {
    throw new Error(`Professor id=${prof.id} already exists`);
  }
  professors.push(prof);
}

/**
 * Додає нову аудиторію.
 * @param {Classroom} classroom Об'єкт аудиторії.
 * @returns {void}
 */
export function addClassroom(classroom: Classroom): void {
  if (classrooms.some((c: Classroom) => c.number === classroom.number)) {
    throw new Error(`Classroom number=${classroom.number} already exists`);
  }
  classrooms.push(classroom);
}

/**
 * Додає новий курс.
 * @param {Course} course Об'єкт курсу.
 * @returns {void}
 */
export function addCourse(course: Course): void {
  if (courses.some((c: Course) => c.id === course.id)) {
    throw new Error(`Course id=${course.id} already exists`);
  }
  courses.push(course);
}