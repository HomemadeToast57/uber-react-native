import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as Localization from "expo-localization";
import { Icon } from "react-native-elements";
import tw from "tailwind-react-native-classnames";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { selectTravelTimeInformation } from "../slices/navSlice";
import currency from "currency.js";

const data = [
  {
    id: "Uber-X-123",
    title: "UberX",
    multiplier: 1,
    image: require("../assets/images/UberX.png"),
  },
  {
    id: "Uber-XL-456",
    title: "UberXL",
    multiplier: 1.2,
    image: require("../assets/images/UberXL.png"),
  },
  {
    id: "Uber-LUX-789",
    title: "UberLUX",
    multiplier: 1.75,
    image: require("../assets/images/UberLUX.png"),
  },
];

const SURGE_CHARGE_RATE = 1.5;

const RideOptionsCard = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(null);
  const travelTimeInformation = useSelector(selectTravelTimeInformation);
  const [currencyRates, setCurrencyRates] = useState(null);
  const [cost, setCost] = useState(null);

  useEffect(() => {
    if (!travelTimeInformation) return;

    if (Localization.currency == "USD") {
      return setCurrencyRates(1);
    }

    const getCurrencyRates = async () => {
      if (!travelTimeInformation) return;

      try {
        await fetch(`https://api.frankfurter.app/latest?base=USD`)
          .then((res) => res.json())
          .then((data) => {
            setCurrencyRates(data.rates[Localization.currency]);
          });
      } catch (error) {
        const data = {
          amount: 1,
          base: "USD",
          rates: {
            AUD: 1.4403,
            BGN: 1.9193,
            BRL: 5.478,
            CAD: 1.2861,
            CHF: 0.96487,
            CNY: 6.7568,
            CZK: 24.057,
            DKK: 7.3055,
            EUR: 0.98135,
            GBP: 0.83553,
            HKD: 7.8494,
            HRK: 7.3831,
            HUF: 390.87,
            IDR: 14991,
            ILS: 3.4429,
            INR: 79.863,
            ISK: 136.9,
            JPY: 136.91,
            KRW: 1310.76,
            MXN: 20.569,
            MYR: 4.452,
            NOK: 9.9605,
            NZD: 1.5962,
            PHP: 56.173,
            PLN: 4.6622,
            RON: 4.8401,
            SEK: 10.2383,
            SGD: 1.3887,
            THB: 36.695,
            TRY: 17.7566,
            ZAR: 16.8802,
          },
        };

        setCurrencyRates(data.rates[Localization.currency]);
      }
    };

    getCurrencyRates();
  }, [travelTimeInformation?.duration, travelTimeInformation?.distance]);

  useEffect(() => {
    if (!travelTimeInformation) return;

    const getRideCost = async () => {
      if (!travelTimeInformation) return;
      if (!currencyRates) return;

      return setCost(
        currency(
          travelTimeInformation?.duration.value *
            SURGE_CHARGE_RATE *
            currencyRates,
          { fromCents: true, symbol: Localization.currency }
        ).value
      );
    };

    getRideCost();
  }, [travelTimeInformation?.duration, currencyRates]);

  return (
    <SafeAreaView style={tw`bg-white flex-grow`}>
      <View style={tw`border-b border-gray-200`}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("NavigateCard");
          }}
          style={tw`absolute top-3 left-5 z-50 p-3 rounded-full`}
        >
          <Icon name="chevron-left" type="fontawesome" />
        </TouchableOpacity>

        <Text style={tw`text-center py-5 text-xl`}>
          {travelTimeInformation?.distance
            ? `Select a Ride - ${travelTimeInformation?.distance.text}`
            : "No rides found..."}
        </Text>
      </View>

      {travelTimeInformation?.duration && (
        <FlatList
          style={tw`-mt-3 mb-0`}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item: { id, title, multiplier, image }, item }) => (
            <TouchableOpacity
              style={tw`flex-row justify-between items-center px-8 ${
                id === selected?.id && "bg-gray-200"
              }`}
              onPress={() => setSelected(item)}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: "contain",
                }}
                source={image}
              />
              <View style={tw`-ml-6`}>
                <Text style={tw`text-xl font-semibold`}>{title}</Text>
                <Text style={tw`text-xs`}>
                  {travelTimeInformation?.duration.text} Travel Time
                </Text>
              </View>
              <Text style={tw`text-xl`}>
                {cost ? currency(cost * multiplier).format() : "No rides found"}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={tw`flex-row bg-white justify-evenly py-2 mt-auto`}>
        <TouchableOpacity
          style={tw`flex flex-row justify-evenly bg-black px-4 py-3 rounded-full w-1/2 mt-auto ${
            !selected && "opacity-50"
          }`}
          disabled={!selected || !travelTimeInformation}
        >
          <Icon name="car" type="font-awesome" color="white" size={16} />
          <Text style={tw`text-white text-center`}>
            {travelTimeInformation?.duration
              ? `Choose ${selected?.title || "a ride"}`
              : "No Rides Available"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RideOptionsCard;

const styles = StyleSheet.create({});
