import React, { Component } from 'react';
import {
  ScrollView, StyleSheet, Image, View, TouchableOpacity, Text, Button, AppRegistry,
  FlatList,
  AsyncStorage,
  TextInput,
  Keyboard,
  Platform, Header, TouchableHighlight
} from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';
import { SuitcaseButton } from './components/SuitcaseButton';
import { Tiles } from './components/Tiles';
import ActionButton from 'react-native-action-button';
import { List, ListItem } from "react-native-elements"
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const isAndroid = Platform.OS == "android";

const viewPadding = 10;

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Suitcases',
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }
  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://api.myjson.com/bins/12qlul`;
    this.setState({ loading: true });
    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };
  onLearnMore = (navDetails) => {
    this.props.navigation.navigate('Details', {
      itemId: navDetails.itemId,
      otherParam: navDetails.email,
    })};
    setUpNavigation = (navDetails) => {
      this.props.navigation.navigate('SetUpScreen')

    };
  render() {
    var counter = 0;
    return (

      <View style={styles.container}>

        <ScrollView>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View>
                <SuitcaseButton onPress={() => this.props.navigation.navigate('Details', {
                  itemId: `${item.name.first}`,
                  otherParam: { uri: item.picture.thumbnail },
                  email: item.email,
                })}>
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: item.picture.thumbnail }}
                  />

                  <Text style={styles.TextStyle}> {item.name.first} </Text>

                </SuitcaseButton>
                {/*<ListItem
                  roundAvatar
                  title={`${item.name.first} ${item.name.last}`}
                  subtitle={item.email}
                  avatar={{ uri: item.picture.thumbnail }}
                />*/}
              </View>
            )}
          />
          <View style={styles.row}>
            <SuitcaseButton onPress={() => this.props.navigation.navigate('Details', {
              itemId: 86,
              otherParam: "hey",
            })}>
              <Text style={styles.TextStyle}> HongKong to Texas </Text>

            </SuitcaseButton>
            <SuitcaseButton onPress={() => this.onLearnMore({
              itemId: 86,
              otherParam: 'anything you want here',
            })}>
              <Text style={styles.TextStyle}> HongKong to Texas </Text>

            </SuitcaseButton>
          </View>


        </ScrollView>

        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Suitcase" onPress={() => this.setUpNavigation()}>
            <Icon name="plus" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Settings" onPress={() => {}}>
            <Icon name="settings" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => { }}>
            <Icon name="all-inclusive" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

class TodoList extends Component {
  state = {
    tasks: [],
    text: ""
  };

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      title: params ? ("Checklist for " + params.itemId) : 'A Nested Details Screen',
    }

  };

  changeTextHandler = text => {
    this.setState({ text: text });
  };

  addTask = () => {
    let notEmpty = this.state.text.trim().length > 0;

    if (notEmpty) {
      this.setState(
        prevState => {
          let { tasks, text } = prevState;
          return {
            tasks: tasks.concat({ key: tasks.length, text: text }),
            text: ""
          };
        },
        () => Tasks.save(this.state.tasks)
      );
    }
    console.log(this.state.tasks);
  };

  deleteTask = i => {
    this.setState(
      prevState => {
        let tasks = prevState.tasks.slice();

        tasks.splice(i, 1);

        return { tasks: tasks };
      },
      () => Tasks.save(this.state.tasks)
    );
  };

  componentDidMount() {
    Keyboard.addListener(
      isAndroid ? "keyboardDidShow" : "keyboardWillShow",
      e => this.setState({ viewMargin: e.endCoordinates.height + viewPadding })
    );

    Keyboard.addListener(
      isAndroid ? "keyboardDidHide" : "keyboardWillHide",
      () => this.setState({ viewMargin: viewPadding })
    );
    Tasks.all(tasks => this.setState({
      tasks: tasks || [{
        "key": 0,
        "text": "Sup",
      },
      {
        "key": 1,
        "text": "Hi",
      },
      {
        "key": 2,
        "text": "Sup",
      },
      {
        "key": 3,
        "text": "Sss",
      },
      {
        "key": 4,
        "text": "ALOL",
      }]
    }));
    console.log(this.state.tasks)

  }


  render() {
    const { params } = this.props.navigation.state;
    const itemId = params ? params.itemId : null;
    const otherParam = params ? params.otherParam : null;


    return (


      <View
        style={[styles.container2, { paddingBottom: this.state.viewMargin }]}
      >

        <Text>itemId: Checklist for {JSON.stringify(params.itemId)}</Text>
        <FlatList
          style={styles.list}
          data={this.state.tasks}
          renderItem={({ item, index }) =>
            <View>
              <View style={styles.listItemCont}>
                <Text> {JSON.stringify(itemId)} </Text>
                <Button title="X" onPress={() => this.deleteTask(index)} />
                <Text style={styles.listItem}>
                  {item.text}
                </Text>


              </View>
              <View style={styles.hr} />
            </View>}
        />
        <TextInput
          style={styles.textInput}
          onChangeText={this.changeTextHandler}
          onSubmitEditing={this.addTask}
          value={this.state.text}
          placeholder="Add Tasks"
          returnKeyType="done"
          returnKeyLabel="done"
        />
      </View>
    );
  }
}

let Tasks = {
  convertToArrayOfObject(tasks, callback) {
    return callback(
      tasks ? tasks.split("||").map((task, i) => ({ key: i, text: task })) : []
    );
  },
  convertToStringWithSeparators(tasks) {
    return tasks.map(task => task.text).join("||");
  },
  all(callback) {
    return AsyncStorage.getItem("TASKS", (err, tasks) =>
      this.convertToArrayOfObject(tasks, callback)
    );
  },
  save(tasks) {
    AsyncStorage.setItem("TASKS", this.convertToStringWithSeparators(tasks));
  }
};














class SetUp extends Component {
  static navigationOptions = {
    title: 'Set up',
  };
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false,

    };
  }

  onLearnMore = (navDetails) => {
    this.props.navigation.navigate('Details', {
      itemId: navDetails.itemId,
      otherParam: navDetails.email,
    });
  };

  render() {
    var counter = [];
    return (
      
      <View style={styles.container}>
        <ScrollView>
        <Text style={styles.BigText}>Tap</Text>
          <View style={styles.row}>
            
            <Tiles>
              <Icon name="beach" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Vacation </Text>

            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
          </View>
          <View style={styles.row}>
            
            <Tiles>
              <Icon name="beach" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Vacation </Text>

            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
          </View>
          <View style={styles.row}>
            
            <Tiles>
              <Icon name="beach" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Vacation </Text>

            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
          </View>
          <View style={styles.row}>
            
            <Tiles>
              <Icon name="beach" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Vacation </Text>

            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
            <Tiles>
              <Icon name="domain" size={30} color="#ffffff" />
              <Text style={styles.TextStyle}> Business Trip </Text>
            </Tiles>
          </View>
          


        </ScrollView>

      </View>
    );
  }
}

const RootStack = StackNavigator(
  {
    Home: {
      screen: HomeScreen,


    },
    Details: {
      screen: TodoList,

    },
    SetUpScreen: {
      screen: SetUp,

    },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center'
    
  },
  SetUpScreenContainer: {
    flex: 1,
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
    
  },
  header: {
    height: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#03A9F4',
    zIndex: 10
  },
  content: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 40
  },
  footer: {
    height: 40,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#8BC34A'
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: '#333',
    marginBottom: 10
  },
  row: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  MainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },

  GooglePlusStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc4e41',
    borderWidth: .5,
    borderColor: '#fff',
    height: 40,
    borderRadius: 5,
    margin: 5,

  },

  Suitcase: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    borderWidth: 5,
    borderColor: '#1E88E5',
    height: 100,
    borderRadius: 15,
    flex: 1,
    margin: 5,

  },
  SuitcaseAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 5,
    borderColor: '#1E88E5',
    height: 100,
    borderRadius: 15,
    width: 10,
    margin: 5,

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


  },

  SeparatorLine: {

    backgroundColor: '#fff',
    width: 1,
    height: 40

  },
  container2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    padding: viewPadding,
    paddingTop: 20
  },
  list: {
    width: "100%"
  },
  listItem: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 5,
    fontSize: 18
  },
  hr: {
    height: 1,
    backgroundColor: "gray"
  },
  listItemCont: {
    flexDirection: "row",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    paddingRight: 10,
    paddingLeft: 10,
    borderColor: "gray",
    borderWidth: isAndroid ? 0 : 1,
    width: "100%"
  },
  textInputAlt: {
    borderColor: '#e71636',
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  BigText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 30,

  },

});
