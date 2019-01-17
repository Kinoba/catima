import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nestable from 'react-nestable';
import striptags from 'striptags';

class ChoiceSetInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      componentsList: [],
      nextUniqueId: 0,
      shortInputName: this.props.shortInputName.split("[0]"),
      longInputName: this.props.longInputName.split("[0]"),
      srcShortId: this.props.srcShortId.split("_0_"),
      srcLongId: this.props.srcShortId.split("_0_")
    };

    this.renderItem = this.renderItem.bind(this);
    this.addComponent = this._addComponent.bind(this);
    this.updateComponentTree = this._updateComponentTree.bind(this);
  }

  componentDidMount(){
      this._initComponentList();
  }

  _initComponentList() {
      var itemId = 0;
      var component = {
          id: itemId,
          shortInputName: this._buildShortInputName(itemId),
          longInputName: this._buildLongInputName(itemId),
          srcShortId: this._buildShortSrcId(itemId),
          srcLongId: this._buildLongSrcId(itemId),
          children: []
      };

      var componentsList = [];
      componentsList.push(component);

      this.setState({nextUniqueId: component.id + 1});
      this.setState({componentsList: componentsList});
  }

  _addComponent() {
      const itemId = this.state.nextUniqueId;
      var component = {
          id: itemId,
          shortInputName: this._buildShortInputName(itemId),
          longInputName: this._buildLongInputName(itemId),
          srcShortId: this._buildShortSrcId(itemId),
          srcLongId: this._buildLongSrcId(itemId),
          children: []
      };

      var componentsList = this.state.componentsList;
      componentsList.push(component);

      this.setState({nextUniqueId: component.id + 1});
      this.setState({componentsList: componentsList});
  }

  _addChildComponent(parentComponent) {
      const itemId = this.state.nextUniqueId;
      var childComponent = {
          id: itemId,
          shortInputName: this._buildShortInputName(itemId),
          longInputName: this._buildLongInputName(itemId),
          srcShortId: this._buildShortSrcId(itemId),
          srcLongId: this._buildLongSrcId(itemId),
          children: []
      };

      var componentsList = this.state.componentsList;

      var resultList = this._insertItemInTree(componentsList, parentComponent, childComponent);
      if(resultList !== null) {
          this.setState({nextUniqueId: childComponent.id + 1});
          this.setState({componentsList: resultList});
      }
  }

  _insertItemInTree(list, searchItem, itemToInsert) {
      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result){
              //Found the parent item
              if(typeof result.children !== 'undefined') {
                  result.children.push(itemToInsert);
              }
              return list;
          } else {
              //Search in the childrens
              var childrenResult = this._findById(list[i].children, searchItem.id);
              if(childrenResult){
                  //Found the parent item
                  if(typeof childrenResult.children !== 'undefined') {
                      childrenResult.children.push(itemToInsert);
                  }
                  return list;
              }
          }
      }

      return null;
  }

  _deleteComponent(parentComponent) {
      var componentsList = this.state.componentsList;

      /*componentsList.forEach((ref, index) => {
        if(Object.keys(ref).length !== 0 && ref.id === id) {
          componentsList.splice(index, 1);
        }
    });*/

    var resultList = this._deleteItemFromTree(componentsList, parentComponent, {});
    if(resultList !== null) {
        //this.setState({nextUniqueId: childComponent.id + 1});
        this.setState({componentsList: resultList});
    }

      this.setState({componentsList: componentsList});
  }

  _deleteItemFromTree(list, searchItem, itemToInsert) {
      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result) { //The item was found
              var index = list.indexOf(result);
              if(index > -1) {
                  list.splice(index, 1);
                  return list;
              } else {
                  console.log("WEIRDO1");
                  //Search in childrens
                  var resultList = this._deleteItemFromTree(list[i].children, searchItem, {});
                  return resultList;
              }
          } else {
              console.log("ELSE");
              //Search in the childrens
              var childrenResult = this._findById(list[i].children, searchItem.id);
              if(childrenResult) { //The item was found
                  var index = list[i].children.indexOf(childrenResult);
                  if(index > -1) {
                      list[i].children.splice(index, 1);
                      return list;
                  }
              }
          }
      }

      return null;
  }

  _updateComponentTree(list) {
     this.setState({componentsList: list});
  }

  _findById(o, id) {
        //Early return
        if( o.id === id ){
          return o;
        }
        var result, p;
        for (p in o) {
            if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
                result = this._findById(o[p], id);
                if(result){
                    //Found !
                    return result;
                }
            }
        }
        return result;
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

  renderItem({item}) {
    return (
      <div className="row nested-fields">
        <div className="col-md-6"><input id={item.srcShortId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcLongId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3">
            <a type="button" onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i> Add child</a>
            <a type="button" onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i> Remove</a>
        </div>
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
          items={[...this.state.componentsList]}
          renderItem={this.renderItem}
          onChange={this.updateComponentTree}
        />
        <div className="row">
          <div className="col-md-12"><a type="button" onClick={this.addComponent} className="btn"><i className="fa fa-plus-square"></i> Add choice</a></div>
        </div>
      </div>
    );
  }

}

export default ChoiceSetInput;
