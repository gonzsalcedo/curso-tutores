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
    price: 1450000,
    priceFormatted: "$1,450,000",
    unitAmount: 145000000, // 2 decimals in Stripe
    allowsMSI: false,
    table: {
      hourlyRate: "$45,000 - $70,000 COP / hora",
      traditionalMonthly: "~$2,800,000 - $4,200,000 COP",
      courseSellingPrice: "$1,450,000 COP / alumno",
      scalableMonthly: "$14,500,000 – $29,000,000 COP",
    },
    stack: {
      programValue: "$2,900,000 COP",
      bonus1Value: "$1,450,000 COP",
      bonus2Value: "$800,000 COP",
      bonus3Value: "$1,000,000 COP",
      totalRealValue: "$6,150,000+ COP",
      officialPriceDisplay: "$1,450,000",
      currencySuffix: "COP",
      installmentsNote: "Pago único en pesos colombianos con tarjeta de crédito o débito",
    },
  },
  clp: {
    code: "clp",
    symbol: "$",
    flag: "🇨🇱",
    label: "Chile (CLP)",
    price: 340000,
    priceFormatted: "$340,000",
    unitAmount: 340000, // Zero decimal currency in Stripe
    allowsMSI: false,
    table: {
      hourlyRate: "$18,000 - $28,000 CLP / hora",
      traditionalMonthly: "~$1,100,000 - $1,700,000 CLP",
      courseSellingPrice: "$340,000 CLP / alumno",
      scalableMonthly: "$3,400,000 – $6,800,000 CLP",
    },
    stack: {
      programValue: "$680,000 CLP",
      bonus1Value: "$340,000 CLP",
      bonus2Value: "$190,000 CLP",
      bonus3Value: "$240,000 CLP",
      totalRealValue: "$1,450,000+ CLP",
      officialPriceDisplay: "$340,000",
      currencySuffix: "CLP",
      installmentsNote: "Pago único en pesos chilenos con tarjeta de crédito o débito",
    },
  },
  pen: {
    code: "pen",
    symbol: "S/",
    flag: "🇵🇪",
    label: "Perú (PEN)",
    price: 1290,
    priceFormatted: "S/ 1,290",
    unitAmount: 129000,
    allowsMSI: false,
    table: {
      hourlyRate: "S/ 60 - S/ 95 PEN / hora",
      traditionalMonthly: "~S/ 3,800 - S/ 5,500 PEN",
      courseSellingPrice: "S/ 1,290 PEN / alumno",
      scalableMonthly: "S/ 12,900 – S/ 25,800 PEN",
    },
    stack: {
      programValue: "S/ 2,580 PEN",
      bonus1Value: "S/ 1,290 PEN",
      bonus2Value: "S/ 750 PEN",
      bonus3Value: "S/ 900 PEN",
      totalRealValue: "S/ 5,520+ PEN",
      officialPriceDisplay: "S/ 1,290",
      currencySuffix: "PEN",
      installmentsNote: "Pago único en soles peruanos con tarjeta de crédito o débito",
    },
  },
  uyu: {
    code: "uyu",
    symbol: "$U",
    flag: "🇺🇾",
    label: "Uruguay (UYU)",
    price: 145000,
    priceFormatted: "$14,500",
    unitAmount: 1450000,
    allowsMSI: false,
    table: {
      hourlyRate: "$750 - $1,200 UYU / hora",
      traditionalMonthly: "~$45,000 - $70,000 UYU",
      courseSellingPrice: "$14,500 UYU / alumno",
      scalableMonthly: "$145,000 – $290,000 UYU",
    },
    stack: {
      programValue: "$29,000 UYU",
      bonus1Value: "$14,500 UYU",
      bonus2Value: "$8,500 UYU",
      bonus3Value: "$10,500 UYU",
      totalRealValue: "$62,500+ UYU",
      officialPriceDisplay: "$14,500",
      currencySuffix: "UYU",
      installmentsNote: "Pago único en pesos uruguayos con tarjeta de crédito o débito",
    },
  },
  eur: {
    code: "eur",
    symbol: "€",
    flag: "🇪🇺",
    label: "Europa (EUR)",
    price: 320,
    priceFormatted: "320 €",
    unitAmount: 32000,
    allowsMSI: false,
    table: {
      hourlyRate: "35 € - 55 € / hora",
      traditionalMonthly: "~2,200 € - 3,500 €",
      courseSellingPrice: "320 € / alumno",
      scalableMonthly: "3,200 € – 6,400 €",
    },
    stack: {
      programValue: "640 €",
      bonus1Value: "320 €",
      bonus2Value: "180 €",
      bonus3Value: "230 €",
      totalRealValue: "1,370+ €",
      officialPriceDisplay: "320",
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
