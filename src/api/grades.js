import API from './axios';

export const getGradesByStudent = (studentId) => API.get('/api/grades/student/' + studentId);
export const getGradesByCourse = (courseId) => API.get('/api/grades/course/' + courseId);
export const assignGrade = (data) => API.post('/api/grades', data);
export const updateGrade = (id, data) => API.patch('/api/grades/' + id, data);
export const deleteGrade = (id) => API.delete('/api/grades/' + id);
