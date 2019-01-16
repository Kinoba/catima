import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nestable from 'react-nestable';
import striptags from 'striptags';

class ChoiceSetInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      componentsList: this.props.items,
      shortInputName: this.props.items[0].shortInputName.split("[0]"),
      longInputName: this.props.items[0].longInputName.split("[0]"),
      srcShortId: this.props.items[0].srcShortId.split("_0_"),
      srcLongId: this.props.items[0].srcShortId.split("_0_"),
    };
    this.getNestableItem = this._getNestableItem.bind(this);
  }

  componentDidMount(){

  }

  _addComponent(itemId) {
    const componentsList = this.state.componentsList;

    var id = itemId + 1;

    var item = {
      itemId: id,
      srcShortId: this._buildShortSrcId(id),
      srcLongId: this._buildLongSrcId(id),
      shortInputName: this._buildShortInputName(id),
      longInputName: this._buildLongInputName(id),
    };

    componentsList.push(item);

    this.setState({componentsList: componentsList});
  }

  _deleteComponent(itemId) {
    var componentsList = this.state.componentsList;

    componentsList.forEach((ref, index) => {
      if(Object.keys(ref).length !== 0 && ref.itemId === itemId) {
        componentsList.splice(index, 1);
      }
    });

    this.setState({componentsList: componentsList});
  }

  _buildShortInputName(id) {
      if(this.state.shortInputName.length === 2) {
        return this.state.shortInputName[0] + '[' + id + ']' + this.state.shortInputName[1];
      } else {
        return this.props.shortInputName;
      }
  }

  _buildShortSrcId(id) {
      if(this.state.srcShortId.length === 2) {
        return this.state.srcShortId[0] + '_' + id + '_' + this.state.srcShortId[1];
      } else {
        return this.props.srcShortId;
      }
  }

  _buildLongInputName(id) {
      if(this.state.longInputName.length === 2) {
        return this.state.longInputName[0] + '[' + id + ']' + this.state.longInputName[1];
      } else {
        return this.props.longInputName;
      }
  }

  _buildLongSrcId(id) {
      if(this.state.srcLongId.length === 2) {
        return this.state.srcLongId[0] + '_' + id + '_' + this.state.srcLongId[1];
      } else {
        return this.props.srcLongId;
      }
  }

  _getNestableItem(item) {
    return (
      <div className="row nested-fields">
        <div className="col-md-5"><input name="test" className="form-control" type="text" value="HELLO"/></div>
        <div className="col-md-5"><input name="test" className="form-control" type="text" value="HELLO"/></div>
        <div className="col-md-2">Remove</div>
      </div>
    );
  }

  render() {
    return (
      <div className="choiceset-input-container">
        <div className="row"><div className="col-md-12"><label>{ this.props.choiceNameLabel }</label></div></div>
        <div className="row">
          <div className="col-md-5"><label>{ this.props.shortNameLabel }</label></div>
          <div className="col-md-5"><label>{ this.props.longNameLabel }</label></div>
          <div className="col-md-2"></div>
        </div>
        <Nestable
          items={this.state.componentsList}
          renderItem={this.getNestableItem}
        />
        <div className="row">
          <div className="col-md-12"><a className="btn btn-text add_fields" onClick={this._addComponent(this.state.componentsList.length - 1)}><i className="fa fa-plus-square"></i> Add choice</a></div>
        </div>
      </div>
    );
  }

}

export default ChoiceSetInput;
