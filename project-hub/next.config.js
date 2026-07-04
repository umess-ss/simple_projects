/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is now a server app (API route handlers + SQLite), so the static
  // export is gone. better-sqlite3 is a native module — keep it external so
  // Next doesn't try to bundle it into the server runtime.
  serverExternalPackages: ["better-sqlite3"],
};

module.exports = nextConfig;
