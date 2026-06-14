import React, { useState, useEffect } from 'react';
import { getCourses, createCourse, updateCourse, deleteCourse, enrollStudent, unenrollStudent } from '../api/courses';
import { getStudents } from '../api/students';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, []);

  const fetchCourses = async () => {
    const res = await getCourses();
    setCourses(res.data);
  };

  const fetchStudents = async () => {
    const res = await getStudents();
    setStudents(res.data.content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCourse) {
      await updateCourse(editCourse.id, form);
    } else {
      await createCourse(form);
    }
    setShowForm(false);
    setEditCourse(null);
    setForm({ name: '', code: '', description: '' });
    fetchCourses();
  };

  const handleEdit = (course) => {
    setEditCourse(course);
    setForm({ name: course.name, code: course.code, description: course.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this course?')) {
      await deleteCourse(id);
      fetchCourses();
    }
  };

  const handleEnroll = async () => {
    if (selectedCourse && selectedStudent) {
      await enrollStudent(selectedCourse, selectedStudent);
      alert('Student enrolled successfully!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Courses</h2>
        <button style={styles.button} onClick={() => setShowForm(true)}>+ Add Course</button>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3>{editCourse ? 'Edit Course' : 'Add New Course'}</h3>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="Course Name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input style={styles.input} placeholder="Course Code" value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })} required />
            <input style={styles.input} placeholder="Description" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div style={styles.formButtons}>
              <button style={styles.button} type="submit">{editCourse ? 'Update' : 'Save'}</button>
              <button style={styles.cancelBtn} type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div style={styles.enrollBox}>
        <h3>Enroll Student in Course</h3>
        <select style={styles.input} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">Select Course</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select style={styles.input} onChange={(e) => setSelectedStudent(e.target.value)}>
          <option value="">Select Student</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
        </select>
        <button style={styles.button} onClick={handleEnroll}>Enroll</button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Code</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} style={styles.tableRow}>
              <td style={styles.td}>{course.id}</td>
              <td style={styles.td}>{course.name}</td>
              <td style={styles.td}>{course.code}</td>
              <td style={styles.td}>{course.description}</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => handleEdit(course)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(course.id)}>Delete</button>
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
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: '#1a73e8' },
  button: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginRight: '10px' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  input: { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  formButtons: { display: 'flex', gap: '10px' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  enrollBox: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableHeader: { backgroundColor: '#1a73e8', color: 'white' },
  th: { padding: '12px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' },
  editBtn: { padding: '5px 10px', backgroundColor: '#f9a825', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
};

export default Courses;