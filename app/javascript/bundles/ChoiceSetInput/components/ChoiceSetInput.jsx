import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Nestable from 'react-nestable';
import striptags from 'striptags';

class ChoiceSetInput extends Component {
  constructor(props){
    super(props);

    this.state = {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
      componentsList: []
    };

    this.nextUniqueId = 0;
    this.renderItem = this.renderItem.bind(this);
    this.addComponent = this._addComponent.bind(this);
    this.updateComponentTree = this._updateComponentTree.bind(this);
    this.updateShortNameTranslations = this._updateShortNameTranslations.bind(this);
    this.updateLongNameTranslations = this._updateLongNameTranslations.bind(this);
    this.updateSelectedCategory = this._updateSelectedCategory.bind(this);
=======
      componentsList: [],
      nextUniqueId: 0
    };

    this.renderItem = this.renderItem.bind(this);
    this.addComponent = this._addComponent.bind(this);
    this.updateComponentTree = this._updateComponentTree.bind(this);
>>>>>>> Add choice set for choice set creation
  }

  componentDidMount(){
      this._initComponentList();
<<<<<<< HEAD
  }

  _initComponentList() {
      var componentsList = [];

      if(this.props.data.choices.length === 0) {
          //We are creating a new choice set
          this.nextUniqueId = 0;

          var component = {
              id: this.nextUniqueId,
              uuid: '',
              hidden_input_name: this._buildHiddenInputName({}, this.state.componentsList.length, false),
              long_input_name: this._buildLongInputName({}, this.state.componentsList.length, false),
              long_input_id: this._buildLongSrcId({}, this.state.componentsList.length, false),
              long_name_translations: {},
              short_input_name: this._buildShortInputName({}, this.state.componentsList.length, false),
              short_input_id: this._buildShortSrcId({}, this.state.componentsList.length, false),
              short_name_translations: {},
              category_input_name: this._buildCategoryInputName({}, this.state.componentsList.length, false),
              category_input_id: this._buildCategorySrcId({}, this.state.componentsList.length, false),
              category_id: '',
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
          //We are editing an existing choice set
          var counter = 0;
          for(var i=0; i<this.props.data.choices.length; i++) {
              var currentData = this.props.data.choices[i];

              var newComponent = currentData;

              newComponent.id = counter;
              newComponent.hidden_input_name = this._buildHiddenInputName({}, counter, false);
              newComponent.long_input_name = this._buildLongInputName({}, counter, false);
              newComponent.long_input_id = this._buildLongSrcId({}, counter, false);
              newComponent.short_input_name = this._buildShortInputName({}, counter, false);
              newComponent.short_input_id = this._buildShortSrcId({}, counter, false);
              newComponent.category_input_name = this._buildCategoryInputName({}, counter, false);
              newComponent.category_input_id = this._buildCategorySrcId({}, counter, false);
              newComponent.category_options = this.props.category_options;

              if(newComponent.category_id === null || typeof newComponent.category_id === 'undefined') {
                  newComponent.category_id = '';
              }

              counter++;

              if(typeof currentData.children !== 'undefined' && currentData.children.length > 0) {
                  var returnEl = this._initChildren(newComponent, newComponent.children, counter);
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
          newComponent.hidden_input_name = this._buildHiddenInputName(parentComponent, counter, true);
          newComponent.long_input_name = this._buildLongInputName(parentComponent, counter, true);
          newComponent.long_input_id = this._buildLongSrcId(parentComponent, counter, true);
          newComponent.short_input_name = this._buildShortInputName(parentComponent, counter, true);
          newComponent.short_input_id = this._buildShortSrcId(parentComponent, counter, true);
          newComponent.category_input_name = this._buildCategoryInputName(parentComponent, counter, true);
          newComponent.category_input_id = this._buildCategorySrcId(parentComponent, counter, true);
          newComponent.category_options = this.props.category_options;

          if(newComponent.category_id === null || typeof newComponent.category_id === 'undefined') {
              newComponent.category_id = '';
          }

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

  _updateLongNameTranslations({ target }) {
      var searchName = target.name.split('[long_name');
      var locale = searchName[1].split(']')[0];
      var result = this._findByName(this.state.componentsList, searchName[0], 'long_input_name');
      if(result !== null) {
          var replaceList = this._replaceTranslationValueInTree(this.state.componentsList, result, 'long_name_translations', 'long_name' + locale, target.value);
          this.setState({componentsList: replaceList});
      }
  }

  _updateShortNameTranslations({ target }) {
      var searchName = target.name.split('[short_name');
      var locale = searchName[1].split(']')[0];
      var result = this._findByName(this.state.componentsList, searchName[0], 'short_input_name');
      if(result !== null) {
          var replaceList = this._replaceTranslationValueInTree(this.state.componentsList, result, 'short_name_translations', 'short_name' + locale, target.value);
          this.setState({componentsList: replaceList});
      }
  }

  _updateSelectedCategory({ target }) {
      var searchName = target.name.split('[category_id]');
      var result = this._findByName(this.state.componentsList, target.name, 'category_input_name');
      if(result !== null) {
          var replaceList = this._replaceCategoryValueInTree(this.state.componentsList, result, 'category_id', target.value);
          this.setState({componentsList: replaceList});
      }
  }

  _addComponent() {
      var component = {
          id: this.nextUniqueId,
          uuid: '',
          hidden_input_name: this._buildHiddenInputName({}, this.state.componentsList.length, false),
          long_input_name: this._buildLongInputName({}, this.state.componentsList.length, false),
          long_input_id: this._buildLongSrcId({}, this.state.componentsList.length, false),
          long_name_translations: {},
          short_input_name: this._buildShortInputName({}, this.state.componentsList.length, false),
          short_input_id: this._buildShortSrcId({}, this.state.componentsList.length, false),
          short_name_translations: {},
          category_input_name: this._buildCategoryInputName({}, this.state.componentsList.length, false),
          category_input_id: this._buildCategorySrcId({}, this.state.componentsList.length, false),
          category_id: '',
          category_options: this.props.category_options,
          children: []
      };

      this.props.available_locales.forEach((lang) => {
         component.long_name_translations['long_name_' + lang] = '';
         component.short_name_translations['short_name_' + lang] = '';
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
          uuid: '',
          hidden_input_name: this._buildHiddenInputName(parentComponent, parentComponent.children.length, true),
          long_input_name: this._buildLongInputName(parentComponent, parentComponent.children.length, true),
          long_input_id: this._buildLongSrcId(parentComponent, parentComponent.children.length, true),
          long_name_translations: {},
          short_input_name: this._buildShortInputName(parentComponent, parentComponent.children.length, true),
          short_input_id: this._buildShortSrcId(parentComponent, parentComponent.children.length, true),
          short_name_translations: {},
          category_input_name: this._buildCategoryInputName(parentComponent, parentComponent.children.length, true),
          category_input_id: this._buildCategorySrcId(parentComponent, parentComponent.children.length, true),
          category_id: '',
          category_options: this.props.category_options,
          children: []
      };

      this.props.available_locales.forEach((lang) => {
         childComponent.long_name_translations['long_name_' + lang] = '';
         childComponent.short_name_translations['short_name_' + lang] = '';
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

=======
  }

  _initComponentList() {
      var componentsList = [];

      if(this.props.data.length === 0) {
          var itemId = 0;

          var component = {
              id: itemId,
              shortInput: {
                  shortInputName: this._buildShortInputName({}, this.state.componentsList.length, false),
                  srcShortId: this._buildShortSrcId({}, this.state.componentsList.length, false),
                  value: ''
              },
              longInput: {
                  longInputName: this._buildLongInputName({}, this.state.componentsList.length, false),
                  srcLongId: this._buildLongSrcId({}, this.state.componentsList.length, false),
                  value: ''
              },
              categoryInput: {
                  categoryInputName: this._buildCategoryInputName({}, this.state.componentsList.length, false),
                  srcCategoryId: this._buildCategorySrcId({}, this.state.componentsList.length, false),
                  value: '',
                  optionsData: []
              },
              children: []
          };


          componentsList.push(component);

          this.setState({nextUniqueId: component.id + 1});

      } else {
          var counter = 0;
          for(var i=0; i<this.props.data.length; i++) {
              var currentData = this.props.data[i];
              var newComponent = {
                  id: counter,
                  shortInput: {
                      shortInputName: this._buildShortInputName({}, i, false),
                      srcShortId: this._buildShortSrcId({}, i, false),
                      value: currentData.shortInput.value
                  },
                  longInput: {
                      longInputName: this._buildLongInputName({}, i, false),
                      srcLongId: this._buildLongSrcId({}, i, false),
                      value: currentData.longInput.value
                  },
                  categoryInput: {
                      categoryInputName: this._buildCategoryInputName({}, i, false),
                      srcCategoryId: this._buildCategorySrcId({}, i, false),
                      value: currentData.categoryInput.value,
                      optionsData: currentData.categoryInput.optionsData
                  },
                  children: []
              };

              counter++;

              if(currentData.children.length > 0) {
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
          var newComponent = {
              id: counter,
              shortInput: {
                  shortInputName: this._buildShortInputName(parentComponent, i, true),
                  srcShortId: this._buildShortSrcId(parentComponent, i, true),
                  value: currentData.shortInput.value
              },
              longInput: {
                  longInputName: this._buildLongInputName(parentComponent, i, true),
                  srcLongId: this._buildLongSrcId(parentComponent, i, true),
                  value: currentData.longInput.value
              },
              categoryInput: {
                  categoryInputName: this._buildCategoryInputName(parentComponent, i, true),
                  srcCategoryId: this._buildCategorySrcId(parentComponent, i, true),
                  value: currentData.categoryInput.value,
                  optionsData: currentData.categoryInput.optionsData
              },
              children: []
          };

          counter++;

          if(currentData.children.length > 0) {
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
          shortInput: {
              shortInputName: this._buildShortInputName({}, this.state.componentsList.length, false),
              srcShortId: this._buildShortSrcId({}, this.state.componentsList.length, false),
              value: ''
          },
          longInput: {
              longInputName: this._buildLongInputName({}, this.state.componentsList.length, false),
              srcLongId: this._buildLongSrcId({}, this.state.componentsList.length, false),
              value: ''
          },
          categoryInput: {
              categoryInputName: this._buildCategoryInputName({}, this.state.componentsList.length, false),
              srcCategoryId: this._buildCategorySrcId({}, this.state.componentsList.length, false),
              value: '',
              optionsData: []
          },
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
          shortInput: {
              shortInputName: this._buildShortInputName(parentComponent, parentComponent.children.length, true),
              srcShortId: this._buildShortSrcId(parentComponent, parentComponent.children.length, true),
              value: ''
          },
          longInput: {
              longInputName: this._buildLongInputName(parentComponent, parentComponent.children.length, true),
              srcLongId: this._buildLongSrcId(parentComponent, parentComponent.children.length, true),
              value: ''
          },
          categoryInput: {
              categoryInputName: this._buildCategoryInputName(parentComponent, parentComponent.children.length, true),
              srcCategoryId: this._buildCategorySrcId(parentComponent, parentComponent.children.length, true),
              value: '',
              optionsData: []
          },
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

<<<<<<< HEAD
  _updateComponentTree(list) {
     this.setState({componentsList: list});
  }

>>>>>>> Add choice set for choice set creation
=======
>>>>>>> Improve complex name building and drag and drop name update
  _findById(o, id) {
        //Early return
        if( o.id === id ){
          return o;
        }
        var result, p;
        for (p in o) {
<<<<<<< HEAD
            if( o.hasOwnProperty(p) && typeof o[p] === 'object' && p !== 'category_options') {
                if(o[p] !== null) {
                    result = this._findById(o[p], id);
                    if(result){
                        //Found !
                        return result;
                    }
                }

=======
            if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
                result = this._findById(o[p], id);
                if(result){
                    //Found !
                    return result;
                }
>>>>>>> Add choice set for choice set creation
            }
        }
        return result;
    }

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    _findByName(o, name, nameString) {
          //Early return
          if( o[nameString] === name){
            return o;
          }
          var result, p;
          for (p in o) {
              if( o.hasOwnProperty(p) && typeof o[p] === 'object' && p !== 'category_options') {
                  if(o[p] !== null) {
                      result = this._findByName(o[p], name, nameString);
                      if(result){
                          //Found !
                          return result;
                      }
                  }

              }
          }
          return result;
      }

    _buildHiddenInputName(parentComponent, position, children) {
        var hiddenInputName = '';

        if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
            //Building a child-level name
            var nameArray = parentComponent.hidden_input_name.split('[uuid]');
            if(nameArray.length === 2) {
              hiddenInputName = nameArray[0] + '[' + position + '][uuid]';
            } else {
              hiddenInputName = parentComponent.hidden_input_name + '['+ position +'][uuid]';
            }
        } else {
            //Building a top-level name
            hiddenInputName = '[' + position + '][uuid]';
        }

        return hiddenInputName;
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

  _buildHiddenInputName(parentComponent, position, children) {
      var hiddenInputName = '';

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.hidden_input_name.split('[uuid]');
          if(nameArray.length === 2) {
            hiddenInputName = nameArray[0] + '[' + position + '][uuid]';
          } else {
            hiddenInputName = parentComponent.short_input_name + '['+ position +'][uuid]';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.shortInputName.split('[0]');
          if(nameArray.length === 2) {
            hiddenInputName = nameArray[0] + '[' + position + '][uuid]';
          } else {
            hiddenInputName = this.props.shortInputName + '[uuid]';
          }
      }

      return hiddenInputName;
  }

  _buildShortSrcId(parentComponent, position, children) {
      var srcShortId = '';

      if(typeof parentComponent !== 'undefined' && children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.short_input_id.split('_short_name');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position;
          } else {
            srcShortId = parentComponent.short_input_id + '_'+ position;
          }
=======
  _buildShortInputName(id) {
      if(this.state.shortInputName.length === 2) {
        return this.state.shortInputName[0] + '[' + id + ']' + this.state.shortInputName[1];
>>>>>>> Add choice set for choice set creation
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
            srcLongId = parentComponent.long_input_id + '_'+ position;
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
          var nameArray = parentComponent.category_input_name.split('[category_id]');
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
          var nameArray = parentComponent.category_input_id.split('_category_id');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_id';
          } else {
            srcCategoryId = parentComponent.category_input_id + '_' + position + '_category_id';
          }
      } else {
          //Building a top-level name
          var nameArray = this.props.srcCategoryId.split('_0_');
          if(nameArray.length === 2) {
            srcCategoryId = nameArray[0] + '_' + position + '_category_id';
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

          if(typeof component.children === "undefined") component.children = [];

          if(parentComponent && Object.keys(parentComponent).length > 0) {
              //This component is a child component
                  var newComponent = {
                      id: component.id,
                      uuid: component.uuid,
                      hidden_input_name: this._buildHiddenInputName(parentComponent, i, true),
                      long_input_name: this._buildLongInputName(parentComponent, i, true),
                      long_input_id: this._buildLongSrcId(parentComponent, i, true),
                      long_name_translations: component.long_name_translations,
                      short_input_name: this._buildShortInputName(parentComponent, i, true),
                      short_input_id: this._buildShortSrcId(parentComponent, i, true),
                      short_name_translations: component.short_name_translations,
                      category_input_name: this._buildCategoryInputName(parentComponent, i, true),
                      category_input_id: this._buildCategorySrcId(parentComponent, i, true),
                      category_id: component.category_id,
                      category_options: component.category_options,
                      children: component.children
                  };
          } else {
              //This component is a root-level component
                  var newComponent = {
                      id: component.id,
                      uuid: component.uuid,
                      hidden_input_name: this._buildHiddenInputName({}, i, false),
                      long_input_name: this._buildLongInputName({}, i, false),
                      long_input_id: this._buildLongSrcId({}, i, false),
                      long_name_translations: component.long_name_translations,
                      short_input_name: this._buildShortInputName({}, i, false),
                      short_input_id: this._buildShortSrcId(parentComponent, i, true),
                      short_name_translations: component.short_name_translations,
                      category_input_name: this._buildCategoryInputName({}, i, false),
                      category_input_id: this._buildCategorySrcId({}, i, false),
                      category_id: component.category_id,
                      category_options: component.category_options,
                      children: component.children
                  };
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
=======
  _buildShortInputName(parentComponent, id, children) {
=======
  _buildShortInputName(parentComponent, position, children) {
>>>>>>> Improve complex name building and drag and drop name update
      var shortInputName = '';

      if(children && (Object.keys(parentComponent).length !== 0)) {
          //Building a child-level name
          var nameArray = parentComponent.shortInput.shortInputName.split('[short_name');
          if(nameArray.length === 2) {
            shortInputName = nameArray[0] + '[' + position + '][short_name' + nameArray[1];
          } else {
            shortInputName = parentComponent.shortInput.shortInputName + '['+ position +']';
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
          var nameArray = parentComponent.shortInput.srcShortId.split('_short_name');
          if(nameArray.length === 2) {
            srcShortId = nameArray[0] + '_' + position + '_short_name' + nameArray[1];
          } else {
            srcShortId = parentComponent.shortInput.srcShortId + '_'+ position +'_';
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
          var nameArray = parentComponent.longInput.longInputName.split('[long_name');
          if(nameArray.length === 2) {
            longInputName = nameArray[0] + '[' + position + '][long_name' + nameArray[1];
          } else {
            longInputName = parentComponent.longInput.longInputName + '['+ position +']';
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
          var nameArray = parentComponent.longInput.srcLongId.split('_long_name');
          if(nameArray.length === 2) {
            srcLongId = nameArray[0] + '_' + position + '_long_name' + nameArray[1];
          } else {
            srcLongId = parentComponent.longInput.srcLongId + '_'+ position +'_';
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
>>>>>>> Build complex input names for nested choice set creation
  }

  _buildCategoryInputName(parentComponent, position, children) {
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

  renderItem({item}) {
    return (
      <div className="row nested-fields">
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="col-md-3">
            { Object.keys(item.short_name_translations).map((key) => {
                return (
                    <div key={item.short_input_id + '_' + key} className="input-group form-group">
                        <span className="input-group-addon">{key.split('short_name_')[1]}</span>
                        <input id={item.short_input_id + '_' + key} name={item.short_input_name + '[' + key + ']'} defaultValue={item.short_name_translations[key]} className="form-control" type="text" required/>
                    </div>)
            })}
        </div>
        <input name={item.hidden_input_name} value={item.uuid} type="hidden"/>
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
            <select id={item.category_input_id} className="form-control" name={item.category_input_name} value={item.category_id} onChange={this.updateSelectedCategory} disabled={item.category_options.length === 0}>
              <option key="" value=""></option>
              { item.category_options.map((item) => {
                return <option key={item.id} value={item.id}>{item.name}</option>
              })}
            </select>
        </div>
        <div className="col-md-2 pull-right">
            <a type="button" title={this.props.addChildrenChoiceLabel} onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i></a>
            <a type="button" title={this.props.removeChoiceLabel} onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i></a>
=======
        <div className="col-md-6"><input id={item.srcShortId} name={item.shortInputName} className="form-control" type="text"/></div>
=======
        <div className="col-md-3"><input id={item.srcShortId} name={item.shortInputName} className="form-control" type="text"/></div>
<<<<<<< HEAD
>>>>>>> Add category input for choice set creation
        <div className="col-md-3"><input id={item.srcLongId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcCategoryId} name={item.categoryInputName} className="form-control" type="text"/></div>
        <div className="col-md-3">
<<<<<<< HEAD
            <a type="button" onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i> Add child</a>
            <a type="button" onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i> Remove</a>
>>>>>>> Add choice set for choice set creation
=======
            <a type="button" onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i> {this.props.addChildrenChoiceLabel}</a>
            <a type="button" onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i> {this.props.removeChoiceLabel}</a>
>>>>>>> Add category input for choice set creation
=======
        <div className="col-md-3"><input id={item.srcLongId} name={item.longInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcCategoryId} name={item.categoryInputName} className="form-control" type="text"/></div>
=======
        <div className="col-md-3"><input id={item.shortInput.srcShortId} name={item.shortInput.shortInputName} defaultValue={item.shortInput.value} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.longInput.srcLongId} name={item.longInput.longInputName} defaultValue={item.longInput.value} className="form-control" type="text"/></div>
        <div className="col-md-3">
            <select id={item.categoryInput.srcCategoryId} className="form-control" name={item.categoryInput.categoryInputName} defaultValue={item.categoryInput.value} disabled={item.categoryInput.optionsData.length === 0}>
            { item.categoryInput.optionsData.map((item) => {
              return <option key={item.key} value={item.key}>{item.value}</option>
            })}
            </select>
        </div>
>>>>>>> Improve choice set input component initialisation with server data
        <div className="col-md-2 pull-right">
            <a type="button" title={this.props.addChildrenChoiceLabel} onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i></a>
            <a type="button" title={this.props.removeChoiceLabel} onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i></a>
>>>>>>> Build complex input names for nested choice set creation
        </div>
=======
      componentsList: this.props.items,
      shortInputName: this.props.items[0].shortInputName.split("[0]"),
      longInputName: this.props.items[0].longInputName.split("[0]"),
      srcShortId: this.props.items[0].srcShortId.split("_0_"),
      srcLongId: this.props.items[0].srcShortId.split("_0_"),
=======
      componentsList: [],
      nextUniqueId: 0,
      shortInputName: this.props.shortInputName.split("[0]"),
      longInputName: this.props.longInputName.split("[0]"),
      srcShortId: this.props.srcShortId.split("_0_"),
      srcLongId: this.props.srcShortId.split("_0_")
>>>>>>> Add choice set for choice set creation
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
<<<<<<< HEAD
        <div className="col-md-5"><input name="test" className="form-control" type="text" value="HELLO"/></div>
        <div className="col-md-5"><input name="test" className="form-control" type="text" value="HELLO"/></div>
        <div className="col-md-2">Remove</div>
>>>>>>> Improving choice set nested creation
=======
        <div className="col-md-6"><input id={item.srcShortId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3"><input id={item.srcLongId} name={item.shortInputName} className="form-control" type="text"/></div>
        <div className="col-md-3">
            <a type="button" onClick={() => this._addChildComponent(item)} className="btn"><i className="fa fa-plus-square"></i> Add child</a>
            <a type="button" onClick={() => this._deleteComponent(item)} className="btn"><i className="fa fa-trash"></i> Remove</a>
        </div>
>>>>>>> Add choice set for choice set creation
      </div>
    );
}

<<<<<<< HEAD
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

  renderCollapseIcon({ isCollapsed }) {
    return true;
  }

  render() {
    return (
      <div className="choiceset-input-container">
        <div className="row"><div className="col-md-12"><label>{ this.props.choiceNameLabel }</label></div></div>
        <div className="row">
<<<<<<< HEAD
          <div className="col-md-3"><label>{ this.props.shortNameLabel }</label></div>
          <div className="col-md-3"><label>{ this.props.longNameLabel }</label></div>
          <div className="col-md-3"><label>{ this.props.categoryNameLabel }</label></div>
          <div className="col-md-3"></div>
        </div>
        <Nestable
          items={[...this.state.componentsList]}
          renderItem={this.renderItem}
<<<<<<< HEAD
<<<<<<< HEAD
          renderCollapseIcon={this.renderCollapseIcon}
          onChange={this.updateComponentTree}
        />
        <div className="row">
          <div className="col-md-12">
            <a id="addRootChoice" type="button" onClick={this.addComponent} className="btn">
              <i className="fa fa-plus-square"></i> {this.props.addChoiceLabel}
            </a>
          </div>
=======
=======
          renderCollapseIcon={this.renderCollapseIcon}
>>>>>>> Build complex input names for nested choice set creation
          onChange={this.updateComponentTree}
        />
        <div className="row">
<<<<<<< HEAD
          <div className="col-md-12"><a type="button" onClick={this.addComponent} className="btn"><i className="fa fa-plus-square"></i> Add choice</a></div>
>>>>>>> Add choice set for choice set creation
=======
          <div className="col-md-12"><a type="button" onClick={this.addComponent} className="btn"><i className="fa fa-plus-square"></i> {this.props.addChoiceLabel}</a></div>
>>>>>>> Add category input for choice set creation
=======
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
<<<<<<< HEAD
          <div className="col-md-12"><a className="btn btn-text add_fields" onClick={this._addComponent(this.state.componentsList.length - 1)}><i className="fa fa-plus-square"></i> Add choice</a></div>
>>>>>>> Improving choice set nested creation
=======
          <div className="col-md-12"><a type="button" onClick={this.addComponent} className="btn"><i className="fa fa-plus-square"></i> Add choice</a></div>
>>>>>>> Add choice set for choice set creation
        </div>
      </div>
    );
  }

}

export default ChoiceSetInput;
