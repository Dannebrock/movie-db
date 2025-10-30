import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'

export default function AppLayout() {
  return (
    <>
      <NavBar />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  )
}
