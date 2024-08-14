export const generateRandom = (max: number) => Math.floor(Math.random() * max);

export const getLocalStorage = (key: string) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : undefined;
};

export const incrementNumber = (number: number, max: number) => {
    return (number + 1) % max;
};

export const prefersReducedMotion = () => {
    if (typeof window === 'undefined') {
        return false;
    }
    // Grab the prefers reduced media query.
    const mediaQuery = window?.matchMedia('(prefers-reduced-motion: reduce)');
    return !mediaQuery || mediaQuery.matches;
};

// Promise with timeout; pass an async function and timeout (ms)
export const timeout = (prom: Promise<any>, time: number) => {
    let timer: any;
    return Promise.race([
        prom,
        new Promise((_r, reject) => {
            timer = setTimeout(() => reject(new Error(`timeout`)), time);
            return timer;
        }),
    ]).finally(() => clearTimeout(timer));
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// retryOperation(func, 1000, 5)
//   .then(console.log)
//   .catch(console.log);
export const retryOperation = (
    operation: () => any,
    delay: number,
    retries: number,
): Promise<any> =>
    new Promise((resolve, reject) => {
        return operation()
            .then(resolve)
            .catch((error: any) => {
                if (retries > 0) {
                    return wait(delay)
                        .then(
                            retryOperation.bind(
                                null,
                                operation,
                                delay,
                                retries - 1,
                            ),
                        )
                        .then(resolve)
                        .catch((err) => {
                            let errorMessage = 'Operation failed';
                            if (err instanceof Error) {
                                errorMessage = err.message;
                            }
                            reject(errorMessage);
                        });
                }
                return reject(error);
            });
    });

// Format strings with %s
export const strFormat = (str: string, ...args: any) =>
    args.reduce((s: string, v: string) => s.replace('%s', v), str);
