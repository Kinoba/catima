import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nestable from 'react-nestable';
import striptags from 'striptags';

class ChoiceSetInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      componentsList: [],
      nextUniqueId: 0
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
          shortInputName: this._buildShortInputName({}, this.state.componentsList.length, false),
          longInputName: this._buildLongInputName({}, this.state.componentsList.length, false),
          categoryInputName: this._buildCategoryInputName({}, this.state.componentsList.length, false),
          srcShortId: this._buildShortSrcId({}, this.state.componentsList.length, false),
          srcLongId: this._buildLongSrcId({}, this.state.componentsList.length, false),
          srcCategoryId: this._buildCategorySrcId({}, this.state.componentsList.length, false),
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
          shortInputName: this._buildShortInputName({}, this.state.componentsList.length, false),
          longInputName: this._buildLongInputName({}, this.state.componentsList.length, false),
          categoryInputName: this._buildCategoryInputName({}, this.state.componentsList.length, false),
          srcShortId: this._buildShortSrcId({}, this.state.componentsList.length, false),
          srcLongId: this._buildLongSrcId({}, this.state.componentsList.length, false),
          srcCategoryId: this._buildCategorySrcId({}, this.state.componentsList.length, false),
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
          shortInputName: this._buildShortInputName(parentComponent, parentComponent.children.length, true),
          longInputName: this._buildLongInputName(parentComponent, parentComponent.children.length, true),
          categoryInputName: this._buildCategoryInputName(parentComponent, parentComponent.children.length, true),
          srcShortId: this._buildShortSrcId(parentComponent, parentComponent.children.length, true),
          srcLongId: this._buildLongSrcId(parentComponent, parentComponent.children.length, true),
          srcCategoryId: this._buildCategorySrcId(parentComponent, parentComponent.children.length, true),
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

    var resultList = this._deleteItemFromTree(componentsList, parentComponent);
    if(resultList !== null) {
        this.setState({componentsList: resultList});
    }

      this.setState({componentsList: componentsList});
  }

  _deleteItemFromTree(list, searchItem) {
      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result) { //The item was found
              var index = list.indexOf(result);
              if(index > -1) {
                  list.splice(index, 1);
                  return list;
              } else {
                  //Search in childrens
                  return this._deleteItemFromTree(list[i].children, searchItem);
              }
          } else {
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

  _buildShortInputName(parentComponent, position, children) {
      var shortInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.shortInputName.split('[short_name');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + '][short_name' + nameArray[1];
          } else {
            shortInputName = parentComponent.shortInputName + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.shortInputName.split('[0]');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + ']' + nameArray[1];
          } else {
            shortInputName = this.props.shortInputName;
          }
      }

      return shortInputName;
  }

  _buildShortSrcId(parentComponent, position, children) {
      var srcShortId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.srcShortId.split('_short_name');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position + '_short_name' + nameArray[1];
          } else {
            srcShortId = parentComponent.srcShortId + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcShortId.split('_0_');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position + '_' + nameArray[1];
          } else {
            srcShortId = this.props.srcShortId;
          }
      }

      return srcShortId;
  }

  _buildLongInputName(parentComponent, position, children) {
      var longInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.longInputName.split('[long_name');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + '][long_name' + nameArray[1];
          } else {
            longInputName = parentComponent.longInputName + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.longInputName.split('[0]');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + ']' + nameArray[1];
          } else {
            longInputName = this.props.longInputName;
          }
      }

      return longInputName;
  }

  _buildLongSrcId(parentComponent, position, children) {
      var srcLongId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.srcLongId.split('_long_name');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position + '_long_name' + nameArray[1];
          } else {
            srcLongId = parentComponent.srcLongId + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcLongId.split('_0_');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position + '_' + nameArray[1];
          } else {
            srcLongId = this.props.srcLongId;
          }
      }

      return srcLongId;
  }

  _buildCategoryInputName(parentComponent, position, children) {
      var categoryInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.categoryInputName.split('[category_name');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + '][category_name' + nameArray[1];
          } else {
            categoryInputName = parentComponent.categoryInputName + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.categoryInputName.split('[0]');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + ']' + nameArray[1];
          } else {
            categoryInputName = this.props.categoryInputName;
          }
      }

      return categoryInputName;
  }

  _buildCategorySrcId(parentComponent, position, children) {
      var srcCategoryId = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.srcCategoryId.split('_category_name');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_name' + nameArray[1];
          } else {
            srcCategoryId = parentComponent.srcCategoryId + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcCategoryId.split('_0_');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_' + nameArray[1];
          } else {
            srcCategoryId = this.props.srcCategoryId;
          }
      }

      return srcCategoryId;
  }

  _getItemPositionInTree(list, searchItem) {
      var position = [];

      for(var i = 0; i < list.length; i++) {
          var result = this._findById(list[i], searchItem.id);
          if(result) { //The item was found
              var index = list.indexOf(result);
              if(index > -1) {
                  position.push(index);
                  return position;
              } else {
                  //Search in childrens
                  return this._deleteItemFromTree(list[i].children, searchItem);
              }
          } else {
              //Search in the childrens
              var childrenResult = this._findById(list[i].children, searchItem.id);
              if(childrenResult) { //The item was found
                  var index = list[i].children.indexOf(childrenResult);
                  if(index > -1) {
                      position.push(index);
                      return position;
                  }
              }
          }
      }

      return null;
  }

  _renameTreeComponents(list, parentComponent) {
      for(var i = 0; i < list.length; i++) {

          var component = list[i];
          if(parentComponent && Object.keys(parentComponent).length > 0) {
              var newComponent = {
                  id: component.id,
                  shortInputName: this._buildShortInputName(parentComponent, i, true),
                  longInputName: this._buildLongInputName(parentComponent, i, true),
                  categoryInputName: this._buildCategoryInputName(parentComponent, i, true),
                  srcShortId: this._buildShortSrcId(parentComponent, i, true),
                  srcLongId: this._buildLongSrcId(parentComponent, i, true),
                  srcCategoryId: this._buildCategorySrcId(parentComponent, i, true),
                  children: component.children
              };
          } else {
              var newComponent = {
                  id: component.id,
                  shortInputName: this._buildShortInputName({}, i, false),
                  longInputName: this._buildLongInputName({}, i, false),
                  categoryInputName: this._buildCategoryInputName({}, i, false),
                  srcShortId: this._buildShortSrcId({}, i, false),
                  srcLongId: this._buildLongSrcId({}, i, false),
                  srcCategoryId: this._buildCategorySrcId({}, i, false),
                  children: component.children
              };
          }

          if(newComponent.children.length > 0) {
            var newChildrenList = this._renameTreeComponents(newComponent.children, component);
            newComponent.children = newChildrenList;
          }

          list[i] = newComponent;
      }

      return list;
  }

  _updateComponentTree(list, component) {
     this.setState({componentsList: this._renameTreeComponents(list)});
  }

  renderItem({item}) {
    return (
      <div className="row nested-fields">
        <div className="col-md-3"><input id={item.srcShortId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcLongId} name={item.longInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcCategoryId} name={item.categoryInputName} className="form-control" type="text"/></div>
        <div className="col-md-2 pull-right">
            <a type="button" title={this.props.addChildrenChoiceLabel} onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i></a>
            <a type="button" title={this.props.removeChoiceLabel} onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i></a>
        </div>
      </div>
    );
  }

  renderCollapseIcon({ isCollapsed }) {
    return true;
  }

  render() {
    return (
      <div className="choiceset-input-container">
        <div className="row"><div className="col-md-12"><label>{ this.props.choiceNameLabel }</label></div></div>
        <div className="row">
          <div className="col-md-3"><label>{ this.props.shortNameLabel }</label></div>
          <div className="col-md-3"><label>{ this.props.longNameLabel }</label></div>
          <div className="col-md-3"><label>{ this.props.categoryNameLabel }</label></div>
          <div className="col-md-3"></div>
        </div>
        <Nestable
          items={[...this.state.componentsList]}
          renderItem={this.renderItem}
          renderCollapseIcon={this.renderCollapseIcon}
          onChange={this.updateComponentTree}
        />
        <div className="row">
          <div className="col-md-12"><a type="button" onClick={this.addComponent} className="btn"><i className="fa fa-plus-square"></i> {this.props.addChoiceLabel}</a></div>
        </div>
      </div>
    );
  }

}

export default ChoiceSetInput;
