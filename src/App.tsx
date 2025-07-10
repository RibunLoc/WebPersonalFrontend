import Navbar from './components/Navbar';
import Home from './Home';

function App() {
  return (
    <>
      <Navbar />
      <main className="pt-24"> {/* để tránh bị navbar che mất */}
        {/* Các section nội dung */}
        <Home />
        {/* <section id="home" className="h-screen bg-gray-100">
        </section>
        <section id="about" className="h-screen bg-white">About Section</section>
        <section id="experience" className="h-screen bg-gray-100">Experience Section</section>
        <section id="education" className="h-screen bg-white">Education Section</section>
        <section id="hobbies" className="h-screen bg-gray-100">Hobbies & Interests Section</section> */}
      </main>
    </>
  );
}

export default App;
