import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nestable from 'react-nestable';
import striptags from 'striptags';

class ChoiceSetInput extends Component {
  constructor(props){
    super(props);

    this.state = {
      componentsList: []
    };

    this.nextUniqueId = 0;
    this.renderItem = this.renderItem.bind(this);
    this.addComponent = this._addComponent.bind(this);
    this.updateComponentTree = this._updateComponentTree.bind(this);
  }

  componentDidMount(){
      this._initComponentList();
  }

  _initComponentList() {
      var componentsList = [];

      if(this.props.data.choices.length === 0) {
          this.nextUniqueId = 0;

          var component = {
              id: this.nextUniqueId,
              uuid: this.nextUniqueId,
              long_input_name: this._buildLongInputName({}, this.state.componentsList.length, false),
              long_input_id: this._buildLongSrcId({}, this.state.componentsList.length, false),
              long_name_translations: {},
              short_input_name: this._buildShortInputName({}, this.state.componentsList.length, false),
              short_input_id: this._buildShortSrcId({}, this.state.componentsList.length, false),
              short_name_translations: {},
              category_input_name: this._buildCategoryInputName({}, this.state.componentsList.length, false),
              category_input_id: this._buildCategorySrcId({}, this.state.componentsList.length, false),
              category: null,
              category_options: [],
              children: []
          };

          this.props.available_locales.forEach((lang) => {
             component.long_name_translations['long_name_' + lang] = '';
             component.short_name_translations['short_name_' + lang] = '';
          });

          componentsList.push(component);

          this.nextUniqueId = component.id + 1;
      } else {
          var counter = 0;
          for(var i=0; i<this.props.data.choices.length; i++) {
              var currentData = this.props.data.choices[i];

              var newComponent = currentData;

              newComponent.id = counter;
              newComponent.long_input_name = this._buildLongInputName({}, newComponent.uuid, false);
              newComponent.long_input_id = this._buildLongSrcId({}, newComponent.uuid, false);
              newComponent.short_input_name = this._buildShortInputName({}, newComponent.uuid, false);
              newComponent.short_input_id = this._buildShortSrcId({}, newComponent.uuid, false);
              newComponent.category_input_name = this._buildCategoryInputName({}, newComponent.uuid, false);
              newComponent.category_input_id = this._buildCategorySrcId({}, newComponent.uuid, false);
              newComponent.children = [];
              newComponent.category_options = this.props.category_options;

              counter++;

              if(typeof currentData.children !== 'undefined' && currentData.children.length > 0) {
                  var returnEl = this._initChildren(newComponent, currentData.children, counter);
                  newComponent.children = returnEl.list;
                  counter = returnEl.counter;
              }

              componentsList.push(newComponent);
          }

          this.nextUniqueId = counter;
      }

      this.setState({componentsList: componentsList});
  }

  _initChildren(parentComponent, childrenData, counter) {
      var childrenList = [];
      for(var i=0; i<childrenData.length; i++) {

          var currentData = childrenData[i];
          var newComponent = currentData;

          newComponent.id = counter;
          newComponent.long_input_name = this._buildLongInputName(parentComponent, newComponent.uuid, false);
          newComponent.long_input_id = this._buildLongSrcId(parentComponent, newComponent.uuid, false);
          newComponent.short_input_name = this._buildShortInputName(parentComponent, newComponent.uuid, false);
          newComponent.short_input_id = this._buildShortSrcId(parentComponent, newComponent.uuid, false);
          newComponent.category_input_name = this._buildCategoryInputName(parentComponent, newComponent.uuid, false);
          newComponent.category_input_id = this._buildCategorySrcId(parentComponent, newComponent.uuid, false);
          newComponent.children = [];
          newComponent.category_options = this.props.category_options;

          counter++;

          if(typeof currentData.children !== 'undefined' && currentData.children.length > 0) {
              var returnEl = this._initChildren(newComponent, currentData.children, counter);
              newComponent.children = returnEl.list;
              counter = returnEl.counter;
          }

          childrenList.push(newComponent);
      }

      return {list: childrenList, counter: counter};
  }

  _addComponent() {
      var component = {
          id: this.nextUniqueId,
          uuid: this.nextUniqueId,
          long_input_name: this._buildLongInputName({}, this.state.componentsList.length, false),
          long_input_id: this._buildLongSrcId({}, this.state.componentsList.length, false),
          long_name_translations: this.state.componentsList[0].long_name_translations,
          short_input_name: this._buildShortInputName({}, this.state.componentsList.length, false),
          short_input_id: this._buildShortSrcId({}, this.state.componentsList.length, false),
          short_name_translations: this.state.componentsList[0].short_name_translations,
          category_input_name: this._buildCategoryInputName({}, this.state.componentsList.length, false),
          category_input_id: this._buildCategorySrcId({}, this.state.componentsList.length, false),
          category: null,
          category_options: this.props.category_options,
          children: []
      };

      //CLear each translation for the new child component
      Object.keys(component.long_name_translations).forEach((key) => {
         component.long_name_translations[key] = '';
      });

      //CLear each translation for the new child component
      Object.keys(component.short_name_translations).forEach((key) => {
         component.short_name_translations[key] = '';
     });

      var componentsList = this.state.componentsList;
      componentsList.push(component);

      this.nextUniqueId = component.id + 1;
      this.setState({componentsList: componentsList});
  }

  _addChildComponent(parentComponent) {
      const itemId = this.state.nextUniqueId;

      var childComponent = {
          id: this.nextUniqueId,
          uuid: this.nextUniqueId,
          long_input_name: this._buildLongInputName(parentComponent, parentComponent.children.length, true),
          long_input_id: this._buildLongSrcId(parentComponent, parentComponent.children.length, true),
          long_name_translations: parentComponent.long_name_translations,
          short_input_name: this._buildShortInputName(parentComponent, parentComponent.children.length, true),
          short_input_id: this._buildShortSrcId(parentComponent, parentComponent.children.length, true),
          short_name_translations: parentComponent.short_name_translations,
          category_input_name: this._buildCategoryInputName(parentComponent, parentComponent.children.length, true),
          category_input_id: this._buildCategorySrcId(parentComponent, parentComponent.children.length, true),
          category: null,
          category_options: this.props.category_options,
          children: []
      };

      //CLear each translation for the new child component
      Object.keys(childComponent.long_name_translations).forEach((key) => {
         childComponent.long_name_translations[key] = '';
      });

      //CLear each translation for the new child component
      Object.keys(childComponent.short_name_translations).forEach((key) => {
         childComponent.short_name_translations[key] = '';
     });

      var componentsList = this.state.componentsList;
      var resultList = this._insertItemInTree(componentsList, parentComponent, childComponent);

      if(resultList !== null) {
          this.nextUniqueId = childComponent.id + 1;
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

  }

  _initComponentList() {
      var itemId = 0;

      if(this.props.data.length === 0) {
          var itemId = 0;

          var component = {
              id: itemId,
              uuid: itemId,
              long_input_name: this._buildLongInputName({}, this.state.componentsList.length, false),
              long_input_id: this._buildLongSrcId({}, this.state.componentsList.length, false),
              long_name_translations: {},
              short_input_name: this._buildShortInputName({}, this.state.componentsList.length, false),
              short_input_id: this._buildShortSrcId({}, this.state.componentsList.length, false),
              short_name_translations: {},
              category_input_name: this._buildCategoryInputName({}, this.state.componentsList.length, false),
              category_input_id: this._buildCategorySrcId({}, this.state.componentsList.length, false),
              category: null,
              category_options: [],
              children: []
          };


          componentsList.push(component);

          this.setState({nextUniqueId: component.id + 1});
      } else {
          var counter = 0;
          for(var i=0; i<this.props.data.choices.length; i++) {
              var currentData = this.props.data.choices[i];

              var newComponent = currentData;

              newComponent.id = counter;
              newComponent.long_input_name = this._buildLongInputName({}, newComponent.uuid, false);
              newComponent.long_input_id = this._buildLongSrcId({}, newComponent.uuid, false);
              newComponent.short_input_name = this._buildShortInputName({}, newComponent.uuid, false);
              newComponent.short_input_id = this._buildShortSrcId({}, newComponent.uuid, false);
              newComponent.category_input_name = this._buildCategoryInputName({}, newComponent.uuid, false);
              newComponent.category_input_id = this._buildCategorySrcId({}, newComponent.uuid, false);
              newComponent.children = [];
              newComponent.category_options = [];


              counter++;

              if(typeof currentData.children !== 'undefined' && currentData.children.length > 0) {
                  var returnEl = this._initChildren(newComponent, currentData.children, counter);
                  newComponent.children = returnEl.list;
                  counter = returnEl.counter;
              }


              componentsList.push(newComponent);
          }
      }


      this.setState({nextUniqueId: counter});
      this.setState({componentsList: componentsList});
  }

  _initChildren(parentComponent, childrenData, counter) {
      var childrenList = [];
      for(var i=0; i<childrenData.length; i++) {

          var currentData = childrenData[i];
          var newComponent = currentData;

          newComponent.id = counter;
          newComponent.long_input_name = this._buildLongInputName(parentComponent, newComponent.uuid, false);
          newComponent.long_input_id = this._buildLongSrcId(parentComponent, newComponent.uuid, false);
          newComponent.short_input_name = this._buildShortInputName(parentComponent, newComponent.uuid, false);
          newComponent.short_input_id = this._buildShortSrcId(parentComponent, newComponent.uuid, false);
          newComponent.category_input_name = this._buildCategoryInputName(parentComponent, newComponent.uuid, false);
          newComponent.category_input_id = this._buildCategorySrcId(parentComponent, newComponent.uuid, false);
          newComponent.children = [];
          newComponent.category_options = [];


          counter++;

          if(typeof currentData.children !== 'undefined' && currentData.children.length > 0) {
              var returnEl = this._initChildren(newComponent, currentData.children, counter);
              newComponent.children = returnEl.list;
              counter = returnEl.counter;
          }


          childrenList.push(newComponent);
      }

      return {list: childrenList, counter: counter};
  }

  _addComponent() {
      const itemId = this.state.nextUniqueId;

      var component = {
          id: itemId,
          uuid: itemId,
          long_input_name: this._buildLongInputName({}, this.state.componentsList.length, false),
          long_input_id: this._buildLongSrcId({}, this.state.componentsList.length, false),
          long_name_translations: {},
          short_input_name: this._buildShortInputName({}, this.state.componentsList.length, false),
          short_input_id: this._buildShortSrcId({}, this.state.componentsList.length, false),
          short_name_translations: {},
          category_input_name: this._buildCategoryInputName({}, this.state.componentsList.length, false),
          category_input_id: this._buildCategorySrcId({}, this.state.componentsList.length, false),
          category: null,
          category_options: [],
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
          uuid: itemId,
          long_input_name: this._buildLongInputName(parentComponent, parentComponent.children.length, true),
          long_input_id: this._buildLongSrcId(parentComponent, parentComponent.children.length, true),
          long_name_translations: {},
          short_input_name: this._buildShortInputName(parentComponent, parentComponent.children.length, true),
          short_input_id: this._buildShortSrcId(parentComponent, parentComponent.children.length, true),
          short_name_translations: {},
          category_input_name: this._buildCategoryInputName(parentComponent, parentComponent.children.length, true),
          category_input_id: this._buildCategorySrcId(parentComponent, parentComponent.children.length, true),
          category: null,
          category_options: [],
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

  _findById(o, id) {
        //Early return
        if( o.id === id ){
          return o;
        }
        var result, p;
        for (p in o) {
            if( o.hasOwnProperty(p) && typeof o[p] === 'object' && p === 'children') {
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

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.short_input_name.split('[short_name');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + ']';
          } else {
            shortInputName = parentComponent.short_input_name + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.shortInputName.split('[0]');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + ']';
          } else {
            shortInputName = this.props.shortInputName;
          }
      }

      return null;
  }

  _updateComponentTree(list) {
     this.setState({componentsList: list});
  }

  _buildShortSrcId(parentComponent, position, children) {
      var srcShortId = '';

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.short_input_id.split('_short_name');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position;
          } else {
            srcShortId = parentComponent.short_input_id + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcShortId.split('_0_');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position;
          } else {
            srcShortId = this.props.srcShortId;
          }
      }
  }

  _buildLongInputName(parentComponent, position, children) {
      var longInputName = '';

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.long_input_name.split('[long_name');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + ']';
          } else {
            longInputName = parentComponent.long_input_name + '['+ position +']';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.longInputName.split('[0]');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + ']';
          } else {
            longInputName = this.props.longInputName;
          }
      }
  }

  _buildLongSrcId(parentComponent, position, children) {
      var srcLongId = '';

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.long_input_id.split('_long_name');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position;
          } else {
            srcLongId = parentComponent.long_input_id + '_'+ position +'_';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcLongId.split('_0_');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position;
          } else {
            srcLongId = this.props.srcLongId;
          }
      }
  }

  _buildCategoryInputName(parentComponent, position, children) {
      var categoryInputName = '';

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.category_input_name.split('[category_');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + '][category_id]';
          } else {
            categoryInputName = parentComponent.category_input_name + '['+ position +']';
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

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.category_input_id.split('_category_');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_id';
          } else {
            srcCategoryId = parentComponent.category_input_id + '_'+ position +'_';
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
                  uuid: component.uuid,
                  long_input_name: this._buildLongInputName(parentComponent, i, true),
                  long_input_id: this._buildLongSrcId(parentComponent, i, true),
                  long_name_translations: component.long_name_translations,
                  short_input_name: this._buildShortInputName(parentComponent, i, true),
                  short_input_id: this._buildShortSrcId(parentComponent, i, true),
                  short_name_translations: component.short_name_translations,
                  category_input_name: this._buildCategoryInputName(parentComponent, i, true),
                  category_input_id: this._buildCategorySrcId(parentComponent, i, true),
                  category: component.category,
                  category_options: component.category_options,
                  children: component.children
              };
          } else {
              var newComponent = {
                  id: component.id,
                  uuid: component.uuid,
                  long_input_name: this._buildLongInputName({}, i, false),
                  long_input_id: this._buildLongSrcId({}, i, false),
                  long_name_translations: component.long_name_translations,
                  short_input_name: this._buildShortInputName({}, i, false),
                  short_input_id: this._buildShortSrcId(parentComponent, i, true),
                  short_name_translations: component.short_name_translations,
                  category_input_name: this._buildCategoryInputName({}, i, false),
                  category_input_id: this._buildCategorySrcId({}, i, false),
                  category: component.category,
                  category_options: component.category_options,
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

  _buildCategoryInputName(parentComponent, id, children) {
      var categoryInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.categoryInputName.split('[category_name');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + '][category_name' + nameArray[1];
          } else {
            categoryInputName = parentComponent.categoryInput.categoryInputName + '['+ position +']';
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
          var nameArray = parentComponent.categoryInput.srcCategoryId.split('_category_name');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_name' + nameArray[1];
          } else {
            srcCategoryId = parentComponent.categoryInput.srcCategoryId + '_'+ position +'_';
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
                  shortInput: {
                      shortInputName: this._buildShortInputName(parentComponent, i, true),
                      srcShortId: this._buildShortSrcId(parentComponent, i, true),
                      value: component.shortInput.value
                  },
                  longInput: {
                      longInputName: this._buildLongInputName(parentComponent, i, true),
                      srcLongId: this._buildLongSrcId(parentComponent, i, true),
                      value: component.longInput.value
                  },
                  categoryInput: {
                      categoryInputName: this._buildCategoryInputName(parentComponent, i, true),
                      srcCategoryId: this._buildCategorySrcId(parentComponent, i, true),
                      value: component.categoryInput.value,
                      optionsData: component.categoryInput.optionsData
                  },
                  children: component.children
              };
          } else {
              var newComponent = {
                  id: component.id,
                  shortInput: {
                      shortInputName: this._buildShortInputName({}, i, false),
                      srcShortId: this._buildShortSrcId({}, i, false),
                      value: component.shortInput.value
                  },
                  longInput: {
                      longInputName: this._buildLongInputName({}, i, false),
                      srcLongId: this._buildLongSrcId({}, i, false),
                      value: component.longInput.value
                  },
                  categoryInput: {
                      categoryInputName: this._buildCategoryInputName({}, i, false),
                      srcCategoryId: this._buildCategorySrcId({}, i, false),
                      value: component.categoryInput.value,
                      optionsData: component.categoryInput.optionsData
                  },
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

  _buildCategoryInputName(parentComponent, id, children) {
      var categoryInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.categoryInput.categoryInputName.split('[category_name');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + '][category_name' + nameArray[1];
          } else {
            categoryInputName = parentComponent.categoryInput.categoryInputName + '['+ position +']';
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

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.category_input_name.split('[category_');
          if(nameArray.length === 2) {
            categoryInputName = nameArray[0] + '[' + position + '][category_id]';
          } else {
            categoryInputName = parentComponent.category_input_name + '['+ position +']';
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

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.category_input_id.split('_category_');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_id';
          } else {
            srcCategoryId = parentComponent.category_input_id + '_'+ position +'_';
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
              //This component is a child component
              if(typeof component.uuid === 'string') {
                  var newComponent = {
                      id: component.id,
                      uuid: component.uuid,
                      long_input_name: this._buildLongInputName(parentComponent, component.uuid, true),
                      long_input_id: this._buildLongSrcId(parentComponent, component.uuid, true),
                      long_name_translations: component.long_name_translations,
                      short_input_name: this._buildShortInputName(parentComponent, component.uuid, true),
                      short_input_id: this._buildShortSrcId(parentComponent, component.uuid, true),
                      short_name_translations: component.short_name_translations,
                      category_input_name: this._buildCategoryInputName(parentComponent, component.uuid, true),
                      category_input_id: this._buildCategorySrcId(parentComponent, component.uuid, true),
                      category: component.category,
                      category_options: component.category_options,
                      children: component.children
                  };
              } else {
                  var newComponent = {
                      id: component.id,
                      uuid: component.uuid,
                      long_input_name: this._buildLongInputName(parentComponent, i, true),
                      long_input_id: this._buildLongSrcId(parentComponent, i, true),
                      long_name_translations: component.long_name_translations,
                      short_input_name: this._buildShortInputName(parentComponent, i, true),
                      short_input_id: this._buildShortSrcId(parentComponent, i, true),
                      short_name_translations: component.short_name_translations,
                      category_input_name: this._buildCategoryInputName(parentComponent, i, true),
                      category_input_id: this._buildCategorySrcId(parentComponent, i, true),
                      category: component.category,
                      category_options: component.category_options,
                      children: component.children
                  };
              }

          } else {
              //This component is a root-level component
              if(typeof component.uuid === 'string') {
                  var newComponent = {
                      id: component.id,
                      uuid: component.uuid,
                      long_input_name: this._buildLongInputName({}, component.uuid, false),
                      long_input_id: this._buildLongSrcId({}, component.uuid, false),
                      long_name_translations: component.long_name_translations,
                      short_input_name: this._buildShortInputName({}, component.uuid, false),
                      short_input_id: this._buildShortSrcId(parentComponent, component.uuid, true),
                      short_name_translations: component.short_name_translations,
                      category_input_name: this._buildCategoryInputName({}, component.uuid, false),
                      category_input_id: this._buildCategorySrcId({}, component.uuid, false),
                      category: component.category,
                      category_options: component.category_options,
                      children: component.children
                  };
              } else {
                  var newComponent = {
                      id: component.id,
                      uuid: component.uuid,
                      long_input_name: this._buildLongInputName({}, i, false),
                      long_input_id: this._buildLongSrcId({}, i, false),
                      long_name_translations: component.long_name_translations,
                      short_input_name: this._buildShortInputName({}, i, false),
                      short_input_id: this._buildShortSrcId(parentComponent, i, true),
                      short_name_translations: component.short_name_translations,
                      category_input_name: this._buildCategoryInputName({}, i, false),
                      category_input_id: this._buildCategorySrcId({}, i, false),
                      category: component.category,
                      category_options: component.category_options,
                      children: component.children
                  };
              }
          }

          if(newComponent.children.length > 0) {
            var newChildrenList = this._renameTreeComponents(newComponent.children, newComponent);
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
        <div className="col-md-3">
            { Object.keys(item.short_name_translations).map((key) => {
                return (
                    <div key={item.short_input_id + '_' + key} className="input-group form-group">
                        <span className="input-group-addon">{key.split('short_name_')[1]}</span>
                        <input id={item.short_input_id + '_' + key} name={item.short_input_name + '[' + key + ']'} defaultValue={item.short_name_translations[key]} className="form-control" type="text"/>
                    </div>)
            })}
        </div>
        <div className="col-md-3">
            { Object.keys(item.long_name_translations).map((key) => {
                return (
                    <div key={item.long_input_id + '_' + key} className="input-group form-group">
                        <span className="input-group-addon">{key.split('long_name_')[1]}</span>
                        <input id={item.long_input_id + '_' + key} name={item.long_input_name + '[' + key + ']'} defaultValue={item.long_name_translations[key]} className="form-control" type="text"/>
                    </div>)
            })}
        </div>
        <div className="col-md-3">
            <select id={item.category_input_id} className="form-control" name={item.category_input_name} defaultValue={item.category} disabled={item.category_options.length === 0}>
              <option key="" value={null}></option>
              { item.category_options.map((item) => {
                return <option key={item.uuid} value={item.uuid}>{item.name_translations['name_' + this.props.locale]}</option>
              })}
            </select>
        </div>
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

  renderCollapseIcon({ isCollapsed }) {
    return true;
  }

  renderCollapseIcon({ isCollapsed }) {
    return true;
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
