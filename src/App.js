import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from '../src/components/Navbar'
import Sidebar from '../src/components/Sidebar'
import Home from './pages/Home'
import Consulta from './pages/Consulta'
import Clients from './pages/Clients'


import './App.scss';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route exact path='/' element={< Home />}/>
            <Route exact path='/Consulta' element={< Consulta />}/>
            <Route exact path='/Clients' element={< Clients />}/>
          </Routes>           
        </div>
      </div> 
     </Router>
  );
}

export default App;
