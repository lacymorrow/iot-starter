export const celciusToFahrenheit = (celcius: number | string) => {
    const parsedCelcius = parseFloat(celcius.toString());
    return (parsedCelcius * 9) / 5 + 32;
};
