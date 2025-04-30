import React, { useState } from 'react'
import css from './registerPage.module.css'
import axios from 'axios'

export const RegisterPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordOk, setPasswordOk] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [errPasswordOk, setErrPasswordOk] = useState('')

  const [registerState, setRegisterState] = useState('')

  const validateUsername = value => {
    if (!value) {
      setErrUsername('')
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
      setErrUsername('사용자명은 영문자로 시작하는 4글자 이상의 영문자 또는 숫자여야 합니다.')
    } else {
      setErrUsername('')
    }
  }
  const validatePassword = value => {
    if (!value) {
      setErrPassword('')
      return
    }
    if (value.length < 4) {
      setErrPassword('패스워드는 4자 이상이어야 합니다.')
    } else {
      setErrPassword('')
    }
  }
  const validatePasswordCheck = (value, current = password) => {
    if (!value) {
      setErrPasswordOk('')
      return
    }
    if (value !== current) {
      setErrPasswordOk('패스워드가 일치하지 않습니다.')
    } else {
      setErrPasswordOk('')
    }
  }
  const handleUsernameChange = e => {
    const value = e.target.value
    setUsername(value)
    validateUsername(value)
  }
  const handlePasswordChange = e => {
    const value = e.target.value
    setPassword(value)
    validatePassword(value)
  }
  const handlePasswordOkChange = e => {
    const value = e.target.value
    setPasswordOk(value)
    validatePasswordCheck(value)
  }
  const register = async e => {
    e.preventDefault()
    console.log('회원가입', username, password, passwordOk)
    validateUsername(username)
    validatePassword(password)
    validatePasswordCheck(passwordOk, password)

    if (errUsername || errPassword || errPasswordOk || !username || !password || !passwordOk) return
    try {
      setRegisterState('등록중')
      const response = await axios.post('http://localhost:3000/register', { username, password })
      console.log('회원가입 성공', response)
      setRegisterState('등록완료')
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <main className={css.registerPage}>
      <h2>회원가입 페이지</h2>
      <form className={css.container} onSubmit={register}>
        <input
          type="text"
          placeholder="사용자명"
          value={username}
          onChange={handleUsernameChange}
        />
        <strong>{errUsername}</strong>
        <input
          type="password"
          placeholder="패스워드"
          value={password}
          onChange={handlePasswordChange}
        />
        <strong>{errPassword}</strong>
        <input
          type="password"
          placeholder="패스워드 확인"
          value={passwordOk}
          onChange={handlePasswordOkChange}
        />
        <strong>{errPasswordOk}</strong>
        <button type="submit">가입하기</button>
      </form>
    </main>
  )
}
