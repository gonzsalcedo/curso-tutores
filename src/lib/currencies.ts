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
    price: 1490,
    priceFormatted: "$1,490",
    unitAmount: 149000,
    allowsMSI: true,
    highTicketPricing: "$3,000 a $8,000 MXN",
    programPricingRange: "$3,500 - $10,000+ MXN",
    table: {
      hourlyRate: "$400 MXN / hora",
      traditionalMonthly: "~$25,000 - $35,000 MXN",
      courseSellingPrice: "$1,490 MXN / alumno",
      scalableMonthly: "$50,000 – $100,000 MXN",
    },
    stack: {
      programValue: "$3,000 MXN",
      bonus1Value: "$1,500 MXN",
      bonus2Value: "$900 MXN",
      bonus3Value: "$1,200 MXN",
      totalRealValue: "$6,600+ MXN",
      officialPriceDisplay: "$1,490",
      currencySuffix: "MXN",
      installmentsNote: "Se aceptan Meses Sin Intereses con tarjetas de crédito participantes",
    },
  },
  usd: {
    code: "usd",
    symbol: "$",
    flag: "🇺🇸",
    label: "Internacional (USD)",
    price: 149,
    priceFormatted: "$149",
    unitAmount: 14900,
    allowsMSI: false,
    hasSplitOption: false,
    splitPrice: 55,
    splitPriceFormatted: "3 pagos de $55",
    splitUnitAmount: 5500,
    highTicketPricing: "$150 a $400 USD",
    programPricingRange: "$200 - $500+ USD",
    table: {
      hourlyRate: "$50 - $75 USD / hora",
      traditionalMonthly: "~$3,000 - $4,500 USD",
      courseSellingPrice: "$149 USD / alumno",
      scalableMonthly: "$5,000 – $10,000 USD",
    },
    stack: {
      programValue: "$300 USD",
      bonus1Value: "$150 USD",
      bonus2Value: "$90 USD",
      bonus3Value: "$120 USD",
      totalRealValue: "$660+ USD",
      officialPriceDisplay: "$149",
      currencySuffix: "USD",
      installmentsNote: "Pago seguro en dólares con tarjeta de crédito o débito",
    },
  },
  cop: {
    code: "cop",
    symbol: "$",
    flag: "🇨🇴",
    label: "Colombia (COP)",
    price: 280000,
    priceFormatted: "$280,000",
    unitAmount: 28000000, // 2 decimals in Stripe (280,000 * 100)
    allowsMSI: false,
    highTicketPricing: "$500,000 a $1,500,000 COP",
    programPricingRange: "$600,000 - $2,000,000+ COP",
    table: {
      hourlyRate: "$25,000 - $40,000 COP / hora",
      traditionalMonthly: "~$1,500,000 - $2,500,000 COP",
      courseSellingPrice: "$280,000 COP / alumno",
      scalableMonthly: "$2,800,000 – $5,600,000 COP",
    },
    stack: {
      programValue: "$560,000 COP",
      bonus1Value: "$280,000 COP",
      bonus2Value: "$160,000 COP",
      bonus3Value: "$200,000 COP",
      totalRealValue: "$1,200,000+ COP",
      officialPriceDisplay: "$280,000",
      currencySuffix: "COP",
      installmentsNote: "Pago único en pesos colombianos con tarjeta de crédito o débito",
    },
  },
  clp: {
    code: "clp",
    symbol: "$",
    flag: "🇨🇱",
    label: "Chile (CLP)",
    price: 85000,
    priceFormatted: "$85,000",
    unitAmount: 85000, // Zero decimal currency in Stripe
    allowsMSI: false,
    highTicketPricing: "$120,000 a $350,000 CLP",
    programPricingRange: "$150,000 - $450,000+ CLP",
    table: {
      hourlyRate: "$10,000 - $16,000 CLP / hora",
      traditionalMonthly: "~$600,000 - $1,000,000 CLP",
      courseSellingPrice: "$85,000 CLP / alumno",
      scalableMonthly: "$850,000 – $1,700,000 CLP",
    },
    stack: {
      programValue: "$170,000 CLP",
      bonus1Value: "$85,000 CLP",
      bonus2Value: "$50,000 CLP",
      bonus3Value: "$60,000 CLP",
      totalRealValue: "$365,000+ CLP",
      officialPriceDisplay: "$85,000",
      currencySuffix: "CLP",
      installmentsNote: "Pago único en pesos chilenos con tarjeta de crédito o débito",
    },
  },
  pen: {
    code: "pen",
    symbol: "S/",
    flag: "🇵🇪",
    label: "Perú (PEN)",
    price: 300,
    priceFormatted: "S/ 300",
    unitAmount: 30000,
    allowsMSI: false,
    highTicketPricing: "S/ 500 a S/ 1,500 PEN",
    programPricingRange: "S/ 600 - S/ 1,800+ PEN",
    table: {
      hourlyRate: "S/ 35 - S/ 55 PEN / hora",
      traditionalMonthly: "~S/ 2,200 - S/ 3,500 PEN",
      courseSellingPrice: "S/ 300 PEN / alumno",
      scalableMonthly: "S/ 3,000 – S/ 6,000 PEN",
    },
    stack: {
      programValue: "S/ 600 PEN",
      bonus1Value: "S/ 300 PEN",
      bonus2Value: "S/ 180 PEN",
      bonus3Value: "S/ 210 PEN",
      totalRealValue: "S/ 1,290+ PEN",
      officialPriceDisplay: "S/ 300",
      currencySuffix: "PEN",
      installmentsNote: "Pago único en soles peruanos con tarjeta de crédito o débito",
    },
  },
  uyu: {
    code: "uyu",
    symbol: "$U",
    flag: "🇺🇾",
    label: "Uruguay (UYU)",
    price: 3600,
    priceFormatted: "$3,600",
    unitAmount: 360000,
    allowsMSI: false,
    highTicketPricing: "$6,000 a $16,000 UYU",
    programPricingRange: "$7,000 - $20,000+ UYU",
    table: {
      hourlyRate: "$450 - $700 UYU / hora",
      traditionalMonthly: "~$28,000 - $44,000 UYU",
      courseSellingPrice: "$3,600 UYU / alumno",
      scalableMonthly: "$36,000 – $72,000 UYU",
    },
    stack: {
      programValue: "$7,200 UYU",
      bonus1Value: "$3,600 UYU",
      bonus2Value: "$2,000 UYU",
      bonus3Value: "$2,500 UYU",
      totalRealValue: "$15,300+ UYU",
      officialPriceDisplay: "$3,600",
      currencySuffix: "UYU",
      installmentsNote: "Pago único en pesos uruguayos con tarjeta de crédito o débito",
    },
  },
  eur: {
    code: "eur",
    symbol: "€",
    flag: "🇪🇺",
    label: "Europa (EUR)",
    price: 79,
    priceFormatted: "79 €",
    unitAmount: 7900,
    allowsMSI: false,
    highTicketPricing: "120 € a 350 €",
    programPricingRange: "150 € - 450+ €",
    table: {
      hourlyRate: "20 € - 35 € / hora",
      traditionalMonthly: "~1,300 € - 2,200 €",
      courseSellingPrice: "79 € / alumno",
      scalableMonthly: "1,000 € – 2,000 €",
    },
    stack: {
      programValue: "160 €",
      bonus1Value: "80 €",
      bonus2Value: "50 €",
      bonus3Value: "60 €",
      totalRealValue: "350+ €",
      officialPriceDisplay: "79",
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
