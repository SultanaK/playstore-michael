'use strict';

const capitalize = (str) => {
  str = str.toLowerCase();
  return str[0].toUpperCase() + str.slice(1, str.length);
};

module.exports = {
  capitalize
};