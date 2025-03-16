import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { loginUser, registerUser } from "../api/index";
import { Button, TextField, Container, Box, Typography } from "@mui/material";

const AuthPage = () => {
  const { login } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    if (isLogin) {
      const response = await loginUser(email, password);

      if (response.token) {
        login(response.token);
      } else {
        throw new Error("Invalid response from server");
      }
    } else {
      await registerUser(email, password);
      setIsLogin(true);
    }
  } catch (error) {
    console.error("Auth error:", error);
    setError("Invalid login or password");
  }
};

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" align="center" gutterBottom>
          {isLogin ? "Login" : "Register"}
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Пароль"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {isLogin ? "Login" : "Register"}
          </Button>
        </form>
        <Typography align="center" sx={{ mt: 2 }}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Button onClick={() => setIsLogin((prev) => !prev)}>
            {isLogin ? "Register" : "Login"}
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default AuthPage;
