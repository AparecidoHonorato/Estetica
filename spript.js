// Funcionalidade dos botões
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalAgendamento');
    const closeBtn = document.querySelector('.close');
    const btnCancelar = document.getElementById('btnCancelar');
    const buttons = document.querySelectorAll('.btn');
    const formAgendamento = document.getElementById('formAgendamento');
    
    // Abrir modal ao clicar no botão "Agende uma sessão"
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#contato') {
                e.preventDefault();
                modal.style.display = 'block';
            } else if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Fechar modal ao clicar no X
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Fechar modal ao clicar no botão Cancelar
    btnCancelar.addEventListener('click', function() {
        modal.style.display = 'none';
        formAgendamento.reset();
    });

    // Enviar formulário
    formAgendamento.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Capturar dados do formulário
        const nome = formAgendamento.querySelector('input[type="text"]').value;
        const whatsapp = formAgendamento.querySelector('input[placeholder="WhatsApp"]').value;
        const servico = formAgendamento.querySelector('select').value;
        const data = formAgendamento.querySelector('input[type="date"]').value;
        const hora = formAgendamento.querySelector('input[type="time"]').value;
        const mensagem = formAgendamento.querySelector('textarea').value;

        // Validar hora
        if (!hora) {
            alert('❌ Por favor, selecione um horário');
            return;
        }

        // Salvar no banco de dados
        fetch('/api/agendamentos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                whatsapp,
                servico,
                data,
                hora,
                mensagem
            })
        })
        .then(response => response.json())
        .then(resultado => {
            if (resultado.sucesso) {
                // Limpar formulário e fechar modal
                formAgendamento.reset();
                modal.style.display = 'none';
                
                alert('✓ ' + resultado.mensagem);
            } else {
                alert('❌ Erro ao salvar agendamento: ' + resultado.mensagem);
            }
        })
        .catch(erro => {
            console.error('Erro:', erro);
            alert('❌ Erro ao enviar dados');
        });
    });

    // Fechar dropdowns ao clicar fora
    document.addEventListener('click', function(e) {
        if (!e.target.closest('nav')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.style.display = 'none';
            });
        }
    });

    console.log("✓ Site de estética carregado com sucesso!");
});
