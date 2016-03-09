var Backbone = require('backbone');
var Parser = require('query-parser');
var parse = new Parser();
var query = require('../query');

var model = new Backbone.Model({
  title: 'Woo Logo Hy-phen "spécîäl" доступ مدفوع',
  id: 5,
  bool: true,
  boolean: false,
  barcode: 'SKU12345',
  address: {
    country: 'US',
    postcode: '90210'
  },
  categories: [
    'Music',
    'Posters'
  ],
  complex: [{
    name: 'Color',
    slug: 'color',
    option: 'Black'
  },{
    name: 'Size',
    slug: 'size',
    option: 'XL'
  }],
  variable: [{
    name: 'Color',
    slug: 'color',
    variation: true,
    options: [
      'Black',
      'Green'
    ]
  },{
    name: 'Size',
    slug: 'size',
    variation: true,
    options: [
      'S', 'M', 'L'
    ]
  }]
});

describe('simple queries', function(){

  it('should match simple query on title', function () {
    query(model, parse('woo')).should.be.true;
    query(model, parse('foo')).should.be.false;
  });

  it('should match capitalized query on title', function () {
    query(model, parse('WOO')).should.be.true;
    query(model, parse('Log')).should.be.true;
  });

  it('should match spaced query on title', function () {
    query(model, parse('woo lo')).should.be.true;
    query(model, parse('woo foo')).should.be.false;
  });

  it('should match dashed query on title', function () {
    query(model, parse('hy-phen')).should.be.true;
  });

  it('should match special characters query on title', function () {
    query(model, parse('spéc')).should.be.true;
  });

  it('should match foreign characters query on title', function () {
    query(model, parse('مدفوع')).should.be.true;
  });

  it('should match an attribute with string value', function () {
    query(model, parse('barcode:sku12345')).should.be.true;
    query(model, parse('barcode:sku')).should.be.false;
  });

  it('should match an attribute with numeric value', function () {
    query(model, parse('id:5')).should.be.true;
    query(model, parse('id:6')).should.be.false;
  });

  it('should match an attribute with boolean value', function () {
    query(model, parse('bool:true')).should.be.true;
    query(model, parse('bool:false')).should.be.false;
    query(model, parse('bool:tru')).should.be.false;
    query(model, parse('boolean:TRUE')).should.be.false;
    query(model, parse('boolean:FALSE')).should.be.true;
    query(model, parse('boolean:FAL')).should.be.false;
    query(model, parse('bool:1')).should.be.false;
  });

  it('should match an attribute with an array value', function () {
    query(model, parse('categories:Music')).should.be.true;
    query(model, parse('categories:Mus')).should.be.false;
    query(model, parse('categories:posters')).should.be.true;
  });

});

describe('complex queries', function(){

  it('should match piped queries on title', function () {
    query(model, parse('woo|foo')).should.be.true;
    query(model, parse('foo|bar')).should.be.false;
  });

  it('should match piped queries on attribute', function () {
    query(model, parse('id:5|id:6')).should.be.true;
    query(model, parse('id:1|id:7')).should.be.false;
  });

});