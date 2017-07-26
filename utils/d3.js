// @flow

const d3Lib = require('d3')
const d3SelectionMulti = require('d3-selection-multi')
const jsdom = require('jsdom')

module.exports = (plotter : (window : any, d3 : any, timeFormat: any, view : any, rdata : Array<any>) => any, data : any) : Promise<string> => new Promise((resolve, reject) =>

  jsdom.env({
    html:'',
    features: { QuerySelector: true }, //you need query selector for D3 to work
    done: async function (errors, window) {

    	window.d3 = d3Lib.select(window.document); //get d3 into the dom
      const d3 = window.d3
      const timeFormat = require('d3-time-format')

      try {

        const view = d3.select('body')
          .append('div').attr('class','view')

        plotter(window, d3, timeFormat, view, data)


        resolve(view.html())
      } catch (ex) {
        reject(ex)
      }
    }
  })
)
