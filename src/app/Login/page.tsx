"use client";
// Header is hidden on this page
import loginStyles from "./Login.module.css";
import { url } from "@/globals";
import { Dispatch, SetStateAction, useState } from "react";
import { isAdmin } from "../utils/credentials";
// This function handles form submission and should be client-side
async function handleSubmit(
  event: React.FormEvent<HTMLFormElement>,
  setMsg: Dispatch<SetStateAction<string>>
) {
  event.preventDefault();
  try {
    const formData = new FormData(event.currentTarget);
    const formUsername = formData.get("username");
    const formPassword = formData.get("password");

    let loginUrl = url;
    loginUrl.pathname = "/login";
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: formUsername, password: formPassword }),
    });
    const data = await response.json();
    if (response.status === 429) {
      setMsg("Prekoračen je broj pokušaja. Pokušajte ponovo za par minuta.");
      return;
    }
    if (response.status === 401) {
      setMsg("Netčno korisničko ime ili lozinka.");
      return;
    }
    setMsg(data.message);
    const { id, token, username, role } = data.info;
    localStorage.setItem("id", id);
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    // Redirect to dashboard if user is admin
    window.location.href = isAdmin(role) ? "../Dashboard" : "/";
  } catch (error) {}
}

// ErrorMessage component needs to be client-side because it handles dynamic content
function ErrorMessage({ message }: { message: string }) {
  "use client";
  return (
    <div id="message">
      <p>{message}</p>
    </div>
  );
}
function LoginButton() {
  return (
    <button className={loginStyles["submit-btn"]} type="submit">
      Prijava
    </button>
  );
}
// LoginForm component handles user input and should be client-side
function LoginForm() {
  "use client";
  const [message, setMessage] = useState<string>("");
  return (
    <form onSubmit={(event) => handleSubmit(event, setMessage)} id="loginForm">
      <input
        autoComplete="username"
        type="text"
        id="username"
        name="username"
        placeholder="Korisničko ime"
        className={loginStyles["username-input"]}
        autoFocus
      />
      <br />
      <input
        autoComplete="current-password"
        type="password"
        id="password"
        name="password"
        placeholder="Lozinka"
        className={loginStyles["password-input"]}
      />
      <br />
      <br />
      <LoginButton />
      <ErrorMessage message={message} />
    </form>
  );
}

// Main Login component can be server-side
export default function Login() {
  return (
    <div className={loginStyles["form-container"]}>
      <LoginForm />
    </div>
  );
}
