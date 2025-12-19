import { useState, useEffect } from 'react';
import '../App.css';
import '../Styles/Billing.css';
import { api } from '../utils/api';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [members, setMembers] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [showAddBillModal, setShowAddBillModal] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    memberName: '',
    gymId: '',
    gymName: '',
    plan: 'Basic',
    amount: '',
    dueDate: '',
    paymentMethod: ''
  });

  useEffect(() => {
    loadMembers();
    loadGyms();
    setLoading(false);
  }, []);

  const loadBills = async () => {
    try {
      const data = await api.getBills();
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
      alert('Failed to load billing data');
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

  const loadGyms = async () => {
    try {
      const data = await api.getGyms();
      setGyms(data);
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  const handleGenerateInvoice = async (billId) => {
    try {
      const response = await api.generateInvoice(billId);
      if (response.invoice) {
        setSelectedInvoice(response.invoice);
        setShowInvoiceModal(true);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    }
  };

  const handleSendReminder = async (billId) => {
    if (window.confirm('Send payment reminder via email?')) {
      try {
        const response = await api.sendReminder(billId);
        alert(response.message || 'Reminder sent successfully');
      } catch (error) {
        console.error('Error sending reminder:', error);
        alert('Failed to send reminder');
      }
    }
  };

  const handleAddBill = () => {
    setFormData({
      memberId: '',
      memberName: '',
      gymId: '',
      gymName: '',
      plan: 'Basic',
      amount: '',
      dueDate: '',
      paymentMethod: ''
    });
    setShowAddBillModal(true);
  };

  const handleMemberChange = (memberId) => {
    const member = members.find(m => m._id === memberId);
    if (member) {
      setFormData({
        ...formData,
        memberId: member._id,
        memberName: member.name,
        plan: member.plan
      });
    }
  };

  const handleGymChange = (gymId) => {
    const gym = gyms.find(g => g._id === gymId);
    if (gym) {
      setFormData({
        ...formData,
        gymId: gym._id,
        gymName: gym.gymName
      });
    }
  };

  const handleSubmitBill = async (e) => {
    e.preventDefault();
    try {
      const newBill = await api.createBill(formData);
      alert('Bill created successfully');
      setShowAddBillModal(false);
      setBills([...bills, newBill]);
    } catch (error) {
      console.error('Error creating bill:', error);
      alert('Failed to create bill');
    }
  };

  const handleUpdateBillStatus = async (billId, status) => {
    try {
      const updatedBill = await api.updateBill(billId, { status, paymentMethod: formData.paymentMethod || 'Cash' });
      setBills(bills.map(bill => bill._id === billId ? updatedBill : bill));
      alert('Bill status updated');
    } catch (error) {
      console.error('Error updating bill:', error);
      alert('Failed to update bill');
    }
  };

  const printInvoice = () => {
    window.print();
  };

  const filteredBills = bills.filter(bill => {
    return statusFilter === 'All Status' || bill.status === statusFilter;
  });

  const stats = {
    totalRevenue: bills.filter(b => b.status === 'Paid').reduce((sum, b) => sum + (b.amount || 0), 0),
    paidThisMonth: bills.filter(b => {
      if (b.status !== 'Paid' || !b.paidAt) return false;
      const paidDate = new Date(b.paidAt);
      const now = new Date();
      return paidDate.getMonth() === now.getMonth() && paidDate.getFullYear() === now.getFullYear();
    }).reduce((sum, b) => sum + (b.amount || 0), 0),
    pending: bills.filter(b => b.status === 'Pending').reduce((sum, b) => sum + (b.amount || 0), 0),
    overdue: bills.filter(b => b.status === 'Overdue').reduce((sum, b) => sum + (b.amount || 0), 0)
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div className="billing-background">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Billing & Payments</h1>
          <div className="user-profile">
            <button 
              onClick={loadBills}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#3498DB', color: 'white', cursor: 'pointer', marginRight: '10px' }}
            >
              ↻ Load Bills
            </button>
            <button 
              onClick={handleAddBill}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#8E44AD', color: 'white', cursor: 'pointer', marginRight: '10px' }}
            >
              + Add Bill
            </button>
            <button 
              onClick={() => handleGenerateInvoice(bills[0]?._id)}
              disabled={bills.length === 0}
              style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#8E44AD', color: 'white', cursor: bills.length === 0 ? 'not-allowed' : 'pointer' }}
            >
              Generate Invoice
            </button>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card" style={{ borderLeftColor: '#8E44AD', background: 'linear-gradient(135deg, rgba(142, 68, 173, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(142, 68, 173, 0.2)' }}>
            <div className="stat-title">Total Revenue</div>
            <div className="stat-value" style={{ color: '#8E44AD' }}>₹{stats.totalRevenue.toLocaleString()}</div>
            <div className="stat-change" style={{ color: '#9B59B6' }}>All time</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#9B59B6', background: 'linear-gradient(135deg, rgba(155, 89, 182, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(155, 89, 182, 0.2)' }}>
            <div className="stat-title">Paid This Month</div>
            <div className="stat-value" style={{ color: '#9B59B6' }}>₹{stats.paidThisMonth.toLocaleString()}</div>
            <div className="stat-change" style={{ color: '#AF7AC5' }}>{bills.filter(b => b.status === 'Paid').length} payments</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#AF7AC5', background: 'linear-gradient(135deg, rgba(175, 122, 197, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(175, 122, 197, 0.2)' }}>
            <div className="stat-title">Pending Amount</div>
            <div className="stat-value" style={{ color: '#AF7AC5' }}>₹{stats.pending.toLocaleString()}</div>
            <div className="stat-change" style={{ color: '#BB8FCE' }}>{bills.filter(b => b.status === 'Pending').length} pending bills</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#BB8FCE', background: 'linear-gradient(135deg, rgba(187, 143, 206, 0.15), rgba(255, 255, 255, 0.95))', boxShadow: '0 8px 32px rgba(187, 143, 206, 0.2)' }}>
            <div className="stat-title">Overdue Amount</div>
            <div className="stat-value" style={{ color: '#BB8FCE' }}>₹{stats.overdue.toLocaleString()}</div>
            <div className="stat-change" style={{ color: '#8E44AD' }}>{bills.filter(b => b.status === 'Overdue').length} overdue bills</div>
          </div>
        </div>

        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 className="card-title">Recent Transactions</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}
              >
                <option>All Status</option>
                <option>Paid</option>
                <option>Pending</option>
                <option>Overdue</option>
              </select>
            </div>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Member</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Gym</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Plan</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Due Date</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Method</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '500' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                      No bills found
                    </td>
                  </tr>
                ) : (
                  (filteredBills || []).map((bill) => (
                    <tr key={bill._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#8E44AD', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>
                            {(bill.memberName || bill.memberId?.name || 'M').charAt(0)}
                          </div>
                          {bill.memberName || bill.memberId?.name}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>
                        {bill.gymName || bill.gymId?.gymName || 'N/A'}
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{bill.plan}</td>
                      <td style={{ padding: '12px', fontWeight: '500' }}>₹{bill.amount}</td>
                      <td style={{ padding: '12px', color: '#666' }}>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500',
                          background: bill.status === 'Paid' ? '#E8F5E8' : bill.status === 'Pending' ? '#FFF3E0' : '#FFEBEE',
                          color: bill.status === 'Paid' ? '#27AE60' : bill.status === 'Pending' ? '#F39C12' : '#E74C3C'
                        }}>
                          {bill.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#666' }}>{bill.paymentMethod || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => handleGenerateInvoice(bill._id)}
                            style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#27AE60', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Invoice
                          </button>
                          {bill.status !== 'Paid' && (
                            <>
                              <button 
                                onClick={() => handleSendReminder(bill._id)}
                                style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#3498DB', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                              >
                                Remind
                              </button>
                              <button 
                                onClick={() => handleUpdateBillStatus(bill._id, 'Paid')}
                                style={{ padding: '4px 8px', border: 'none', borderRadius: '4px', background: '#8E44AD', color: 'white', cursor: 'pointer', fontSize: '12px' }}
                              >
                                Collect
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <h2 style={{ color: '#8E44AD', marginBottom: '10px' }}>INVOICE</h2>
              <p style={{ color: '#666' }}>Invoice #{selectedInvoice.invoiceNumber}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h4>Bill To:</h4>
                  <p>{selectedInvoice.memberName}</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>{selectedInvoice.memberEmail}</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>{selectedInvoice.memberPhone}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4>Gym:</h4>
                  <p>{selectedInvoice.gymName}</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>Date: {selectedInvoice.date}</p>
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #ddd' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Description</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px' }}>{selectedInvoice.plan} Membership</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: '500' }}>₹{selectedInvoice.amount}</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid #ddd' }}>
                    <td style={{ padding: '10px', fontWeight: '600' }}>Total</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: '600', fontSize: '18px', color: '#8E44AD' }}>
                      ₹{selectedInvoice.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
              <p><strong>Status:</strong> {selectedInvoice.status}</p>
              {selectedInvoice.paymentMethod && (
                <p><strong>Payment Method:</strong> {selectedInvoice.paymentMethod}</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowInvoiceModal(false)}
                style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
              >
                Close
              </button>
              <button
                onClick={printInvoice}
                style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#8E44AD', color: 'white', cursor: 'pointer' }}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Bill Modal */}
      {showAddBillModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            width: '90%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px' }}>Add New Bill</h2>
            <form onSubmit={handleSubmitBill}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Member</label>
                <select
                  required
                  value={formData.memberId}
                  onChange={(e) => handleMemberChange(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="">Select Member</option>
                  {members.map(member => (
                    <option key={member._id} value={member._id}>{member.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Gym</label>
                <select
                  required
                  value={formData.gymId}
                  onChange={(e) => handleGymChange(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="">Select Gym</option>
                  {gyms.map(gym => (
                    <option key={gym._id} value={gym._id}>{gym.gymName}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Plan</label>
                <select
                  required
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="Basic">Basic</option>
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Due Date</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                >
                  <option value="">Select Method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowAddBillModal(false)}
                  style={{ padding: '10px 20px', border: '1px solid #ddd', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#8E44AD', color: 'white', cursor: 'pointer' }}
                >
                  Add Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
