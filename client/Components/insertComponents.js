const React = require('react');
const ReactDOM = require('react-dom/client');

const Causes = require('./causes');
const e = React.createElement;
const domContainer = document.querySelector('#causes-container');
const root = ReactDOM.createRoot(domContainer);
root.render(e(Causes));
