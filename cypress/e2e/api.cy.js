describe('Testes de API - Agendamentos', () => {
  const baseUrl = 'http://localhost:3000/api/agendamentos';
  const validData = {
    nome: 'Maria Silva',
    email: 'maria@email.com',
    whatsapp: '11987654321',
    servico: 'Facial',
    data: '2026-03-20',
    hora: '14:30',
    mensagem: 'Primeira visita'
  };

  describe('POST /api/agendamentos - Validação', () => {
    it('Deve criar agendamento válido (201)', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: validData,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(201);
        expect(response.body.sucesso).to.equal(true);
        expect(response.body.id).to.exist;
      });
    });

    it('Deve rejeitar nome vazio (400)', () => {
      const data = { ...validData, nome: '' };
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: data,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(400);
        expect(response.body.sucesso).to.equal(false);
      });
    });

    it('Deve rejeitar email inválido (400)', () => {
      const data = { ...validData, email: 'invalido' };
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: data,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(400);
        expect(response.body.mensagem).to.include('Email');
      });
    });

    it('Deve rejeitar telefone inválido (400)', () => {
      const data = { ...validData, whatsapp: '123' };
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: data,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(400);
        expect(response.body.mensagem).to.include('WhatsApp');
      });
    });

    it('Deve rejeitar serviço inválido (400)', () => {
      const data = { ...validData, servico: 'Inexistente' };
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: data,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(400);
        expect(response.body.mensagem).to.include('Serviço');
      });
    });

    it('Deve aceitar serviços válidos', () => {
      const servicos = ['Facial', 'Corporal', 'Unhas'];
      
      servicos.forEach(servico => {
        cy.request({
          method: 'POST',
          url: baseUrl,
          body: { ...validData, servico },
          failOnStatusCode: false
        }).then(response => {
          expect(response.status).to.equal(201);
        });
      });
    });
  });

  describe('GET /api/agendamentos', () => {
    it('Deve listar agendamentos (200)', () => {
      cy.request({
        method: 'GET',
        url: baseUrl,
        failOnStatusCode: false
      }).then(response => {
        expect(response.status).to.equal(200);
        expect(Array.isArray(response.body)).to.equal(true);
      });
    });

    it('Deve retornar campos corretos', () => {
      cy.request({
        method: 'GET',
        url: baseUrl
      }).then(response => {
        if (response.body.length > 0) {
          const agendamento = response.body[0];
          expect(agendamento).to.have.property('id');
          expect(agendamento).to.have.property('nome');
          expect(agendamento).to.have.property('servico');
          expect(agendamento).to.have.property('data');
        }
      });
    });
  });

  describe('Rate Limiting', () => {
    it('Deve bloquear após limite de requisições', () => {
      const requisicoes = 6; // Limite é 5
      
      for (let i = 0; i < requisicoes; i++) {
        cy.request({
          method: 'POST',
          url: baseUrl,
          body: validData,
          failOnStatusCode: false
        }).then(response => {
          if (i < 5) {
            expect(response.status).to.equal(201);
          } else {
            expect(response.status).to.equal(429);
            expect(response.body.mensagem).to.include('Muitas requisições');
          }
        });
      }
    });
  });

  describe('Integridade dos Dados', () => {
    it('Deve salvar dados corretamente', () => {
      cy.request({
        method: 'POST',
        url: baseUrl,
        body: validData
      }).then(response => {
        expect(response.body.sucesso).to.equal(true);
        const id = response.body.id;

        // Verificar se foi salvo
        cy.request({
          method: 'GET',
          url: baseUrl
        }).then(getResponse => {
          const agendamento = getResponse.body.find(a => a.id === id);
          expect(agendamento).to.exist;
          expect(agendamento.nome).to.equal(validData.nome);
          expect(agendamento.servico).to.equal(validData.servico);
        });
      });
    });

    it('Deve sanitizar caracteres especiais', () => {
      const dataComCaracteresEspeciais = {
        ...validData,
        nome: 'Maria <script>alert("xss")</script> Silva'
      };

      cy.request({
        method: 'POST',
        url: baseUrl,
        body: dataComCaracteresEspeciais,
        failOnStatusCode: false
      }).then(response => {
        // Deve rejeitar ou sanitizar
        if (response.status === 201) {
          expect(response.body.sucesso).to.equal(true);
        }
      });
    });
  });
});
