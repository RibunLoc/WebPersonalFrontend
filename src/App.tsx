import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="container">
      <h1>Xin chào, mình là Ri Bún 👋</h1>
      <p>Chào mừng đến với trang cá nhân của mình.</p>

      <section>
        <h2>💼 Kỹ năng</h2>
        <ul>
          <li>DevOps: Jenkins, Terraform, ArgoCD, AWS</li>
          <li>Frontend: React, TailwindCSS, Vite</li>
          <li>Networking, bảo mật, monitoring</li>
        </ul>
      </section>

      <section>
        <h2>📫 Liên hệ</h2>
        <p>Email: hothanhloc@gmail.com</p>
        <p>GitHub: <a href="https://github.com/ribunloc" target="_blank">ribunloc</a></p>
      </section>
    </div>
  );
}

export default App;
