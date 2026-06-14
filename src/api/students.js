import API from './axios';

export const getStudents = (page, size) => API.get('/api/students?page=' + (page || 0) + '&size=' + (size || 10));
export const getStudentById = (id) => API.get('/api/students/' + id);
export const createStudent = (data) => API.post('/api/students', data);
export const updateStudent = (id, data) => API.patch('/api/students/' + id, data);
export const deleteStudent = (id) => API.delete('/api/students/' + id);
