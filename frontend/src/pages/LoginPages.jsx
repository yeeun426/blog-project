import { useState, useEffect } from 'react'
import css from './registerPage.module.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../store/useSlice'
import { loginUser } from '../apis/userApi'

export const LoginPages = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errUsername, setErrUsername] = useState('')
  const [errPassword, setErrPassword] = useState('')
  const [loginStatus, setLoginStatus] = useState('') // 로그인 상태
  const [redirect, setRedirect] = useState(false) // 로그인 상태 메시지

  const navigate = useNavigate()

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
  const login = async e => {
    e.preventDefault()
    setLoginStatus('')
    validateUsername(username)
    validatePassword(password)
    if (errPassword || errUsername || !username || !password) {
      setLoginStatus('아이디와 패스워드를 확인하세요.')
      return
    }
    try {
      const userData = await loginUser({ username, password })

      if (userData) {
        setLoginStatus('로그인 성공')
        dispatch(setUserInfo(userData))
        setRedirect(true)
      }
    } catch (error) {
      console.error('로그인 오류---', error)
      return
    } finally {
      setLoginStatus(false)
    }
  }
  useEffect(() => {
    if (redirect) {
      navigate('/')
    }
  }, [redirect, navigate])

  return (
    <main className={css.loginpage}>
      <h2>로그인 페이지</h2>
      {loginStatus && <strong>{loginStatus}</strong>}
      <form className={css.container} onSubmit={login}>
        <input value={username} onChange={handleUsernameChange} type="text" placeholder="아이디" />
        <strong>{errUsername}</strong>
        <input
          value={password}
          onChange={handlePasswordChange}
          type="password"
          placeholder="패스워드"
        />
        <strong>{errPassword}</strong>
        <button type="submit">로그인</button>
      </form>
    </main>
  )
}
