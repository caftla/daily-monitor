// @flow

const React = require('react')
const R = require('ramda')

export const tr_th_style = { textAlign: 'left', fontWeight: 'bold', backgroundColor: '#f0f0f0', fontSize: '0.9em', height: '3.4ex' }
const td_th_style = { textAlign: 'left' }

const td_style = {
  borderBottom: 'solid 1px #ddd', overflow: 'hidden', padding: '0.3em 0 0.3em 0'
}

export const TD = ({value, width, style, link}: any) => {
  const content = !!link
    ? <a style={ {color: '#0f4169', textDecoration: 'none'} } target='_blank' href={ link }>{value}</a>
    : value
  return <td style={ { width: `${width}px`, ...td_style, ...(style || {}) } }>
    { content }
  </td>
}
export const TH = ({value, width, style}: any) => <th style={ { width: `${width}px`, ...(style || {}) } }>{value}</th>

export const TABLE = (props: any) =>
  <table style={ { width: `${props.width}px`, backgroundColor: 'white', marginBottom: '2em', color: 'black', fontFamily: 'Osaka, CONSOLAS, monospace', ...(props.style || {}) } } cellSpacing="0" cellPadding="0">
    { props.children }
  </table>
