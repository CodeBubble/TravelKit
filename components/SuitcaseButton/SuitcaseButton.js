import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, Button, Image } from 'react-native';

import styles from './styles';


export default class SuitcaseButton extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (

            <TouchableOpacity style={styles.Suitcase}
                onPress={this.props.onPress}
                activeOpacity={0.5}
                onLongPress={this.props.onLongPress}
            >
                {this.props.children}

            </TouchableOpacity>
        )
    }
}
{/*
                {this.props.children}
<View style={styles.SeparatorLine} />*/}