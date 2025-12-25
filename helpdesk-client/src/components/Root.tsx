import { Outlet, Link } from 'react-router-dom';

function Root() {
  return (
    <div>
      <nav style={{ padding: '20px', background: '#333', color: 'white' }}>
        <Link to="/dashboard" style={{ margin: '0 10px', color: 'white' }}>
          Dashboard
        </Link>
        <Link to="/tickets" style={{ margin: '0 10px', color: 'white' }}>
          Tickets
        </Link>
        <Link to="/login" style={{ margin: '0 10px', color: 'white' }}>
          Login
        </Link>
        <Link to="/register" style={{ margin: '0 10px', color: 'white' }}>
          Register
        </Link>
      </nav>

      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Root;