import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudent, deleteStudent } from '../api/students';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phoneNumber: '', course: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data.content);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editStudent) {
        await updateStudent(editStudent.id, form);
      } else {
        await createStudent(form);
      }
      setShowForm(false);
      setEditStudent(null);
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '', course: '' });
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setEditStudent(student);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      course: student.course,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await deleteStudent(id);
      fetchStudents();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Students</h2>
        <div>
          <button style={styles.button} onClick={() => setShowForm(true)}>+ Add Student</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3>{editStudent ? 'Edit Student' : 'Add New Student'}</h3>
          <form onSubmit={handleSubmit}>
            <input style={styles.input} placeholder="First Name" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            <input style={styles.input} placeholder="Last Name" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            <input style={styles.input} placeholder="Email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input style={styles.input} placeholder="Phone Number" value={form.phoneNumber}
              onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
            <select style={styles.input} value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })} required>
              <option value="">Select Course</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Education">Education</option>
              <option value="Engineering">Engineering</option>
              <option value="Arts">Arts</option>
              <option value="Nursing">Nursing</option>
            </select>
            <div style={styles.formButtons}>
              <button style={styles.button} type="submit">{editStudent ? 'Update' : 'Save'}</button>
              <button style={styles.cancelBtn} type="button" onClick={() => {
                setShowForm(false); setEditStudent(null);
              }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>First Name</th>
            <th style={styles.th}>Last Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Phone</th>
            <th style={styles.th}>Course</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} style={styles.tableRow}>
              <td style={styles.td}>{student.id}</td>
              <td style={styles.td}>{student.firstName}</td>
              <td style={styles.td}>{student.lastName}</td>
              <td style={styles.td}>{student.email}</td>
              <td style={styles.td}>{student.phoneNumber}</td>
              <td style={styles.td}>{student.course}</td>
              <td style={styles.td}>
                <button style={styles.editBtn} onClick={() => handleEdit(student)}>Edit</button>
                <button style={styles.deleteBtn} onClick={() => handleDelete(student.id)}>Delete</button>
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
  logoutBtn: { padding: '10px 20px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '20px' },
  input: { display: 'block', width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  formButtons: { display: 'flex', gap: '10px' },
  cancelBtn: { padding: '10px 20px', backgroundColor: '#999', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  tableHeader: { backgroundColor: '#1a73e8', color: 'white' },
  th: { padding: '12px', textAlign: 'left' },
  tableRow: { borderBottom: '1px solid #eee' },
  td: { padding: '12px' },
  editBtn: { padding: '5px 10px', backgroundColor: '#f9a825', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#e53935', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' },
};

export default Students;