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
        <div className="logo">
          <img src="image.png" alt="Silhueta de Mulher" className="logo-img" />
          <h1>Lumena Estética</h1>
        </div>
        <nav>
          <ul className="menu">
            <li>
              <a 
                className={activeSection === 'servicos' ? 'active' : ''}
                onClick={() => scrollToSection('servicos')}
              >
                Serviços
              </a>
              <ul className="dropdown">
                <li><a onClick={() => scrollToSection('facial')}>Facial</a></li>
                <li><a onClick={() => scrollToSection('corporal')}>Corporal</a></li>
                <li><a onClick={() => scrollToSection('unhas')}>Unhas</a></li>
              </ul>
            </li>
            <li>
              <a 
                className={activeSection === 'sobre' ? 'active' : ''}
                onClick={() => scrollToSection('sobre')}
              >
                Sobre
              </a>
              <ul className="dropdown">
                <li><a onClick={() => scrollToSection('sobre')}>Nossa Equipe</a></li>
                <li><a onClick={() => scrollToSection('sobre')}>Missão</a></li>
              </ul>
            </li>
            <li>
              <a 
                className={activeSection === 'contato' ? 'active' : ''}
                onClick={() => scrollToSection('contato')}
              >
                Contato
              </a>
              <ul className="dropdown">
                <li><a onClick={() => scrollToSection('contato')}>Email</a></li>
                <li><a onClick={() => scrollToSection('contato')}>Telefone</a></li>
              </ul>
            </li>
          </ul>
        </nav>
        