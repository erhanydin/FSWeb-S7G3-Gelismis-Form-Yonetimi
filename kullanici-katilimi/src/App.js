import React, { useState, useEffect } from 'react';
import * as yup from "yup";
import axios from 'axios';

import logo from './logo.svg';
import './App.css';

const schema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required"),
  email: yup
    .string()
    .email(),
  password: yup.string().min(5, "Your password should contain min 5 chars"),
  conditions: yup
    .mixed().oneOf([true], "You must agree to all conditions")
})

function App() {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    conditions: false,
  })

  const [disabled, setDisabled] = useState(true);
  const [sonuc, setSonuc] = useState(null);

  const [formError, setFormError] = useState({
    name: '',
    email: '',
    password: '',
    conditions: '',
  })

  useEffect(() => {
    schema.isValid(formData).then((valid) => setDisabled(!valid));
  }, [formData]);

  const checkFormErrors = (name, value) => {
    yup
      .reach(schema, name)
      .validate(value)
      .then(() => {
        setFormError({
          ...formError,
          [name]: ""
        })
      })
      .catch(err => {
        console.log("hata: ", err);
        setFormError({
          ...formError,
          [name]: err.errors[0]
        })
      })

  }

  const handleFormChange = (event) => {
    const { checked, name, value, type } = event.target;
    const valueToUse = type === "checkbox" ? checked : value;

    checkFormErrors(name, valueToUse);

    setFormData({
      ...formData,
      [name]: valueToUse
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const newUser = {
      name: formData.name.trim(),
      email: formData.email,
      password: formData.password,
      conditions: formData.conditions
    };

    axios
      .post("https://reqres.in/api/user", newUser)
      .then((res) => {

        setSonuc(res.data.id);

        setFormData({
          name: "",
          email: "",
          password: "",
          conditions: false
        });
      })
      .catch((err) => {});
  }

  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            <span>Ad Soyad: </span>
            <input
              type="text"
              name="name"
              placeholder="Adinizi ve soyadinizi giriniz"
              value={formData.name}
              onChange={handleFormChange}
            />
          </label>
        </p>
        <p>
          <label>
            <span>Email: </span>
            <input
              type="email"
              name="email"
              placeholder="Email adresinizi giriniz"
              value={formData.email}
              onChange={handleFormChange}
            />
          </label>
        </p>
        <p>
          <label>
            <span>Şifre: </span>
            <input
              type="password"
              name="password"
              placeholder="Şifrenizi giriniz"
              value={formData.password}
              onChange={handleFormChange}
            />
          </label>
        </p>
        <p>
          <label>
            <span>Kullanim şartlari: </span>
            <input
              type="checkbox"
              name="conditions"
              checked={formData.conditions}
              onChange={handleFormChange}
            />
          </label>
        </p>
        <p>
          <input type="Submit" value="Send" disabled={disabled}/>
        </p>
        <p>
          <div style={{ color: "red" }}>
            <div>{formError.name}</div>
            <div>{formError.email}</div>
            <div>{formError.password}</div>
            <div>{formError.conditions}</div>
          </div>
        </p>
        {sonuc && <div>{sonuc}</div>}
      </form>
    </div>
  );
}

export default App;
