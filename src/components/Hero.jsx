export default function Hero({ onScheduleClick }) {
  const handleScheduleClick = () => {
    onScheduleClick();
  };

  return (
    <section className="hero">
      <h2>Realce sua beleza natural</h2>
      <p>Tratamentos de estética para você se sentir ainda mais incrível.</p>
      <button className="btn" onClick={handleScheduleClick}>
        Agende uma sessão
      </button>
    </section>
  );
}
