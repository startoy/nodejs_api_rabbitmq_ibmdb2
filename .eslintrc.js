module.exports = {
  /* ใช้ Jest สำหรับ Unit tests
  env: {
     "jest": true
  }, */
  // Standard JavaScript Style Guide
    extends: ["standard", "plugin:prettier/recommended"],
  // Airbnb JavaScript Style Guide
    // extends: ["airbnb-base", "plugin:prettier/recommended"],
  // Google JavaScript Style Guide
    // extends: ["google", "plugin:prettier/recommended"],
  rules: {
    // เนื่องจาก Prettier จะแนะนำให้ใช้ Double Quote กับ String จึงทำการแก้ไขให้ Prettier เตือนให้ใช้ Single Quote แทน
     "prettier/prettier": ["error", { "singleQuote": true }]
  }
};