import { useEffect, useState } from 'react';
import styles from './Navbar.module.css';
import { MdDarkMode, MdOutlineDarkMode } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
  

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleMobileMenu  = () => {
    setIsMobileMenuOpen (!isMobileMenuOpen);
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.container}>
        {/* Avatar + tên */}
        <div className={styles.profile}>
          <img
            src="/avatar.jpg"
            alt="Avatar"
            className={styles.avatar}
          />
          <div>
            <h1 className={styles.name}>Thanh Lộc</h1>
            <p className={styles.subtitle}>Ri bún</p>
          </div>
        </div>

        <button className={styles.hamburger} onClick={toggleMobileMenu}>
            <GiHamburgerMenu />
        </button>

        {/* Menu + DarkMode */}
        <div className={`${styles.rightMenu} ${isMobileMenuOpen ? styles.open : ''}`}>
          <nav className={styles.navLinks}>
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#experience">Experience</a>
            <a href="#education">Education</a>
            <a href="#hobbies">Hobbies & Interests</a>
          </nav>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={styles.toggleButton}
          >
            {darkMode ? <MdDarkMode /> : <MdOutlineDarkMode />}
          </button>
        </div>
      </div>
    </header>
  );
}
