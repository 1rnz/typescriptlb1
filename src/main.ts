import { classrooms, schedule, professors, courses } from "./data/store";
import {
  addProfessor,
  addClassroom,
  addCourse,
} from "./modules/entity-management/entity.service";
import {
  addLesson,
  findAvailableClassrooms,
  getProfessorSchedule,
  getClassroomUtilization,
  getMostPopularCourseType,
  reassignClassroom,
  cancelLesson,
} from "./modules/schedule-management/schedule.service";
import { Lesson, ScheduledLesson } from "./types/schedule.types";

// =======================
// University Schedule System Demo
// =======================

console.log("--- 1. Додавання сутностей ---");

addClassroom({ number: "A101", capacity: 50, hasProjector: true });
addClassroom({ number: "B202", capacity: 40, hasProjector: false });
addClassroom({ number: "C303", capacity: 30, hasProjector: true });

addProfessor({ id: 1, name: "Ivanov", department: "Math" });
addProfessor({ id: 2, name: "Petrov", department: "Physics" });

addCourse({ id: 101, name: "Calculus", type: "Lecture" });
addCourse({ id: 102, name: "Mechanics", type: "Practice" });
addCourse({ id: 103, name: "Programming", type: "Lab" });

console.log(`Classrooms: ${classrooms.length}, Professors: ${professors.length}, Courses: ${courses.length}`);

console.log("--- 2. Додавання уроків ---");

const lesson1: Lesson = {
  courseId: 101,
  professorId: 1,
  classroomNumber: "A101",
  dayOfWeek: "Monday",
  timeSlot: "8:30-10:00",
};
const scheduledLesson1: ScheduledLesson | null = addLesson(lesson1);
console.log("Lesson 1 added:", scheduledLesson1 ? scheduledLesson1.id : "Conflict");


const lesson2: Lesson = {
  courseId: 102,
  professorId: 2,
  classroomNumber: "B202",
  dayOfWeek: "Monday",
  timeSlot: "10:15-11:45",
};
addLesson(lesson2);

// Спроба додати конфліктний урок
const lessonConflict: Lesson = {
  courseId: 103,
  professorId: 1,
  classroomNumber: "C303",
  dayOfWeek: "Monday",
  timeSlot: "8:30-10:00", // Час Lesson 1
};
console.log("\nTrying to add Lesson (Professor Conflict)...");
addLesson(lessonConflict); 

console.log("\nCurrent Schedule Length:", schedule.length);

console.log("--- 3. Демонстрація функцій ---");

const available: string[] = findAvailableClassrooms("8:30-10:00", "Monday");
console.log("Available Classrooms on Monday 8:30-10:00:", available); 

const utilizationA101: number = getClassroomUtilization("A101");
console.log(`Classroom A101 Utilization: ${utilizationA101.toFixed(2)}%`);

const mostPopular: string = getMostPopularCourseType();
console.log("Most Popular Course Type:", mostPopular);

if (scheduledLesson1) {
    const reassigned: boolean = reassignClassroom(scheduledLesson1.id, "C303");
    console.log(`Reassign Lesson ${scheduledLesson1.id} to C303: ${reassigned}`);
    cancelLesson(scheduledLesson1.id);
    console.log(`Cancelled Lesson ${scheduledLesson1.id}.`);
}

console.log("Final Schedule Length:", schedule.length);
