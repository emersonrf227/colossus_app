export default {
  login: {
    welcome: "Welcome back",
    subtitle: "Blockchain made easy in the palm of your hand.",
    user: "Username",
    password: "Password",
    login: "Sign In",
    forgotPassword: "Forgot my password",
    register: "Telegram Community",
    chooseLanguage: "Choose language",
    changeLanguage: "This changes the language displayed in the app",
  },

  menu: {
    title: "Menu",
    preferences: "PREFERENCES",
    general: "GENERAL",
    languageAndCurrency: "Language & Currency",
    logout: "Delete Wallet",
    logoutError: "Could not sign out. Please try again.",
    items: {
      info: "Receive",
      wallet: "Mnemonic",
      invoices: "History",
      support: "Support",
      about: "About",
      termsOfUse: "Terms of Use",
      printer: "Printer",
      community: "Community",
    },
    modal: {
      title: "Warning",
      description:
        "By leaving your account, all wallet keys will be removed from this device.",
      warning:
        "If you have NOT saved your 12 recovery words, you may permanently lose access to your wallet and funds.",
      warning_plus: "This action is irreversible.",
      cancel: "Cancel",
      understood: "I understand, delete wallet",
    },
  },

  settingsLanguage: {
    title: "Language & Currency",
    appLanguage: "APP LANGUAGE",
    currencyForBilling: "BILLING CURRENCY",
    toastLanguageError: "Could not save language.",
    toastCurrencyError: "Could not save currency.",
    currencySubLabel: {
      BRL: "Brazilian Real",
      USD: "US Dollar",
      PYG: "Paraguayan Guaraní",
    },
  },

  support: {
    title: "Support",
    needHelp: "Need help?",
    contactSubtitle: "Talk directly with our team on Telegram",
    telegramButton: "Chat on Telegram",
    telegramMessage: "Hello, I need help!",
    telegramError: "Could not open Telegram",
    faqSectionTitle: "FREQUENTLY ASKED QUESTIONS",
    faq: {
      q1: {
        question: "1. What is {{appName}}?",
        answer:
          "{{appName}} is a digital payment solution developed by I Like Technology, allowing businesses of all sizes to accept payments in USDT (Tether) via app, web system and card terminal.",
      },
      q2: {
        question: "2. Who can use {{appName}}?",
        answer:
          "The platform is aimed at merchants who want to offer a modern and secure payment alternative with lower fees and immediate liquidity.",
      },
      q3: {
        question: "3. How does receiving in USDT work?",
        answer:
          "When making a sale, the merchant generates a QR code or payment link. The customer pays in USDT, and the amount is instantly received in the merchant's digital wallet.",
      },
      q4: {
        question: "4. What fees does {{appName}} charge?",
        answer: "{{appName}} charges a fixed fee of 1.95% per transaction.",
      },
      q5: {
        question: "5. Do I need to understand cryptocurrency?",
        answer:
          "No. The platform was designed to be intuitive and simple, even for those who have never used cryptocurrency.",
      },
      q6: {
        question: "6. Where can I use {{appName}}?",
        answer:
          "In physical stores, e-commerce, delivery services or freelancers, via mobile app, web system or compatible terminal.",
      },
      q7: {
        question: "7. Is it safe to receive payments in USDT?",
        answer:
          "Yes. USDT is a dollar-backed stablecoin with high stability and liquidity.",
      },
      q8: {
        question: "8. What are the benefits of accepting cryptocurrency?",
        answer:
          "Lower fees, instant settlement, access to a new consumer profile and exemption from banking bureaucracies.",
      },
      q9: {
        question: "9. Do I need to register?",
        answer:
          "Download the app, register with a {{appName}} consultant and after verification your company will be ready to accept USDT.",
      },
    },
  },

  terms: {
    title: "Terms of Use",
    docTitle: "Terms of Use – {{appName}}",
    lastUpdated: "Last updated: {{date}}",
    intro:
      "These Terms of Use govern the use of the {{appName}} platform, owned by I Like Technology, registered under CNPJ No. 45.123.168/0001-22.",
    footerNote: "{{appName}} · I Like Technology\nCNPJ 45.123.168/0001-22",
    sections: {
      s1: {
        title: "Purpose",
        paragraphs: [
          "This platform provides technological solutions for merchants and users to accept and make payments using digital assets, especially the USDT stablecoin.",
        ],
      },
      s2: {
        title: "Registration",
        paragraphs: [
          "2.1. To use the services, the User must register in advance with true and complete information.",
          "2.2. I Like Technology reserves the right to verify information and refuse registrations in case of inconsistencies.",
        ],
      },
      s3: {
        title: "Terms of Use",
        paragraphs: [
          "3.1. The User agrees to use the Platform exclusively for lawful purposes.",
          "3.2. It is prohibited to use the Platform for:",
        ],
        bullets: [
          "Fraudulent transactions or illegal activities",
          "Money laundering or terrorism financing",
          "Trading prohibited products or services",
        ],
      },
      s4: {
        title: "Fees",
        paragraphs: [
          "4.1. Use of the Platform may incur fees, currently set at 2% per transaction.",
          "4.2. I Like Technology reserves the right to change values with at least 15 days notice.",
        ],
      },
      s5: {
        title: "Intellectual Property",
        paragraphs: [
          "All elements of {{appName}} are the exclusive property of I Like Technology. Unauthorized reproduction is prohibited.",
        ],
      },
      s6: {
        title: "Responsibilities",
        paragraphs: ["6.1. I Like Technology is not responsible for:"],
        bullets: [
          "Errors caused by misuse",
          "Failures from third parties",
          "Financial losses from unauthorized transactions",
        ],
      },
      s7: {
        title: "Modifications",
        paragraphs: [
          "These Terms may be changed at any time. Continued use implies acceptance of the new terms.",
        ],
      },
    },
  },

  communityMap: {
    headerTitle: "Colossus Community",
    filterAll: "All",
    loading: "Loading Colossus community...",
    errorLoad: "Could not load locations.",
    retry: "Try again",
    errors: {
      call: "Could not open dialer.",
      telegram: "Could not open Telegram.",
      website: "Could not open website.",
    },
    verified: "Verified",
    actions: { call: "Call", telegram: "Telegram", website: "Website" },
    address: "ADDRESS",
    openingHours: "OPENING HOURS",
    paymentMethods: "PAYMENT METHODS",
    tags: "TAGS",
  },

  wallet: {
    title: "Wallet",
    totalBalance: "TOTAL BALANCE",
    usdtSubtitle: "Tether USD (USDT) · Across all networks",
    allNetworks: "Across all networks",
    addressCopied: "Address copied!",
    sendButton: "Send",
    sendSubtitle: "Blockchain",
    receiveButton: "Receive",
    receiveSubtitle: "QR & address",
    pixButton: "Withdraw",
    pixSubtitle: "via PIX",
    withdraw: "Withdraw",
    pix: "PIX",
    balanceByNetwork: "BALANCE BY NETWORK",
    balanceError: "Could not fetch balances. Pull down to try again.",
    lowGas: "Low {{symbol}} balance for fees",
    viewOnly:
      "You are viewing this wallet in read-only mode. The access key is associated with another device — withdrawals can only be made from that device.",
    modal: {
      pinTitle: "To access the wallet we need to validate your PIN code.",
      pinTitleModal: "Authentication required to access the wallet.",
    },
  },

  walletReceive: {
    title: "Receive",
    addressLabel: "Address",
    copied: "Address copied!",
    copy: "Copy",
    share: "Share",
    noAddress: "No wallet found.",
  },

  walletSetup: {
    title: "Set up wallet",
    subtitle: "How do you want to set it up?",
    description: "Create a new wallet or import an existing one.",
    createNew: "Create new wallet",
    createDescription:
      "The app generates a wallet just for you. You keep the 12-word recovery phrase.",
    recommended: "RECOMMENDED",
    import: "Import existing wallet",
    importDescription:
      "Already have a wallet with a 12-word phrase (MetaMask, Trust Wallet, SafePal)? Import here for full access.",
    viewOnly: "View balance only",
    viewOnlyDescription:
      "Enter only the public address. You will see the balance but cannot withdraw via the app.",
    connectAddress: "Connect address",
    warning: "Never share your 12-word phrase or private key with anyone.",
    clipboardError: "Could not access clipboard",
    invalidAddress: "Invalid address.",
    connectSuccess: "External wallet connected!",
    connectError: "Could not save wallet. Please try again.",
  },

  walletBackup: {
    titleReveal: "Recovery phrase",
    titleConfirm: "Confirm backup",
    warningNeverShare: "Never share",
    warningText:
      " these 12 words with anyone. Anyone with them can access and move all funds in your wallet.",
    revealButton: "Tap to reveal words",
    continueButton: "I've noted them, continue",
    stepLabel: "FINAL STEP",
    stepTitle: "Confirm you noted correctly",
    stepSubtitle: "Enter the requested words to confirm your backup.",
    wordLabel: "WORD #{{number}}",
    wordPlaceholder: "Enter word",
    confirmButton: "Confirm and create wallet",
    errorWordMismatch: "A word doesn't match. Check your backup.",
    errorGenerate: "Could not generate wallet. Please try again.",
    errorSave: "Could not save wallet. Please try again.",
    errorRegister: "Wallet created locally, but could not register on server.",
    revealFirst: "Tap 'Reveal words' before continuing.",
  },

  walletImport: {
    title: "Import wallet",
    warningNeverShare: "Never share",
    warningText:
      " your recovery phrase. {{appName}} will never ask for these words.",
    sectionLabel: "RECOVERY PHRASE (12 WORDS)",
    wordPlaceholder: "word",
    importButton: "Import wallet",
    importing: "Importing...",
    errorFillAll: "Fill in all 12 words.",
    errorInvalidMnemonic: "Invalid recovery phrase. Check the words and order.",
    errorRegister: "Wallet imported locally, but could not register on server.",
    errorImport: "Could not import wallet. Please try again.",
    successImport: "Wallet imported successfully!",
  },

  walletPinSetup: {
    labelCreate: "CREATE PIN",
    labelReset: "RESET PIN",
    titleEnter: "Choose your PIN",
    titleConfirm: "Confirm PIN",
    subtitleEnter:
      "This 6-digit PIN will be required before any wallet transaction.",
    subtitleConfirm: "Enter the PIN again to confirm.",
    errorMismatch: "PINs don't match.",
    errorMismatchToast: "PINs don't match. Try again.",
    errorSave: "Could not save PIN. Please try again.",
    successCreate: "PIN created successfully!",
    successReset: "PIN reset successfully!",
  },

  walletExport: {
    title: "Recovery phrase",
    lockedTitle: "Protected content",
    lockedSubtitle:
      "Your 12-word recovery phrase can only be viewed after confirming your PIN.",
    unlockButton: "Confirm PIN to view",
    warningNeverShare: "Never share",
    warningText:
      " these words with anyone. Anyone with them can move all funds without reversal.",
    revealButton: "Tap to reveal",
    hideButton: "Hide words",
    copyButton: "Copy all words",
    copiedSuccess: "Phrase copied! Keep it in a safe place.",
    errorNotFound: "No seed phrase found. This wallet may be external.",
    errorRecover: "Could not recover seed phrase.",
    pinTitle: "Confirm your PIN",
    pinSubtitle: "Authentication required to display your recovery phrase.",
  },

  walletWithdraw: {
    memoLabel: "MEMO (OPTIONAL)",
    memoPlaceholder: "Identification or transaction note",
    memoNote:
      "The memo is optional and is permanently recorded on the blockchain.",
    qrHint: "Point at the wallet address QR Code",
    title: "Withdraw USDT",
    networkLabel: "NETWORK",
    addressLabel: "DESTINATION ADDRESS",
    addressPlaceholder: "0x...",
    amountLabel: "AMOUNT",
    amountPlaceholder: "0.00",
    available: "Available: {{amount}} USDT",
    maxButton: "MAX",
    lowGas: "Low {{symbol}} balance — may not be enough for network fee.",
    submitButton: "Review and withdraw",
    invalidAddress: "Invalid destination address.",
    invalidAmount: "Enter a valid amount.",
    insufficientBalance: "Insufficient balance on this network.",
    successToast: "Withdrawal sent successfully!",
    errorToast: "Could not complete withdrawal.",
    cameraPermission: "Camera permission required to read QR codes.",
    qrSuccess: "Address read successfully!",
    qrInvalid: "QR code does not contain a valid address.",
    clipboardError: "Could not access clipboard",
    pinTitle: "Confirm withdrawal",
    pinSubtitle: "You are sending {{amount}} USDT. Confirm PIN to proceed.",
  },

  walletWithdrawSuccess: {
    title: "Withdrawal sent!",
    subtitle:
      "The transaction was signed and sent to the blockchain. Confirmation may take a few seconds.",
    txidLabel: "TXID",
    explorerButton: "View on Explorer",
    shareButton: "Share",
    shareMessage: "Transaction confirmed:\n{{url}}",
  },

  walletWithdrawPix: {
    title: "PIX Withdrawal",
    networkLabel: "NETWORK",
    quoteLabel: "CURRENT RATE",
    usdtValue: "1 USDT equals",
    markup: "Network markup ({{network}})",
    quoteExpires: "Rate expires in {{time}}",
    refresh: "Refresh",
    quoteError: "Could not load rate. Tap Refresh.",
    pixCodeLabel: "DO YOU HAVE A PIX CODE?",
    pixCodeTitle: "PASTE CODE OR SCAN QR",
    pasteButton: "Paste code",
    decoding: "Decoding...",
    scanButton: "Scan QR",
    pixDetected: "PIX identified",
    beneficiary: "Beneficiary",
    city: "City",
    fixedAmount: "✓ Fixed amount of R$ {{amount}} filled automatically",
    clearPix: "Clear",
    amountLabel: "HOW MUCH DO YOU WANT TO RECEIVE?",
    amountPlaceholder: "0.00",
    fixedNote: "Fixed amount set by QR Code",
    youSend: "You will send",
    yourBalance: "Your balance ({{network}})",
    insufficient: "Insufficient balance — {{amount}} USDT short.",
    expiredWarning: "Rate expired. Refresh before continuing.",
    continueButton: "Continue",
    quoteLoadError: "Could not load rate.",
    cameraPermission: "Camera permission required.",
    qrInvalid: "Invalid or unrecognized PIX code.",
    clipboardEmpty: "Clipboard is empty.",
    clipboardError: "Could not access clipboard.",
    qrHint: "Point at the PIX QR Code",
    pixIdentified: "PIX identified: {{name}}",
  },

  walletWithdrawPixForm: {
    title: "PIX Details",
    summaryLabel: "SUMMARY",
    youReceive: "You receive",
    youSend: "You send",
    network: "Network",
    keyTypeLabel: "PIX KEY TYPE",
    pixKeyLabel: "PIX KEY",
    copyPastePlaceholder: "Paste code or scan",
    emailLabel: "EMAIL FOR RECEIPT",
    emailPlaceholder: "email@example.com",
    saveEmail: "Save email for future transactions",
    beneficiary: "Beneficiary",
    proceedButton: "Review and confirm",
    errorNoKey: "Enter the PIX key.",
    errorNoEmail: "Enter a valid email for the receipt.",
    cameraPermission: "Camera permission required.",
    qrInvalid: "Invalid or unrecognized QR Code.",
    qrSuccess: "QR read: {{name}}",
    fixedAmount: "QR with fixed amount: R$ {{amount}}",
  },

  walletWithdrawPixConfirm: {
    title: "Confirm PIX",
    detailsLabel: "OPERATION DETAILS",
    network: "Network",
    keyType: "Key type",
    pixKey: "PIX Key",
    beneficiary: "Beneficiary",
    emailReceipt: "Receipt email",
    youSend: "You send",
    quote: "Rate",
    receiveLabel: "You receive via PIX",
    blockchainNote: "Subject to blockchain network confirmation",
    confirmButton: "Confirm with PIN",
    pinTitle: "Confirm PIX",
    pinSubtitle: "You will send {{usdt}} USDT and receive R$ {{brl}} via PIX.",
    errorGeneric: "Could not process PIX withdrawal.",
  },

  walletWithdrawPixStatus: {
    title: "Awaiting confirmation",
    subtitle:
      "USDT has been sent. Waiting for blockchain confirmation to process PIX.",
    network: "Network",
    pixKey: "PIX Key",
    type: "Type",
    amountBrl: "BRL Amount",
    txid: "TXID",
    txidCopied: "TXID copied!",
    errorExpired:
      "Transaction expired before confirmation. Check your balance and try again.",
    errorFailed:
      "Transaction failed. USDT may have been returned — check your balance and contact support.",
    errorGeneric: "An error occurred. Contact support with the TXID.",
    errorTimeout: "Wait time exceeded. Check status soon.",
  },

  walletWithdrawPixSuccess: {
    title: "PIX sent!",
    subtitle:
      "Payment processed successfully. The beneficiary should receive it shortly.",
    valueLabel: "Amount received via PIX",
    receiptTitle: "RECEIPT",
    beneficiary: "Beneficiary",
    pixKey: "PIX Key",
    type: "Type",
    usdtSent: "USDT sent",
    totalBrl: "Total BRL",
    endToEnd: "End-to-End",
    txidBlockchain: "Blockchain TXID",
    newTransaction: "Make a new transaction",
    viewBlockchain: "View on blockchain",
    shareReceipt: "Share receipt",
    shareMessage:
      "✅ PIX sent successfully!\n\nBeneficiary: {{name}}\nPIX Key: {{key}} ({{type}})\nAmount: R$ {{brl}}\nEnd-to-End: {{endtoend}}\nUSDT sent: {{usdt}}\n\nBlockchain: {{url}}",
  },

  walletPixReceipt: {
    title: "PIX Receipt",
    loading: "Loading receipt...",
    error: "Could not load receipt. The transaction may still be processing.",
    confirmed: "PIX CONFIRMED",
    valueLabel: "Amount received via PIX",
    sectionRecipient: "RECIPIENT",
    name: "Name",
    pixKey: "PIX Key",
    keyType: "Key type",
    sectionValues: "VALUES",
    valueSent: "Amount sent",
    usdtUsed: "USDT used",
    sectionId: "IDENTIFICATION",
    network: "Network",
    txid: "Blockchain TXID",
    date: "Date",
    share: "Share receipt",
    viewBlockchain: "View on blockchain",
    shareHeader: "✅ PIX Receipt",
    beneficiary: "Beneficiary",
  },

  walletHistory: {
    title: "Blockchain History",
    loading: "Fetching blockchain transactions...",
    error: "Could not load history. Check your connection and try again.",
    retry: "Try again",
    empty: "No transactions found for this address on the {{network}} network.",
    received: "Received",
    sent: "Sent",
    pixOffRamp: "PIX OFF-RAMP",
    pixReceipt: "PIX Receipt",
    blockchain: "Blockchain",
  },

  gasSponsor: {
    idleTitle: "Sponsored gas",
    idleSubtitle:
      "Your {{symbol}} balance is low.\nRequest sponsored gas to keep operating.",
    network: "Network",
    gasSent: "Gas sent",
    cost: "Cost to you",
    free: "0.1 USDT",
    collateralNote1: "By requesting, you authorize a fee of",
    collateralNote2: "from your balance as payment for the sponsored gas.",
    requestButton: "Request sponsored gas",
    notNow: "Not now",
    requestingTitle: "Sending gas...",
    requestingSubtitle:
      "Verifying your identity and balance.\nGas is being sent to your wallet.",
    approvingTitle: "Confirming payment...",
    approvingSubtitle:
      "Gas received! Processing the payment\nof 0.1 USDT on the blockchain.",
    successTitle: "Gas received!",
    successSubtitle: "All set. You can now operate on the {{network}} network.",
    gasReceived: "Gas received",
    collateral: "Fee paid",
    continue: "Continue",
    errorTitle: "Not possible",
    errorGeneric: "Could not request sponsored gas. Please try again.",
    retry: "Try again",
    close: "Close",
  },
};
