declare global {
    interface Window {
        gtag: any;
    }
}

// log the pageview with their URL
export const pageview = (url: string) => {
    window.gtag('config', process.env.GOOGLE_ANALYTICS, {
        page_path: url,
    });
};

// log specific events happening.
export const event = ({ action, params }: any) => {
    window.gtag('event', action, params);
};
