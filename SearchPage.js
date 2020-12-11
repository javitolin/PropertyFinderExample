"use strict";

import React, { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";

export default function SearchPage({ navigation }) {
  const [searchString, setSearchString] = useState("london");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const onSearchTextChanged = (event) => {
    setSearchString(event.nativeEvent.text);
  };

  var spinner = isLoading ? (
    <ActivityIndicator size="large" color="#0000ff" />
  ) : null;

  const executeQuery = (query) => {
    console.log(query);
    setIsLoading(true);
    // fetch(query)
    //   .then((response) => response.json())
    //   .then((json) => handleResponse(json.response))
    //   .catch((error) => {
    //     setIsLoading(false);
    //     setMessage('Something bad happened ' + error);
    //   });
    handleResponse(
      JSON.parse(
        '{"application_response_code": 1, \
            "listings": [ \
                {"title":"house 1", "price_formatted":"300,000 GBP", "img_url" : "https://picsum.photos/200/300"}, \
                {"title":"house 2", "price_formatted":"450,000 GBP", "img_url" : "https://picsum.photos/200/300"}, \
                {"title":"house 3", "price_formatted":"200,000 GBP", "img_url" : "https://picsum.photos/200/300"} \
            ] }'
      )
    );
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  const handleResponse = (response) => {
    setIsLoading(false);
    if (response.application_response_code === 1) {
      setMessage("Properties found: " + response.listings.length);
      navigation.navigate("Results", response.listings);
    } else {
      setMessage("Location not recognized; please try again.");
    }
  };

  const onSearchPressed = () => {
    const query = urlForQueryAndPage("place_name", searchString, 1);
    executeQuery(query);
  };

  const urlForQueryAndPage = (key, value, pageNumber) => {
    const data = {
      country: "uk",
      pretty: "1",
      encoding: "json",
      listing_type: "buy",
      action: "search_listings",
      page: pageNumber,
    };
    data[key] = value;

    const querystring = Object.keys(data)
      .map((key) => key + "=" + encodeURIComponent(data[key]))
      .join("&");

    return "https://api.nestoria.co.uk/api?" + querystring;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.description}>Search for houses to buy!</Text>
      <Text style={styles.description}>Search by place-name or postcode.</Text>
      <View style={styles.flowRight}>
        <TextInput
          underlineColorAndroid={"transparent"}
          style={styles.searchInput}
          value={searchString}
          onChange={onSearchTextChanged}
          placeholder="Search via name or postcode"
        />
        <Button onPress={() => onSearchPressed()} color="#48BBEC" title="Go" />
      </View>
      <Image source={require("./Resources/house.png")} style={styles.image} />
      {spinner}
      <Text style={styles.description}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    color: "#656565",
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: "center",
  },
  flowRight: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flexGrow: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#48BBEC",
    borderRadius: 8,
    color: "#48BBEC",
  },
  image: {
    width: 217,
    height: 138,
  },
});
