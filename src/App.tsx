import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './Home';
import AboutMe from './AboutMe';
import Footer from './Footer';
import Experience from './Experience';
import Project from './Project'
import ProjectDetail from './ProjectDetailPage'
import ScrollToTop from './components/ScrollToTop'


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main className="pt-24">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <section id="home" className="h-screen bg-gray-100">
                <Home />
                </section>
                <section id="about" className="h-screen bg-white">
                  <AboutMe />
                </section>
                <section id="experience" className="h-screen bg-gray-100">
                  <Experience/>
                </section>
                <section id="project" className="h-screen bg-white">
                  <Project/>
                </section>
                <section id="hobbies" className="h-screen bg-gray-100"></section>
              </>
            }
          />
          <Route path='/projects/:id' element={<ProjectDetail />} />
        </Routes>
      </main>
      <Footer/>
    </Router>
  );
}

export default App;