import { useState, useEffect } from 'react';
import '../App.css';
import '../Styles/Attendance.css';
import { api } from '../utils/api';

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newAttendance, setNewAttendance] = useState({ 
    memberId: '', 
    memberName: '',
    status: 'Present',
    sessionType: 'Manual'
  });

  useEffect(() => {
    // Don't auto-load attendance and members on page load
    // User can manually load them if needed
    setLoading(false);
  }, []);

  const loadAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const data = await api.getAttendance(today);
      setAttendanceData(data);
    } catch (error) {
      console.error('Error loading attendance:', error);
      alert('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const data = await api.getMembers();
      setMembers(data);
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleMemberChange = (memberId) => {
    const member = members.find(m => m._id === memberId);
    if (member) {
      setNewAttendance({
        ...newAttendance,
        memberId: member._id,
        memberName: member.name
      });
    }
  };

  const markAttendance = async () => {
    if (!newAttendance.memberId) {
      alert('Please select a member');
      return;
    }

    try {
      await api.createAttendance(newAttendance);
      alert('Attendance marked successfully');
      setNewAttendance({ memberId: '', memberName: '', status: 'Present', sessionType: 'Manual' });
      setShowModal(false);
      loadAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    }
  };

  const stats = {
    present: attendanceData.filter(a => a.status === 'Present').length,
    late: attendanceData.filter(a => a.status === 'Late').length,
    absent: 0, // This would need to be calculated based on all members
    attendanceRate: attendanceData.length > 0 
      ? ((attendanceData.filter(a => a.status === 'Present').length / attendanceData.length) * 100).toFixed(1)
      : 0
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="attendance-background">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Attendance Tracking</h1>
          <div className="user-profile">
            <button 
              onClick={loadMembers}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#4ECDC4', color: 'white', cursor: 'pointer', marginRight: '10px', fontWeight: '500' }}
            >
              Load Members
            </button>
            <button 
              onClick={async () => { 
                await loadMembers(); 
                setShowModal(true); 
              }}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#34495E', color: 'white', cursor: 'pointer', fontWeight: '500' }}
            >
              + Mark Attendance
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: '#45B7D1', background: 'linear-gradient(135deg, rgba(69, 183, 209, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(69, 183, 209, 0.2)' }}>
            <div className="stat-title">Total Present</div>
            <div className="stat-value" style={{ color: '#45B7D1' }}>{stats.present}</div>
            <div className="stat-change" style={{ color: '#1E90FF' }}>Today</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#1E90FF', background: 'linear-gradient(135deg, rgba(30, 144, 255, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(30, 144, 255, 0.2)' }}>
            <div className="stat-title">Late Arrivals</div>
            <div className="stat-value" style={{ color: '#1E90FF' }}>{stats.late}</div>
            <div className="stat-change" style={{ color: '#4169E1' }}>Today</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#4169E1', background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(65, 105, 225, 0.2)' }}>
            <div className="stat-title">Total Records</div>
            <div className="stat-value" style={{ color: '#4169E1' }}>{attendanceData.length}</div>
            <div className="stat-change" style={{ color: '#6495ED' }}>Today</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#6495ED', background: 'linear-gradient(135deg, rgba(100, 149, 237, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(100, 149, 237, 0.2)' }}>
            <div className="stat-title">Attendance Rate</div>
            <div className="stat-value" style={{ color: '#6495ED' }}>{stats.attendanceRate}%</div>
            <div className="stat-change" style={{ color: '#45B7D1' }}>Today</div>
          </div>
        </div>

        <div className="chart-card" style={{ background: 'linear-gradient(135deg, rgba(69, 183, 209, 0.03), rgba(255, 255, 255, 0.97))', border: '1px solid rgba(69, 183, 209, 0.15)', boxShadow: '0 10px 30px rgba(69, 183, 209, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title" style={{ color: '#45B7D1', fontSize: '20px', fontWeight: '600' }}>Today's Attendance</h3>
            <button 
              onClick={() => setShowModal(true)}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#4CAF50', color: 'white', cursor: 'pointer' }}
            >
              Mark Attendance
            </button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Member Name</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Check-in Time</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Session Type</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No attendance records for today
                    </td>
                  </tr>
                ) : (
                  (attendanceData || []).map((record) => (
                    <tr key={record._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', color: '#333' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e3f2fd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                            {(record.memberName || record.memberId?.name || 'M').charAt(0)}
                          </div>
                          {record.memberName || record.memberId?.name}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>
                        {new Date(record.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          background: record.status === 'Present' ? '#e8f5e8' : record.status === 'Late' ? '#fff3cd' : '#ffebee',
                          color: record.status === 'Present' ? '#28a745' : record.status === 'Late' ? '#856404' : '#dc3545'
                        }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{record.sessionType}</td>
                      <td style={{ padding: '12px' }}>
                        <button 
                          onClick={async () => {
                            const memberId = record.memberId?._id || record.memberId || record.member?._id || record.member;
                            console.log('Deleting member with ID:', memberId, 'Full record:', record);
                            if (window.confirm('Delete this member? This will remove the member and their attendance records from the system.')) {
                              try {
                                if (memberId) {
                                  await api.deleteMember(memberId);
                                  alert('Member deleted successfully');
                                  // Remove the deleted record from attendance data
                                  setAttendanceData(attendanceData.filter(r => r.memberId?._id !== memberId && r.memberId !== memberId));
                                  await loadMembers();
                                } else {
                                  alert('Cannot delete: Member ID not found. Record data: ' + JSON.stringify(record));
                                }
                              } catch (error) {
                                console.error('Error deleting member:', error);
                                alert('Failed to delete member: ' + error.message);
                              }
                            }
                          }}
                          style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#ffebee', color: '#dc3545', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Delete Member
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h3 style={{ marginBottom: '20px' }}>Mark Attendance</h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Member</label>
              <select
                value={newAttendance.memberId}
                onChange={(e) => handleMemberChange(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="">Select Member</option>
                {members.map(member => (
                  <option key={member._id} value={member._id}>{member.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Status</label>
              <select
                value={newAttendance.status}
                onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Session Type</label>
              <select
                value={newAttendance.sessionType}
                onChange={(e) => setNewAttendance({ ...newAttendance, sessionType: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewAttendance({ memberId: '', memberName: '', status: 'Present', sessionType: 'Manual' });
                }}
                style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={markAttendance}
                style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#4CAF50', color: 'white', cursor: 'pointer' }}
              >
                Mark
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
