import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';

import { bindActionCreators } from 'redux';
import * as pageActions from './actions/place';
const API_KEY = 'AIzaSyA1MgLuZuyqR_OGY3ob3M52N46TDBRI_9k';
import ListItem from './components/ListItems';
import { connect } from 'react-redux';
import { addPlace } from './actions/place';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeName: '',
      places: [],
      searchKeyword: '',
      searchResults: [],
      isShowingResults: false,
    };
  }

  searchLocation = async (text) => {
    if(text==""){
      this.setState({
        searchKeyword:'',
        isShowingResults:false
      })
    }else{
      this.setState({searchKeyword: text});
      console.log(API_KEY);
      axios
        .request({
          method: 'post',
          url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}&input=${this.state.searchKeyword}`,
        })
        .then((response) => {
        
        
          this.setState({
            searchResults: response.data.predictions,
            isShowingResults: true,
          });
        })
        .catch((e) => {
          console.log(e.response);
        });
    }
    
  };
  
placesOutput = () => {
  return (
   <FlatList style = { styles.listContainer }
     data = { this.props.places }
     keyExtractor={(item, index) => index.toString()}
     renderItem = { info => (
       <ListItem 
         placeName={ info.item.value }
       />
     )}
   />
 )
}
  onpressdata = (item)=>{
    this.props.add(item.description);
    this.setState({
      isShowingResults: false,
    })
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.autocompleteContainer}>
          <TextInput
            placeholder="Search for an address"
            returnKeyType="search"
            style={styles.searchBox}
            placeholderTextColor="#000"
            onChangeText={(text) => this.searchLocation(text)}
            value={this.state.searchKeyword}
          />
          {this.state.isShowingResults && (
            <FlatList
            
              data={this.state.searchResults}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={styles.resultItem}
                    onPress={()=>this.onpressdata(item)
                    }>
                    <Text>{item.description}</Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => index.toString()}
              style={styles.searchResultsContainer}
            />
          )}
        </View>
        <View style = { styles.listContainer }>
        <Text style={{alignSelf:'center',fontWeight:'bold',fontSize:25}}>List Data</Text>
          { this.placesOutput() }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    zIndex: 1,
  },
  searchResultsContainer: {
    marginTop:20,
    width: 340,
    height: 200,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 50,
  },
  dummmy: {
    width: 600,
    height: 200,
    backgroundColor: 'hotpink',
    marginTop: 20,
  },
  resultItem: {
    width: '100%',
    justifyContent: 'center',
    height: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingLeft: 15,
  },
  searchBox: {
    marginTop:20,
    width: 340,
    height: 50,
    fontSize: 18,
    borderRadius: 8,
    borderColor: '#aaa',
    color: '#000',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    paddingLeft: 15,
  },
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%'
  },
  placeInput: {
    width: '70%'
  },
  placeButton: {
    width: '30%'
  },
  listContainer: {
    marginTop:20,
    width: '100%'
  }
});
const mapStateToProps = state => {
  return {
    places: state.places.places
  }
}

const mapDispatchToProps = dispatch => {
  return {
    add: (name) => {
      dispatch(addPlace(name))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)