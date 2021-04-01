import React from 'react'
import markdown from 'markdown-it'
import plantPlugin from 'markdown-it-plantuml'
import mermaidPlugin from 'markdown-it-mermaid'

// TODO: Despite what the docs say, the mermaid plugin doesn't render properly
const cfg = 'plantuml'
// const md = cfg === 'mermaid' ? markdown().use(mermaidPlugin) : markdown().use(require('markdown-it-plantuml'))
const md = require('markdown-it')().use(require('markdown-it-plantuml'))

import stripIndent from 'strip-indent'

export default class extends React.Component {
  static defaultProps = {
    container: 'div',
    options: {}
  }

  render() {
    var Container = this.props.container
    return <Container>{this.content()}</Container>
  }

  componentWillUpdate(nextProps, nextState) {}

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />
    } else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />
        } else {
          return child
        }
      })
    }
  }

  renderMarkdown(source) {
    return md.render(stripIndent(source))
  }
}
