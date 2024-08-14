const config = {
    totalImages: 5,
    site_name: 'iot-cloud',
    email: 'me@lacymorrow.com',
    title: 'Smartcloud',
    tagline: 'Firmware for iot scheduler',
    description: 'Firmware for iot scheduler',
    locale: 'en',
    errorMessage: '',
    MAX_RETRIES: 3, // TODO: increase for production
    RETRY_DELAY: 1000,
    TIMEOUT: 3000,
    BACKOFF_DELAY: 4000,
    NETWORK_TIMEOUT: 10000,
};

config.errorMessage = `There was an error, please email <a href="mailto:${config.email}">${config.email}</a>`;

export default config;
