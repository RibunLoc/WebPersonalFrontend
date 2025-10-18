import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="app-shell">
        <div className="app-surface" aria-hidden="true">
          <div className="app-orb app-orb--one" />
          <div className="app-orb app-orb--two" />
          <div className="app-grid" />
        </div>
        <Navbar />
        <main className="app-main" role="main">
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
    </Router>
  );
}

export default App;
