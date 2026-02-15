export default function Services() {
  const services = [
    {
      id: 'facial',
      title: 'Facial',
      description: 'Limpeza de pele, hidratação e tratamentos faciais.'
    },
    {
      id: 'corporal',
      title: 'Corporal',
      description: 'Massagens, drenagem linfática e modelagem corporal.'
    },
    {
      id: 'unhas',
      title: 'Unhas',
      description: 'Manicure, pedicure e nail design criativo.'
    }
  ];

  return (
    <section id="servicos" className="container">
      <h2>Nossos Serviços</h2>
      <div className="cards">
        {services.map(service => (
          <div key={service.id} className="card" id={service.id}>
            <img 
              src="image.png" 
              alt={service.title} 
              className="card-img"
              loading="lazy"
              decoding="async"
            />
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
