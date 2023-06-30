import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";

export default function Register() {
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    cpf: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, cpf } = values;
    if (password !== confirmPassword) {
      toast.error(
        "A senha e a confirmação de senha devem ser idênticas.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "O nome de usuário deve conter mais de 3 caracteres.",
        toastOptions
      );
      return false;
    } else if (password.length < 3) {
      toast.error("A senha deve conter mais de 3 caracteres.", toastOptions);
      return false;
    } else if (cpf === "") {
      toast.error("CPF é obrigatório.", toastOptions);
      return false;
    } else if (cpf.length != 14) {
      toast.error("O CPF deve conter 11 números.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { cpf, username, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        cpf,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        navigate("/");
      }
    }
  };
  const handleCpfChange = (e) => {
    const { value } = e.target;
    let formattedCPF = value.replace(/\D/g, ""); // Remove caracteres não numéricos

    if (formattedCPF.length > 11) {
      formattedCPF = formattedCPF.slice(0, 11);
    }

    if (formattedCPF.length > 3 && formattedCPF.length <= 6) {
      formattedCPF = `${formattedCPF.slice(0, 3)}.${formattedCPF.slice(3)}`;
    } else if (formattedCPF.length > 6 && formattedCPF.length <= 9) {
      formattedCPF = `${formattedCPF.slice(0, 3)}.${formattedCPF.slice(
        3,
        6
      )}.${formattedCPF.slice(6)}`;
    } else if (formattedCPF.length > 9) {
      formattedCPF = `${formattedCPF.slice(0, 3)}.${formattedCPF.slice(
        3,
        6
      )}.${formattedCPF.slice(6, 9)}-${formattedCPF.slice(9)}`;
    }
    e.target.value = formattedCPF;
    setValues({ ...values, cpf: formattedCPF });
  };

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <h1>Registrar</h1>
          </div>
          <input
            type="text"
            placeholder="Usuário"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="text"
            placeholder="CPF"
            name="cpf"
            onChange={(e) => {
              handleChange(e);
              handleCpfChange(e);
            }}
          />
          <input
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirmar Senha"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Criar conta</button>
          <span>
            Já tem uma conta ? <Link to="/login">Entrar.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: rgb(32 32 40 / 0%);
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      align-self: left;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;

    backdrop-filter: blur(15px) saturate(100%);
    -webkit-backdrop-filter: blur(15px) saturate(100%);
    background-color: rgba(0, 0, 0, 0.07);
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.125);

    // border: 1px solid rgba(255, 255, 255, 0.18);
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    // border: 0.1rem solid rgb(63 89 194);
    border: 0.1rem solid rgb(33 140 185 / 42%);
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      // box-shadow: 0px 1px 10px 0 rgb(63 89 194);
      border: 0.1rem solid rgb(33 140 185 / 82%);
      outline: none;
    }
  }
  button {
    background-color: rgb(63 127 194);
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: rgb(63 127 194 / 41%);
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #00a3d0;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
