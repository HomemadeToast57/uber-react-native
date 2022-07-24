import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import tw from "tailwind-react-native-classnames";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { selectDestination, setDestination } from "../slices/navSlice";
import NavFavorites from "./NavFavorites";
import { Icon } from "react-native-elements";

const NavigateCard = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const autoCompleteRef = useRef(null);

  const destination = useSelector(selectDestination);

  const autoFillLocation = (location) => {
    autoCompleteRef.current.focus();
    autoCompleteRef.current.setAddressText(location);
  };
  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("HomeScreen");
        }}
        style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
      >
        <Icon name="chevron-left" type="fontawesome" />
      </TouchableOpacity>
      <Text style={tw`text-center py-5 text-xl`}>Good Morning, Jack</Text>
      <View style={tw`border-t border-gray-200 flex-shrink`}>
        <View>
          <GooglePlacesAutocomplete
            ref={autoCompleteRef}
            styles={toInputBoxStyles}
            placeholder="Where to?"
            fetchDetails={true}
            showBuildings={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            returnKeyType="search"
            query={{
              key: `${GOOGLE_MAPS_APIKEY}`,
              language: "en",
            }}
            debounce={400}
            minLength={2}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => {
              dispatch(
                setDestination({
                  location: details.geometry.location,
                  description: data.description,
                })
              );
            }}
          />
        </View>
        <NavFavorites autoFillLocation={autoFillLocation} />
      </View>

      <View style={tw`flex-row bg-white justify-evenly py-2 mt-auto`}>
        <TouchableOpacity
          style={tw`flex flex-row justify-evenly bg-black w-${!destination ? "1/2" : "44"} px-4 py-3 rounded-full ${
            !destination && "opacity-50"
          }`}
          disabled={!destination}
          onPress={() => {
            navigation.navigate("RideOptionsCard");
          }}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}> {!destination ? "Choose a Destination" : "Look for Rides"}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    fontSize: 18,
    borderRadius: 0,
    backgroundColor: "#DDDDDF",
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});
