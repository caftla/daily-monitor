// @flow

const {sortBy, filter, Obj, objToPairs, id} = require('prelude-ls')

const duck = function(d3, view, result, args) {

  const x$ = view.append('table').attr('class', 'plottable');
  x$.append('thead').append('tr');
  x$.append('tbody');

}

module.exports = function(window : any, d3: any, view: any, result: Array<any>, options: any){
  var cell, cells, colsOrder, cols, x$, y$, $table, z$, z1$, z2$, this$ = this;
  cell = options.cell, cells = options.cells, colsOrder = options.colsOrder, cols = options.cols;
  cols = cols != null
    ? cols
    : function(){
      var this$ = this;
      return sortBy(function(it){
        var b;
        b = colsOrder.indexOf(it);
        if (b === -1) {
          return Infinity;
        } else {
          return b;
        }
      })(
      filter(compose$(function(it){
        return it.indexOf('$');
      }, (function(it){
        return it !== 0;
      })))(
      Obj.keys(
      result[0])));
    }();

  x$ = view.append('table').attr('class', 'plottable');
  x$.append('thead').append('tr');
  x$.append('tbody');

  y$ = $table = view.select('table');
  z$ = y$.select('thead tr').selectAll('td').data(cols);
  z$.enter().append('td').text(id);
  z$.attr('class', id);
  z1$ = y$.select('tbody').selectAll('tr').data(result).enter().append('tr').attr('style', function(it){
    return it.$style;
  });
  z2$ = z1$.selectAll('td').data(compose$(objToPairs, filter(function(arg$){
    var k;
    k = arg$[0];
    return cols.indexOf(k) > -1;
  }), sortBy(function(arg$){
    var k;
    k = arg$[0];
    return cols.indexOf(k);
  })));
  z2$.enter().append('td').each(function(arg$){
    var key, value;
    key = arg$[0], value = arg$[1];
    return cell(this, key, value);
  });
}

function compose$() {
  var functions = arguments;
  return function() {
    var i, result;
    result = functions[0].apply(this, arguments);
    for (i = 1; i < functions.length; ++i) {
      result = functions[i](result);
    }
    return result;
  };
}
