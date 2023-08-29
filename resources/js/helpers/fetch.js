const fetcher = async (url, options = {}) => {
    // method = "GET", data

    const config = {
        ...options,
        headers: {
            ...options?.headers,
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            Accept: "application/json, text-plain, */*",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
        },
        body: options?.body ? JSON.stringify(options?.body) : undefined,
    };

    return new Promise(async (resolve, reject) => {
        try {
            const response = fetch(url, config);

            response.then(async (response) => {
                let res;
                try {
                    res = await response.json();
                } catch (error) {
                    res = await response.text();
                }
                if (response.ok === false) {
                    reject(res);
                } else {
                    resolve(res);
                }
            });

            response.catch((error) => {
                reject(error);
            });
        } catch (error) {
            console.error("Fetch error:", error);
            reject(error);
        }
    });
};

fetcher.post = (url, options) =>
    fetcher(url, {
        ...options,
        method: "POST",
    });

fetcher.put = (url, options) =>
    fetcher(url, {
        ...options,
        method: "PUT",
    });

fetcher.patch = (url, options) =>
    fetcher(url, {
        ...options,
        method: "PATCH",
    });

fetcher.delete = (url, options) =>
    fetcher(url, {
        ...options,
        method: "DELETE",
    });

export default fetcher;
