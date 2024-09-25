module.exports = {
  "presets": [
    ["@babel/preset-env", {
      "loose": true,
      "targets": "> 0.25%, not dead"
    }],
    ["@babel/preset-react", {
      "runtime": "automatic"
    }]
  ],
  "plugins": [
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    ["@babel/plugin-proposal-private-methods", { "loose": true }],
    ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
    "@babel/plugin-transform-runtime"
  ]
}
