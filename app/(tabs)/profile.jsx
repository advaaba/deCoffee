import React, { Component } from "react";
import { Text, View } from "react-native";
import ColorList from '@/components/ColorList'

export default class Profile extends Component {
  render() {
    return (
      <View>
        <ColorList color="#e9c46a"></ColorList>
      </View>
    );
  }
}
