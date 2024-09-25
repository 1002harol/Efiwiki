module.exports = {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest",
     
    },
    moduleNameMapper : {
        '\\.(css|styl|less|sass)$': 'identity-obj-proxy',
    },
    transformIgnorePatterns: [
      "node_modules/(?!(axios|bootstrap|react-bootstrap|@react-bootstrap|react-icons|react-modal|react-toastify)/)",
    ],
    moduleFileExtensions: ['js', 'jsx' ,'json', 'node'],
  };