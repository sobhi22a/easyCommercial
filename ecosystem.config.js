module.exports = {
    apps: [
      {
        name: "easy-commercial",
        script: "quotaServe.js", // Adjust if using TypeScript
        instances: "max", // Auto-scale to max CPU cores
        exec_mode: "cluster", // Enable clustering
        watch: false, // Set to true if you want auto-restart on file changes
        env: {
          NODE_ENV: "production",
          PORT: 2081, // Change as needed
        },
      },
    ],
  };
  