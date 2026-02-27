export const formatPrice = (price: number, currency: string = 'CHF'): string => {
  switch(currency?.toUpperCase()) {
    case 'EUR':
      return `${price.toFixed(2).replace('.', ',')} €`;
    case 'CHF':
    default:
      return `${price.toFixed(2)} CHF`;
  }
};