export default {
  login: {
    welcome: "Welcome back",
    subtitle: "Sign in to your account to continue",
    user: "Username",
    password: "Password",
    login: "Sign in",
    forgotPassword: "Forgot my password",
    register: "I want to sign up",
    chooseLanguage: "Choose language",
    changeLanguage: "This changes the language displayed in the app",
    or: "OR",
  },
  forget: {
    title: "Forgot your password?",
    subtitle:
      "Enter your registered email and we'll send you a code to reset your password.",
    iemail: "Your Email",
    send: "Send",
    know: "Remembered your password?",
    open: "Sign in",
  },
  pinforger: {
    title: "Enter the code you received",
    subtitle: " We sent a 6-digit code to",
    label_new_pass: "NEW PASSWORD",
    inew: "New Password",
    cnew: "Confirm New Password",

    bconfirm: "Confirm",
    breturn: "Back",
  },
  cadwallet: {
    title: "Receiving Wallet",
    configured: "Wallet configured",
    network: "NETWORK",
    addressLabel: "WALLET ADDRESS",
    addressDescription:
      "Payments received will be automatically forwarded to this address on the selected network.",
    addressPlaceholder: "0x...",
    registerWallet: "Register wallet",
    copySuccess: "Address copied!",
    registerSuccess: "Receiving wallet registered!",
    invalidAddress: "Invalid address for the {{network}} network.",
    clipboardError: "Unable to access the clipboard",
    walletCheckError: "Unable to verify your wallet. Please try again.",
    comingSoon: "Coming soon!",
    token: "USDT",
  },
  dashboard: {
    generateCharge: "Generate charge",
    keypad: {
      clear: "C",
      backspace: "⌫",
    },
    validation: {
      invalidAmount: "Enter a valid amount.",
    },
  },
  extract: {
    title: "Charges",
    period: "PERIOD",
    status: "STATUS",
    periods: {
      today: "Today",
      sevenDays: "7 days",
      thirtyDays: "30 days",
      custom: "Custom",
    },
    statusOptions: {
      open: "Open",
      confirmed: "Confirmed",
      cancelled: "Cancelled",
    },
    noConfirmationDate: "No confirmation date",
    loading: "Loading charges...",
    empty: "No charges found for this period and status.",
    errors: {
      loadInvoices: "Error fetching charges.",
    },
  },
  about: {
    title: "About",
    versionLabel: "VERSION {{version}}",
    brazilTitle: "100% Brazilian technology",
    brazilDescriptionBefore: "Colossus Crypto is developed and maintained ",
    brazilDescriptionHighlight: "in Brazil, by Brazilians",
    brazilDescriptionAfter:
      ", combining cutting-edge cryptocurrency technology with the support and trust of a national company.",
    developedBy: "DEVELOPED BY",
    companyLabel: "COMPANY",
    cnpjLabel: "TAX ID",
    footerNote: "Made with 💜 in 🇧🇷 for the whole world.",
  },
  info: {
    title: "My Information",
    personTypeIndividual: "Individual",
    personTypeCompany: "Company",
    errorLoad: "Unable to load your information.",
    retry: "Try again",
    errorEmpty: "No information found.",
    registrationData: "REGISTRATION DATA",
    socialName: "DISPLAY NAME",
    document: "DOCUMENT",
    contact: "CONTACT",
    email: "EMAIL",
    phone: "PHONE",
    address: "ADDRESS",
    street: "STREET",
    city: "CITY",
    zipCode: "ZIP CODE",
    emptyValue: "-",
  },
  invoice: {
    title: "Charge",
    loadingInvoice: "Loading charge...",
    toastExpired: "Charge expired",
    toastTimeUp: "Time's up. Going back...",
    toastAddressCopied: "Address copied!",
    amountLabel: "AMOUNT DUE",
    expiresIn: "Expires in {{time}}",
    cancelInvoice: "Cancel charge",
  },
  menu: {
    title: "Settings",
    preferences: "PREFERENCES",
    general: "GENERAL",
    languageAndCurrency: "Language and Currency",
    logout: "Log out",
    logoutError: "Unable to log out. Please try again.",
    items: {
      info: "Information",
      wallet: "Wallet",
      invoices: "Charges",
      support: "Support",
      about: "About",
      termsOfUse: "Terms of use",
      printer: "Printer",
      community: "Community",
    },
  },
  printer: {
    title: "Printer",
    labelSizeTitle: "Label size",
    labelSizeSubtitle: "Choose the model compatible with your thermal printer",
    toastSaved: "Printer {{model}} saved!",
    toastSaveError: "Unable to save the setting.",
    options: {
      compact: "Compact",
      standard: "Standard",
    },
  },
  receipt: {
    toastNoPrinter: "No printer configured. Go to settings.",
    toastPrintSuccess: "Receipt printed!",
    toastPrintError: "Unable to print. Check the printer.",
    notFound: "Receipt not found.",
    paymentConfirmed: "Payment confirmed",
    validatedOnBlockchain: "The transaction was validated on the blockchain",
    receiptSubtitle: "Payment receipt",
    amountReceived: "AMOUNT RECEIVED",
    confirmationDate: "CONFIRMATION DATE",
    recipient: "RECIPIENT",
    reference: "REFERENCE",
    txid: "TXID",
    printButton: "Print receipt",
    backButton: "Back to home",
    print: {
      headerTitle: "Proof Colossus Crypto",
      statusConfirmed: "PAYMENT CONFIRMED",
      amountLabel: "Amount",
      dateTimeLabel: "Date/Time",
      recipientLabel: "Recipient:",
      referenceLabel: "Reference:",
      txidLabel: "TXID:",
      scanHint: "Scan to view on Polygonscan",
    },
  },
  selectNetwork: {
    title: "Choose the network",
    amountSummaryLabel: "CHARGE AMOUNT",
    availableNetworks: "AVAILABLE NETWORKS",
    loadingNetworks: "Loading networks...",
    loadNetworksError: "Unable to load networks.",
    retry: "Try again",
    conversionHint:
      "The amount will be converted to USDT based on the current exchange rate",
    proceed: "Proceed",
    createInvoiceError: "Unable to create the charge. Please try again.",
    noForwardWallet:
      "Receiving wallet not found. Register a wallet to continue.",
  },
  settingsLanguage: {
    title: "Language and Currency",
    appLanguage: "APP LANGUAGE",
    currencyForBilling: "BILLING CURRENCY",
    toastLanguageError: "Unable to save the language.",
    toastCurrencyError: "Unable to save the currency.",
    currencySubLabel: {
      BRL: "Brazilian Real",
      USD: "US Dollar",
      PYG: "Paraguayan Guarani",
    },
  },
  support: {
    title: "Support",
    needHelp: "Need help?",
    contactSubtitle: "Talk directly with our team via WhatsApp",
    whatsappButton: "Chat on WhatsApp",
    whatsappMessage: "Hello, I need help!",
    whatsappError: "Unable to open WhatsApp",
    faqSectionTitle: "FREQUENTLY ASKED QUESTIONS",
    faq: {
      q1: {
        question: "1. What is Colossus Crypto?",
        answer:
          "Colossus Crypto is a digital payments solution developed by I Like Technology that allows merchants of all sizes to accept payments in USDT (Tether) — one of the most stable and widely used cryptocurrencies in the world — through an app, web system, and card terminal.",
      },
      q2: {
        question: "2. Who can use Colossus Crypto?",
        answer:
          "The platform is designed for merchants (individuals or companies) who want to offer their customers a modern and secure payment alternative, while also benefiting from more attractive fees and immediate liquidity.",
      },
      q3: {
        question: "3. How does receiving payments in USDT work?",
        answer:
          "When making a sale, the merchant generates a QR Code or payment link via the app, system, or terminal. The customer pays in USDT, and the amount is instantly received in the merchant's digital wallet linked to Colossus Crypto.",
      },
      q4: {
        question: "4. What fees does Colossus Crypto charge?",
        answer:
          "Colossus Crypto charges a fixed fee of 1.95% per transaction, lower than the average charged by traditional credit card processors.",
      },
      q5: {
        question:
          "5. Do I need to understand cryptocurrencies to use the platform?",
        answer:
          "No. The platform was designed to be intuitive and simple, with a user-friendly interface and dedicated support, even for those who have never used cryptocurrencies before.",
      },
      q6: {
        question: "6. Where can I use Colossus Crypto?",
        answer:
          "The solution can be used in physical stores, e-commerces, delivery services, or by freelancers, through the mobile app, web system, or a compatible payment terminal.",
      },
      q7: {
        question: "7. Is it safe to receive payments in USDT?",
        answer:
          "Yes. USDT is a dollar-backed stablecoin with high stability and liquidity. In addition, Colossus Crypto adopts security technologies, encryption, and authentication to ensure full protection of transactions.",
      },
      q8: {
        question:
          "8. What are the benefits of accepting cryptocurrencies in my business?",
        answer:
          "Besides visibility as a modern company, merchants benefit from lower fees, instant settlement, access to a new consumer profile, and exemption from traditional banking bureaucracy.",
      },
      q9: {
        question: "9. Do I need to register to use it?",
        answer:
          "Download the app, sign up with a Colossus Crypto consultant, and after verification, your company will be ready to accept payments in USDT.",
      },
    },
  },
  terms: {
    title: "Terms of Use",
    docTitle: "Terms of Use – Colossus Crypto",
    lastUpdated: "Last updated: {{date}}",
    intro:
      'These Terms of Use govern the use of the Colossus Crypto platform, hereinafter referred to as the "Platform," owned by I Like Technology, registered under Tax ID 45.123.168/0001-22.\n\nBy accessing or using any feature available on the Platform, the User declares that they have read, understood, and fully agreed to the provisions set forth herein.',
    footerNote:
      "Colossus Crypto · I Like Technology\nTax ID 45.123.168/0001-22",
    sections: {
      s1: {
        title: "Purpose",
        paragraphs: [
          "This platform aims to provide technological solutions so that merchants and users can accept and make payments using digital assets, especially the USDT (Tether) stablecoin, in a secure, efficient, and transparent environment, through an app, web system, APIs, and physical devices (terminals).",
        ],
      },
      s2: {
        title: "Registration and Eligibility",
        paragraphs: [
          "2.1. To use the services, the User must complete a prior registration, providing truthful, complete, and up-to-date information.",
          "2.2. I Like Technology reserves the right to verify the accuracy of the information provided and may refuse or suspend registrations in cases of inconsistencies or misuse.",
        ],
      },
      s3: {
        title: "Conditions of Use",
        paragraphs: [
          "3.1. The User agrees to use the Platform exclusively for lawful purposes and shall be civilly and criminally liable for any acts performed.",
          "3.2. The Platform may not be used for:",
        ],
        bullets: [
          "Fraudulent transactions or transactions involving illegal activities",
          "Money laundering or terrorism financing",
          "Trading of products or services prohibited by law",
        ],
      },
      s4: {
        title: "Fees and Charges",
        paragraphs: [
          "4.1. Use of the Platform may be subject to fees, currently set at 2% (two percent) per transaction.",
          "4.2. I Like Technology reserves the right to change these amounts with at least 15 (fifteen) days' prior notice.",
        ],
      },
      s5: {
        title: "Intellectual Property",
        paragraphs: [
          "All elements of Colossus Crypto, including logos, systems, code, content, and trademarks, are the exclusive property of I Like Technology, and any unauthorized reproduction or use is prohibited.",
        ],
      },
      s6: {
        title: "Liability",
        paragraphs: ["6.1. I Like Technology shall not be liable for:"],
        bullets: [
          "Errors caused by misuse of the platform",
          "Failures caused by third parties (e.g., internet service providers)",
          "Financial losses resulting from improper transactions carried out by third parties with access to the user's account or wallet",
        ],
      },
      s7: {
        title: "Changes and Updates",
        paragraphs: [
          "These Terms may be amended at any time. Continued use of the platform after the publication of changes shall constitute tacit acceptance of the new terms.",
        ],
      },
    },
  },
  communityMap: {
    headerTitle: "Colossus Community",
    filterAll: "All",
    loading: "Loading Colossus community...",
    errorLoad: "Unable to load locations.",
    retry: "Try again",
    errors: {
      call: "Unable to open the dialer.",
      whatsapp: "Unable to open WhatsApp.",
      website: "Unable to open the website.",
    },
    verified: "Verified",
    actions: {
      call: "Call",
      whatsapp: "WhatsApp",
      website: "Website",
    },
    address: "ADDRESS",
    openingHours: "OPENING HOURS",
    paymentMethods: "PAYMENT METHODS",
    tags: "TAGS",
  },
};
