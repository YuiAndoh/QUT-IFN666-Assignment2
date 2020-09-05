import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Text, TextInput, ScrollView} from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

export default function SearchScreen({ navigation }) {
  const { ServerURL, addToWatchlist } = useStocksContext();
  const [ query, setQuery ] = useState("");
  const [ allData, setAllData ] = useState([]);
  const [ result, setResult ] = useState([]);


  // Get all stock information (nameand symbol) when the program is loaded
  useEffect(() => {
    fetch(ServerURL + '/all')
      .then(res => res.json()).then((data) => {
        let rowdataVal = data;
        setAllData(rowdataVal); 
      })
  }, []);

  // Search stocks by name and symbol. The result shows stocks whose symbol or name has the query string
  useEffect(() => {
    let arr = [];

    if (query !== ""){
      allData.map((item) => {
        if ((item.symbol.toLowerCase()).includes(query.toLowerCase()) || (item.name.toLowerCase()).includes(query.toLowerCase())){ 
          arr.push(item);
        }
      });
    }

    setResult(arr);
  }, [query]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchTextInputOuter}>
          <TextInput
            placeholder="Search"
            style={styles.searchTextInput}
            onChangeText={str => setQuery(str)}
            value={query}
          />
        </View>

        <ScrollView>
        {result.map((item, index) => {
          return (
            <TouchableOpacity key = { "touch" + index } delayPressIn = {100} onPressIn={() => addToWatchlist(item.symbol, navigation)}>
              <View style = {styles.row}>
                <View>
                  <Text style = {styles.symbol} key = {index}>{item.symbol}</Text>
                </View>
                <View>
                  <Text style = {styles.name} key = {index}>{item.name}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )
        })}
        </ScrollView>

      </View>
      
    </TouchableWithoutFeedback>    
  )
}

const styles = StyleSheet.create({
  
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'stretch',
  },
  
  symbol: {
    color: "white",
    fontSize: scaleSize(20),
    margin: scaleSize(1.5),
    paddingTop: scaleSize(2),
    paddingRight: scaleSize(5),
    paddingLeft: scaleSize(5),
    width: "100%",
  },
  
  name: {
    color: "white",
    fontSize: scaleSize(10),
    margin: scaleSize(1.5),
    paddingBottom: scaleSize(2),
    paddingRight: scaleSize(5),
    paddingLeft: scaleSize(5),
    width: "100%",
  },

  row: {
    width: "100%",
    padding: scaleSize(3),
    borderBottomColor: "#777777",
    borderWidth: 0.5,
  },

  searchTextInputOuter: {
    flexDirection: 'row',
    borderColor: '#000',
    paddingBottom: 10,
    color: "white",
    borderWidth: 1
  },

  searchTextInput: {
    width: "100%",
    height: 40,
    borderColor: '#252525',
    borderWidth: 0.6,
    color: '#dddddd',
    borderTopWidth: 1,
    paddingLeft:20,
    backgroundColor :"#252525",
    borderRadius:12
  }
});