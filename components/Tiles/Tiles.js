import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet, Button, Image } from 'react-native';

import styles from './styles';


export default class Tiles extends Component {
    constructor(props) {
        super(props)
        this.state = {
            toggle: false,
        }

    }
    
 
    render() {
        return (

            <TouchableOpacity style={[styles.Suitcase, this.state.toggle && styles.SuitcaseAlt]}
            onPress={() => {this.setState({ toggle: !this.state.toggle}); console.log(this.props.Text);}}
                activeOpacity={0.5}
            >
                {this.props.children}

            </TouchableOpacity>
        )
    }
}
{/*
                {this.props.children}
<View style={styles.SeparatorLine} />*/}