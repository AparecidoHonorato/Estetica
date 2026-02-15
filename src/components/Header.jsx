export default function Header({ activeSection, onNavClick, isDarkMode, onToggleDarkMode }) {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onNavClick(sectionId);
    }
  };

  return (
    <header>
      <div className="header-container">
        <div className="logo-btn">
          <img 
            src="image.png" 
            alt="Lumena Estética" 
            className="logo-img"
            loading="lazy"
            decoding="async"
          />
        </div>
        <nav>
          <ul className="menu">
            <li>
              <a 
                className={activeSection === 'sobre' ? 'active' : ''}
                onClick={() => scrollToSection('sobre')}
              >
                Sobre
              </a>
            </li>
            <li>
              <a 
                className={activeSection === 'contato' ? 'active' : ''}
                onClick={() => scrollToSection('contato')}
              >
                Contato
              </a>
            </li>
          </ul>
        </nav>
        <button 
          className="dark-mode-btn" 
          onClick={onToggleDarkMode} 
          title="Alternar tema"
          aria-label="Alternar entre modo claro e escuro"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
