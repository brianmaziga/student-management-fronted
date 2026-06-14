import React, { useState, useEffect } from 'react';
import { getGradesByStudent, assignGrade, deleteGrade } from '../api/grades';
import { getStudents } from '../api/students';
import { getCourses } from '../api/courses';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [form, setForm] = useState({ studentId: '', courseId: '', score: '', remarks: '' });

  useEffect(() => {
    getStudents().then(res => setStudents(res.data.content));
    getCourses().then(res => setCourses(res.data));
  }, []);

  const fetchGrades = async (studentId) => {
    const res = await getGradesByStudent(studentId);
    setGrades(res.data);
  };

  const handleStudentChange = (e) => {
    setSelectedStudent(e.target.value);
    fetchGrades(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await assignGrade(form);
    setForm({ studentId: '', courseId: '', score: '', remarks: '' });
    if (selectedStudent) fetchGrades(selectedStudent);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this grade?')) {
      await deleteGrade(id);
      if (selectedStudent) fetchGrades(selectedStudent);
    }
  };

  const gradeColor = (grade) => {
    if (grade === 'A') return '#2e7d32';
    if (grade === 'B') return '#1565c0';
    if (grade === 'C') return '#f9a825';
    if (grade === 'D') return '#e65100';
    return '#c62828';
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Grades</h2>

      <div style={styles.form}>
        <h3>Assign Grade</h3>
        <form onSubmit={handleSubmit}>
          <select style={styles.input} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
            <option value="">Select Student</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
          </select>
          <select style={styles.input} value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} required>
            <option value="">Select Course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input style={styles.input} type="number" placeholder="Score (0-100)" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} required />
          <input style={styles.input} placeholder="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          <button style={styles.button} type="submit">Assign Grade</button>
        </form>
      </div>

      <div style={styles.filterBox}>
        <h3>View Grades by Student</h3>
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
            <th style={styles.th}>Score</th>
            <th style={styles.th}>Grade</th>
            <th style={styles.th}>Remarks</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade) => (
            <tr key={grade.id} style={styles.tableRow}>
              <td style={styles.td}>{grade.studentName}</td>
              <td style={styles.td}>{grade.courseName}</td>
              <td style={styles.td}>{grade.score}</td>
              <td style={styles.td}>
                <span style={{ padding: '3px 8px', borderRadius: '3px', color: 'white', backgroundColor: gradeColor(grade.grade) }}>
                  {grade.grade}
                </span>
              </td>
              <td style={styles.td}>{grade.remarks}</td>
              <td style={styles.td}>
                <button style={styles.deleteBtn} onClick={() => handleDelete(grade.id)}>Delete</button>
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

export default Grades;