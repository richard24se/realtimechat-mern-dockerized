import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ cpf: "", password: "" });
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { cpf, password } = values;
    if (cpf === "") {
      toast.error("CPF e senha são obrigatórios.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("CPF e senha são obrigatórios.", toastOptions);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const { cpf, password } = values;
      const { data } = await axios.post(loginRoute, {
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
            <h1>Login</h1>
          </div>
          <input
            type="text"
            placeholder="CPF"
            name="cpf"
            onChange={(e) => {
              handleChange(e);
              handleCpfChange(e);
            }}
            min="3"
          />
          <input
            type="password"
            placeholder="Senha"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Entrar</button>
          <span>
            Ainda não tem uma conta ? <Link to="/register">Criar uma.</Link>
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

    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid rgb(33 140 185 / 42%);
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
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
