import React from 'react'
import css from './header.module.css'
import { Link, NavLink } from 'react-router-dom'

export function Header() {
  return (
    <header className={css.header}>
      <h1>
        <Link to={'/'}>TOKTOK</Link>
      </h1>
      <nav>
        <NavLink to="/register" className={({ isActive }) => (isActive ? css.active : '')}>
          회원가입
        </NavLink>
      </nav>
    </header>
  )
}
