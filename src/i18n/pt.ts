export default {
  login: {
    welcome: "Bem-vindo de volta",
    subtitle: "Entre com sua conta para continuar",
    user: "Usuário",
    password: "Senha",
    login: "Entrar",
    forgotPassword: "Esqueci minha senha",
    register: "Quero me cadastrar",
    chooseLanguage: "Escolha o idioma",
    changeLanguage: "Isso muda o idioma exibido no aplicativo",
    or: "OU",
  },
  forget: {
    title: "Esqueceu sua senha?",
    subtitle:
      "Informe o e-mail cadastrado e enviaremos um código para redefinir sua senha.",
    iemail: "Seu E-mail",
    send: "Enviar",
    know: "Lembrou a senha?",
    open: "Entrar",
  },
  pinforger: {
    title: "Digite o código recebido",
    subtitle: " Enviamos um código de 6 dígitos para",
    label_new_pass: "NOVA SENHA",
    inew: "Nova Senha",
    cnew: "Confirmar Nova Senha",

    bconfirm: "Confirmar",
    breturn: "Voltar",
  },
  cadwallet: {
    title: "Carteira de Recebimento",
    configured: "Carteira configurada",
    network: "REDE",
    addressLabel: "ENDEREÇO DA CARTEIRA",
    addressDescription:
      "Os pagamentos recebidos serão automaticamente encaminhados para este endereço na rede selecionada.",
    addressPlaceholder: "0x...",
    registerWallet: "Cadastrar carteira",
    copySuccess: "Endereço copiado!",
    registerSuccess: "Carteira de recebimento cadastrada!",
    invalidAddress: "Endereço inválido para a rede {{network}}.",
    clipboardError: "Não foi possível acessar a área de transferência",
    walletCheckError:
      "Não foi possível verificar sua carteira. Tente novamente.",
    comingSoon: "Em breve!",
    token: "USDT",
  },
  dashboard: {
    generateCharge: "Gerar cobrança",
    keypad: {
      clear: "C",
      backspace: "⌫",
    },
    validation: {
      invalidAmount: "Informe um valor válido.",
    },
  },
  extract: {
    title: "Cobranças",
    period: "PERÍODO",
    status: "STATUS",
    periods: {
      today: "Hoje",
      sevenDays: "7 dias",
      thirtyDays: "30 dias",
      custom: "Personalizado",
    },
    statusOptions: {
      open: "Aberta",
      confirmed: "Confirmada",
      cancelled: "Cancelada",
    },
    noConfirmationDate: "Sem data de confirmação",
    loading: "Carregando cobranças...",
    empty: "Nenhuma cobrança encontrada para esse período e status.",
    errors: {
      loadInvoices: "Erro ao buscar cobranças.",
    },
  },
  about: {
    title: "Sobre",
    versionLabel: "VERSÃO {{version}}",
    brazilTitle: "Tecnologia 100% brasileira",
    brazilDescriptionBefore: "A Colossus Crypto é desenvolvida e mantida ",
    brazilDescriptionHighlight: "no Brasil, por brasileiros",
    brazilDescriptionAfter:
      ", unindo tecnologia de ponta em criptomoedas com o suporte e a confiança de uma empresa nacional.",
    developedBy: "DESENVOLVIDO POR",
    companyLabel: "EMPRESA",
    cnpjLabel: "CNPJ",
    footerNote: "Feito com 💜 e no 🇧🇷 para todo o mundo.",
  },
  info: {
    title: "Minhas Informações",
    personTypeIndividual: "Pessoa Física",
    personTypeCompany: "Pessoa Jurídica",
    errorLoad: "Não foi possível carregar suas informações.",
    retry: "Tentar novamente",
    errorEmpty: "Nenhuma informação encontrada.",
    registrationData: "DADOS CADASTRAIS",
    socialName: "NOME SOCIAL",
    document: "DOCUMENTO",
    contact: "CONTATO",
    email: "E-MAIL",
    phone: "TELEFONE",
    address: "ENDEREÇO",
    street: "LOGRADOURO",
    city: "CIDADE",
    zipCode: "CEP",
    emptyValue: "-",
  },
  invoice: {
    title: "Cobrança",
    loadingInvoice: "Carregando cobrança...",
    toastExpired: "Cobrança expirada",
    toastTimeUp: "Tempo esgotado. Voltando...",
    toastAddressCopied: "Endereço copiado!",
    amountLabel: "VALOR A PAGAR",
    expiresIn: "Expira em {{time}}",
    cancelInvoice: "Cancelar cobrança",
  },
  menu: {
    title: "Configurações",
    preferences: "PREFERÊNCIAS",
    general: "GERAL",
    languageAndCurrency: "Idioma e Moeda",
    logout: "Sair da conta",
    logoutError: "Não foi possível sair. Tente novamente.",
    items: {
      info: "Informações",
      wallet: "Carteira",
      invoices: "Cobranças",
      support: "Suporte",
      about: "Sobre",
      termsOfUse: "Termos de uso",
      printer: "Impressora",
      community: "Comunidade",
    },
  },
  printer: {
    title: "Impressora",
    labelSizeTitle: "Tamanho da etiqueta",
    labelSizeSubtitle: "Escolha o modelo compatível com sua impressora térmica",
    toastSaved: "Impressora {{model}} salva!",
    toastSaveError: "Não foi possível salvar a configuração.",
    options: {
      compact: "Compacta",
      standard: "Padrão",
    },
  },
  receipt: {
    toastNoPrinter: "Nenhuma impressora configurada. Acesse as configurações.",
    toastPrintSuccess: "Comprovante impresso!",
    toastPrintError: "Não foi possível imprimir. Verifique a impressora.",
    notFound: "Comprovante não encontrado.",
    paymentConfirmed: "Pagamento confirmado",
    validatedOnBlockchain: "A transação foi validada na blockchain",
    receiptSubtitle: "Comprovante de pagamento",
    amountReceived: "VALOR RECEBIDO",
    confirmationDate: "DATA DA CONFIRMAÇÃO",
    recipient: "DESTINATÁRIO",
    reference: "REFERÊNCIA",
    txid: "TXID",
    printButton: "Imprimir comprovante",
    backButton: "Voltar ao início",
    print: {
      headerTitle: "Proof Colossus Crypto",
      statusConfirmed: "PAGAMENTO CONFIRMADO",
      amountLabel: "Valor",
      dateTimeLabel: "Data/Hora",
      recipientLabel: "Destinatário:",
      referenceLabel: "Referência:",
      txidLabel: "TXID:",
      scanHint: "Escaneie para ver no Polygonscan",
    },
  },
  selectNetwork: {
    title: "Escolha a rede",
    amountSummaryLabel: "VALOR DA COBRANÇA",
    availableNetworks: "REDES DISPONÍVEIS",
    loadingNetworks: "Carregando redes...",
    loadNetworksError: "Não foi possível carregar as redes.",
    retry: "Tentar novamente",
    conversionHint:
      "O valor será convertido para USDT com base na cotação atual",
    proceed: "Prosseguir",
    createInvoiceError: "Não foi possível criar a cobrança. Tente novamente.",
    noForwardWallet:
      "Carteira de recebimento não encontrada. Cadastre uma carteira para continuar.",
  },
  settingsLanguage: {
    title: "Idioma e Moeda",
    appLanguage: "IDIOMA DO APP",
    currencyForBilling: "MOEDA PARA COBRANÇA",
    toastLanguageError: "Não foi possível salvar o idioma.",
    toastCurrencyError: "Não foi possível salvar a moeda.",
    currencySubLabel: {
      BRL: "Real brasileiro",
      USD: "Dólar americano",
      PYG: "Guarani paraguaio",
    },
  },
  support: {
    title: "Suporte",
    needHelp: "Precisa de ajuda?",
    contactSubtitle: "Fale direto com nosso time pelo WhatsApp",
    whatsappButton: "Falar no WhatsApp",
    whatsappMessage: "Olá, preciso de ajuda!",
    whatsappError: "Não foi possível abrir o WhatsApp",
    faqSectionTitle: "PERGUNTAS FREQUENTES",
    faq: {
      q1: {
        question: "1. O que é a Colossus Crypto?",
        answer:
          "A Colossus Crypto é uma solução de pagamentos digitais desenvolvida pela I Like Technology, que permite que comércios de todos os portes aceitem pagamentos em USDT (Tether) – uma das criptomoedas mais estáveis e utilizadas do mundo – por meio de aplicativo, sistema web e maquininha de cartão.",
      },
      q2: {
        question: "2. Quem pode utilizar a Colossus Crypto?",
        answer:
          "A plataforma é voltada para comerciantes (pessoas físicas ou jurídicas) que desejam oferecer uma alternativa moderna e segura de pagamento aos seus clientes, além de contar com taxas mais atrativas e liquidez imediata.",
      },
      q3: {
        question: "3. Como funciona o recebimento em USDT?",
        answer:
          "Ao realizar uma venda, o comerciante gera um QR Code ou link de pagamento via aplicativo, sistema ou maquininha. O cliente faz o pagamento em USDT, e o valor é recebido instantaneamente na carteira digital do comerciante vinculada à Colossus Crypto.",
      },
      q4: {
        question: "4. Quais são as taxas cobradas pela Colossus Crypto?",
        answer:
          "A Colossus Crypto cobra uma taxa fixa de 1.95% por transação, inferior à média praticada por operadoras tradicionais de cartão de crédito.",
      },
      q5: {
        question: "5. Preciso entender de criptomoedas para usar a plataforma?",
        answer:
          "Não. A plataforma foi projetada para ser intuitiva e simples, com interface amigável e suporte dedicado, mesmo para quem nunca utilizou criptomoedas antes.",
      },
      q6: {
        question: "6. Onde posso usar a Colossus Crypto?",
        answer:
          "A solução pode ser utilizada em lojas físicas, e-commerces, serviços delivery ou autônomos, através de aplicativo mobile, sistema web ou maquininha de pagamento compatível.",
      },
      q7: {
        question: "7. É seguro receber pagamentos em USDT?",
        answer:
          "Sim. O USDT é uma stablecoin lastreada em dólar, com estabilidade e liquidez elevadas. Além disso, a Colossus Crypto adota tecnologias de segurança, criptografia e autenticação para garantir total proteção nas transações.",
      },
      q8: {
        question:
          "8. Quais os benefícios de aceitar criptomoedas no meu negócio?",
        answer:
          "Além da visibilidade como empresa moderna, os comerciantes se beneficiam com taxas menores, liquidação instantânea, acesso a um novo perfil de consumidores e isenção de burocracias bancárias tradicionais.",
      },
      q9: {
        question: "9. Preciso de cadastro para usar?",
        answer:
          "Baixe o app, realize seu cadastro junto a um consultor da Colossus Crypto e, após verificação, sua empresa já estará pronta para aceitar pagamentos em USDT.",
      },
    },
  },
  terms: {
    title: "Termos de Uso",
    docTitle: "Termos de Uso – Colossus Crypto",
    lastUpdated: "Última atualização: {{date}}",
    intro:
      'Este Termo de Uso regula a utilização da plataforma Colossus Crypto, doravante denominada "Plataforma", de titularidade da I Like Technology, inscrita sob o CNPJ nº 45.123.168/0001-22.\n\nAo acessar ou utilizar qualquer funcionalidade disponibilizada na Plataforma, o Usuário declara ter lido, compreendido e concordado integralmente com as disposições aqui previstas.',
    footerNote: "Colossus Crypto · I Like Technology\nCNPJ 45.123.168/0001-22",
    sections: {
      s1: {
        title: "Objeto",
        paragraphs: [
          "A presente plataforma tem por finalidade disponibilizar soluções tecnológicas para que comerciantes e usuários aceitem e realizem pagamentos por meio de ativos digitais, especialmente a stablecoin USDT (Tether), em ambiente seguro, eficiente e transparente, por meio de aplicativo, sistema web, APIs e dispositivos físicos (maquininhas).",
        ],
      },
      s2: {
        title: "Cadastro e Elegibilidade",
        paragraphs: [
          "2.1. Para utilizar os serviços, o Usuário deverá realizar cadastro prévio, fornecendo informações verídicas, completas e atualizadas.",
          "2.2. A I Like Technology reserva-se o direito de verificar a veracidade das informações, podendo, inclusive, recusar ou suspender cadastros em caso de inconsistências ou uso indevido.",
        ],
      },
      s3: {
        title: "Condições de Uso",
        paragraphs: [
          "3.1. O Usuário compromete-se a utilizar a Plataforma exclusivamente para fins lícitos, responsabilizando-se civil e criminalmente por quaisquer atos praticados.",
          "3.2. É vedada a utilização da Plataforma para:",
        ],
        bullets: [
          "Transações fraudulentas ou que envolvam atividades ilegais",
          "Lavagem de dinheiro ou financiamento ao terrorismo",
          "Comércio de produtos ou serviços proibidos por lei",
        ],
      },
      s4: {
        title: "Remuneração e Taxas",
        paragraphs: [
          "4.1. A utilização da Plataforma poderá implicar na incidência de taxas, atualmente fixadas em 2% (dois por cento) sobre cada transação realizada.",
          "4.2. A I Like Technology reserva-se o direito de alterar os valores mediante aviso prévio com antecedência mínima de 15 (quinze) dias.",
        ],
      },
      s5: {
        title: "Propriedade Intelectual",
        paragraphs: [
          "Todos os elementos da Colossus Crypto, incluindo logotipos, sistemas, códigos, conteúdos e marcas, são de propriedade exclusiva da I Like Technology, sendo vedada qualquer reprodução ou uso não autorizado.",
        ],
      },
      s6: {
        title: "Responsabilidades",
        paragraphs: ["6.1. A I Like Technology não se responsabiliza por:"],
        bullets: [
          "Erros causados por má utilização da plataforma",
          "Falhas decorrentes de terceiros (ex: operadoras de internet)",
          "Perdas financeiras decorrentes de transações indevidas realizadas por terceiros com acesso à conta ou wallet do usuário",
        ],
      },
      s7: {
        title: "Modificações e Atualizações",
        paragraphs: [
          "Este Termo poderá ser alterado a qualquer momento. O uso contínuo da plataforma após a publicação das alterações implicará aceitação tácita dos novos termos.",
        ],
      },
    },
  },
  communityMap: {
    headerTitle: "Comunidade Colossus",
    filterAll: "Todos",
    loading: "Carregando comunidade Colossus...",
    errorLoad: "Não foi possível carregar os locais.",
    retry: "Tentar novamente",
    errors: {
      call: "Não foi possível abrir o discador.",
      whatsapp: "Não foi possível abrir o WhatsApp.",
      website: "Não foi possível abrir o site.",
    },
    verified: "Verificado",
    actions: {
      call: "Ligar",
      whatsapp: "WhatsApp",
      website: "Site",
    },
    address: "ENDEREÇO",
    openingHours: "HORÁRIO DE FUNCIONAMENTO",
    paymentMethods: "FORMAS DE PAGAMENTO",
    tags: "TAGS",
  },
};
