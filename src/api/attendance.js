import API from './axios';

export const getAttendanceByStudent = (studentId) => API.get('/api/attendance/student/' + studentId);
export const getAttendanceByCourse = (courseId) => API.get('/api/attendance/course/' + courseId);
export const markAttendance = (data) => API.post('/api/attendance', data);
export const updateAttendance = (id, data) => API.patch('/api/attendance/' + id, data);
export const deleteAttendance = (id) => API.delete('/api/attendance/' + id);
