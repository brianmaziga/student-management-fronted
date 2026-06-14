import React, { useState, useEffect } from 'react';
import { getAttendanceByStudent, markAttendance, deleteAttendance } from '../api/attendance';
import { getStudents } from '../api/students';
import { getCourses } from '../api/courses';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [form, setForm] = useState({ studentId: '', courseId: '', date: '', status: 'PRESENT', remarks: '' });

  useEffect(() => {
    getStudents().then(res => setStudents(res.data.content));
    getCourses().then(res => setCourses(res.data));
  }, []);

  const fetchAttendance = async (studentId) => {
    const res = await getAttendanceByStudent(studentId);
    setAttendance(res.data);
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
    fetchAttendance(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await markAttendance(form);
    setForm({ studentId: '', courseId: '', date: '', status: 'PRESENT', remarks: '' });
    if (selectedStudent) fetchAttendance(selectedStudent);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this record?')) {
      await deleteAttendance(id);
      if (selectedStudent) fetchAttendance(selectedStudent);
    }
  };

  const statusColor = (status) => {
    if (status === 'PRESENT') return '#2e7d32';
    if (status === 'ABSENT') return '#c62828';
    if (status === 'LATE') return '#f9a825';
    if (status === 'EXCUSED') return '#1565c0';
    return '#999';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Attendance</h2>

      <div style={styles.form}>
        <h3>Mark Attendance</h3>
        <form onSubmit={handleSubmit}>
          <select style={styles.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <select style={styles.input} value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input style={styles.input} type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <select style={styles.input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="PRESENT">Present</option>
            <option value="ABSENT">Absent</option>
            <option value="LATE">Late</option>
            <option value="EXCUSED">Excused</option>
          </select>
          <input style={styles.input} placeholder="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          <button style={styles.button} type="submit">Mark Attendance</button>
        </form>
      </div>

      <div style={styles.filterBox}>
        <h3>View Attendance by Student</h3>
        <select style={styles.input} onChange={handleStudentChange}>
          <option value="">Select Student</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>Student</th>
            <th style={styles.th}>Course</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Remarks</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.id} style={styles.tableRow}>
              <td style={styles.td}>{record.studentName}</td>
              <td style={styles.td}>{record.courseName}</td>
              <td style={styles.td}>{record.date}</td>
              <td style={styles.td}>
                <span style={{ padding: '3px 8px', borderRadius: '3px', color: 'white', backgroundColor: statusColor(record.status) }}>
                  {record.status}
                </span>
              </td>
              <td style={styles.td}>{record.remarks}</td>
              <td style={styles.td}>
                <button style={styles.deleteBtn} onClick={() => handleDelete(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif' },
  title: { color: '#1a73e8' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  filterBox: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  input: { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableHeader: { backgroundColor: '#1a73e8', color: 'white' },
  th: { padding: '12px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
};

export default Attendance;