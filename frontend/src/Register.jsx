import { useState } from "react";

function Register({ onBackToLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("USER");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (event) => {
        event.preventDefault();

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await fetch(
                "https://ai-employee-management-system-1.onrender.com/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password,
                        role
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Registration failed");
            }

            setMessage("Registration successful! You can now login.");

            setUsername("");
            setPassword("");
            setRole("USER");

        } catch (error) {
            console.error(error);
            setError("Unable to register. Username may already exist.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <h1>Create Account</h1>

                <p>Register for Employee Management System</p>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(event) =>
                            setUsername(event.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />

                    <select
                        value={role}
                        onChange={(event) =>
                            setRole(event.target.value)
                        }
                    >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    {message && (
                        <p>{message}</p>
                    )}

                    {error && (
                        <p className="error-message">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="add-button"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>

                </form>

                <p>
                    Already have an account?{" "}

                    <button
                        type="button"
                        onClick={onBackToLogin}
                    >
                        Login
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Register;