/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss"
  ],

  // Ignore legacy / archived code
  ignoreFiles: [
    "**/app/_archive/**",
    "**/components/_archive/**"
  ],

  rules: {
    // Allow Tailwind / PostCSS at-rules
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "layer",
          "config",
          "custom-variant",
          "screen"
        ]
      }
    ]
  }
};
