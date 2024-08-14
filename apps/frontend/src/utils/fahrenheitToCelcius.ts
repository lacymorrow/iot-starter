export const fahrenheitToCelcius = (fahrenheit: number | string) => {
    const parsedFahrenheit = parseFloat(fahrenheit.toString());
    return ((parsedFahrenheit - 32) * 5) / 9;
};
