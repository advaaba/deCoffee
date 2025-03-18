import React, { Component } from "react";
import { Text, View } from "react-native";
import ColorList from '@/components/ColorList'

export default class Create extends Component {
  render() {
    return (
      <View>
        <ColorList color="#588157"></ColorList>
      </View>
    );
  }
}
