export const config = {
    apiBaseUrl:
    process.env.NODE_ENV === "production"
    ? ""
    : "http://localhost:4000"
}