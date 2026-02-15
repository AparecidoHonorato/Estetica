import { useState } from 'react';

export default function SchedulingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    servico: 'Facial',
    data: '',
    mensagem: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Validação básica
    if (!formData.nome || !formData.whatsapp || !formData.data) {
      setMessage('Por favor, preencha todos os campos obrigatórios');
      setMessageType('error');
      return;
    }

    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.sucesso) {
        setMessage('Agendamento realizado com sucesso!');
        setMessageType('success');
        
        // Abrir Google Calendar se houver URL
        if (data.calendarUrl) {
          setTimeout(() => {
            window.open(data.calendarUrl, '_blank');
          }, 1000);
        }

        // Resetar formulário após 2 segundos
        setTimeout(() => {
          setFormData({
            nome: '',
            whatsapp: '',
            servico: 'Facial',
            data: '',
            mensagem: ''
          });
          onClose();
        }, 2000);
      } else {
        setMessage(data.mensagem || 'Erro ao agendar');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Erro:', error);
      setMessage('Erro ao conectar com o servidor');
      setMessageType('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay active">
      <div className="modal-content">
        <h3>Agendar Sessão</h3>
        
        {message && (
          <div className={`modal-message ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="whatsapp">WhatsApp *</label>
            <input
              type="tel"
              id="whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="(XX) 9XXXX-XXXX"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="servico">Serviço *</label>
            <select
              id="servico"
              name="servico"
              value={formData.servico}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                background: '#222',
                border: '1px solid #d4af37',
                color: '#fff',
                borderRadius: '5px',
                fontSize: '1rem'
              }}
            >
              <option value="Facial">Facial</option>
              <option value="Corporal">Corporal</option>
              <option value="Unhas">Unhas</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data">Data e Hora *</label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mensagem">Mensagem</label>
            <textarea
              id="mensagem"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Deixe uma mensagem (opcional)"
            ></textarea>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-submit"
            >
              Agendar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
