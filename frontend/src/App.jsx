import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [amt, setAmt] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [edit_id, setEdit_id] = useState('');
  const [expenses, setExpenses] = useState([]);

  console.log(Number(amt))

  useEffect(() => {
    fetch('http://localhost:3000/api/expenses')
    .then((res) => res.json())
    .then((data) => setExpenses(data));
  }, []);

  console.log({expenses})

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAmtChange = (e) => {
    setAmt(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      fetch(`http://localhost:3000/api/expenses/${edit_id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ title: title, amt: Number(amt) }),
      })
      .then((res) => res.json())
      .then((data) => {
        setExpenses(expenses.map((expense) => (expense._id === edit_id ? data : expense)));
        setIsEdit(false);
        setEdit_id('');
      })
    } else {
      fetch('http://localhost:3000/api/expenses', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({ title: title, amt: Number(amt) }),
      })
      .then((res) => res.json())
      .then((data) => setExpenses([...expenses, data]))
    }
    setTitle('');
    setAmt('');
  };
  

  const handleEdit = (_id) => {
    setIsEdit(true);
    const editObj = expenses.find((expense) => expense._id === _id);
    setAmt(editObj.amt.toString());
    setTitle(editObj.title);
    setEdit_id(editObj._id);
  };
  
  const handleDelete = (_id) => {
    fetch(`http://localhost:3000/api/expenses/${_id}`, {
      method: 'DELETE',
    })
    .then(() => setExpenses(expenses.filter((expense) => expense._id !== _id)))
    .catch((error) => console.error('Error deleting expense:', error));
  };
  
  let sum = 0;
  const tot = expenses.map((exp) => (sum += exp.amt));
  console.log(sum);

  return (
    <>
    <h1>Expense Tracker</h1>
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter expense name"
            className="input-field"
          />
          <input
            type="number"
            value={amt}
            onChange={handleAmtChange}
            placeholder="Enter expense amount"
            className="input-field"
          />
          <button type="submit" class="btn-s">
            {isEdit == true ? 'Update' : 'Add Expense'}
          </button>
        </form>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Remove / Edit</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={index}>
                <td>{expense.title}</td>
                <td>{expense.amt}</td>
                <td>
                  <button class= 'btn-d' onClick={() => handleDelete(expense._id)}>Delete</button>
                  <button class= 'btn-e' onClick={() => handleEdit(expense._id)}>Edit</button>
                </td>
              </tr>
            ))}
            <tr>
              <td>Balance</td>
              <td>{sum}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
