/** @type {import('stylelint').Config} */
module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss"
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
