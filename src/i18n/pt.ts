export default {
  login: {
    welcome: "Bem-vindo de volta",
    subtitle: "Blockchain fácil na palma da sua mão.",
    user: "Usuário",
    password: "Senha",
    login: "Entrar",
    forgotPassword: "Esqueci minha senha",
    register: "Comunidade do Telegram",
    chooseLanguage: "Escolha o idioma",
    changeLanguage: "Isso muda o idioma exibido no aplicativo",
  },

  menu: {
    title: "Menu",
    preferences: "PREFERÊNCIAS",
    general: "GERAL",
    languageAndCurrency: "Idioma e Moeda",
    logout: "Apagar Carteira",
    logoutError: "Não foi possível sair. Tente novamente.",
    items: {
      notifications: "Notificações",
      info: "Receber",
      wallet: "Mnemônico",
      invoices: "Histórico",
      support: "Suporte",
      about: "Sobre",
      termsOfUse: "Termos de uso",
      printer: "Impressora",
      community: "Comunidade",
    },
    modal: {
      title: "Atenção",
      description:
        " Ao sair da sua conta, todas as chaves da carteira serão removidas deste dispositivo.",
      warning:
        "Se você NÃO salvou suas 12 palavras de recuperação, poderá perder o acesso à sua carteira e aos seus fundos permanentemente.",
      warning_plus: "Esta ação é irreversível.",
      cancel: "Cancelar",
      understood: "Entendi, sair da conta",
    },
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
        question: "1. O que é a {{appName}}?",
        answer:
          "A {{appName}} é uma carteira digital de autocustódia desenvolvida pela I Like Technology, que permite a qualquer pessoa guardar, enviar e receber USDT (Tether) nas redes blockchain suportadas, com total controle sobre os próprios fundos.",
      },
      q2: {
        question: "2. Quem pode utilizar a {{appName}}?",
        answer:
          "Qualquer pessoa maior de 18 anos — não é preciso ser comerciante ou empresa. Se você quer guardar seus USDT com segurança, enviar para outras carteiras ou receber de qualquer lugar do mundo, a {{appName}} é para você.",
      },
      q3: {
        question: "3. O que significa autocustódia?",
        answer:
          "Significa que só você tem acesso aos seus fundos. As chaves da sua carteira (as 12 palavras de recuperação) ficam apenas no seu dispositivo — nem a {{appName}} consegue acessá-las, movimentar seus ativos ou recuperá-las por você.",
      },
      q4: {
        question: "4. Quais são as taxas?",
        answer:
          "Guardar e receber USDT na {{appName}} não custa nada. Ao enviar, você paga apenas a taxa de rede (gás), cobrada pela própria blockchain — não pela {{appName}}. Funcionalidades específicas, quando tiverem custo, mostram o valor antes de você confirmar.",
      },
      q5: {
        question: "5. Preciso entender de criptomoedas para usar?",
        answer:
          "Não. O app foi projetado para ser simples e intuitivo, mesmo para quem nunca usou criptomoedas. Você cria sua carteira em minutos e o app te orienta em cada passo.",
      },
      q6: {
        question: "6. O que acontece se eu perder minhas 12 palavras?",
        answer:
          "As 12 palavras são a única forma de recuperar sua carteira. Se você perdê-las, o acesso aos fundos é perdido de forma definitiva — ninguém, nem a {{appName}}, pode recuperá-las. Por isso, anote em papel e guarde em local seguro.",
      },
      q7: {
        question: "7. É seguro usar USDT?",
        answer:
          "O USDT é uma stablecoin lastreada em dólar, com alta liquidez e ampla adoção. A {{appName}} soma a isso criptografia local, PIN de acesso e bloqueio de capturas de tela nas áreas sensíveis.",
      },
      q8: {
        question: "8. Em quais redes a {{appName}} funciona?",
        answer:
          "Atualmente nas redes Polygon e Plasma. Ao enviar ou receber, confira sempre se a rede selecionada é a mesma da outra carteira — envios em rede incompatível não podem ser recuperados.",
      },
      q9: {
        question: "9. Como começo a usar?",
        answer:
          "Baixe o app, crie uma carteira nova (ou importe uma existente com suas 12 palavras) e pronto: em poucos minutos você já pode receber e enviar USDT.",
      },
      q10: {
        question: "10. O que é o gás patrocinado?",
        answer:
          "Para enviar USDT, a blockchain cobra uma pequena taxa na moeda nativa da rede (como POL na Polygon). Se o seu saldo dessa moeda estiver baixo, a {{appName}} pode patrocinar o gás: você recebe o necessário para concluir suas transações sem precisar comprar a moeda nativa em outro lugar. Quando disponível, o app oferece isso automaticamente.",
      },
    },
  },
  terms: {
    title: "Termos de Uso",
    docTitle: "Termos de Uso – {{appName}}",
    lastUpdated: "Última atualização: {{date}}",
    intro:
      'Este Termo de Uso regula a utilização do aplicativo {{appName}}, doravante denominado "Aplicativo", de titularidade da I Like Technology, inscrita sob o CNPJ nº 45.123.168/0001-22.\n\nAo acessar ou utilizar qualquer funcionalidade do Aplicativo, o Usuário declara ter lido, compreendido e concordado integralmente com as disposições aqui previstas.',
    footerNote: "{{appName}} · I Like Technology\nCNPJ 45.123.168/0001-22",
    sections: {
      s1: {
        title: "Objeto e Natureza do Serviço",
        paragraphs: [
          "1.1. O {{appName}} é uma carteira digital de autocustódia (self-custody) que permite ao Usuário armazenar, enviar e receber ativos digitais, em especial a stablecoin USDT (Tether), nas redes blockchain suportadas (como Polygon e Plasma).",
          "1.2. A I Like Technology fornece exclusivamente a tecnologia de interface com as redes blockchain. Não é instituição financeira, corretora, exchange ou custodiante, não intermedeia operações e não detém, em nenhum momento, a posse, o controle ou o acesso aos ativos do Usuário.",
        ],
      },
      s2: {
        title: "Autocustódia e Chaves Privadas",
        paragraphs: [
          "2.1. As chaves privadas e a frase de recuperação (12 palavras) são geradas e armazenadas exclusivamente no dispositivo do Usuário. A I Like Technology não possui cópia, backup ou qualquer meio de acesso a elas.",
          "2.2. O Usuário é o único e exclusivo responsável pela guarda e sigilo da sua frase de recuperação. A perda, o extravio ou o compartilhamento indevido dessas informações implica a perda definitiva e irreversível do acesso aos ativos, sem qualquer possibilidade de recuperação pela I Like Technology.",
          "2.3. O {{appName}} jamais solicitará a frase de recuperação por e-mail, telefone, aplicativos de mensagem ou qualquer outro canal.",
        ],
      },
      s3: {
        title: "Cadastro e Elegibilidade",
        paragraphs: [
          "3.1. Para utilizar os serviços, o Usuário deverá fornecer informações verídicas, completas e atualizadas, sendo civilmente responsável pela sua exatidão.",
          "3.2. O uso do Aplicativo é permitido apenas a maiores de 18 (dezoito) anos, plenamente capazes.",
          "3.3. A I Like Technology reserva-se o direito de recusar ou suspender cadastros em caso de inconsistências, fraude ou uso indevido.",
        ],
      },
      s4: {
        title: "Condições de Uso e Vedações",
        paragraphs: [
          "4.1. O Usuário compromete-se a utilizar o Aplicativo exclusivamente para fins lícitos, responsabilizando-se civil e criminalmente por seus atos.",
          "4.2. É expressamente vedada a utilização do Aplicativo para:",
        ],
        bullets: [
          "Transações fraudulentas ou vinculadas a atividades ilegais",
          "Lavagem de dinheiro ou financiamento ao terrorismo",
          "Comércio de produtos ou serviços proibidos por lei",
          "Tentativas de burlar, atacar ou explorar vulnerabilidades do Aplicativo ou das redes blockchain",
        ],
      },
      s5: {
        title: "Transações em Blockchain",
        paragraphs: [
          "5.1. As transações em blockchain são definitivas e irreversíveis. Uma vez confirmadas na rede, não podem ser canceladas, estornadas ou modificadas pela I Like Technology.",
          "5.2. É responsabilidade exclusiva do Usuário conferir o endereço de destino e a rede selecionada antes de confirmar qualquer envio. Ativos enviados a endereços incorretos ou em rede incompatível são irrecuperáveis.",
          "5.3. As transações estão sujeitas a taxas de rede (gás), cobradas pelas próprias redes blockchain e alheias ao controle da I Like Technology.",
        ],
      },
      s6: {
        title: "Riscos",
        paragraphs: [
          "6.1. O Usuário declara estar ciente dos riscos inerentes aos ativos digitais, incluindo, entre outros: volatilidade de preços, possibilidade de perda de paridade de stablecoins, falhas, congestionamentos ou ataques às redes blockchain e alterações regulatórias.",
          "6.2. A utilização do Aplicativo é feita por conta e risco do Usuário, que reconhece que ativos digitais não contam com garantia de fundos ou proteção governamental.",
        ],
      },
      s7: {
        title: "Taxas",
        paragraphs: [
          "7.1. Funcionalidades específicas do Aplicativo poderão estar sujeitas a taxas de serviço, sempre informadas de forma clara antes da confirmação da operação.",
          "7.2. A I Like Technology reserva-se o direito de alterar suas taxas mediante aviso prévio com antecedência mínima de 15 (quinze) dias.",
        ],
      },
      s8: {
        title: "Propriedade Intelectual",
        paragraphs: [
          "Todos os elementos do {{appName}}, incluindo logotipos, sistemas, códigos, conteúdos e marcas, são de propriedade exclusiva da I Like Technology, sendo vedada qualquer reprodução ou uso não autorizado.",
        ],
      },
      s9: {
        title: "Limitação de Responsabilidade",
        paragraphs: ["9.1. A I Like Technology não se responsabiliza por:"],
        bullets: [
          "Perda, roubo ou compartilhamento da frase de recuperação ou das chaves privadas do Usuário",
          "Transações enviadas a endereços incorretos ou em redes incompatíveis",
          "Falhas, congestionamentos ou ataques às redes blockchain e a serviços de terceiros",
          "Acesso indevido ao dispositivo do Usuário, inclusive por malware ou engenharia social",
          "Variações de preço ou perda de paridade de ativos digitais",
        ],
      },
      s10: {
        title: "Modificações e Disposições Gerais",
        paragraphs: [
          "10.1. Este Termo poderá ser alterado a qualquer momento. O uso contínuo do Aplicativo após a publicação das alterações implicará aceitação tácita dos novos termos.",
          "10.2. Este Termo é regido pelas leis da República Federativa do Brasil, ficando eleito o foro do domicílio do Usuário para dirimir eventuais controvérsias.",
        ],
      },
    },
  },
  communityMap: {
    headerTitle: "Comunidade Colossus",
    filterAll: "Todos",
    loading: "Carregando Comunidade Colossus...",
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
  about: {
    title: "Sobre",
    versionLabel: "VERSÃO {{version}}",
    brazilTitle: "Tecnologia 100% brasileira",
    brazilDescriptionBefore: "A {{devName}} é desenvolvida e mantida ",
    brazilDescriptionHighlight: "no Brasil, por brasileiros",
    brazilDescriptionAfter:
      ", unindo tecnologia de ponta em criptomoedas com o suporte e a confiança de uma empresa nacional.",
    developedBy: "DESENVOLVIDO POR",
    companyLabel: "EMPRESA",
    cnpjLabel: "CNPJ",
    footerNote: "Feito com 💜 e no 🇧🇷 para todo o mundo.",
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
    receiveButton: "Receber",
    receiveSubtitle: "QR e endereço",
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
    modal: {
      pinTitle:
        "Para ter acesso a carteira precisamos validar o seu código PIN.",
      pinTitleModal: "Autenticação necessária para acessar a carteira.",
    },
  },
  walletReceive: {
    addressLabel: "Endereço",
    copy: "Copiar",
    share: "Compartilhar",
    title: "Receber",
  },

  walletSecurity: {
    title: "Antes de criar sua carteira",
    steps: {
      selfCustody: {
        title: "Você no controle total",
        text: "O {{appName}} é uma carteira de autocustódia: só você tem acesso aos seus fundos. Nós não guardamos cópia das suas 12 palavras e não podemos recuperá-las por você.",
      },
      writePaper: {
        title: "Anote em papel",
        text: "Você vai receber 12 palavras de recuperação. Anote-as à mão, em papel, na ordem exata, e guarde em local seguro — de preferência mais de uma cópia, em lugares diferentes.",
      },
      noScreenshot: {
        title: "Nada de print ou foto",
        text: "Não tire captura de tela nem fotografe as palavras. Imagens vão para a galeria, nuvem e backups automáticos — qualquer app com acesso pode roubá-las.",
      },
      noCloud: {
        title: "Nunca envie ou digite",
        text: "Não envie as palavras por e-mail, WhatsApp ou nuvem, e não as digite em sites ou outros apps. O {{appName}} nunca vai pedir suas 12 palavras.",
      },
    },
    acceptText:
      "Estou ciente de que, se eu perder minhas 12 palavras, perderei o acesso aos meus fundos de forma definitiva e ninguém — nem o {{appName}} — poderá recuperá-los.",
    acceptButton: "Entendi, criar carteira",
    nextButton: "Continuar",
  },
  walletSetup: {
    title: "Configurar carteira",
    subtitle: "Como você quer configurar?",
    description: "Crie uma nova carteira ou importe uma existente.",
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
      "Nunca compartilhe sua frase de 12 palavras ou chave privada com ninguém. A {{appName}} jamais vai pedir essas informações.",
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
      " estas 12 palavras com ninguém. Qualquer pessoa com elas pode acessar e mover todo o saldo da sua carteira. A {{appName}} nunca vai pedir essas palavras por telefone, chat ou e-mail.",
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
    generating: "Gerando sua carteira com segurança...",
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
      " sua frase de recuperação. A {{appName}} nunca vai pedir essas palavras por telefone, chat ou e-mail. Digite apenas em conexões confiáveis.",
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
    memoLabel: "MEMO (OPCIONAL)",
    memoPlaceholder: "Identificação ou nota da transação",
    memoNote: "O memo é opcional e fica registrado na blockchain.",
    qrHint: "Aponte para o endereço em QR Code",
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
  notifications: {
    title: "Notificações",
    empty: "Nenhuma notificação no momento",
    permissionDenied: "Helm precisa da sua aprovação para enviar notificações. Ative nas configurações do dispositivo.",
    status: "STATUS",
    statusGranted: "Ativadas",
    statusDenied: "Desativadas",
    descriptionGranted: "Você receberá notificações sobre suas transações, alertas de segurança e atualizações importantes.",
    descriptionDenied: "Ative as notificações para receber atualizações sobre suas transações e alertas importantes.",
    everythingReady: "Tudo pronto! Você está recebendo notificações.",
    enable: "Ativar Notificações",
    openSettings: "Abrir Configurações",
    whyNeeded: "POR QUE PRECISA?",
    whyDescription: "As notificações ajudam você a ficar informado sobre:\n\n• Novas transações recebidas\n• Confirmação de saques\n• Alertas de segurança\n• Atualizações importantes",
    enabled: "Notificações ativadas com sucesso!",
    requiresSettings: "Abra as configurações do dispositivo para ativar.",
    enableError: "Não foi possível ativar notificações.",
    settingsError: "Não foi possível abrir as configurações.",
  },
};
