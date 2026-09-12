export interface CurrencyConfig {
  code: "mxn" | "usd" | "cop" | "clp" | "pen" | "uyu" | "eur";
  symbol: string;
  flag: string;
  label: string;
  price: number;
  priceFormatted: string;
  unitAmount: number; // For Stripe
  allowsMSI: boolean;
  hasSplitOption?: boolean;
  splitPrice?: number;
  splitPriceFormatted?: string;
  splitUnitAmount?: number;
  
  highTicketPricing: string;
  programPricingRange: string;

  // Tabla Comparativa
  table: {
    hourlyRate: string;
    traditionalMonthly: string;
    courseSellingPrice: string;
    scalableMonthly: string;
  };

  // Stack de Bonos y Oferta
  stack: {
    programValue: string;
    bonus1Value: string;
    bonus2Value: string;
    bonus3Value: string;
    totalRealValue: string;
    officialPriceDisplay: string;
    currencySuffix: string;
    installmentsNote: string;
  };
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  mxn: {
    code: "mxn",
    symbol: "$",
    flag: "🇲🇽",
    label: "México (MXN)",
    price: 997,
    priceFormatted: "$997",
    unitAmount: 99700,
    allowsMSI: true,
    highTicketPricing: "$2,000 a $6,000 MXN",
    programPricingRange: "$2,500 - $7,000+ MXN",
    table: {
      hourlyRate: "$400 MXN / hora",
      traditionalMonthly: "~$25,000 - $35,000 MXN",
      courseSellingPrice: "$997 MXN / alumno",
      scalableMonthly: "$35,000 – $70,000 MXN",
    },
    stack: {
      programValue: "$2,000 MXN",
      bonus1Value: "$1,000 MXN",
      bonus2Value: "$600 MXN",
      bonus3Value: "$800 MXN",
      totalRealValue: "$4,400+ MXN",
      officialPriceDisplay: "$997",
      currencySuffix: "MXN",
      installmentsNote: "Se aceptan Meses Sin Intereses con tarjetas de crédito participantes",
    },
  },
  usd: {
    code: "usd",
    symbol: "$",
    flag: "🇺🇸",
    label: "Internacional (USD)",
    price: 97,
    priceFormatted: "$97",
    unitAmount: 9700,
    allowsMSI: false,
    hasSplitOption: false,
    splitPrice: 35,
    splitPriceFormatted: "3 pagos de $35",
    splitUnitAmount: 3500,
    highTicketPricing: "$100 a $300 USD",
    programPricingRange: "$150 - $400+ USD",
    table: {
      hourlyRate: "$50 - $75 USD / hora",
      traditionalMonthly: "~$3,000 - $4,500 USD",
      courseSellingPrice: "$97 USD / alumno",
      scalableMonthly: "$3,500 – $7,000 USD",
    },
    stack: {
      programValue: "$200 USD",
      bonus1Value: "$100 USD",
      bonus2Value: "$60 USD",
      bonus3Value: "$80 USD",
      totalRealValue: "$440+ USD",
      officialPriceDisplay: "$97",
      currencySuffix: "USD",
      installmentsNote: "Pago seguro en dólares con tarjeta de crédito o débito",
    },
  },
  cop: {
    code: "cop",
    symbol: "$",
    flag: "🇨🇴",
    label: "Colombia (COP)",
    price: 230000,
    priceFormatted: "$230,000",
    unitAmount: 23000000, // 2 decimals in Stripe (230,000 * 100)
    allowsMSI: false,
    highTicketPricing: "$400,000 a $1,200,000 COP",
    programPricingRange: "$500,000 - $1,500,000+ COP",
    table: {
      hourlyRate: "$25,000 - $40,000 COP / hora",
      traditionalMonthly: "~$1,500,000 - $2,500,000 COP",
      courseSellingPrice: "$230,000 COP / alumno",
      scalableMonthly: "$2,300,000 – $4,600,000 COP",
    },
    stack: {
      programValue: "$460,000 COP",
      bonus1Value: "$230,000 COP",
      bonus2Value: "$130,000 COP",
      bonus3Value: "$160,000 COP",
      totalRealValue: "$980,000+ COP",
      officialPriceDisplay: "$230,000",
      currencySuffix: "COP",
      installmentsNote: "Pago único en pesos colombianos con tarjeta de crédito o débito",
    },
  },
  clp: {
    code: "clp",
    symbol: "$",
    flag: "🇨🇱",
    label: "Chile (CLP)",
    price: 55000,
    priceFormatted: "$55,000",
    unitAmount: 55000, // Zero decimal currency in Stripe
    allowsMSI: false,
    highTicketPricing: "$95,000 a $280,000 CLP",
    programPricingRange: "$120,000 - $350,000+ CLP",
    table: {
      hourlyRate: "$10,000 - $16,000 CLP / hora",
      traditionalMonthly: "~$600,000 - $1,000,000 CLP",
      courseSellingPrice: "$55,000 CLP / alumno",
      scalableMonthly: "$550,000 – $1,100,000 CLP",
    },
    stack: {
      programValue: "$110,000 CLP",
      bonus1Value: "$55,000 CLP",
      bonus2Value: "$32,000 CLP",
      bonus3Value: "$38,000 CLP",
      totalRealValue: "$235,000+ CLP",
      officialPriceDisplay: "$55,000",
      currencySuffix: "CLP",
      installmentsNote: "Pago único en pesos chilenos con tarjeta de crédito o débito",
    },
  },
  pen: {
    code: "pen",
    symbol: "S/",
    flag: "🇵🇪",
    label: "Perú (PEN)",
    price: 220,
    priceFormatted: "S/ 220",
    unitAmount: 22000,
    allowsMSI: false,
    highTicketPricing: "S/ 380 a S/ 1,150 PEN",
    programPricingRange: "S/ 480 - S/ 1,400+ PEN",
    table: {
      hourlyRate: "S/ 35 - S/ 55 PEN / hora",
      traditionalMonthly: "~S/ 2,200 - S/ 3,500 PEN",
      courseSellingPrice: "S/ 220 PEN / alumno",
      scalableMonthly: "S/ 2,200 – S/ 4,400 PEN",
    },
    stack: {
      programValue: "S/ 440 PEN",
      bonus1Value: "S/ 220 PEN",
      bonus2Value: "S/ 130 PEN",
      bonus3Value: "S/ 150 PEN",
      totalRealValue: "S/ 940+ PEN",
      officialPriceDisplay: "S/ 220",
      currencySuffix: "PEN",
      installmentsNote: "Pago único en soles peruanos con tarjeta de crédito o débito",
    },
  },
  uyu: {
    code: "uyu",
    symbol: "$U",
    flag: "🇺🇾",
    label: "Uruguay (UYU)",
    price: 2300,
    priceFormatted: "$2,300",
    unitAmount: 230000,
    allowsMSI: false,
    highTicketPricing: "$4,000 a $12,000 UYU",
    programPricingRange: "$5,000 - $15,000+ UYU",
    table: {
      hourlyRate: "$450 - $700 UYU / hora",
      traditionalMonthly: "~$28,000 - $44,000 UYU",
      courseSellingPrice: "$2,300 UYU / alumno",
      scalableMonthly: "$23,000 – $46,000 UYU",
    },
    stack: {
      programValue: "$4,600 UYU",
      bonus1Value: "$2,300 UYU",
      bonus2Value: "$1,300 UYU",
      bonus3Value: "$1,600 UYU",
      totalRealValue: "$9,800+ UYU",
      officialPriceDisplay: "$2,300",
      currencySuffix: "UYU",
      installmentsNote: "Pago único en pesos uruguayos con tarjeta de crédito o débito",
    },
  },
  eur: {
    code: "eur",
    symbol: "€",
    flag: "🇪🇺",
    label: "Europa (EUR)",
    price: 97,
    priceFormatted: "97 €",
    unitAmount: 9700,
    allowsMSI: false,
    highTicketPricing: "100 € a 300 €",
    programPricingRange: "150 € - 350+ €",
    table: {
      hourlyRate: "20 € - 35 € / hora",
      traditionalMonthly: "~1,300 € - 2,200 €",
      courseSellingPrice: "97 € / alumno",
      scalableMonthly: "1,000 € – 2,000 €",
    },
    stack: {
      programValue: "200 €",
      bonus1Value: "100 €",
      bonus2Value: "60 €",
      bonus3Value: "80 €",
      totalRealValue: "440+ €",
      officialPriceDisplay: "97",
      currencySuffix: "EUR",
      installmentsNote: "Pago único en euros válido para toda la Unión Europea",
    },
  },
};

export const COUNTRY_CURRENCY_MAP: Record<string, keyof typeof CURRENCIES> = {
  MX: "mxn",
  CO: "cop",
  CL: "clp",
  PE: "pen",
  UY: "uyu",
  // Europa
  ES: "eur",
  FR: "eur",
  DE: "eur",
  IT: "eur",
  PT: "eur",
  NL: "eur",
  BE: "eur",
  AT: "eur",
  IE: "eur",
  FI: "eur",
  GR: "eur",
  LU: "eur",
  // USA / Resto del mundo
  US: "usd",
  CA: "usd",
  PA: "usd",
  EC: "usd",
  CR: "usd",
  GT: "usd",
  DO: "usd",
};
