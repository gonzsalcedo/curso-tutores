import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ---------- Types ----------

export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  order: number;
  slug?: string;
  price?: number;
  published?: boolean;
}

export interface Module {
  id: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
  resources?: { title: string; url: string }[];
}

export interface StudentProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  lastLessonId?: string;
  updatedAt?: string;
}

export interface Student {
  id: string;
  email: string;
  displayName?: string;
  enrolledCourses: string[];
  createdAt: string;
  role?: "student" | "admin";
}

// ---------- Helper ----------
function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ---------- Courses ----------

export async function getCourses(): Promise<Course[]> {
  try {
    const snap = await getDocs(collection(db, "courses"));
    return sortByOrder(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Course)));
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const snap = await getDoc(doc(db, "courses", courseId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export async function createCourse(data: Omit<Course, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "courses"), data);
  return ref.id;
}

export async function updateCourse(courseId: string, data: Partial<Course>): Promise<void> {
  await updateDoc(doc(db, "courses", courseId), data);
}

export async function deleteCourse(courseId: string): Promise<void> {
  const modules = await getModules(courseId);
  for (const mod of modules) {
    const lessons = await getLessons(courseId, mod.id);
    for (const lesson of lessons) {
      await deleteDoc(doc(db, "courses", courseId, "modules", mod.id, "lessons", lesson.id));
    }
    await deleteDoc(doc(db, "courses", courseId, "modules", mod.id));
  }
  await deleteDoc(doc(db, "courses", courseId));
}

// ---------- Modules ----------

export async function getModules(courseId: string): Promise<Module[]> {
  try {
    const snap = await getDocs(collection(db, "courses", courseId, "modules"));
    return sortByOrder(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Module)));
  } catch (error) {
    console.error("Error getting modules:", error);
    return [];
  }
}

export async function createModule(courseId: string, data: Omit<Module, "id">): Promise<string> {
  const ref = await addDoc(collection(db, "courses", courseId, "modules"), data);
  return ref.id;
}

export async function updateModule(courseId: string, moduleId: string, data: Partial<Module>): Promise<void> {
  await updateDoc(doc(db, "courses", courseId, "modules", moduleId), data);
}

export async function deleteModule(courseId: string, moduleId: string): Promise<void> {
  const lessons = await getLessons(courseId, moduleId);
  for (const lesson of lessons) {
    await deleteDoc(doc(db, "courses", courseId, "modules", moduleId, "lessons", lesson.id));
  }
  await deleteDoc(doc(db, "courses", courseId, "modules", moduleId));
}

// ---------- Lessons ----------

export async function getLessons(courseId: string, moduleId: string): Promise<Lesson[]> {
  try {
    const snap = await getDocs(collection(db, "courses", courseId, "modules", moduleId, "lessons"));
    return sortByOrder(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lesson)));
  } catch (error) {
    console.error("Error getting lessons:", error);
    return [];
  }
}

export async function createLesson(
  courseId: string,
  moduleId: string,
  data: Omit<Lesson, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, "courses", courseId, "modules", moduleId, "lessons"), data);
  return ref.id;
}

export async function updateLesson(
  courseId: string,
  moduleId: string,
  lessonId: string,
  data: Partial<Lesson>
): Promise<void> {
  await updateDoc(doc(db, "courses", courseId, "modules", moduleId, "lessons", lessonId), data);
}

export async function deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<void> {
  await deleteDoc(doc(db, "courses", courseId, "modules", moduleId, "lessons", lessonId));
}

// ---------- Student Progress ----------

export async function getStudentProgress(userId: string, courseId: string): Promise<StudentProgress | null> {
  try {
    const progressDocId = `${userId}_${courseId}`;
    const snap = await getDoc(doc(db, "progress", progressDocId));
    if (!snap.exists()) return null;
    return snap.data() as StudentProgress;
  } catch (error) {
    console.error("Error fetching student progress:", error);
    return null;
  }
}

export async function toggleLessonCompletion(
  userId: string,
  courseId: string,
  lessonId: string
): Promise<string[]> {
  const progressDocId = `${userId}_${courseId}`;
  const ref = doc(db, "progress", progressDocId);
  const snap = await getDoc(ref);

  let completedLessons: string[] = [];
  if (snap.exists()) {
    const data = snap.data() as StudentProgress;
    completedLessons = data.completedLessons || [];
    if (completedLessons.includes(lessonId)) {
      completedLessons = completedLessons.filter((id) => id !== lessonId);
    } else {
      completedLessons.push(lessonId);
    }
    await updateDoc(ref, {
      completedLessons,
      lastLessonId: lessonId,
      updatedAt: new Date().toISOString(),
    });
  } else {
    completedLessons = [lessonId];
    await setDoc(ref, {
      userId,
      courseId,
      completedLessons,
      lastLessonId: lessonId,
      updatedAt: new Date().toISOString(),
    });
  }
  return completedLessons;
}

// ---------- Students / Subscribers ----------

export async function getStudents(): Promise<Student[]> {
  try {
    const snap = await getDocs(collection(db, "subscribers"));
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        email: data.email || d.id,
        displayName: data.displayName || data.name || "",
        enrolledCourses: data.enrolledCourses || (data.courseId ? [data.courseId] : ["curso-tutores"]),
        createdAt: data.createdAt || new Date().toISOString(),
        role: data.role || "student",
      };
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export async function grantCourseAccess(email: string, courseId: string): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const ref = doc(db, "subscribers", cleanEmail);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const current = snap.data().enrolledCourses || [];
    if (!current.includes(courseId)) {
      await updateDoc(ref, { enrolledCourses: [...current, courseId] });
    }
  } else {
    await setDoc(ref, {
      email: cleanEmail,
      enrolledCourses: [courseId],
      createdAt: new Date().toISOString(),
      role: "student",
    });
  }
}

export async function revokeCourseAccess(email: string, courseId: string): Promise<void> {
  const cleanEmail = email.toLowerCase().trim();
  const ref = doc(db, "subscribers", cleanEmail);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const current = snap.data().enrolledCourses || [];
    await updateDoc(ref, {
      enrolledCourses: current.filter((id: string) => id !== courseId),
    });
  }
}

/**
 * Valida si un alumno específico tiene acceso activo al curso
 */
export async function checkStudentAccess(email: string, courseId: string): Promise<boolean> {
  if (!email) return false;
  try {
    const cleanEmail = email.toLowerCase().trim();
    const ref = doc(db, "subscribers", cleanEmail);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    const data = snap.data();
    const enrolled: string[] = data.enrolledCourses || (data.courseId ? [data.courseId] : []);
    return enrolled.includes(courseId);
  } catch (err) {
    console.error("Error al validar acceso de alumno:", err);
    return false;
  }
}

