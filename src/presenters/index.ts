export const formatPrice = (price: number | null): string => {
  const value = price ? price / 100 : 0; //value is returned as cents by strapi api
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const formatDateFull = (stringDate: string) => {
  const date = new Date(stringDate);
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};
