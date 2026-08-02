import { useState } from "react";

function Login({ onLogin, onRegister }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:8080/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Invalid username or password");
            }

            const data = await response.json();

            onLogin(data.token);

        } catch (error) {
            console.error(error);
            setError("Invalid username or password");
        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>Employee Management</h1>

                <p>Sign in to continue</p>

                <form onSubmit={handleSubmit}>

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

                    <button
                        type="submit"
                        className="add-button"
                    >
                        Login
                    </button>

                </form>

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}

                <p>
                    Don't have an account?{" "}

                    <button
                        type="button"
                        onClick={onRegister}
                    >
                        Create Account
                    </button>
                </p>

            </div>

        </div>
    );
}

export default Login;