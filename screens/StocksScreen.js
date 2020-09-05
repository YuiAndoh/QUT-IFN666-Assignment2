import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Text, ScrollView } from 'react-native';
import { useStocksContext } from '../contexts/StocksContext';
import { scaleSize } from '../constants/Layout';

export default function StocksScreen({route}) {
  const { ServerURL, watchList } = useStocksContext();
  const [ state, setState ] = useState([]);
  const [ selectedStock, setSelectedStock ] = useState([]);

  // Get data of all stocks in Watch List (prices, volumes, name, symbol etc)
  useEffect(() => {
    async function fetchData (watchList) {
      try {
        let arr = [];
        
        await Promise.all(
          watchList.map(async (item) => {
            await fetch(ServerURL + '/history?symbol=' + item)
              .then(response => response.json()).then((data) => {
                arr.push(data[0]);
                console.log(data[0]);
              })
          })
        ).then(async () => { setState(arr.sort()); })    
      }
      catch (error) {
        console.log(error);
      } 
    }

    fetchData(watchList);
  }, [watchList]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ScrollView style = {styles.list}>
          {state.map((item, index) => {
            // Change a display color based on if the closing price is higher than the opening price
            let percentage = ((item.close)/(item.open)*100 - 100).toFixed(2);
            let color = "#fa362d";
            let selectedColor = "transparent";

            if (percentage > 0) {
              color = "#4CD964";
            }

            if (selectedStock.symbol == item.symbol) {
              selectedColor = "#393939";
            }

            const gainOrLoss = StyleSheet.create({
              iconColorVal: {
                backgroundColor: color,
                borderRadius: scaleSize(5),
              },
              selectedColorVal: {
                backgroundColor: selectedColor
              }
            })
            
            return (
              <TouchableOpacity key = {"touch"+index} delayPressIn = {100} onPressIn = {() => {setSelectedStock(item)}}>
                <View style = {[styles.listrow, gainOrLoss.selectedColorVal]}>
                  <View style = {styles.listitem}>
                    <Text style = {styles.symbol} key = {index + "1"}>{item.symbol}</Text>
                  </View>
                  <View style = {styles.listitem}>
                    <Text style = {styles.price} key = {index + "2"}>{item.close}</Text>
                    <Text style = {[styles.gain, gainOrLoss.iconColorVal]} key = {index + "3"}>{(percentage<=0?"":"+") + percentage + "%"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
        <View style = {styles.details}>
          <View style = {styles.row}>
            <Text style = {styles.stockName}>{selectedStock.name}</Text>
          </View>
          <View style = {styles.row}>
            <View style = {styles.itemflex}>
              <Text style = {styles.heading}>OPEN</Text>
              <Text style = {styles.value}>{selectedStock.open}</Text>
            </View>
            <View style = {styles.itemflex}>
              <Text style = {styles.heading}>CLOSE</Text>
              <Text style = {styles.value}>{selectedStock.close}</Text>
            </View>
          </View>
          <View style = {styles.row}>
            <View style = {styles.itemflex}>
              <Text style = {styles.heading}>HIGH</Text>
              <Text style = {styles.value}>{selectedStock.high}</Text>
            </View>
            <View style = {styles.itemflex}>
              <Text style = {styles.heading}>LOW</Text>
              <Text style = {styles.value}>{selectedStock.low}</Text>
            </View>
          </View>
          <View style = {styles.row}>
            <View style = {styles.itemflex}>
              <Text style = {styles.heading}>VOL</Text>
              <Text style = {styles.value}>{selectedStock.volumes}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'column',
  },

  row: {
    width: "100%",
    textAlign: 'center',
    flexDirection: 'row',
    borderBottomColor: "#777777",
    borderWidth: 0.5,
  },

  list: {
    width: "100%",
    height: "75%",
  },

  listitem: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: scaleSize(7),
    paddingTop: scaleSize(2),
    paddingBottom: scaleSize(2),
    paddingRight: scaleSize(3),
    paddingLeft: scaleSize(3),
    
  },

  listrow: {
    width: "100%",
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: "space-between",
    borderBottomColor: "#777777",
    borderWidth: 0.5,
  },

  details: {
    width: "100%",
    height: "25%",
    backgroundColor: "#111111"
  },

  itemflex: {
    width: "50%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  symbol: {
    color: "white",
    fontSize: scaleSize(20),
    alignSelf: "flex-start",
  },

  price: {
    textAlign: 'right',
    color: "white",
    fontSize: scaleSize(20),
    marginRight: scaleSize(10),
  },

  gain: {
    textAlign: 'right',
    color: "white",
    fontSize: scaleSize(20),
    alignSelf: "flex-end",
    padding: scaleSize(5),
    width: scaleSize(80),
  },

  stockName: {
    color: "white",
    fontSize: scaleSize(15),
    margin: scaleSize(3),
    paddingTop: scaleSize(2),
    paddingBottom: scaleSize(2),
    paddingRight: scaleSize(5),
    paddingLeft: scaleSize(5),
    width: "100%",
    textAlign: 'center',
  },

  heading: {
    color: "white",
    fontSize: scaleSize(12),
    margin: scaleSize(3),
    paddingTop: scaleSize(2),
    paddingBottom: scaleSize(2),
    paddingRight: scaleSize(10),
    paddingLeft: scaleSize(10),
    alignSelf: "flex-start",
  },

  value: {
    color: "white",
    fontSize: scaleSize(15),
    margin: scaleSize(5),
    paddingTop: scaleSize(2),
    paddingBottom: scaleSize(2),
    paddingRight: scaleSize(10),
    paddingLeft: scaleSize(10),
    alignSelf: "flex-end",
  },
  
  searchTextInputOuter: {
    flexDirection: 'row',
    borderColor: '#000',
    paddingBottom: 10,
    color: "white",
    borderWidth: 1
  },

  searchTextInput: {
    width: "94%",
    height: 40,
    borderColor: '#252525',
    borderWidth: 0.6,
    color: 'white',
    borderTopWidth: 1,
    paddingLeft:20,
    backgroundColor :"#252525",
    borderRadius:12
  }
  });