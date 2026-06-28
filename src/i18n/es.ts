export default {
  login: {
    welcome: "Bienvenido de nuevo",
    subtitle: "Inicia sesión con tu cuenta para continuar",
    user: "Usuario",
    password: "Contraseña",
    login: "Iniciar sesión",
    forgotPassword: "Olvidé mi contraseña",
    register: "Quiero registrarme",
    chooseLanguage: "Elige el idioma",
    changeLanguage: "Esto cambia el idioma mostrado en la aplicación",
    or: "O",
  },
  forget: {
    title: "¿Olvidaste tu contraseña?",
    subtitle:
      "Indica el correo registrado y te enviaremos un código para restablecer tu contraseña.",
    iemail: "Tu correo electrónico",
    send: "Enviar",
    know: "¿Recordaste la contraseña?",
    open: "Iniciar sesión",
  },
  pinforger: {
    title: "Ingresa el código recibido",
    subtitle: " Enviamos un código de 6 dígitos a",
    label_new_pass: "NUEVA CONTRASEÑA",
    inew: "Nueva contraseña",
    cnew: "Confirmar nueva contraseña",

    bconfirm: "Confirmar",
    breturn: "Volver",
  },
  cadwallet: {
    title: "Billetera de recepción",
    configured: "Billetera configurada",
    network: "RED",
    addressLabel: "DIRECCIÓN DE LA BILLETERA",
    addressDescription:
      "Los pagos recibidos se reenviarán automáticamente a esta dirección en la red seleccionada.",
    addressPlaceholder: "0x...",
    registerWallet: "Registrar billetera",
    copySuccess: "¡Dirección copiada!",
    registerSuccess: "¡Billetera de recepción registrada!",
    invalidAddress: "Dirección inválida para la red {{network}}.",
    clipboardError: "No fue posible acceder al portapapeles",
    walletCheckError:
      "No fue posible verificar tu billetera. Inténtalo de nuevo.",
    comingSoon: "¡Próximamente!",
    token: "USDT",
  },
  dashboard: {
    generateCharge: "Generar cobro",
    keypad: {
      clear: "C",
      backspace: "⌫",
    },
    validation: {
      invalidAmount: "Indica un monto válido.",
    },
  },
  extract: {
    title: "Cobros",
    period: "PERÍODO",
    status: "ESTADO",
    periods: {
      today: "Hoy",
      sevenDays: "7 días",
      thirtyDays: "30 días",
      custom: "Personalizado",
    },
    statusOptions: {
      open: "Abierto",
      confirmed: "Confirmado",
      cancelled: "Cancelado",
    },
    noConfirmationDate: "Sin fecha de confirmación",
    loading: "Cargando cobros...",
    empty: "No se encontraron cobros para ese período y estado.",
    errors: {
      loadInvoices: "Error al buscar cobros.",
    },
  },
  about: {
    title: "Acerca de",
    versionLabel: "VERSIÓN {{version}}",
    brazilTitle: "Tecnología 100% brasileña",
    brazilDescriptionBefore: "Colossus Crypto es desarrollada y mantenida ",
    brazilDescriptionHighlight: "en Brasil, por brasileños",
    brazilDescriptionAfter:
      ", combinando tecnología de vanguardia en criptomonedas con el respaldo y la confianza de una empresa nacional.",
    developedBy: "DESARROLLADO POR",
    companyLabel: "EMPRESA",
    cnpjLabel: "CNPJ",
    footerNote: "Hecho con 💜 en 🇧🇷 para todo el mundo.",
  },
  info: {
    title: "Mi información",
    personTypeIndividual: "Persona física",
    personTypeCompany: "Persona jurídica",
    errorLoad: "No fue posible cargar tu información.",
    retry: "Intentar de nuevo",
    errorEmpty: "No se encontró información.",
    registrationData: "DATOS DE REGISTRO",
    socialName: "NOMBRE SOCIAL",
    document: "DOCUMENTO",
    contact: "CONTACTO",
    email: "CORREO ELECTRÓNICO",
    phone: "TELÉFONO",
    address: "DIRECCIÓN",
    street: "CALLE",
    city: "CIUDAD",
    zipCode: "CÓDIGO POSTAL",
    emptyValue: "-",
  },
  invoice: {
    title: "Cobro",
    loadingInvoice: "Cargando cobro...",
    toastExpired: "Cobro vencido",
    toastTimeUp: "Tiempo agotado. Volviendo...",
    toastAddressCopied: "¡Dirección copiada!",
    amountLabel: "MONTO A PAGAR",
    expiresIn: "Vence en {{time}}",
    cancelInvoice: "Cancelar cobro",
  },
  menu: {
    title: "Configuración",
    preferences: "PREFERENCIAS",
    general: "GENERAL",
    languageAndCurrency: "Idioma y moneda",
    logout: "Cerrar sesión",
    logoutError: "No fue posible cerrar sesión. Inténtalo de nuevo.",
    items: {
      info: "Información",
      wallet: "Billetera",
      invoices: "Cobros",
      support: "Soporte",
      about: "Acerca de",
      termsOfUse: "Términos de uso",
      printer: "Impresora",
      community: "Comunidad",
    },
  },
  printer: {
    title: "Impresora",
    labelSizeTitle: "Tamaño de etiqueta",
    labelSizeSubtitle: "Elige el modelo compatible con tu impresora térmica",
    toastSaved: "¡Impresora {{model}} guardada!",
    toastSaveError: "No fue posible guardar la configuración.",
    options: {
      compact: "Compacta",
      standard: "Estándar",
    },
  },
  receipt: {
    toastNoPrinter: "No hay impresora configurada. Ve a la configuración.",
    toastPrintSuccess: "¡Comprobante impreso!",
    toastPrintError: "No fue posible imprimir. Verifica la impresora.",
    notFound: "Comprobante no encontrado.",
    paymentConfirmed: "Pago confirmado",
    validatedOnBlockchain: "La transacción fue validada en la blockchain",
    receiptSubtitle: "Comprobante de pago",
    amountReceived: "MONTO RECIBIDO",
    confirmationDate: "FECHA DE CONFIRMACIÓN",
    recipient: "DESTINATARIO",
    reference: "REFERENCIA",
    txid: "TXID",
    printButton: "Imprimir comprobante",
    backButton: "Volver al inicio",
    print: {
      headerTitle: "Proof Colossus Crypto",
      statusConfirmed: "PAGO CONFIRMADO",
      amountLabel: "Monto",
      dateTimeLabel: "Fecha/Hora",
      recipientLabel: "Destinatario:",
      referenceLabel: "Referencia:",
      txidLabel: "TXID:",
      scanHint: "Escanea para ver en Polygonscan",
    },
  },
  selectNetwork: {
    title: "Elige la red",
    amountSummaryLabel: "MONTO DEL COBRO",
    availableNetworks: "REDES DISPONIBLES",
    loadingNetworks: "Cargando redes...",
    loadNetworksError: "No fue posible cargar las redes.",
    retry: "Intentar de nuevo",
    conversionHint: "El monto se convertirá a USDT según la cotización actual",
    proceed: "Continuar",
    createInvoiceError: "No fue posible crear el cobro. Inténtalo de nuevo.",
    noForwardWallet:
      "Billetera de recepción no encontrada. Registra una billetera para continuar.",
  },
  settingsLanguage: {
    title: "Idioma y moneda",
    appLanguage: "IDIOMA DE LA APP",
    currencyForBilling: "MONEDA PARA COBROS",
    toastLanguageError: "No fue posible guardar el idioma.",
    toastCurrencyError: "No fue posible guardar la moneda.",
    currencySubLabel: {
      BRL: "Real brasileño",
      USD: "Dólar estadounidense",
      PYG: "Guaraní paraguayo",
    },
  },
  support: {
    title: "Soporte",
    needHelp: "¿Necesitas ayuda?",
    contactSubtitle: "Habla directamente con nuestro equipo por WhatsApp",
    whatsappButton: "Hablar por WhatsApp",
    whatsappMessage: "Hola, ¡necesito ayuda!",
    whatsappError: "No fue posible abrir WhatsApp",
    faqSectionTitle: "PREGUNTAS FRECUENTES",
    faq: {
      q1: {
        question: "1. ¿Qué es Colossus Crypto?",
        answer:
          "Colossus Crypto es una solución de pagos digitales desarrollada por I Like Technology que permite a comercios de todos los tamaños aceptar pagos en USDT (Tether) —una de las criptomonedas más estables y utilizadas del mundo— mediante aplicación, sistema web y terminal de pago.",
      },
      q2: {
        question: "2. ¿Quién puede usar Colossus Crypto?",
        answer:
          "La plataforma está dirigida a comerciantes (personas físicas o jurídicas) que desean ofrecer a sus clientes una alternativa de pago moderna y segura, además de contar con tarifas más atractivas y liquidez inmediata.",
      },
      q3: {
        question: "3. ¿Cómo funciona la recepción de pagos en USDT?",
        answer:
          "Al realizar una venta, el comerciante genera un código QR o enlace de pago a través de la app, el sistema o la terminal. El cliente paga en USDT y el monto se recibe instantáneamente en la billetera digital del comerciante vinculada a Colossus Crypto.",
      },
      q4: {
        question: "4. ¿Qué tarifas cobra Colossus Crypto?",
        answer:
          "Colossus Crypto cobra una tarifa fija del 1.95% por transacción, inferior al promedio aplicado por los operadores tradicionales de tarjetas de crédito.",
      },
      q5: {
        question:
          "5. ¿Necesito entender de criptomonedas para usar la plataforma?",
        answer:
          "No. La plataforma fue diseñada para ser intuitiva y simple, con una interfaz amigable y soporte dedicado, incluso para quienes nunca han usado criptomonedas.",
      },
      q6: {
        question: "6. ¿Dónde puedo usar Colossus Crypto?",
        answer:
          "La solución puede utilizarse en tiendas físicas, comercios electrónicos, servicios de entrega o profesionales independientes, a través de la app móvil, el sistema web o una terminal de pago compatible.",
      },
      q7: {
        question: "7. ¿Es seguro recibir pagos en USDT?",
        answer:
          "Sí. USDT es una stablecoin respaldada por el dólar, con alta estabilidad y liquidez. Además, Colossus Crypto utiliza tecnologías de seguridad, cifrado y autenticación para garantizar total protección en las transacciones.",
      },
      q8: {
        question:
          "8. ¿Cuáles son los beneficios de aceptar criptomonedas en mi negocio?",
        answer:
          "Además de la visibilidad como empresa moderna, los comerciantes se benefician con tarifas más bajas, liquidación instantánea, acceso a un nuevo perfil de consumidores y exención de trámites bancarios tradicionales.",
      },
      q9: {
        question: "9. ¿Necesito registrarme para usarla?",
        answer:
          "Descarga la app, regístrate con un asesor de Colossus Crypto y, tras la verificación, tu empresa estará lista para aceptar pagos en USDT.",
      },
    },
  },
  terms: {
    title: "Términos de uso",
    docTitle: "Términos de Uso – Colossus Crypto",
    lastUpdated: "Última actualización: {{date}}",
    intro:
      'Estos Términos de Uso regulan el uso de la plataforma Colossus Crypto, en adelante denominada "Plataforma", de titularidad de I Like Technology, inscrita bajo el CNPJ n.º 45.123.168/0001-22.\n\nAl acceder o utilizar cualquier funcionalidad disponible en la Plataforma, el Usuario declara haber leído, comprendido y aceptado íntegramente las disposiciones aquí previstas.',
    footerNote: "Colossus Crypto · I Like Technology\nCNPJ 45.123.168/0001-22",
    sections: {
      s1: {
        title: "Objeto",
        paragraphs: [
          "La presente plataforma tiene por finalidad ofrecer soluciones tecnológicas para que comerciantes y usuarios acepten y realicen pagos mediante activos digitales, especialmente la stablecoin USDT (Tether), en un entorno seguro, eficiente y transparente, a través de aplicación, sistema web, API y dispositivos físicos (terminales).",
        ],
      },
      s2: {
        title: "Registro y elegibilidad",
        paragraphs: [
          "2.1. Para utilizar los servicios, el Usuario deberá realizar un registro previo, proporcionando información veraz, completa y actualizada.",
          "2.2. I Like Technology se reserva el derecho de verificar la veracidad de la información, pudiendo, incluso, rechazar o suspender registros en caso de inconsistencias o uso indebido.",
        ],
      },
      s3: {
        title: "Condiciones de uso",
        paragraphs: [
          "3.1. El Usuario se compromete a utilizar la Plataforma exclusivamente para fines lícitos, siendo civil y penalmente responsable por cualquier acto practicado.",
          "3.2. Queda prohibido el uso de la Plataforma para:",
        ],
        bullets: [
          "Transacciones fraudulentas o que involucren actividades ilegales",
          "Lavado de dinero o financiamiento del terrorismo",
          "Comercio de productos o servicios prohibidos por la ley",
        ],
      },
      s4: {
        title: "Remuneración y tarifas",
        paragraphs: [
          "4.1. La utilización de la Plataforma podrá implicar el cobro de tarifas, actualmente fijadas en 2% (dos por ciento) sobre cada transacción realizada.",
          "4.2. I Like Technology se reserva el derecho de modificar los valores mediante aviso previo con una antelación mínima de 15 (quince) días.",
        ],
      },
      s5: {
        title: "Propiedad intelectual",
        paragraphs: [
          "Todos los elementos de Colossus Crypto, incluidos logotipos, sistemas, códigos, contenidos y marcas, son propiedad exclusiva de I Like Technology, quedando prohibida cualquier reproducción o uso no autorizado.",
        ],
      },
      s6: {
        title: "Responsabilidades",
        paragraphs: ["6.1. I Like Technology no se responsabiliza por:"],
        bullets: [
          "Errores causados por el mal uso de la plataforma",
          "Fallas derivadas de terceros (por ejemplo, operadoras de internet)",
          "Pérdidas financieras derivadas de transacciones indebidas realizadas por terceros con acceso a la cuenta o billetera del usuario",
        ],
      },
      s7: {
        title: "Modificaciones y actualizaciones",
        paragraphs: [
          "Estos Términos podrán modificarse en cualquier momento. El uso continuado de la plataforma tras la publicación de los cambios implicará la aceptación tácita de los nuevos términos.",
        ],
      },
    },
  },
};
