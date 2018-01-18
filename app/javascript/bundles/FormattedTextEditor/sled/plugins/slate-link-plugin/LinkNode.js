import React, { Component } from 'react'
import { hasLinks, getLink, unlink } from './LinkUtils'
import Tooltip from '../../components/tooltip'
import LinkDataModal from './LinkDataModal'

// FIXME: Needs to handle assets files to work with SSR
if (require('exenv').canUseDOM) require('./LinkNode.css')

class LinkNode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isModalActive: false,
      mounted: false,
      presetData: { text: '' }
    }
  }

  modal(isModalActive) {
    this.setState({ isModalActive })
  }

  componentDidMount() {
    const { node } = this.props

    if (node.data.get('openModal')) this.modal(true)

    this.setState({
      presetData: { text: this.text.innerText },
      mounted: true,
    })
  }

  componentWillUpdate(props, state) {
    if (state.mounted && state.presetData.text !== this.text.innerText) {
      this.setState({
        presetData: { text: this.text.innerText }
      })
    }
  }

  render() {
    const { isModalActive, presetData } = this.state
    const {
      children,
      attributes,
      node,
      readOnly,
      editor: {
        onChange,
        props: { value }
      }
    } = this.props

    const focusedOnCurrentNode = getLink(value) && node.key === getLink(value).key
    const showTooltip = !readOnly && value.isCollapsed && focusedOnCurrentNode

    return (
      <span>
        {!isModalActive ? null : (
          <LinkDataModal
            node={node}
            value={value}
            onChange={onChange}
            changeModalState={this.modal.bind(this)}
            presetData={presetData}
          />
        )}

        <span className="link-node-container">
          {showTooltip && (
            <Tooltip style={{ display: hasLinks(value) ? 'block' : 'none' }}>
              <Tooltip.Item>
                <a href={node.data.get('href')} target="_blank">
                  {node.data.get('href')}
                </a>
              </Tooltip.Item>
              <Tooltip.Item onClick={() => this.modal(true)}>
                Edit
              </Tooltip.Item>
              <Tooltip.Item onClick={() => onChange(unlink(value.change()))}>
                Remove
              </Tooltip.Item>
            </Tooltip>
          )}
          <a
            {...attributes}
            className="link-node"
            href={node.data.get('href')}
            ref={text => {this.text = text}}
          >
            {children}
          </a>
        </span>
      </span>
    )
  }
}

export default LinkNode
