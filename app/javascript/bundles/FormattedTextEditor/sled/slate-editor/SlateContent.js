import React from 'react'
import classnames from 'classnames'
import { Editor } from 'slate-react'

//
// Nodes
//
import { AlignmentNode } from '../plugins/slate-alignment-plugin'
import { EmbedNode } from '../plugins/slate-embed-plugin'
import { GridNode, GridRowNode, GridCellNode } from '../plugins/slate-grid-plugin'
import { ImageNode, ImageLinkNode } from '../plugins/slate-image-plugin'
import { LinkNode } from '../plugins/slate-link-plugin'
import { ListItemNode, OrderedListNode, UnorderedListNode } from '../plugins/slate-list-plugin'
import { H1Node, H2Node, H3Node, H4Node, H5Node, H6Node, H7Node } from '../plugins/headings-plugin'

//
// Marks
//
import { BoldMark } from '../plugins/slate-bold-plugin'
import { ColorMark } from '../plugins/slate-color-plugin'
import { FontFamilyMark } from '../plugins/slate-font-family-plugin'
import { FontSizeMark } from '../plugins/slate-font-size-plugin'
import { ItalicMark } from '../plugins/slate-italic-plugin'
import { StrikethroughMark } from '../plugins/slate-strikethrough-plugin'
import { UnderlineMark } from '../plugins/slate-underline-plugin'
import { FootnoteMark } from '../plugins/footnote-plugin'
import { EndnoteMark } from '../plugins/endnote-plugin'

/* eslint-disable default-case */
export const renderNode = props => {
  switch (props.node.type) {
    case 'alignment': return <AlignmentNode {...props} />
    case 'embed': return <EmbedNode {...props} />
    case 'grid': return <GridNode {...props} />
    case 'grid-row': return <GridRowNode {...props} />
    case 'grid-cell': return <GridCellNode {...props} />
    case 'image': return <ImageNode {...props} />
    case 'imageLink': return <ImageLinkNode {...props} />
    case 'link': return <LinkNode {...props} />
    case 'list-item': return <ListItemNode {...props} />
    case 'ordered-list': return <OrderedListNode {...props} />
    case 'unordered-list': return <UnorderedListNode {...props} />
    case 'h1': return <H1Node {...props} />
    case 'h2': return <H2Node {...props} />
    case 'h3': return <H3Node {...props} />
    case 'h4': return <H4Node {...props} />
    case 'h5': return <H5Node {...props} />
    case 'h6': return <H6Node {...props} />
    case 'h7': return <H7Node {...props} />
  }
}

export const renderMark = props => {
  switch (props.mark.type) {
    case 'bold': return <BoldMark {...props} />
    // case 'color': return <ColorMark {...props} />
    // case 'font-family': return <FontFamilyMark {...props} />
    // case 'font-size': return <FontSizeMark {...props} />
    case 'italic': return <ItalicMark {...props} />
    case 'strikethrough': return <StrikethroughMark {...props} />
    case 'underline': return <UnderlineMark {...props} />
    case 'footnote': return <FootnoteMark {...props} />
    case 'endnote': return <EndnoteMark {...props} />
  }
}
/* eslint-disable default-case */

export default ({
  className,
  wrapperStyle,
  style,
  value,
  outerState,
  plugins,
  onChange,
  children,
  ...rest
}) => {
  const { readOnly } = outerState

  return (
    <div className={classnames('editor--content', className)} style={wrapperStyle}>
      <Editor
        plugins={plugins}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        outerState={outerState}
        style={style}
        renderNode={renderNode}
        renderMark={renderMark}
        {...rest}
      />
      {children}
    </div>
  )
}
