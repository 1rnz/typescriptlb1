// -----------------------
// 1. Базові типи
// -----------------------
export type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

export type TimeSlot =
  | "8:30-10:00"
  | "10:15-11:45"
  | "12:15-13:45"
  | "14:00-15:30"
  | "15:45-17:15";

export type CourseType = "Lecture" | "Seminar" | "Lab" | "Practice";

// -----------------------
// 2. Типи сутностей
// -----------------------

export type Professor = {
  id: number;
  name: string;
  department: string;
};

export type Classroom = {
  number: string;
  capacity: number;
  hasProjector: boolean;
};

export type Course = {
  id: number;
  name: string;
  type: CourseType;
};

// -----------------------
// 3. Типи уроків та конфліктів
// -----------------------

export type Lesson = {
  courseId: number;
  professorId: number;
  classroomNumber: string;
  dayOfWeek: DayOfWeek;
  timeSlot: TimeSlot;
};

// Внутрішній тип збереженого уроку
export type ScheduledLesson = Lesson & { id: number };

// Тип конфлікту
export type ScheduleConflict = {
  type: "ProfessorConflict" | "ClassroomConflict";
  lessonDetails: Lesson;
};