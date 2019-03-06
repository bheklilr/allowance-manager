export default {
    createTables: "CREATE TABLE IF NOT EXISTS purchase_history (date text, name text, amount real);",
    getPurchases: "SELECT date, name, amount FROM purchase_history WHERE user = $1;",
    insertPurchase: "INSERT INTO purchase_history(user, date, name, amount) VALUES($1, $2, $3, $4);",
    clear: "TRUNCATE purchase_history;",
    editPurchase: "",
    deletePurchase: "",
}