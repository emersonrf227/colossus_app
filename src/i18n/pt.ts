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
    keypad: { clear: "C", backspace: "⌫" },
    validation: { invalidAmount: "Informe um valor válido." },
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
    errors: { loadInvoices: "Erro ao buscar cobranças." },
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
    options: { compact: "Compacta", standard: "Padrão" },
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
    contactSubtitle: "Fale direto com nosso time pelo Telegram",
    telegramButton: "Falar no Telegram",
    telegramMessage: "Olá, preciso de ajuda!",
    telegramError: "Não foi possível abrir o Telegram",
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
      telegram: "Não foi possível abrir o Telegram.",
      website: "Não foi possível abrir o site.",
    },
    verified: "Verificado",
    actions: { call: "Ligar", telegram: "Telegram", website: "Site" },
    address: "ENDEREÇO",
    openingHours: "HORÁRIO DE FUNCIONAMENTO",
    paymentMethods: "FORMAS DE PAGAMENTO",
    tags: "TAGS",
  },

  // ─── Wallet ───────────────────────────────────────────────────────────────
  wallet: {
    title: "Carteira",
    totalBalance: "SALDO TOTAL",
    usdtSubtitle: "Tether USD (USDT) · Somando todas as redes",
    allNetworks: "Somando todas as redes",
    addressCopied: "Endereço copiado!",
    sendButton: "Enviar",
    sendSubtitle: "Blockchain",
    pixButton: "Sacar",
    pixSubtitle: "com PIX",
    withdraw: "Sacar",
    pix: "PIX",
    balanceByNetwork: "SALDO POR REDE",
    balanceError:
      "Não foi possível consultar os saldos agora. Arraste para baixo para tentar de novo.",
    lowGas: "Saldo de {{symbol}} baixo para taxas",
    viewOnly:
      "Você está vendo esta carteira apenas para consulta. A chave de acesso está associada a outro dispositivo — saques só podem ser feitos a partir dele.",
  },

  walletSetup: {
    title: "Configurar carteira",
    subtitle: "Como você quer configurar?",
    description:
      "Crie uma nova carteira, importe uma existente ou conecte um endereço externo para visualização.",
    createNew: "Criar nova carteira",
    createDescription:
      "O app gera uma carteira só sua, com saldo, saque e PIX integrados. Você guarda a frase de recuperação de 12 palavras.",
    recommended: "RECOMENDADO",
    import: "Importar carteira existente",
    importDescription:
      "Já tem uma carteira com frase de 12 palavras (MetaMask, Trust Wallet, SafePal)? Importe aqui para ter acesso completo a saldo, saque e PIX.",
    viewOnly: "Só visualizar saldo",
    viewOnlyDescription:
      "Informe apenas o endereço público. Você verá o saldo mas não poderá sacar pelo app — movimentações ficam na sua wallet original.",
    connectAddress: "Conectar endereço",
    warning:
      "Nunca compartilhe sua frase de 12 palavras ou chave privada com ninguém. A Colossus Crypto jamais vai pedir essas informações.",
    clipboardError: "Não foi possível acessar a área de transferência",
    invalidAddress: "Endereço inválido.",
    connectSuccess: "Wallet externa conectada!",
    connectError: "Não foi possível salvar a wallet. Tente novamente.",
  },

  walletBackup: {
    titleReveal: "Frase de recuperação",
    titleConfirm: "Confirme o backup",
    warningNeverShare: "Nunca compartilhe",
    warningText:
      " estas 12 palavras com ninguém. Qualquer pessoa com elas pode acessar e mover todo o saldo da sua carteira. A Colossus Crypto nunca vai pedir essas palavras por telefone, chat ou e-mail.",
    revealButton: "Toque para revelar as palavras",
    continueButton: "Já anotei, continuar",
    stepLabel: "ÚLTIMA ETAPA",
    stepTitle: "Confirme que anotou corretamente",
    stepSubtitle:
      "Digite as palavras solicitadas para confirmar seu backup. Isso garante que você realmente guardou a frase em local seguro.",
    wordLabel: "PALAVRA Nº {{number}}",
    wordPlaceholder: "Digite a palavra",
    confirmButton: "Confirmar e criar carteira",
    errorWordMismatch: "Alguma palavra não confere. Verifique seu backup.",
    errorGenerate: "Não foi possível gerar a carteira. Tente novamente.",
    errorSave: "Não foi possível salvar a carteira. Tente novamente.",
    errorRegister:
      "Carteira criada localmente, mas não foi possível registrá-la no servidor. Verifique sua internet e tente novamente em Configurações > Carteira.",
    revealFirst: "Toque em 'Revelar palavras' antes de continuar.",
  },

  walletImport: {
    title: "Importar carteira",
    warningNeverShare: "Nunca compartilhe",
    warningText:
      " sua frase de recuperação. A Colossus Crypto nunca vai pedir essas palavras por telefone, chat ou e-mail. Digite apenas em conexões confiáveis.",
    sectionLabel: "FRASE DE RECUPERAÇÃO (12 PALAVRAS)",
    wordPlaceholder: "palavra",
    importButton: "Importar carteira",
    importing: "Importando...",
    errorFillAll: "Preencha todas as 12 palavras.",
    errorInvalidMnemonic:
      "Frase de recuperação inválida. Verifique as palavras e a ordem.",
    errorRegister:
      "Carteira importada localmente, mas não foi possível registrá-la no servidor. Verifique sua internet.",
    errorImport: "Não foi possível importar a carteira. Tente novamente.",
    successImport: "Carteira importada com sucesso!",
  },

  walletPinSetup: {
    labelCreate: "CRIAR PIN",
    labelReset: "REDEFINIR PIN",
    titleEnter: "Escolha seu PIN",
    titleConfirm: "Confirme o PIN",
    subtitleEnter:
      "Este PIN de 6 dígitos será pedido antes de qualquer movimentação da carteira.",
    subtitleConfirm: "Digite o PIN novamente para confirmar.",
    errorMismatch: "Os PINs não coincidem.",
    errorMismatchToast: "Os PINs não coincidem. Tente novamente.",
    errorSave: "Não foi possível salvar o PIN. Tente novamente.",
    successCreate: "PIN criado com sucesso!",
    successReset: "PIN redefinido com sucesso!",
  },

  walletExport: {
    title: "Frase de recuperação",
    lockedTitle: "Conteúdo protegido",
    lockedSubtitle:
      "Sua frase de recuperação de 12 palavras só pode ser visualizada após confirmar seu PIN de segurança.",
    unlockButton: "Confirmar PIN para ver",
    warningNeverShare: "Nunca compartilhe",
    warningText:
      " estas palavras com ninguém. Qualquer pessoa com elas pode mover todo o saldo da sua carteira sem reversão possível.",
    revealButton: "Toque para revelar",
    hideButton: "Ocultar palavras",
    copyButton: "Copiar todas as palavras",
    copiedSuccess: "Frase copiada! Guarde em local seguro.",
    errorNotFound:
      "Nenhuma seed phrase encontrada. Esta wallet pode ser externa.",
    errorRecover: "Não foi possível recuperar a seed phrase.",
    pinTitle: "Confirme seu PIN",
    pinSubtitle:
      "Autenticação necessária para exibir sua frase de recuperação.",
  },

  walletWithdraw: {
    title: "Sacar USDT",
    networkLabel: "REDE",
    addressLabel: "ENDEREÇO DE DESTINO",
    addressPlaceholder: "0x...",
    amountLabel: "VALOR",
    amountPlaceholder: "0.00",
    available: "Disponível: {{amount}} USDT",
    maxButton: "MÁX.",
    lowGas:
      "Saldo de {{symbol}} baixo — pode não ser suficiente para pagar a taxa da rede.",
    submitButton: "Revisar e sacar",
    invalidAddress: "Endereço de destino inválido.",
    invalidAmount: "Informe um valor válido.",
    insufficientBalance: "Saldo insuficiente nesta rede.",
    successToast: "Saque enviado com sucesso!",
    errorToast: "Não foi possível concluir o saque.",
    cameraPermission: "Permissão de câmera necessária para ler QR codes.",
    qrSuccess: "Endereço lido com sucesso!",
    qrInvalid: "QR code não contém um endereço válido.",
    clipboardError: "Não foi possível acessar a área de transferência",
    pinTitle: "Confirme o saque",
    pinSubtitle:
      "Você está enviando {{amount}} USDT. Confirme o PIN para prosseguir.",
  },

  walletWithdrawSuccess: {
    title: "Saque enviado!",
    subtitle:
      "A transação foi assinada e enviada à blockchain. A confirmação pode levar alguns segundos dependendo da rede.",
    txidLabel: "TXID",
    explorerButton: "Ver no Explorer",
    shareButton: "Compartilhar",
    shareMessage: "Transação confirmada:\n{{url}}",
  },

  walletWithdrawPix: {
    title: "Saque PIX",
    networkLabel: "REDE",
    quoteLabel: "COTAÇÃO ATUAL",
    usdtValue: "1 USDT vale",
    markup: "Markup da rede ({{network}})",
    quoteExpires: "Cotação expira em {{time}}",
    refresh: "Atualizar",
    quoteError: "Não foi possível carregar a cotação. Toque em Atualizar.",
    pixCodeLabel: "TEM UM CÓDIGO PIX?",
    pixCodeTitle: "COLAR CÓDIGO OU ESCANEAR QR",
    pasteButton: "Colar código",
    decoding: "Decodificando...",
    scanButton: "Escanear QR",
    pixDetected: "PIX identificado",
    beneficiary: "Beneficiário",
    city: "Cidade",
    fixedAmount: "✓ Valor fixo de R$ {{amount}} preenchido automaticamente",
    clearPix: "Limpar",
    amountLabel: "QUANTO QUER RECEBER?",
    amountPlaceholder: "0,00",
    fixedNote: "Valor fixo definido pelo QR Code",
    youSend: "Você vai enviar",
    yourBalance: "Seu saldo ({{network}})",
    insufficient: "Saldo insuficiente — faltam {{amount}} USDT.",
    expiredWarning: "Cotação expirada. Atualize antes de continuar.",
    continueButton: "Continuar",
    quoteLoadError: "Não foi possível carregar a cotação.",
    cameraPermission: "Permissão de câmera necessária.",
    qrInvalid: "Código PIX inválido ou não reconhecido.",
    clipboardEmpty: "Área de transferência vazia.",
    clipboardError: "Não foi possível acessar a área de transferência.",
    qrHint: "Aponte para o QR Code do PIX",
    pixIdentified: "PIX identificado: {{name}}",
  },

  walletWithdrawPixForm: {
    title: "Dados do PIX",
    summaryLabel: "RESUMO",
    youReceive: "Você recebe",
    youSend: "Você envia",
    network: "Rede",
    keyTypeLabel: "TIPO DE CHAVE PIX",
    pixKeyLabel: "CHAVE PIX",
    copyPastePlaceholder: "Cole o código ou escaneie",
    emailLabel: "E-MAIL PARA COMPROVANTE",
    emailPlaceholder: "email@exemplo.com",
    saveEmail: "Salvar e-mail para próximas transações",
    beneficiary: "Beneficiário",
    proceedButton: "Revisar e confirmar",
    errorNoKey: "Informe a chave PIX.",
    errorNoEmail: "Informe um e-mail válido para o comprovante.",
    cameraPermission: "Permissão de câmera necessária.",
    qrInvalid: "QR Code inválido ou não reconhecido.",
    qrSuccess: "QR lido: {{name}}",
    fixedAmount: "QR com valor fixo: R$ {{amount}}",
  },

  walletWithdrawPixConfirm: {
    title: "Confirmar PIX",
    detailsLabel: "DETALHES DA OPERAÇÃO",
    network: "Rede",
    keyType: "Tipo de chave",
    pixKey: "Chave PIX",
    beneficiary: "Beneficiário",
    emailReceipt: "E-mail comprovante",
    youSend: "Você envia",
    quote: "Cotação",
    receiveLabel: "Você recebe via PIX",
    blockchainNote: "Sujeito a confirmação da rede blockchain",
    confirmButton: "Confirmar com PIN",
    pinTitle: "Confirme o PIX",
    pinSubtitle: "Você vai enviar {{usdt}} USDT e receber R$ {{brl}} via PIX.",
    errorGeneric: "Não foi possível processar o saque PIX.",
  },

  walletWithdrawPixStatus: {
    title: "Aguardando confirmação",
    subtitle:
      "O USDT foi enviado. Estamos aguardando a confirmação na blockchain para processar o PIX.",
    network: "Rede",
    pixKey: "Chave PIX",
    type: "Tipo",
    amountBrl: "Valor BRL",
    txid: "TXID",
    txidCopied: "TXID copiado!",
    errorExpired:
      "A transação expirou antes de ser confirmada. Verifique seu saldo e tente novamente.",
    errorFailed:
      "A transação falhou. O USDT pode ter sido devolvido — verifique seu saldo e entre em contato com o suporte informando o TXID.",
    errorGeneric:
      "Ocorreu um erro na transação. Entre em contato com o suporte informando o TXID.",
    errorTimeout: "Tempo de espera esgotado. Verifique o status em breve.",
  },

  walletWithdrawPixSuccess: {
    title: "PIX enviado!",
    subtitle:
      "O pagamento foi processado com sucesso. O beneficiário deve receber em instantes.",
    valueLabel: "Valor recebido via PIX",
    receiptTitle: "COMPROVANTE",
    beneficiary: "Beneficiário",
    pixKey: "Chave PIX",
    type: "Tipo",
    usdtSent: "USDT enviado",
    totalBrl: "Total BRL",
    endToEnd: "End-to-End",
    txidBlockchain: "TXID Blockchain",
    newTransaction: "Realizar nova transação",
    viewBlockchain: "Ver na blockchain",
    shareReceipt: "Compartilhar comprovante",
    shareMessage:
      "✅ PIX enviado com sucesso!\n\nBeneficiário: {{name}}\nChave PIX: {{key}} ({{type}})\nValor: R$ {{brl}}\nEnd-to-End: {{endtoend}}\nUSDT enviado: {{usdt}}\n\nBlockchain: {{url}}",
  },

  walletPixReceipt: {
    title: "Comprovante PIX",
    loading: "Consultando comprovante...",
    error:
      "Não foi possível carregar o comprovante. A transação pode ainda estar sendo processada.",
    confirmed: "PIX CONFIRMADO",
    valueLabel: "Valor recebido via PIX",
    sectionRecipient: "DESTINATÁRIO",
    name: "Nome",
    pixKey: "Chave PIX",
    keyType: "Tipo de chave",
    sectionValues: "VALORES",
    valueSent: "Valor enviado",
    usdtUsed: "USDT utilizado",
    sectionId: "IDENTIFICAÇÃO",
    network: "Rede",
    txid: "TXID Blockchain",
    date: "Data",
    share: "Compartilhar comprovante",
    viewBlockchain: "Ver na blockchain",
    shareHeader: "✅ Comprovante PIX",
    beneficiary: "Beneficiário",
  },

  walletHistory: {
    title: "Extrato Blockchain",
    loading: "Buscando transações na blockchain...",
    error:
      "Não foi possível carregar o extrato. Verifique sua conexão e tente novamente.",
    retry: "Tentar novamente",
    empty:
      "Nenhuma transação encontrada para este endereço na rede {{network}}.",
    received: "Recebido",
    sent: "Enviado",
    pixOffRamp: "PIX OFF-RAMP",
    pixReceipt: "Comprovante PIX",
    blockchain: "Blockchain",
  },
  gasSponsor: {
    idleTitle: "Gas patrocinado",
    idleSubtitle:
      "Seu saldo de {{symbol}} está baixo.\nSolicite gas patrocinado para continuar operando.",
    network: "Rede",
    gasSent: "Gas enviado",
    cost: "Custo para você",
    free: "0.1 USDT",
    collateralNote1: "Ao solicitar, você autoriza um empenho de",
    collateralNote2: "do seu saldo como taxa pelo gas patrocinado.",
    requestButton: "Solicitar gas patrocinado",
    notNow: "Agora não",
    requestingTitle: "Enviando gas...",
    requestingSubtitle:
      "Verificando sua identidade e saldo.\nO gas está sendo enviado para sua carteira.",
    approvingTitle: "Confirmando pagamento...",
    approvingSubtitle:
      "Gas recebido! Processando o pagamento\nde 0.1 USDT na blockchain.",
    successTitle: "Gas recebido!",
    successSubtitle:
      "Tudo pronto. Você já pode realizar operações na rede {{network}}.",
    gasReceived: "Gas recebido",
    collateral: "Taxa paga",
    continue: "Continuar",
    errorTitle: "Não foi possível",
    errorGeneric:
      "Não foi possível solicitar gas patrocinado. Tente novamente.",
    retry: "Tentar novamente",
    close: "Fechar",
  },
};
