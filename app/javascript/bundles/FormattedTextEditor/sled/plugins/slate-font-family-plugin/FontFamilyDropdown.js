import React from 'react'
import classnames from 'classnames'

import FontFamilyList from './FontFamilyList'
import { fontFamilyMarkStrategy } from './FontFamilyUtils'


const FontFamilyDropdown = ({ value, onChange, changeState, className, style }) => (
  <select
    className={classnames(className)}
    style={style}
    onChange={({ target: { value: fontFamilyIndex } }) => {
      onChange(fontFamilyMarkStrategy({ value, fontFamilyIndex }))
    }}
  >
    {FontFamilyList.map((font, index) => (
      <option key={`slate-font-family-${index}`} value={index}>
        {font.name}
      </option>
    ))}
  </select>
)

export default FontFamilyDropdown
