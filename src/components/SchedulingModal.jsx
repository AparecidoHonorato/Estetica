import { useState } from 'react';

export default function SchedulingModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    servico: 'Facial',
    data: '',
    mensagem: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Filtro especial para o campo Nome: apenas letras, acentos e espaços
    if (name === 'nome') {
      finalValue = value.replace(/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g, '');
    }

    // Filtro especial para WhatsApp: apenas números, parênteses, hífen e espaço
    if (name === 'whatsapp') {
      finalValue = value.replace(/[^0-9()\- ]/g, '');
    }

    // Limitar mensagem a 500 caracteres
    if (name === 'mensagem') {
      finalValue = value.slice(0, 500);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    // Limpar erro do campo ao começar a digitar
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validação detalhada dos campos
  const validateForm = () => {
    const errors = {};

    // Validar Nome - apenas letras, acentos e espaços
    const nomeValue = formData.nome.trim();
    if (!nomeValue) {
      errors.nome = 'Nome é obrigatório';
    } else if (nomeValue.length < 3) {
      errors.nome = 'Nome deve ter no mínimo 3 caracteres';
    } else if (!/^[a-zA-ZáàâäãåèéêëìíîïòóôöõùúûüçñÁÀÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕÙÚÛÜÇÑ\s]+$/.test(nomeValue)) {
      errors.nome = 'Nome deve conter apenas letras e espaços';
    }

    // Validar Email
    const emailValue = formData.email.trim();
    if (!emailValue) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      errors.email = 'Email inválido (ex: seu@email.com)';
    } else if (emailValue.length > 100) {
      errors.email = 'Email muito longo (máximo 100 caracteres)';
    }

    // Validar WhatsApp
    const whatsappValue = formData.whatsapp.trim();
    if (!whatsappValue) {
      errors.whatsapp = 'WhatsApp é obrigatório';
    } else if (!/^\d{10,11}$|^\(\d{2}\)\s?\d{4,5}-?\d{4}$/.test(whatsappValue.replace(/\D/g, ''))) {
      errors.whatsapp = 'WhatsApp inválido (use formato: (XX) 9XXXX-XXXX)';
    }

    // Validar Data e Hora
    if (!formData.data) {
      errors.data = 'Data e hora são obrigatórias';
    } else {
      const selectedDate = new Date(formData.data);
      const now = new Date();
      if (selectedDate <= now) {
        errors.data = 'Escolha uma data e hora no futuro';
      }
    }

    // Validar Serviço (selbox já tem valor padrão, mas validar se está vazio)
    if (!formData.servico || formData.servico === 'Selecione um serviço') {
      errors.servico = 'Selecione um serviço';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    // Executar validação completa
    if (!validateForm()) {
      setMessage('⚠️ Por favor, corrija os erros no formulário');
      setMessageType('error');
      return;
    }

    // Iniciar carregamento
    setIsLoading(true);
    setMessage('⏳ Enviando seu agendamento...');
    setMessageType('loading');

    try {
      const response = await fetch('/api/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Verificar se resposta é válida
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (data.sucesso) {
        setMessage('✅ Agendamento realizado com sucesso! Redirecionando...');
        setMessageType('success');
        
        console.log('✓ Agendamento criado com ID:', data.id);

        // Resetar formulário após 3 segundos
        setTimeout(() => {
          setFormData({
            nome: '',
            email: '',
            whatsapp: '',
            servico: 'Facial',
            data: '',
            mensagem: ''
          });
          setIsLoading(false);
          setMessage('');
          onClose();
        }, 3000);
      } else {
        setMessage('❌ ' + (data.mensagem || 'Erro ao agendar'));
        setMessageType('error');
        setIsLoading(false);
        console.error('Erro no agendamento:', data);
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      
      let errorMsg = '❌ Erro ao conectar com o servidor';
      if (error instanceof TypeError) {
        errorMsg = '❌ Servidor indisponível. Tente novamente mais tarde.';
      } else if (error.message.includes('404')) {
        errorMsg = '❌ Endpoint não encontrado. Configure o servidor.';
      } else if (error.message.includes('500')) {
        errorMsg = '❌ Erro interno do servidor. Tente novamente.';
      }
      
      setMessage(errorMsg);
      setMessageType('error');
      setIsLoading(false);
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
              className={fieldErrors.nome ? 'input-error' : ''}
              required
            />
            {fieldErrors.nome && <span className="field-error">{fieldErrors.nome}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className={fieldErrors.email ? 'input-error' : ''}
              required
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
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
              className={fieldErrors.whatsapp ? 'input-error' : ''}
              required
            />
            {fieldErrors.whatsapp && <span className="field-error">{fieldErrors.whatsapp}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="servico">Serviço *</label>
            <select
              id="servico"
              name="servico"
              value={formData.servico}
              onChange={handleChange}
              className={fieldErrors.servico ? 'input-error' : ''}
              style={{
                width: '100%',
                padding: '10px',
                background: '#222',
                border: `1px solid ${fieldErrors.servico ? '#dc3545' : '#d4af37'}`,
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
              className={fieldErrors.data ? 'input-error' : ''}
              required
            />
            {fieldErrors.data && <span className="field-error">{fieldErrors.data}</span>}
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
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Agendar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
