var _ = require('lodash');

function toType(obj) {
  return ({}).toString.call(obj).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
}

/**
 * Helper methods for matching tokens
 */
var methods = {

  /**
   * Token type `string`
   * @return {Boolean}
   */
  string: function(token, model){
    token = token || {};
    if(!_.isString(token.query)){ return false; }

    var attributes = _.chain(model.fields || ['title'])
      .map(function(key){
        return model.get(key); // allows nested get
      })
      .compact()
      .value();

    var self = this;
    return _.some( attributes, function( attribute ) {
      return self._partialString(attribute, token.query.toLowerCase());
    });
  },

  /**
   * Token type `prefix`
   * @return {Boolean}
   */
  prefix: function(token, model){
    token = token || {};
    if(_.isFunction(token.query)){
      return token.query(model.get(token.prefix));
    }

    if(!_.isString(token.query)){
      token.query = token.query.toString();
    }

    var attr = model.get(token.prefix),
        type = toType(attr);

    // _boolean, _array etc
    if(this.hasOwnProperty('_' + type)){
      return this['_' + type](attr, token.query.toLowerCase());
    }
  },

  /**
   * Token type `or`
   * @return {Boolean}
   */
  or: function(token, model){
    var self = this;
    return _.some(token.queries, function(t){
      return self[t.type](t, model);
    });
  },

  _string: function(str, value){
    return str.toLowerCase() === value;
  },

  _partialString: function(str, value){
    return str.toLowerCase().indexOf( value ) !== -1;
  },

  _number: function(number, value){
    return number.toString() === value;
  },

  _partialNumber: function(number, value){
    return number.toString().indexOf( value ) !== -1;
  },

  _boolean: function(bool, value){
    if(value === 'true'){
      return bool === true;
    } else if (value === 'false'){
      return bool === false;
    }
    return false;
  },

  _array: function(arr, value){
    return _.some(arr, function(elem){
      return elem.toLowerCase() === value;
    });
  }

};

module.exports = function(model, filterArray){
  // match tokens
  // todo: all = AND, any = OR
  return _.every(filterArray, function(filter){
    return methods[filter.type](filter, model);
  });
};