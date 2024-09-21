export const config = {
    apiBaseUrl:
    process.env.NODE_ENV === "production"
    ? "https://ecopott-server.vercel.app"
    : "http://localhost:4000"
}