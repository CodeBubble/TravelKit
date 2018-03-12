import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  Suitcase: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#55ffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    height: 150,
    width: 300,
    borderRadius: 20,
    flex: 1,
    margin: 10,
    justifyContent: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 2,
    shadowOffset: { height: 0, width: 0 },

  },

  ImageIconStyle: {
    padding: 10,
    margin: 5,
    height: 25,
    width: 25,
    resizeMode: 'stretch',

  },

  TextStyle: {

    color: "#fff",
    marginBottom: 4,
    marginRight: 20,

  },

  SeparatorLine: {

    backgroundColor: '#fff',
    width: 1,
    height: 40

  },
});
