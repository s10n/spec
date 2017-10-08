import compact from 'lodash/fp/compact'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as specActions from '../../actions/specActions'
import { colors } from '../../styles'
import { Sub, File, Delete } from '../Icons'
import Checkbox from './Checkbox'
import Name from './Name'
import Meta from './Meta'
import Menu from './Menu'
import Subspecs from './Subspecs'

const propTypes = {
  projectKey: PropTypes.string.isRequired,
  featureKey: PropTypes.string.isRequired,
  specKey: PropTypes.string.isRequired,
  spec: PropTypes.object.isRequired,
  specs: PropTypes.object.isRequired,
  isOwner: PropTypes.bool.isRequired,
  updateSpec: PropTypes.func.isRequired,
  deleteSpec: PropTypes.func.isRequired
}

class Spec extends Component {
  state = { name: this.props.spec.name, hover: false }

  toggleCompleted = () => {
    const { spec: { completed } } = this.props
    this.update({ completed: !completed })
  }

  setName = e => {
    this.setState({ name: e.target.value })
  }

  handleKeyPress = e => {
    e.key === 'Enter' && this.updateName()
  }

  updateName = () => {
    const { name } = this.state
    this.update({ name: name.trim() })
  }

  showMenu = () => {
    this.setState({ hover: true })
  }

  hideMenu = () => {
    this.setState({ hover: false })
  }

  createSubspec = () => {
    const { projectKey, specKey } = this.props
    const { createSubspec } = this.props
    const _name =
      (!this.isSyncing() && window.prompt('Type a name of subspec')) || ''
    const name = _name.trim()
    name && createSubspec(projectKey, specKey, { name })
  }

  updateFilename = () => {
    const _filename =
      (!this.isSyncing() && window.prompt('Type a filename')) || ''
    const filename = _filename.trim()
    filename && this.update({ filename })
  }

  isSyncing = () => {
    return this.props.spec.isSyncing
  }

  update = updates => {
    const { projectKey, featureKey, specKey } = this.props
    const { updateSpec } = this.props
    !this.isSyncing() && updateSpec(projectKey, featureKey, specKey, updates)
  }

  delete = () => {
    const { projectKey, featureKey, specKey } = this.props
    const { spec: { name }, deleteSpec } = this.props
    const { isSubspec, parentKey, deleteSubspec } = this.props
    !this.isSyncing() &&
      window.confirm(`Delete '${name}'?`) &&
      (isSubspec
        ? deleteSubspec(projectKey, parentKey, specKey)
        : deleteSpec(projectKey, featureKey, specKey))
  }

  render() {
    const { spec, variant, isOwner, isSubspec } = this.props
    const { name, hover } = this.state
    const { completed = false, subspecs = [] } = spec
    const hasSubspecs = !!subspecs.length

    const props = {
      Line: {
        style: {
          display: 'flex',
          alignItems: 'center',
          opacity: completed && 0.25
        },
        onMouseEnter: this.showMenu,
        onMouseLeave: this.hideMenu
      },

      Checkbox: {
        checked: completed,
        onClick: isOwner ? this.toggleCompleted : undefined
      },

      Name: {
        name,
        onChange: this.setName,
        onKeyPress: this.handleKeyPress,
        readOnly: !isOwner,
        variant: { flex: 1 }
      },

      Meta: {
        labels: spec.labels,
        filename: spec.filename
      },

      Menu: {
        menu: compact([
          !isSubspec && {
            label: 'subspec',
            icon: <Sub color={colors.gray} />,
            action: this.createSubspec
          },
          {
            label: 'filename',
            icon: <File color={colors.gray} />,
            action: this.updateFilename
          },
          {
            label: 'delete',
            icon: <Delete color={colors.gray} />,
            action: this.delete
          }
        ]),
        variant: { visibility: hover ? 'visible' : 'hidden' }
      }
    }

    return (
      <article style={variant}>
        <section {...props.Line}>
          <Checkbox {...props.Checkbox} />
          <Name {...props.Name} />
          <Meta {...props.Meta} />
          {isOwner && <Menu {...props.Menu} />}
        </section>

        {hasSubspecs && <Subspecs {...this.props} subspecs={subspecs} />}
      </article>
    )
  }
}

Spec.propTypes = propTypes

const mapDispatchToProps = dispatch => bindActionCreators(specActions, dispatch)

export default connect(null, mapDispatchToProps)(Spec)