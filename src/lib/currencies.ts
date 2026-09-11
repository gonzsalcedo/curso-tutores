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
    price: 3500,
    priceFormatted: "$3,500",
    unitAmount: 350000,
    allowsMSI: true,
    highTicketPricing: "$2,000 a $6,000 MXN",
    programPricingRange: "$2,500 - $7,000+ MXN",
    table: {
      hourlyRate: "$400 MXN / hora",
      traditionalMonthly: "~$25,000 - $35,000 MXN",
      courseSellingPrice: "$3,500 MXN / alumno",
      scalableMonthly: "$35,000 – $70,000 MXN",
    },
    stack: {
      programValue: "$7,000 MXN",
      bonus1Value: "$3,500 MXN",
      bonus2Value: "$2,000 MXN",
      bonus3Value: "$2,500 MXN",
      totalRealValue: "$15,000+ MXN",
      officialPriceDisplay: "$3,500",
      currencySuffix: "MXN",
      installmentsNote: "Se aceptan Meses Sin Intereses con tarjetas de crédito participantes",
    },
  },
  usd: {
    code: "usd",
    symbol: "$",
    flag: "🇺🇸",
    label: "Internacional (USD)",
    price: 350,
    priceFormatted: "$350",
    unitAmount: 35000,
    allowsMSI: false,
    hasSplitOption: true,
    splitPrice: 130,
    splitPriceFormatted: "3 pagos de $130",
    splitUnitAmount: 13000,
    highTicketPricing: "$100 a $300 USD",
    programPricingRange: "$150 - $400+ USD",
    table: {
      hourlyRate: "$50 - $75 USD / hora",
      traditionalMonthly: "~$3,000 - $4,500 USD",
      courseSellingPrice: "$350 USD / alumno",
      scalableMonthly: "$3,500 – $7,000 USD",
    },
    stack: {
      programValue: "$700 USD",
      bonus1Value: "$350 USD",
      bonus2Value: "$200 USD",
      bonus3Value: "$250 USD",
      totalRealValue: "$1,500+ USD",
      officialPriceDisplay: "$350",
      currencySuffix: "USD",
      installmentsNote: "Pago seguro en dólares • Opción disponible de 3 pagos de $130 USD",
    },
  },
  cop: {
    code: "cop",
    symbol: "$",
    flag: "🇨🇴",
    label: "Colombia (COP)",
    price: 800000,
    priceFormatted: "$800,000",
    unitAmount: 80000000, // 2 decimals in Stripe (800,000 * 100)
    allowsMSI: false,
    highTicketPricing: "$400,000 a $1,200,000 COP",
    programPricingRange: "$500,000 - $1,500,000+ COP",
    table: {
      hourlyRate: "$25,000 - $40,000 COP / hora",
      traditionalMonthly: "~$1,500,000 - $2,500,000 COP",
      courseSellingPrice: "$800,000 COP / alumno",
      scalableMonthly: "$8,000,000 – $16,000,000 COP",
    },
    stack: {
      programValue: "$1,600,000 COP",
      bonus1Value: "$800,000 COP",
      bonus2Value: "$450,000 COP",
      bonus3Value: "$550,000 COP",
      totalRealValue: "$3,400,000+ COP",
      officialPriceDisplay: "$800,000",
      currencySuffix: "COP",
      installmentsNote: "Pago único en pesos colombianos con tarjeta de crédito o débito",
    },
  },
  clp: {
    code: "clp",
    symbol: "$",
    flag: "🇨🇱",
    label: "Chile (CLP)",
    price: 190000,
    priceFormatted: "$190,000",
    unitAmount: 190000, // Zero decimal currency in Stripe
    allowsMSI: false,
    highTicketPricing: "$95,000 a $280,000 CLP",
    programPricingRange: "$120,000 - $350,000+ CLP",
    table: {
      hourlyRate: "$10,000 - $16,000 CLP / hora",
      traditionalMonthly: "~$600,000 - $1,000,000 CLP",
      courseSellingPrice: "$190,000 CLP / alumno",
      scalableMonthly: "$1,900,000 – $3,800,000 CLP",
    },
    stack: {
      programValue: "$380,000 CLP",
      bonus1Value: "$190,000 CLP",
      bonus2Value: "$110,000 CLP",
      bonus3Value: "$130,000 CLP",
      totalRealValue: "$810,000+ CLP",
      officialPriceDisplay: "$190,000",
      currencySuffix: "CLP",
      installmentsNote: "Pago único en pesos chilenos con tarjeta de crédito o débito",
    },
  },
  pen: {
    code: "pen",
    symbol: "S/",
    flag: "🇵🇪",
    label: "Perú (PEN)",
    price: 750,
    priceFormatted: "S/ 750",
    unitAmount: 75000,
    allowsMSI: false,
    highTicketPricing: "S/ 380 a S/ 1,150 PEN",
    programPricingRange: "S/ 480 - S/ 1,400+ PEN",
    table: {
      hourlyRate: "S/ 35 - S/ 55 PEN / hora",
      traditionalMonthly: "~S/ 2,200 - S/ 3,500 PEN",
      courseSellingPrice: "S/ 750 PEN / alumno",
      scalableMonthly: "S/ 7,500 – S/ 15,000 PEN",
    },
    stack: {
      programValue: "S/ 1,500 PEN",
      bonus1Value: "S/ 750 PEN",
      bonus2Value: "S/ 430 PEN",
      bonus3Value: "S/ 520 PEN",
      totalRealValue: "S/ 3,200+ PEN",
      officialPriceDisplay: "S/ 750",
      currencySuffix: "PEN",
      installmentsNote: "Pago único en soles peruanos con tarjeta de crédito o débito",
    },
  },
  uyu: {
    code: "uyu",
    symbol: "$U",
    flag: "🇺🇾",
    label: "Uruguay (UYU)",
    price: 8000,
    priceFormatted: "$8,000",
    unitAmount: 800000,
    allowsMSI: false,
    highTicketPricing: "$4,000 a $12,000 UYU",
    programPricingRange: "$5,000 - $15,000+ UYU",
    table: {
      hourlyRate: "$450 - $700 UYU / hora",
      traditionalMonthly: "~$28,000 - $44,000 UYU",
      courseSellingPrice: "$8,000 UYU / alumno",
      scalableMonthly: "$80,000 – $160,000 UYU",
    },
    stack: {
      programValue: "$16,000 UYU",
      bonus1Value: "$8,000 UYU",
      bonus2Value: "$4,500 UYU",
      bonus3Value: "$5,500 UYU",
      totalRealValue: "$34,000+ UYU",
      officialPriceDisplay: "$8,000",
      currencySuffix: "UYU",
      installmentsNote: "Pago único en pesos uruguayos con tarjeta de crédito o débito",
    },
  },
  eur: {
    code: "eur",
    symbol: "€",
    flag: "🇪🇺",
    label: "Europa (EUR)",
    price: 180,
    priceFormatted: "180 €",
    unitAmount: 18000,
    allowsMSI: false,
    highTicketPricing: "100 € a 300 €",
    programPricingRange: "150 € - 350+ €",
    table: {
      hourlyRate: "20 € - 35 € / hora",
      traditionalMonthly: "~1,300 € - 2,200 €",
      courseSellingPrice: "180 € / alumno",
      scalableMonthly: "1,800 € – 3,600 €",
    },
    stack: {
      programValue: "360 €",
      bonus1Value: "180 €",
      bonus2Value: "100 €",
      bonus3Value: "130 €",
      totalRealValue: "770+ €",
      officialPriceDisplay: "180",
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
