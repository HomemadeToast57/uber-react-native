import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import tw from "tailwind-react-native-classnames";
import { Icon } from "react-native-elements";

const data = [
  {
    id: 123,
    icon: "home",
    location: "Home",
    destination: "1 Infinite Loop, Cupertino, CA, USA",
  },
  {
    id: 456,
    icon: "briefcase",
    location: "Work",
    destination: "1 Hacker Way, Menlo Park, CA, USA",
  },
];

const NavFavorites = ({ autoFillLocation }) => {
  return (
    <FlatList
      data={data}
      scrollEnabled={true}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <View style={tw`border-b border-gray-200`} />}
      renderItem={({ item: { location, destination, icon } }) => {
        return (
          <TouchableOpacity
            onPress={() => {
              autoFillLocation(destination);
            }}
            style={tw`flex-row items-center p-5`}
          >
            <Icon
              style={tw`mr-4 rounded-full bg-gray-300 p-3`}
              name={icon}
              type="ionicon"
              color="white"
            />
            <View>
              <Text style={tw`font-semibold text-lg`}>{location}</Text>
              <Text style={tw`text-gray-500`}>{destination}</Text>
            </View>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default NavFavorites;

const styles = StyleSheet.create({});
