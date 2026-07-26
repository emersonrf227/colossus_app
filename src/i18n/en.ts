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
      notifications: "Notifications",
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
          "{{appName}} is a self-custody digital wallet developed by I Like Technology that lets anyone store, send and receive USDT (Tether) on supported blockchain networks, with full control over their own funds.",
      },
      q2: {
        question: "2. Who can use {{appName}}?",
        answer:
          "Anyone over 18 — you don't need to be a merchant or a company. If you want to store your USDT safely, send it to other wallets or receive it from anywhere in the world, {{appName}} is for you.",
      },
      q3: {
        question: "3. What does self-custody mean?",
        answer:
          "It means only you have access to your funds. Your wallet keys (the 12 recovery words) live only on your device — not even {{appName}} can access them, move your assets or recover them for you.",
      },
      q4: {
        question: "4. What are the fees?",
        answer:
          "Storing and receiving USDT in {{appName}} costs nothing. When sending, you only pay the network (gas) fee, charged by the blockchain itself — not by {{appName}}. Specific features that carry a cost always show it before you confirm.",
      },
      q5: {
        question: "5. Do I need to understand crypto to use it?",
        answer:
          "No. The app is designed to be simple and intuitive, even for first-time crypto users. You create your wallet in minutes and the app guides you through every step.",
      },
      q6: {
        question: "6. What happens if I lose my 12 words?",
        answer:
          "The 12 words are the only way to recover your wallet. If you lose them, access to your funds is permanently lost — no one, not even {{appName}}, can recover them. Write them on paper and keep them somewhere safe.",
      },
      q7: {
        question: "7. Is USDT safe to use?",
        answer:
          "USDT is a dollar-backed stablecoin with high liquidity and wide adoption. {{appName}} adds local encryption, PIN protection and screenshot blocking on sensitive screens.",
      },
      q8: {
        question: "8. Which networks does {{appName}} support?",
        answer:
          "Currently Polygon and Plasma. When sending or receiving, always make sure the selected network matches the other wallet — transfers on incompatible networks cannot be recovered.",
      },
      q9: {
        question: "9. How do I get started?",
        answer:
          "Download the app, create a new wallet (or import an existing one with your 12 words) and that's it: within minutes you can receive and send USDT.",
      },
      q10: {
        question: "10. What is sponsored gas?",
        answer:
          "To send USDT, the blockchain charges a small fee in the network's native coin (such as POL on Polygon). If your native balance is low, {{appName}} can sponsor the gas: you receive enough to complete your transactions without having to buy the native coin elsewhere. When available, the app offers this automatically.",
      },
    },
  },

  terms: {
    title: "Terms of Use",
    docTitle: "Terms of Use – {{appName}}",
    lastUpdated: "Last updated: {{date}}",
    intro:
      'These Terms of Use govern the use of the {{appName}} application ("App"), owned by I Like Technology, registered under CNPJ No. 45.123.168/0001-22.\n\nBy accessing or using any feature of the App, the User declares to have read, understood and fully agreed to the provisions set forth herein.',
    footerNote: "{{appName}} · I Like Technology\nCNPJ 45.123.168/0001-22",
    sections: {
      s1: {
        title: "Purpose and Nature of the Service",
        paragraphs: [
          "1.1. {{appName}} is a self-custody digital wallet that allows the User to store, send and receive digital assets, in particular the stablecoin USDT (Tether), on supported blockchain networks (such as Polygon and Plasma).",
          "1.2. I Like Technology provides only the interface technology to blockchain networks. It is not a financial institution, broker, exchange or custodian, does not intermediate transactions and never holds possession, control or access to the User's assets.",
        ],
      },
      s2: {
        title: "Self-Custody and Private Keys",
        paragraphs: [
          "2.1. Private keys and the recovery phrase (12 words) are generated and stored exclusively on the User's device. I Like Technology has no copy, backup or any means of accessing them.",
          "2.2. The User is solely responsible for safekeeping the recovery phrase. Loss or improper sharing of this information results in the permanent and irreversible loss of access to the assets, with no possibility of recovery by I Like Technology.",
          "2.3. {{appName}} will never request the recovery phrase by email, phone, messaging apps or any other channel.",
        ],
      },
      s3: {
        title: "Registration and Eligibility",
        paragraphs: [
          "3.1. To use the services, the User must provide true, complete and up-to-date information, being liable for its accuracy.",
          "3.2. The App may only be used by persons over 18 years of age with full legal capacity.",
          "3.3. I Like Technology reserves the right to refuse or suspend registrations in case of inconsistencies, fraud or misuse.",
        ],
      },
      s4: {
        title: "Conditions of Use and Prohibitions",
        paragraphs: [
          "4.1. The User agrees to use the App exclusively for lawful purposes and is civilly and criminally liable for their actions.",
          "4.2. Use of the App is expressly prohibited for:",
        ],
        bullets: [
          "Fraudulent transactions or transactions linked to illegal activities",
          "Money laundering or terrorism financing",
          "Trade of products or services prohibited by law",
          "Attempts to circumvent, attack or exploit vulnerabilities of the App or blockchain networks",
        ],
      },
      s5: {
        title: "Blockchain Transactions",
        paragraphs: [
          "5.1. Blockchain transactions are final and irreversible. Once confirmed on the network, they cannot be cancelled, reversed or modified by I Like Technology.",
          "5.2. It is the User's sole responsibility to verify the destination address and selected network before confirming any transfer. Assets sent to incorrect addresses or incompatible networks are unrecoverable.",
          "5.3. Transactions are subject to network (gas) fees, charged by the blockchain networks themselves and beyond the control of I Like Technology.",
        ],
      },
      s6: {
        title: "Risks",
        paragraphs: [
          "6.1. The User declares awareness of the risks inherent to digital assets, including but not limited to: price volatility, potential loss of stablecoin parity, failures, congestion or attacks on blockchain networks, and regulatory changes.",
          "6.2. Use of the App is at the User's own risk. Digital assets are not covered by deposit insurance or government protection.",
        ],
      },
      s7: {
        title: "Fees",
        paragraphs: [
          "7.1. Specific features of the App may be subject to service fees, always clearly disclosed before the operation is confirmed.",
          "7.2. I Like Technology reserves the right to change its fees upon prior notice of at least 15 (fifteen) days.",
        ],
      },
      s8: {
        title: "Intellectual Property",
        paragraphs: [
          "All elements of {{appName}}, including logos, systems, code, content and trademarks, are the exclusive property of I Like Technology; any unauthorized reproduction or use is prohibited.",
        ],
      },
      s9: {
        title: "Limitation of Liability",
        paragraphs: ["9.1. I Like Technology is not liable for:"],
        bullets: [
          "Loss, theft or sharing of the User's recovery phrase or private keys",
          "Transactions sent to incorrect addresses or incompatible networks",
          "Failures, congestion or attacks on blockchain networks and third-party services",
          "Unauthorized access to the User's device, including via malware or social engineering",
          "Price variations or loss of parity of digital assets",
        ],
      },
      s10: {
        title: "Amendments and General Provisions",
        paragraphs: [
          "10.1. These Terms may be amended at any time. Continued use of the App after publication of changes implies tacit acceptance of the new terms.",
          "10.2. These Terms are governed by the laws of the Federative Republic of Brazil, with the courts of the User's domicile elected to resolve any disputes.",
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

  walletSecurity: {
    title: "Before creating your wallet",
    steps: {
      selfCustody: {
        title: "You are in full control",
        text: "{{appName}} is a self-custody wallet: only you have access to your funds. We do not keep a copy of your 12 words and cannot recover them for you.",
      },
      writePaper: {
        title: "Write it on paper",
        text: "You will receive 12 recovery words. Write them by hand, on paper, in the exact order, and store them somewhere safe — ideally more than one copy, in different places.",
      },
      noScreenshot: {
        title: "No screenshots or photos",
        text: "Do not screenshot or photograph your words. Images end up in your gallery, cloud and automatic backups — any app with access could steal them.",
      },
      noCloud: {
        title: "Never send or type them",
        text: "Do not send your words by email, WhatsApp or cloud, and never type them into websites or other apps. {{appName}} will never ask for your 12 words.",
      },
    },
    acceptText:
      "I understand that if I lose my 12 words I will permanently lose access to my funds, and no one — not even {{appName}} — can recover them.",
    acceptButton: "I understand, create wallet",
    nextButton: "Continue",
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
    generating: "Securely generating your wallet...",
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
  notifications: {
    title: "Notifications",
    empty: "No notifications at the moment",
    permissionDenied: "Helm needs your approval to send notifications. Enable it in your device settings.",
    status: "STATUS",
    statusGranted: "Enabled",
    statusDenied: "Disabled",
    descriptionGranted: "You will receive notifications about your transactions, security alerts and important updates.",
    descriptionDenied: "Enable notifications to receive updates about your transactions and important alerts.",
    everythingReady: "All set! You are receiving notifications.",
    enable: "Enable Notifications",
    openSettings: "Open Settings",
    whyNeeded: "WHY NEEDED?",
    whyDescription: "Notifications help you stay informed about:\n\n• New transactions received\n• Withdrawal confirmation\n• Security alerts\n• Important updates",
    enabled: "Notifications enabled successfully!",
    requiresSettings: "Open your device settings to enable.",
    enableError: "Could not enable notifications.",
    settingsError: "Could not open settings.",
  },
};
