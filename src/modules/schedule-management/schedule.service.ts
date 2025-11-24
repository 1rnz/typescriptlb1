import {
  Lesson,
  ScheduleConflict,
  TimeSlot,
  DayOfWeek,
  CourseType,
  ScheduledLesson,
  Course,
  Classroom,
} from "../../types/schedule.types";
import { schedule, courses, classrooms, incrementLessonId } from "../../data/store";

/**
 * Перевіряє урок на конфлікти (професор або аудиторія).
 * @param {Lesson} lesson Урок для перевірки.
 * @returns {ScheduleConflict | null} Об'єкт конфлікту або null.
 */
export function validateLesson(lesson: Lesson): ScheduleConflict | null {
  for (const s of schedule) {
    // Конфлікт за професором
    if (
      s.professorId === lesson.professorId &&
      s.dayOfWeek === lesson.dayOfWeek &&
      s.timeSlot === lesson.timeSlot
    ) {
      return { type: "ProfessorConflict", lessonDetails: s };
    }

    // Конфлікт за аудиторією
    if (
      s.classroomNumber === lesson.classroomNumber &&
      s.dayOfWeek === lesson.dayOfWeek &&
      s.timeSlot === lesson.timeSlot
    ) {
      return { type: "ClassroomConflict", lessonDetails: s };
    }
  }
  return null;
}

/**
 * Додає урок до розкладу, якщо немає конфліктів.
 * @param {Lesson} lesson Урок для додавання.
 * @returns {ScheduledLesson | null} Доданий урок або null у разі конфлікту.
 */
export function addLesson(lesson: Lesson): ScheduledLesson | null {
  const conflict: ScheduleConflict | null = validateLesson(lesson);
  if (conflict) {
    console.log("Conflict detected:", conflict);
    return null;
  }
  const newLesson: ScheduledLesson = { ...lesson, id: incrementLessonId() };
  schedule.push(newLesson);
  return newLesson;
}

/**
 * Знаходить доступні аудиторії на вказаний час.
 * @param {TimeSlot} slot Часовий проміжок.
 * @param {DayOfWeek} day День тижня.
 * @returns {string[]} Масив номерів доступних аудиторій.
 */
export function findAvailableClassrooms(slot: TimeSlot, day: DayOfWeek): string[] {
  const occupied: string[] = schedule
    .filter((s: ScheduledLesson) => s.dayOfWeek === day && s.timeSlot === slot)
    .map((s: ScheduledLesson) => s.classroomNumber);

  return classrooms
    .map((c: Classroom) => c.number)
    .filter((num: string) => !occupied.includes(num));
}

/**
 * Повертає розклад для вказаного професора.
 * @param {number} professorId ID професора.
 * @returns {Lesson[]} Масив уроків.
 */
export function getProfessorSchedule(professorId: number): Lesson[] {
  return schedule.filter((s: ScheduledLesson) => s.professorId === professorId);
}

/**
 * Обчислює відсоток завантаженості аудиторії.
 * @param {string} classroom Номер аудиторії.
 * @returns {number} Відсоток завантаженості.
 */
export function getClassroomUtilization(classroom: string): number {
  const totalPossible: number = 5 * 5; // 5 днів × 5 слотів
  const used: number = schedule.filter((s: ScheduledLesson) => s.classroomNumber === classroom).length;
  return (used / totalPossible) * 100;
}

/**
 * Визначає найпопулярніший тип курсу.
 * @returns {CourseType} Найпопулярніший тип.
 */
export function getMostPopularCourseType(): CourseType {
  const counts: Record<CourseType, number> = {
    Lecture: 0,
    Seminar: 0,
    Lab: 0,
    Practice: 0,
  };

  for (const s of schedule) {
    const c: Course | undefined = courses.find((c: Course) => c.id === s.courseId);
    if (c) counts[c.type]++;
  }

  return (Object.keys(counts) as CourseType[]).reduce((a: CourseType, b: CourseType) =>
    counts[a] > counts[b] ? a : b
  );
}

/**
 * Перепризначає аудиторію для уроку.
 * @param {number} lessonId ID уроку.
 * @param {string} newClassroomNumber Новий номер аудиторії.
 * @returns {boolean} true, якщо перепризначено успішно, інакше false.
 */
export function reassignClassroom(lessonId: number, newClassroomNumber: string): boolean {
  const lesson: ScheduledLesson | undefined = schedule.find((s: ScheduledLesson) => s.id === lessonId);
  if (!lesson) return false;

  if (!classrooms.some((c: Classroom) => c.number === newClassroomNumber)) return false;

  // Перевірка на конфлікт у новій аудиторії
  if (
    schedule.some(
      (s: ScheduledLesson) =>
        s.classroomNumber === newClassroomNumber &&
        s.dayOfWeek === lesson.dayOfWeek &&
        s.timeSlot === lesson.timeSlot &&
        s.id !== lessonId // Ігноруємо поточний урок
    )
  )
    return false;

  lesson.classroomNumber = newClassroomNumber;
  return true;
}

/**
 * Скасовує урок за ID.
 * @param {number} id ID уроку.
 * @returns {void}
 */
export function cancelLesson(id: number): void {
  const idx: number = schedule.findIndex((s: ScheduledLesson) => s.id === id);
  if (idx !== -1) schedule.splice(idx, 1);
}