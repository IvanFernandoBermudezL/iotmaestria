import React from 'react';
import { NavLink } from 'react-router-dom';
import * as Faicons from 'react-icons/fa'

const Sidebar = () => {
  return (
    <div className="sidebar bg-light">
      <ul>
        <li>
          <NavLink to="/" exact className="text-dark rounded py-2 w-100 d-inline-block px-3" 
          activeClassName="active"><Faicons.FaHornbill/>Home</NavLink>
        </li>
        <li>
          <NavLink to="/consulta" exact className="text-dark rounded py-2 w-100 d-inline-block px-3" 
          activeClassName="active"><Faicons.FaRegChartBar className='mr-2'/>Consulta</NavLink>
        </li>
        <li>
          <NavLink to="/clients" exact className="text-dark rounded py-2 w-100 d-inline-block px-3" 
          activeClassName="active"><Faicons.FaUserFriends className='mr-2'/>Clients</NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;