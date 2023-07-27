module.exports = {
  setupFiles: ["jest-canvas-mock"],
  preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
  transformIgnorePatterns: [
      '<rootDir>/node_modules/(?!axios)'
  ],

}
