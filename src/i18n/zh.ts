export default {
  login: {
    welcome: "欢迎回来",
    subtitle: "登录您的账户以继续",
    user: "用户名",
    password: "密码",
    login: "登录",
    forgotPassword: "忘记密码",
    register: "我要注册",
    chooseLanguage: "选择语言",
    changeLanguage: "这将更改应用中显示的语言",
    or: "或",
  },
  forget: {
    title: "忘记密码了吗？",
    subtitle: "请输入您注册的邮箱，我们将发送验证码以重置密码。",
    iemail: "您的邮箱",
    send: "发送",
    know: "想起密码了？",
    open: "登录",
  },
  pinforger: {
    title: "输入收到的验证码",
    subtitle: " 我们已向以下地址发送了6位验证码",
    label_new_pass: "新密码",
    inew: "新密码",
    cnew: "确认新密码",

    bconfirm: "确认",
    breturn: "返回",
  },
  cadwallet: {
    title: "收款钱包",
    configured: "钱包已配置",
    network: "网络",
    addressLabel: "钱包地址",
    addressDescription: "收到的款项将自动转发至所选网络上的此地址。",
    addressPlaceholder: "0x...",
    registerWallet: "注册钱包",
    copySuccess: "地址已复制！",
    registerSuccess: "收款钱包已注册！",
    invalidAddress: "该地址对 {{network}} 网络无效。",
    clipboardError: "无法访问剪贴板",
    walletCheckError: "无法验证您的钱包，请重试。",
    comingSoon: "敬请期待！",
    token: "USDT",
  },
  dashboard: {
    generateCharge: "生成收款",
    keypad: {
      clear: "C",
      backspace: "⌫",
    },
    validation: {
      invalidAmount: "请输入有效金额。",
    },
  },
  extract: {
    title: "收款记录",
    period: "时间段",
    status: "状态",
    periods: {
      today: "今天",
      sevenDays: "7天",
      thirtyDays: "30天",
      custom: "自定义",
    },
    statusOptions: {
      open: "待支付",
      confirmed: "已确认",
      cancelled: "已取消",
    },
    noConfirmationDate: "无确认日期",
    loading: "正在加载收款记录...",
    empty: "在该时间段和状态下未找到收款记录。",
    errors: {
      loadInvoices: "获取收款记录时出错。",
    },
  },
  about: {
    title: "关于",
    versionLabel: "版本 {{version}}",
    brazilTitle: "100% 巴西技术",
    brazilDescriptionBefore:
      "Colossus Crypto 由 I Like Technology 开发并维护，",
    brazilDescriptionHighlight: "在巴西，由巴西人打造",
    brazilDescriptionAfter:
      "，将前沿的加密货币技术与一家本土企业的支持和信誉相结合。",
    developedBy: "开发者",
    companyLabel: "公司",
    cnpjLabel: "公司注册号 (CNPJ)",
    footerNote: "用 💜 在 🇧🇷 为全世界打造。",
  },
  info: {
    title: "我的信息",
    personTypeIndividual: "自然人",
    personTypeCompany: "法人",
    errorLoad: "无法加载您的信息。",
    retry: "重试",
    errorEmpty: "未找到任何信息。",
    registrationData: "注册资料",
    socialName: "显示名称",
    document: "证件",
    contact: "联系方式",
    email: "邮箱",
    phone: "电话",
    address: "地址",
    street: "街道",
    city: "城市",
    zipCode: "邮政编码",
    emptyValue: "-",
  },
  invoice: {
    title: "收款",
    loadingInvoice: "正在加载收款信息...",
    toastExpired: "收款已过期",
    toastTimeUp: "时间已到，正在返回...",
    toastAddressCopied: "地址已复制！",
    amountLabel: "应付金额",
    expiresIn: "将在 {{time}} 后过期",
    cancelInvoice: "取消收款",
  },
  menu: {
    title: "设置",
    preferences: "偏好设置",
    general: "通用",
    languageAndCurrency: "语言与货币",
    logout: "退出账户",
    logoutError: "无法退出，请重试。",
    items: {
      info: "个人信息",
      wallet: "钱包",
      invoices: "收款记录",
      support: "支持",
      about: "关于",
      termsOfUse: "使用条款",
      printer: "打印机",
      community: "社区",
    },
  },
  printer: {
    title: "打印机",
    labelSizeTitle: "标签尺寸",
    labelSizeSubtitle: "选择与您的热敏打印机兼容的型号",
    toastSaved: "打印机 {{model}} 已保存！",
    toastSaveError: "无法保存设置。",
    options: {
      compact: "紧凑型",
      standard: "标准型",
    },
  },
  receipt: {
    toastNoPrinter: "未配置打印机，请前往设置。",
    toastPrintSuccess: "凭证已打印！",
    toastPrintError: "无法打印，请检查打印机。",
    notFound: "未找到凭证。",
    paymentConfirmed: "付款已确认",
    validatedOnBlockchain: "该交易已在区块链上完成验证",
    receiptSubtitle: "付款凭证",
    amountReceived: "已收金额",
    confirmationDate: "确认日期",
    recipient: "收款人",
    reference: "备注",
    txid: "交易ID (TXID)",
    printButton: "打印凭证",
    backButton: "返回首页",
    print: {
      headerTitle: "Proof Colossus Crypto",
      statusConfirmed: "付款已确认",
      amountLabel: "金额",
      dateTimeLabel: "日期/时间",
      recipientLabel: "收款人：",
      referenceLabel: "备注：",
      txidLabel: "交易ID：",
      scanHint: "扫描以在 Polygonscan 上查看",
    },
  },
  selectNetwork: {
    title: "选择网络",
    amountSummaryLabel: "收款金额",
    availableNetworks: "可用网络",
    loadingNetworks: "正在加载网络...",
    loadNetworksError: "无法加载网络。",
    retry: "重试",
    conversionHint: "金额将根据当前汇率转换为 USDT",
    proceed: "继续",
    createInvoiceError: "无法创建收款，请重试。",
    noForwardWallet: "未找到收款钱包，请注册一个钱包以继续。",
  },
  settingsLanguage: {
    title: "语言与货币",
    appLanguage: "应用语言",
    currencyForBilling: "收款货币",
    toastLanguageError: "无法保存语言设置。",
    toastCurrencyError: "无法保存货币设置。",
    currencySubLabel: {
      BRL: "巴西雷亚尔",
      USD: "美元",
      PYG: "巴拉圭瓜拉尼",
    },
  },
  support: {
    title: "支持",
    needHelp: "需要帮助吗？",
    contactSubtitle: "通过 Telegram 直接联系我们的团队",
    telegramButton: "通过 Telegram 联系",
    telegramMessage: "你好，我需要帮助！",
    telegramError: "无法打开 Telegram",
    faqSectionTitle: "常见问题",
    faq: {
      q1: {
        question: "1. 什么是 Colossus Crypto？",
        answer:
          "Colossus Crypto 是由 I Like Technology 开发的数字支付解决方案，使各类规模的商户能够通过应用程序、网页系统和刷卡机接受 USDT（泰达币）支付——这是全球最稳定、使用最广泛的加密货币之一。",
      },
      q2: {
        question: "2. 谁可以使用 Colossus Crypto？",
        answer:
          "该平台面向希望为客户提供现代、安全支付方式的商户（个人或企业），同时还可享受更优惠的费率和即时流动性。",
      },
      q3: {
        question: "3. USDT 收款是如何运作的？",
        answer:
          "商户在完成销售时，可通过应用程序、系统或刷卡机生成二维码或支付链接。客户使用 USDT 支付，款项会立即到达与 Colossus Crypto 绑定的商户数字钱包中。",
      },
      q4: {
        question: "4. Colossus Crypto 收取哪些费用？",
        answer:
          "Colossus Crypto 对每笔交易收取固定的 1.95% 手续费，低于传统信用卡运营商的平均费率。",
      },
      q5: {
        question: "5. 使用该平台需要了解加密货币知识吗？",
        answer:
          "不需要。该平台设计直观简洁，界面友好且提供专属支持，即使从未使用过加密货币的用户也能轻松上手。",
      },
      q6: {
        question: "6. 我可以在哪里使用 Colossus Crypto？",
        answer:
          "该解决方案可用于实体店、电商、外卖服务或个体经营者，通过手机应用、网页系统或兼容的支付终端使用。",
      },
      q7: {
        question: "7. 接收 USDT 付款安全吗？",
        answer:
          "是的。USDT 是与美元挂钩的稳定币，具有高稳定性和流动性。此外，Colossus Crypto 还采用安全技术、加密和身份验证措施，确保交易得到全面保护。",
      },
      q8: {
        question: "8. 在我的业务中接受加密货币有哪些好处？",
        answer:
          "除了提升企业的现代化形象外，商户还可享受更低的费率、即时结算、接触新的消费群体，并免去传统银行业务的繁琐手续。",
      },
      q9: {
        question: "9. 使用该平台需要注册吗？",
        answer:
          "下载应用程序，在 Colossus Crypto 顾问的协助下完成注册，经过审核后，您的企业即可开始接受 USDT 付款。",
      },
    },
  },
  terms: {
    title: "使用条款",
    docTitle: "使用条款 – Colossus Crypto",
    lastUpdated: "最后更新日期：{{date}}",
    intro:
      '本使用条款规范 Colossus Crypto 平台（以下简称"平台"）的使用，该平台归 I Like Technology 所有，公司注册号（CNPJ）为 45.123.168/0001-22。\n\n用户访问或使用平台提供的任何功能，即表示已阅读、理解并完全同意本条款的所有规定。',
    footerNote: "Colossus Crypto · I Like Technology\nCNPJ 45.123.168/0001-22",
    sections: {
      s1: {
        title: "宗旨",
        paragraphs: [
          "本平台旨在提供技术解决方案，使商户和用户能够通过应用程序、网页系统、API 及实体设备（刷卡机），在安全、高效、透明的环境中，使用数字资产（尤其是稳定币 USDT/泰达币）接受和进行支付。",
        ],
      },
      s2: {
        title: "注册与资格",
        paragraphs: [
          "2.1. 用户在使用相关服务前须完成预先注册，并提供真实、完整且最新的信息。",
          "2.2. I Like Technology 保留核实所提供信息真实性的权利，如发现信息不一致或存在不当使用情形，可拒绝或暂停相关注册。",
        ],
      },
      s3: {
        title: "使用条件",
        paragraphs: [
          "3.1. 用户承诺仅出于合法目的使用本平台，并对其行为承担相应的民事和刑事责任。",
          "3.2. 禁止将本平台用于以下用途：",
        ],
        bullets: [
          "涉及欺诈或非法活动的交易",
          "洗钱或资助恐怖主义",
          "买卖法律禁止的产品或服务",
        ],
      },
      s4: {
        title: "费用与收费",
        paragraphs: [
          "4.1. 使用本平台可能产生费用，目前每笔交易的费率为 2%（百分之二）。",
          "4.2. I Like Technology 保留调整费率的权利，但须至少提前 15（十五）天通知。",
        ],
      },
      s5: {
        title: "知识产权",
        paragraphs: [
          "Colossus Crypto 的所有组成部分，包括标识、系统、代码、内容和商标，均为 I Like Technology 的专有财产，禁止任何未经授权的复制或使用。",
        ],
      },
      s6: {
        title: "责任",
        paragraphs: ["6.1. I Like Technology 不对以下情形承担责任："],
        bullets: [
          "因不当使用平台而导致的错误",
          "因第三方原因（例如互联网服务提供商）造成的故障",
          "第三方利用对用户账户或钱包的访问权限进行不当交易而造成的经济损失",
        ],
      },
      s7: {
        title: "修改与更新",
        paragraphs: [
          "本条款可随时进行修改。在条款变更内容公布后继续使用本平台，即视为默示接受新的条款。",
        ],
      },
    },
  },
  communityMap: {
    headerTitle: "Colossus 社区",
    filterAll: "全部",
    loading: "正在加载 Colossus 社区...",
    errorLoad: "无法加载地点信息。",
    retry: "重试",
    errors: {
      call: "无法打开拨号程序。",
      telegram: "无法打开 Telegram。",
      website: "无法打开网站。",
    },
    verified: "已认证",
    actions: {
      call: "拨打电话",
      telegram: "Telegram",
      website: "网站",
    },
    address: "地址",
    openingHours: "营业时间",
    paymentMethods: "支付方式",
    tags: "标签",
  },
};
