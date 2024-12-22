module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      'plugin:vue/essential'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
    }
}