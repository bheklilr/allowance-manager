
export const getPurchases = async () => {
    let response = await fetch("/api/history");
    let history = await response.json();
    return history.map(purchase => ({
        ...purchase,
        date: new Date(purchase.date)
    }));
};

export const postPurchase = async purchase => {
    await fetch("/api/history", {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...purchase, date: purchase.date.toISOString() })
    });
};

export const updatePurchases = async setPurchases => {
    let purchases = await getPurchases();
    setPurchases(purchases);
};