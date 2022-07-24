import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import tw from "tailwind-react-native-classnames";
import NavOptions from "../components/NavOptions";
import NavFavorites from "../components/NavFavorites";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import {
  selectDestination,
  selectOrigin,
  setDestination,
  setOrigin,
} from "../slices/navSlice";
import { useRef } from "react";
import { useIsFocused } from "@react-navigation/native";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);

  const autoCompleteRef = useRef(null);

  const autoFillLocation = (location) => {
    autoCompleteRef.current.focus();
    autoCompleteRef.current.setAddressText(location);
  };

  useEffect(() => {
    if (isFocused) {
      dispatch(setOrigin(null));
      dispatch(setDestination(null));
    }
  }, [isFocused]);

  return (
    <SafeAreaView style={tw`bg-white h-full`}>
      <View style={tw`p-5`}>
        <Image
          style={{
            width: 100,
            height: 100,
            resizeMode: "contain",
          }}
          source={require("../assets/images/UberLogo.png")}
        />

        <GooglePlacesAutocomplete
          ref={autoCompleteRef}
          placeholder="Where from?"
          listViewDisplayed={false}
          keepResultsAfterBlur={true}
          styles={{
            container: {
              flex: 0,
            },
            textInput: {
              fontSize: 18,
            },
          }}
          query={{
            key: `${GOOGLE_MAPS_APIKEY}`,
            language: "en",
          }}
          nearbyPlacesAPI="GooglePlacesSearch"
          fetchDetails={true}
          returnKeyType="search"
          debounce={400}
          minLength={2}
          enablePoweredByContainer={false}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );

            dispatch(setDestination(null));
          }}
        />

        <NavOptions />

        <NavFavorites autoFillLocation={autoFillLocation} />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
