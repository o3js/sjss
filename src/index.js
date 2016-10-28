const _ = require('lodash');

const { keyExpansions, keyValExpansions } = require('./expansions');

function toCSSRecursive(obj, ns, result) {
  _.each(
    _.pickBy(obj, _.isPlainObject),
    (val, key) => _.each(
      key.split(','), ks => toCSSRecursive(val, _.flatten([ns, ks]), result)));
  _.each(
    _.omitBy(obj, _.isPlainObject),
    (val, key) => {
      const oval = keyExpansions[key]
            ? _.map(keyExpansions[key], nk => ({[nk]: val}))
            : (keyValExpansions[key + ':' + val]) || [{[key]: val}];
      const nss = ns.join(' ').replace(/ &/g, '');
      if (!result[nss]) result[nss] = [];
      _.each(oval, (v) => result[nss].push(v));
    });
}

function render(obj) {
  const result = {};
  toCSSRecursive(obj, [], result);
  return _.map(result, (val, key) => {
    let inner = '';
    _.each(val, (v) => {
      _.each(v, (vi, ki) => {
        inner += '  ' + ki + ': ' + vi + ';\n';
      });
    });
    return `${key} {\n${inner}}`;
  }).join('\n');
}

function reset() {
  return render({
    [['html', 'body', 'div', 'span', 'applet', 'object', 'iframe',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote', 'pre',
      'a', 'abbr', 'acronym', 'address', 'big', 'cite', 'code',
      'del', 'dfn', 'em', 'img', 'ins', 'kbd', 'q', 's', 'samp',
      'small', 'strike', 'strong', 'sub', 'sup', 'tt', 'var',
      'b', 'u', 'i', 'center',
      'dl', 'dt', 'dd', 'ol', 'ul', 'li',
      'fieldset', 'form', 'label', 'legend',
      'table', 'caption', 'tbody', 'tfoot', 'thead', 'tr', 'th', 'td',
      'article', 'aside', 'canvas', 'details', 'embed',
      'figure', 'figcaption', 'footer', 'header', 'hgroup',
      'menu', 'nav', 'output', 'ruby', 'section', 'summary',
      'time', 'mark', 'audio', 'video'].join(',')]: {
        'margin': 0,
        'padding': 0,
        'border': 0,
        'font-size': '100%',
        'font': 'inherit',
        'vertical-align': 'baseline',
      },
    /* HTML5 display-role reset for older browsers */
    [['article', 'aside', 'details', 'figcaption', 'figure',
      'footer', 'header', 'hgroup', 'menu', 'nav', 'section'].join(',')]: {
        'display': 'block',
      },
    'body': {
      'line-height': 1,
    },
    'ol,ul': {
      'list-style': 'none',
    },
    'blockquote,q': {
      'quotes': 'none',
    },
    'blockquote:before,blockquote:after,q:before,q:after': {
      'content': ['', 'none'],
    },
    'table': {
      'border-collapse': 'collapse',
      'border-spacing': 0,
    },
  });
}

module.exports = {
  render,
  reset,
};
