import { useEffect, useState } from "react";
import "./App.css";
import Login from "./Login";
import Register from "./Register";

function App() {
    const [employees, setEmployees] = useState([]);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // AI Assistant
    const [aiQuestion, setAiQuestion] = useState("");
    const [aiAnswer, setAiAnswer] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // Login / Register
    const [showRegister, setShowRegister] = useState(false);

    // JWT token
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const emptyEmployee = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        salary: ""
    };

    const [employeeForm, setEmployeeForm] =
        useState(emptyEmployee);

    // =========================
    // LOGIN
    // =========================

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setShowRegister(false);
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");

        setToken(null);
        setEmployees([]);
        setError("");
        setShowForm(false);
        setEditingId(null);
        setSearchTerm("");

        setAiQuestion("");
        setAiAnswer("");
    };

    // =========================
    // LOAD EMPLOYEES
    // =========================

    const loadEmployees = async () => {
        try {
            const response = await fetch(
                "https://ai-employee-management-system-1.onrender.com/employees",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (
                response.status === 401 ||
                response.status === 403
            ) {
                localStorage.removeItem("token");
                setToken(null);

                throw new Error("Session expired");
            }

            if (!response.ok) {
                throw new Error("Unable to load employees");
            }

            const data = await response.json();

            setEmployees(data);
            setError("");

        } catch (error) {
            console.error(error);

            if (error.message !== "Session expired") {
                setError("Could not connect to backend");
            }
        }
    };

    useEffect(() => {
        if (token) {
            loadEmployees();
        }
    }, [token]);

    // =========================
    // HANDLE FORM INPUT
    // =========================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setEmployeeForm({
            ...employeeForm,
            [name]: value
        });
    };

    // =========================
    // OPEN ADD FORM
    // =========================

    const openAddForm = () => {
        setEditingId(null);
        setEmployeeForm(emptyEmployee);
        setShowForm(true);
    };

    // =========================
    // CANCEL FORM
    // =========================

    const cancelForm = () => {
        setShowForm(false);
        setEditingId(null);
        setEmployeeForm(emptyEmployee);
    };

    // =========================
    // ADD EMPLOYEE
    // =========================

    const handleAddEmployee = async () => {
        try {
            const response = await fetch(
                "https://ai-employee-management-system-1.onrender.com/employees",
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...employeeForm,
                        salary: Number(employeeForm.salary)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add employee");
            }

            const savedEmployee = await response.json();

            setEmployees((previousEmployees) => [
                ...previousEmployees,
                savedEmployee
            ]);

            setEmployeeForm(emptyEmployee);
            setShowForm(false);
            setError("");

        } catch (error) {
            console.error(error);
            setError("Unable to add employee");
        }
    };

    // =========================
    // EDIT EMPLOYEE
    // =========================

    const handleEditEmployee = (employee) => {
        setEditingId(employee.id);

        setEmployeeForm({
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            email: employee.email || "",
            phone: employee.phone || "",
            designation: employee.designation || "",
            salary: employee.salary || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // UPDATE EMPLOYEE
    // =========================

    const handleUpdateEmployee = async () => {
        try {
            const response = await fetch(
                `https://ai-employee-management-system-1.onrender.com/employees/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        ...employeeForm,
                        salary: Number(employeeForm.salary)
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update employee");
            }

            const updatedEmployee = await response.json();

            setEmployees((previousEmployees) =>
                previousEmployees.map((employee) =>
                    employee.id === editingId
                        ? updatedEmployee
                        : employee
                )
            );

            setEmployeeForm(emptyEmployee);
            setEditingId(null);
            setShowForm(false);
            setError("");

        } catch (error) {
            console.error(error);
            setError("Unable to update employee");
        }
    };

    // =========================
    // SUBMIT ADD / UPDATE
    // =========================

    const handleSubmit = (event) => {
        event.preventDefault();

        if (editingId !== null) {
            handleUpdateEmployee();
        } else {
            handleAddEmployee();
        }
    };

    // =========================
    // DELETE EMPLOYEE
    // =========================

    const handleDeleteEmployee = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `https://ai-employee-management-system-1.onrender.com/employees/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete employee");
            }

            setEmployees((previousEmployees) =>
                previousEmployees.filter(
                    (employee) => employee.id !== id
                )
            );

            setError("");

        } catch (error) {
            console.error(error);
            setError("Unable to delete employee");
        }
    };

    // =========================
    // AI ASSISTANT
    // =========================

    const handleAskAi = async () => {
        if (!aiQuestion.trim()) {
            return;
        }

        setAiLoading(true);
        setAiAnswer("");

        try {
            const response = await fetch(
                "https://ai-employee-management-system-1.onrender.com/ai/ask",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        question: aiQuestion
                    })
                }
            );

            if (!response.ok) {
                throw new Error("AI request failed");
            }

            const data = await response.json();

            setAiAnswer(data.answer);

        } catch (error) {
            console.error(error);

            setAiAnswer(
                "Unable to get a response from the AI assistant."
            );

        } finally {
            setAiLoading(false);
        }
    };

    // =========================
    // SEARCH
    // =========================

    const filteredEmployees = employees.filter(
        (employee) => {
            const search = searchTerm.toLowerCase();

            return (
                employee.firstName
                    ?.toLowerCase()
                    .includes(search) ||

                employee.lastName
                    ?.toLowerCase()
                    .includes(search) ||

                employee.email
                    ?.toLowerCase()
                    .includes(search) ||

                employee.phone
                    ?.toLowerCase()
                    .includes(search) ||

                employee.designation
                    ?.toLowerCase()
                    .includes(search)
            );
        }
    );

    // =========================
    // DEVELOPER COUNT
    // =========================

    const developers = employees.filter((employee) =>
        employee.designation
            ?.toLowerCase()
            .includes("developer")
    ).length;

    // =========================
    // AVERAGE SALARY
    // =========================

    const averageSalary =
        employees.length > 0
            ? employees.reduce(
            (total, employee) =>
                total + (Number(employee.salary) || 0),
            0
        ) / employees.length
            : 0;

    // =========================
    // NOT LOGGED IN
    // =========================

    if (!token) {
        if (showRegister) {
            return (
                <Register
                    onBackToLogin={() =>
                        setShowRegister(false)
                    }
                />
            );
        }

        return (
            <Login
                onLogin={handleLogin}
                onRegister={() =>
                    setShowRegister(true)
                }
            />
        );
    }

    // =========================
    // DASHBOARD
    // =========================

    return (
        <div className="app">

            {/* HEADER */}

            <header className="header">

                <div>
                    <h1>Employee Management System</h1>

                    <p>
                        Manage your organization's employees
                    </p>
                </div>

                <div>

                    {!showForm ? (
                        <button
                            className="add-button"
                            onClick={openAddForm}
                        >
                            + Add Employee
                        </button>
                    ) : (
                        <button
                            className="add-button"
                            onClick={cancelForm}
                        >
                            Cancel
                        </button>
                    )}

                    {" "}

                    <button
                        className="add-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* ADD / EDIT FORM */}

            {showForm && (
                <section className="employee-section">

                    <h2>
                        {editingId !== null
                            ? "Edit Employee"
                            : "Add Employee"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={employeeForm.firstName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={employeeForm.lastName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={employeeForm.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={employeeForm.phone}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="designation"
                            placeholder="Designation"
                            value={employeeForm.designation}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="number"
                            name="salary"
                            placeholder="Salary"
                            value={employeeForm.salary}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                        <button
                            type="submit"
                            className="add-button"
                        >
                            {editingId !== null
                                ? "Update Employee"
                                : "Save Employee"}
                        </button>

                    </form>

                </section>
            )}

            {/* STATISTICS */}

            <section className="stats">

                <div className="card">
                    <h3>Total Employees</h3>
                    <h2>{employees.length}</h2>
                </div>

                <div className="card">
                    <h3>Developers</h3>
                    <h2>{developers}</h2>
                </div>

                <div className="card">
                    <h3>Average Salary</h3>
                    <h2>₹{averageSalary.toFixed(0)}</h2>
                </div>

            </section>

            {/* EMPLOYEE TABLE */}

            <section className="employee-section">

                <div className="employee-header">

                    <h2>Employees</h2>

                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                    />

                </div>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <table>

                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Designation</th>
                        <th>Salary</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>

                    {filteredEmployees.length === 0 ? (

                        <tr>
                            <td
                                colSpan="6"
                                className="empty"
                            >
                                No employees found
                            </td>
                        </tr>

                    ) : (

                        filteredEmployees.map((employee) => (

                            <tr key={employee.id}>

                                <td>
                                    {employee.firstName}{" "}
                                    {employee.lastName}
                                </td>

                                <td>{employee.email}</td>

                                <td>{employee.phone}</td>

                                <td>
                                    {employee.designation}
                                </td>

                                <td>₹{employee.salary}</td>

                                <td>

                                    <button
                                        onClick={() =>
                                            handleEditEmployee(employee)
                                        }
                                    >
                                        Edit
                                    </button>

                                    {" "}

                                    <button
                                        onClick={() =>
                                            handleDeleteEmployee(
                                                employee.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                    </tbody>

                </table>

            </section>

            {/* AI EMPLOYEE ASSISTANT */}

            <section className="employee-section ai-section">

                <div className="ai-header">

                    <div>
                        <h2>AI Employee Assistant</h2>

                        <p>
                            Ask AI questions about your employee data
                        </p>
                    </div>

                </div>

                <div className="ai-input-container">

                    <input
                        type="text"
                        placeholder="Example: Who has the highest salary?"
                        value={aiQuestion}
                        onChange={(event) =>
                            setAiQuestion(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleAskAi();
                            }
                        }}
                    />

                    <button
                        className="add-button"
                        onClick={handleAskAi}
                        disabled={aiLoading}
                    >
                        {aiLoading
                            ? "Thinking..."
                            : "Ask AI"}
                    </button>

                </div>

                {aiAnswer && (

                    <div className="ai-answer">

                        <strong>AI Answer:</strong>

                        <p>{aiAnswer}</p>

                    </div>

                )}

            </section>

        </div>
    );
}

export default App;