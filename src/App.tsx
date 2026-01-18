import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './Home';
import AboutMe from './AboutMe';
import Footer from './Footer';
import Experience from './Experience';
import Project from './Project';
import ProjectDetail from './ProjectDetailPage';
import ScrollToTop from './components/ScrollToTop';
import Contact from './Contact';

function AppFrame() {
  const location = useLocation();
  const isProjectDetail = location.pathname.startsWith('/projects/');

  return (
    <div className={`app-shell ${isProjectDetail ? 'app-shell--plain' : ''}`}>
      <div className="app-surface" aria-hidden="true">
        <div className="app-orb app-orb--one" />
        <div className="app-orb app-orb--two" />
        <div className="app-orb app-orb--three" />
        <div className="app-orb app-orb--four" />
        <div className="app-orb app-orb--five" />
        <div className="app-orb app-orb--six" />
        <div className="app-orb app-orb--seven" />
        <div className="app-grid" />
      </div>
      <Navbar />
      <main className={`app-main ${isProjectDetail ? 'app-main--plain' : ''}`} role="main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="page-stack">
                <div className="page-section page-section--flush">
                  <Home />
                </div>
                <div className="page-section">
                  <AboutMe />
                </div>
                <div className="page-section page-section--accent">
                  <Experience />
                </div>
                <div className="page-section">
                  <Project />
                </div>
                <div className="page-section page-section--glass">
                  <Contact />
                </div>
              </div>
            }
          />
          <Route path="/projects/:id" element={<ProjectDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppFrame />
    </Router>
  );
}

export default App;
