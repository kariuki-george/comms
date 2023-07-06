import React from 'react'


interface Props{
    children: React.ReactNode
}

const Header = ({children}:Props) => {
  return (
    <div>{children}</div>
  )
}

export default Header