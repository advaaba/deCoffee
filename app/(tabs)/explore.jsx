import React, { Component } from "react";
import { Text, View } from "react-native";
import ColorList from '@/components/ColorList'

export default class Explore extends Component {
  render() {
    return (
      <View>
        <ColorList color="#ffafcc"></ColorList>
      </View>
    );
  }
}
