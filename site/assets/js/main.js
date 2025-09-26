/**
 * ===================================================================
 * ESSÊNCIA DO ATENDIMENTO - SCRIPT PRINCIPAL (MOBILE-FIRST)
 * ===================================================================
 * Controla todas as interatividades do site com foco em conversão
 * e experiência do usuário otimizada para dispositivos móveis.
 */

document.addEventListener("DOMContentLoaded", () => {
  
  /**
   * ===================================================================
   * 1. NAVEGAÇÃO MOBILE
   * ===================================================================
   */
  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");
  const navLinks = document.querySelectorAll(".nav-mobile__link");
  const body = document.body;

  // Função para abrir menu mobile
  const openMenu = () => {
    if (navMenu) {
      navMenu.classList.add("nav-mobile--open");
      body.style.overflow = "hidden";
      navToggle.setAttribute("aria-expanded", "true");
    }
  };

  // Função para fechar menu mobile
  const closeMenu = () => {
    if (navMenu) {
      navMenu.classList.remove("nav-mobile--open");
      body.style.overflow = "";
      navToggle.setAttribute("aria-expanded", "false");
    }
  };

  // Event listeners para navegação
  if (navToggle) {
    navToggle.addEventListener("click", openMenu);
  }

  if (navClose) {
    navClose.addEventListener("click", closeMenu);
  }

  // Fechar menu ao clicar nos links
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Fechar menu com tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navMenu && navMenu.classList.contains("nav-mobile--open")) {
      closeMenu();
    }
  });

  /**
   * ===================================================================
   * 2. VALIDAÇÃO DE FORMULÁRIOS
   * ===================================================================
   */
  
  // Função para validar email
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar telefone brasileiro
  const isValidPhone = (phone) => {
    const phoneRegex = /^(\(?\d{2}\)?\s?)?\d{4,5}-?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Função para exibir erro
  const showError = (input, message) => {
    const errorElement = document.getElementById(input.getAttribute('aria-describedby'));
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }
    input.classList.add('form__input--error');
  };

  // Função para limpar erro
  const clearError = (input) => {
    const errorElement = document.getElementById(input.getAttribute('aria-describedby'));
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
    input.classList.remove('form__input--error');
  };

  // Função para validar campo individual
  const validateField = (input) => {
    const value = input.value.trim();
    let isValid = true;

    // Limpar erro anterior
    clearError(input);

    // Validação por tipo de campo
    if (input.hasAttribute('required') && !value) {
      showError(input, 'Este campo é obrigatório.');
      isValid = false;
    } else if (input.type === 'email' && value && !isValidEmail(value)) {
      showError(input, 'Por favor, insira um e-mail válido.');
      isValid = false;
    } else if (input.type === 'tel' && value && !isValidPhone(value)) {
      showError(input, 'Por favor, insira um telefone válido.');
      isValid = false;
    } else if (input.name === 'name' && value && value.length < 2) {
      showError(input, 'Nome deve ter pelo menos 2 caracteres.');
      isValid = false;
    }

    return isValid;
  };

  // Adicionar validação em tempo real
  const addRealTimeValidation = (form) => {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      // Validar ao sair do campo
      input.addEventListener('blur', () => validateField(input));
      
      // Limpar erro ao começar a digitar
      input.addEventListener('input', () => {
        if (input.classList.contains('form__input--error')) {
          clearError(input);
        }
      });
    });
  };

  /**
   * ===================================================================
   * 3. MANIPULAÇÃO DE FORMULÁRIOS
   * ===================================================================
   */
  
  const handleFormSubmit = (formId, successMessageId, options = {}) => {
    const form = document.getElementById(formId);
    const successMessage = document.getElementById(successMessageId);
    const submitBtn = form?.querySelector('button[type="submit"]');

    if (!form || !successMessage) return;

    // Adicionar validação em tempo real
    addRealTimeValidation(form);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Validar todos os campos
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let isFormValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) {
          isFormValid = false;
        }
      });

      // Validar checkbox de consentimento se existir
      const consentCheckbox = form.querySelector('input[name="consent"]');
      if (consentCheckbox && !consentCheckbox.checked) {
        alert('Por favor, aceite os termos para continuar.');
        isFormValid = false;
      }

      if (!isFormValid) {
        // Focar no primeiro campo com erro
        const firstError = form.querySelector('.form__input--error');
        if (firstError) {
          firstError.focus();
        }
        return;
      }

      // Mostrar estado de carregamento
      if (submitBtn) {
        const btnText = submitBtn.querySelector('.btn__text');
        const btnLoading = submitBtn.querySelector('.btn__loading');
        
        if (btnText && btnLoading) {
          btnText.style.display = 'none';
          btnLoading.style.display = 'inline';
        }
        
        submitBtn.disabled = true;
      }

      // Simular envio (substituir por integração real)
      try {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simula delay de envio
        
        // Coletar dados do formulário
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Log dos dados (remover em produção)
        console.log('Dados do formulário:', data);
        
        // Mostrar mensagem de sucesso
        form.style.display = "none";
        successMessage.style.display = "block";
        
        // Scroll para a mensagem de sucesso
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Tracking de conversão (implementar com Google Analytics, Facebook Pixel, etc.)
        if (typeof gtag !== 'undefined') {
          gtag('event', 'form_submit', {
            'form_name': formId,
            'form_type': options.type || 'lead_generation'
          });
        }
        
      } catch (error) {
        console.error('Erro ao enviar formulário:', error);
        alert('Ocorreu um erro ao enviar o formulário. Tente novamente ou entre em contato conosco.');
        
        // Restaurar botão
        if (submitBtn) {
          const btnText = submitBtn.querySelector('.btn__text');
          const btnLoading = submitBtn.querySelector('.btn__loading');
          
          if (btnText && btnLoading) {
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
          }
          
          submitBtn.disabled = false;
        }
      }
    });
  };

  // Inicializar formulários
  handleFormSubmit("ebookForm", "ebookSuccessMessage", { type: 'ebook_download' });
  handleFormSubmit("contactForm", "contactSuccessMessage", { type: 'contact_form' });

  /**
   * ===================================================================
   * 4. QUESTIONÁRIO DIAGNÓSTICO EM POP-UP
   * ===================================================================
   */
  
  const createDiagnosticPopup = () => {
    // Verificar se já foi exibido nesta sessão
    if (sessionStorage.getItem('diagnosticPopupShown')) {
      return;
    }

    const questions = [
      {
        id: 1,
        question: "Como você avalia o atendimento atual do seu estabelecimento?",
        options: [
          { value: "excelente", text: "Excelente - Clientes sempre elogiam" },
          { value: "bom", text: "Bom - Mas pode melhorar" },
          { value: "regular", text: "Regular - Recebemos algumas reclamações" },
          { value: "ruim", text: "Ruim - Precisamos melhorar urgentemente" }
        ]
      },
      {
        id: 2,
        question: "Qual é o principal desafio da sua equipe?",
        options: [
          { value: "motivacao", text: "Falta de motivação" },
          { value: "treinamento", text: "Falta de treinamento adequado" },
          { value: "rotatividade", text: "Alta rotatividade de funcionários" },
          { value: "comunicacao", text: "Problemas de comunicação interna" }
        ]
      },
      {
        id: 3,
        question: "Como seus clientes descobrem seu estabelecimento?",
        options: [
          { value: "indicacao", text: "Indicação de outros clientes" },
          { value: "redes_sociais", text: "Redes sociais" },
          { value: "localizacao", text: "Localização/passagem" },
          { value: "delivery", text: "Apps de delivery" }
        ]
      }
    ];

    let currentQuestion = 0;
    let answers = {};

    // Criar HTML do popup
    const popupHTML = `
      <div id="diagnosticPopup" class="popup">
        <div class="popup__content diagnostic-popup">
          <button id="closeDiagnostic" class="popup__close" aria-label="Fechar questionário">&times;</button>
          
          <div class="diagnostic-header">
            <h3 class="popup__title">Diagnóstico Rápido do Seu Atendimento</h3>
            <p class="diagnostic-subtitle">Responda 3 perguntas rápidas e receba dicas personalizadas</p>
            <div class="diagnostic-progress">
              <div class="diagnostic-progress__bar" id="progressBar"></div>
            </div>
          </div>

          <div id="questionContainer" class="diagnostic-question">
            <!-- Perguntas serão inseridas aqui -->
          </div>

          <div class="diagnostic-actions">
            <button id="prevBtn" class="btn btn--outline" style="display: none;">Anterior</button>
            <button id="nextBtn" class="btn btn--primary">Próxima</button>
          </div>

          <div id="diagnosticResult" class="diagnostic-result" style="display: none;">
            <h4>Seu Diagnóstico Personalizado</h4>
            <div id="resultContent"></div>
            <div class="diagnostic-cta">
              <p>Quer receber um plano de ação personalizado?</p>
              <a href="#contato" class="btn btn--secondary" id="diagnosticCta">Falar com Especialista</a>
            </div>
          </div>
        </div>
      </div>
    `;

    // Inserir popup no DOM
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    const popup = document.getElementById('diagnosticPopup');
    const closeBtn = document.getElementById('closeDiagnostic');
    const questionContainer = document.getElementById('questionContainer');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const resultContainer = document.getElementById('diagnosticResult');
    const diagnosticCta = document.getElementById('diagnosticCta');

    // Função para renderizar pergunta
    const renderQuestion = (questionIndex) => {
      const question = questions[questionIndex];
      const progress = ((questionIndex + 1) / questions.length) * 100;
      
      progressBar.style.width = `${progress}%`;
      
      questionContainer.innerHTML = `
        <h4 class="diagnostic-question__title">${question.question}</h4>
        <div class="diagnostic-options">
          ${question.options.map(option => `
            <label class="diagnostic-option">
              <input type="radio" name="question_${question.id}" value="${option.value}" 
                     ${answers[question.id] === option.value ? 'checked' : ''}>
              <span class="diagnostic-option__text">${option.text}</span>
            </label>
          `).join('')}
        </div>
      `;

      // Atualizar botões
      prevBtn.style.display = questionIndex > 0 ? 'inline-block' : 'none';
      nextBtn.textContent = questionIndex === questions.length - 1 ? 'Ver Resultado' : 'Próxima';
    };

    // Função para gerar resultado
    const generateResult = () => {
      let resultHTML = '<div class="diagnostic-insights">';
      
      // Análise baseada nas respostas
      if (answers[1] === 'ruim' || answers[2] === 'rotatividade') {
        resultHTML += `
          <div class="diagnostic-insight diagnostic-insight--urgent">
            <h5>🚨 Ação Urgente Necessária</h5>
            <p>Seu estabelecimento precisa de atenção imediata no atendimento. Problemas não resolvidos podem afetar significativamente seu faturamento.</p>
          </div>
        `;
      } else if (answers[1] === 'regular') {
        resultHTML += `
          <div class="diagnostic-insight diagnostic-insight--warning">
            <h5>⚠️ Oportunidade de Melhoria</h5>
            <p>Você está no caminho certo, mas há espaço para crescimento. Pequenos ajustes podem gerar grandes resultados.</p>
          </div>
        `;
      } else {
        resultHTML += `
          <div class="diagnostic-insight diagnostic-insight--good">
            <h5>✅ Bom Trabalho!</h5>
            <p>Seu atendimento está bem encaminhado. Vamos ajudar você a alcançar a excelência e se destacar da concorrência.</p>
          </div>
        `;
      }

      // Recomendações específicas
      resultHTML += '<div class="diagnostic-recommendations"><h5>Recomendações Personalizadas:</h5><ul>';
      
      if (answers[2] === 'motivacao') {
        resultHTML += '<li>Implementar programa de reconhecimento e incentivos</li>';
      }
      if (answers[2] === 'treinamento') {
        resultHTML += '<li>Desenvolver treinamento estruturado de atendimento</li>';
      }
      if (answers[3] === 'indicacao') {
        resultHTML += '<li>Criar programa de fidelização para potencializar indicações</li>';
      }
      
      resultHTML += '</ul></div></div>';
      
      return resultHTML;
    };

    // Event listeners
    closeBtn.addEventListener('click', () => {
      popup.classList.remove('popup--show');
      sessionStorage.setItem('diagnosticPopupShown', 'true');
    });

    prevBtn.addEventListener('click', () => {
      if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion(currentQuestion);
      }
    });

    nextBtn.addEventListener('click', () => {
      // Salvar resposta atual
      const selectedOption = questionContainer.querySelector('input[type="radio"]:checked');
      if (selectedOption) {
        answers[questions[currentQuestion].id] = selectedOption.value;
      }

      if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion(currentQuestion);
      } else {
        // Mostrar resultado
        questionContainer.style.display = 'none';
        document.querySelector('.diagnostic-actions').style.display = 'none';
        resultContainer.style.display = 'block';
        resultContainer.querySelector('#resultContent').innerHTML = generateResult();
        
        // Tracking
        if (typeof gtag !== 'undefined') {
          gtag('event', 'diagnostic_completed', {
            'answers': answers
          });
        }
      }
    });

    diagnosticCta.addEventListener('click', () => {
      popup.classList.remove('popup--show');
      sessionStorage.setItem('diagnosticPopupShown', 'true');
    });

    // Fechar ao clicar fora
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('popup--show');
        sessionStorage.setItem('diagnosticPopupShown', 'true');
      }
    });

    // Inicializar
    renderQuestion(0);
    
    // Mostrar popup após 30 segundos
    setTimeout(() => {
      popup.classList.add('popup--show');
    }, 30000);
  };

  // Inicializar questionário diagnóstico
  createDiagnosticPopup();

  /**
   * ===================================================================
   * 5. FAQ INTERATIVO
   * ===================================================================
   */
  
  const initFAQ = () => {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const answer = faqItem.querySelector('.faq-answer');
        const icon = question.querySelector('.faq-icon');
        const isOpen = question.getAttribute('aria-expanded') === 'true';
        
        // Fechar todas as outras perguntas
        faqQuestions.forEach(otherQuestion => {
          if (otherQuestion !== question) {
            const otherItem = otherQuestion.parentElement;
            const otherAnswer = otherItem.querySelector('.faq-answer');
            const otherIcon = otherQuestion.querySelector('.faq-icon');
            
            otherQuestion.setAttribute('aria-expanded', 'false');
            otherAnswer.style.maxHeight = '0';
            otherIcon.style.transform = 'rotate(0deg)';
          }
        });
        
        // Toggle pergunta atual
        if (isOpen) {
          question.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = '0';
          icon.style.transform = 'rotate(0deg)';
        } else {
          question.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          icon.style.transform = 'rotate(180deg)';
        }
      });
    });
  };

  // Inicializar FAQ
  initFAQ();

  /**
   * ===================================================================
   * 6. SCROLL SUAVE E NAVEGAÇÃO
   * ===================================================================
   */
  
  // Scroll suave para âncoras
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      if (href.length > 1 && document.querySelector(href)) {
        e.preventDefault();
        
        const targetElement = document.querySelector(href);
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Fechar menu mobile se estiver aberto
        closeMenu();
      }
    });
  });

  /**
   * ===================================================================
   * 7. UTILITÁRIOS E MELHORIAS DE UX
   * ===================================================================
   */
  
  // Máscaras para campos de telefone
  const addPhoneMask = () => {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
          if (value.length <= 2) {
            value = value.replace(/(\d{0,2})/, '($1');
          } else if (value.length <= 6) {
            value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
          } else if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
          } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
          }
        }
        
        e.target.value = value;
      });
    });
  };

  // Inicializar máscaras
  addPhoneMask();

  // Lazy loading para imagens (se necessário)
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  };

  // Inicializar lazy loading se houver imagens com data-src
  if (document.querySelector('img[data-src]')) {
    lazyLoadImages();
  }

  // Log de inicialização
  console.log('🎯 Essência do Atendimento - Site inicializado com sucesso!');
});
