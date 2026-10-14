import { useEffect, useState } from "react";

interface Employee {
  id: number;
  name: string;
  age: number;
  department: string;
  salary: number;
  mobile: string | null;
}

function App() {
  const API = "http://localhost:5001/api/employees";

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    department: "",
    salary: "",
    mobile: "",
  });
  const [editId, setEditId] = useState<number | null>(null);

  // READ: Fetch all employees
  const getEmployees = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // Handle form inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // CREATE and UPDATE
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const employee = {
      ...form,
      age: Number(form.age),
      salary: Number(form.salary),
    };

    const url = editId ? `${API}/${editId}` : API;
    const method = editId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });

    if (!response.ok) {
      alert("Operation failed!");
      return;
    }

    alert(editId ? "Employee updated!" : "Employee added!");

    setForm({
      name: "",
      age: "",
      department: "",
      salary: "",
      mobile: "",
    });
    setEditId(null);
    getEmployees();
  };

  // Load employee data into the form
  const handleEdit = (employee: Employee) => {
    setEditId(employee.id);
    setForm({
      name: employee.name,
      age: String(employee.age),
      department: employee.department,
      salary: String(employee.salary),
      mobile: employee.mobile || "",
    });
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    const response = await fetch(`${API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Could not delete employee!");
      return;
    }

    alert("Employee deleted!");
    getEmployees();
  };

  return (
    <div>
      <h1>Employee Management System</h1>

      <h2>{editId ? "Update Employee" : "Add Employee"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="age"
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
        />
        <br />
        <br />

        <button type="submit">
          {editId ? "Update Employee" : "Add Employee"}
        </button>
        <br />
        <br />

        {editId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditId(null);
              setForm({
                name: "",
                age: "",
                department: "",
                salary: "",
                mobile: "",
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Employee List</h2>

      {employees.map((employee) => (
        <div key={employee.id}>
          <p>Name: {employee.name}</p>
          <br />
          <p>Age: {employee.age}</p>
          <br />
          <p>Department: {employee.department}</p>
          <br />
          <p>Salary: {employee.salary}</p>
          <br />
          <p>Mobile: {employee.mobile || "N/A"}</p>
          <br />

          <button onClick={() => handleEdit(employee)}>Edit</button>
          <br />
          <button onClick={() => handleDelete(employee.id)}>Delete</button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;