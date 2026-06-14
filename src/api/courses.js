import API from './axios';

export const getCourses = () => API.get('/api/courses');
export const createCourse = (data) => API.post('/api/courses', data);
export const updateCourse = (id, data) => API.patch('/api/courses/' + id, data);
export const deleteCourse = (id) => API.delete('/api/courses/' + id);
export const enrollStudent = (courseId, studentId) => API.post('/api/courses/' + courseId + '/enroll/' + studentId);
export const unenrollStudent = (courseId, studentId) => API.delete('/api/courses/' + courseId + '/unenroll/' + studentId);
