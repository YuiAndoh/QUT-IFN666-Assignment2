import React, { useState, useContext, useEffect } from "react";
import { AsyncStorage } from "react-native";

const StocksContext = React.createContext();

export const StocksProvider = ({ children }) => {
  const [state, setState] = useState([]);

  return (
    <StocksContext.Provider value={[state, setState]}>
      {children}
    </StocksContext.Provider>
  );
};

export const useStocksContext = () => {
  const [state, setState] = useContext(StocksContext);

  async function addToWatchlist(newSymbol, navigation) {
    try {
      let symbolList = await AsyncStorage.getItem("allAddedSymbols");
      let arr = [];
      let flag = false;

      if (symbolList !== "" && symbolList !== null) {
        arr = JSON.parse(symbolList);
        
        arr.map((item) => {
          if (item === newSymbol) {
            flag = true;
          }
        });
      }

      if (!flag) {
        arr.push(newSymbol);
      }
      // console.log(arr);
      await AsyncStorage.setItem("allAddedSymbols", JSON.stringify(arr))
      setState(arr);
      navigation.navigate("Stocks");
    }

    catch(error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function retrieveWatchList () {
      try {
        let arr = [];
        let allWatchListItems = await AsyncStorage.getItem("allAddedSymbols");
        if (allWatchListItems !== "" && allWatchListItems !== null) {
          arr = JSON.parse(allWatchListItems);
        }
        setState(arr);
      }
      catch (error) {
        console.log(error);
      }
    }
    retrieveWatchList();
  }, []);

  return { ServerURL: 'http://131.181.190.87:3001', watchList: state,  addToWatchlist };
};
