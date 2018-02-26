import React, { Component } from 'react';
import {
  ScrollView, StyleSheet, Image, View, TouchableOpacity, Text, Button, AppRegistry,
  FlatList,
  AsyncStorage,
  TextInput,
  Keyboard,
  Platform, Header
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StackNavigator,
} from 'react-navigation';
import { SuitcaseButton } from './components/SuitcaseButton';
import ActionButton from 'react-native-action-button';
import { List, ListItem } from "react-native-elements"

const isAndroid = Platform.OS == "android";

const viewPadding = 10;

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
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
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
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
      otherParam: navDetails.itemId,
    });
  };
  render() {
    var trips = ["Texas", "HongKong", "India"];
    {/*var textInputComponents = trips.map((type) => <SuitcaseButton onPress={() => this.onLearnMore({
      itemId: { type },
      otherParam: 'anything you want here',
    })}><Text style={styles.TextStyle}>{type} </Text></SuitcaseButton>)*/}

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
          <View style={styles.row}>
            <SuitcaseButton onPress={() => this.onLearnMore(
              86,
              'anything you want here',
            )}>
              <Text style={styles.TextStyle}> HongKong to Texas </Text>

            </SuitcaseButton>
            <TouchableOpacity style={styles.Suitcase} onPress={() => this.onLearnMore(
              86,
              'anything you want here',
            )} activeOpacity={0.5}>
              <View style={styles.SeparatorLine} />
              <Text style={styles.TextStyle}> HongKong to Texas </Text>

            </TouchableOpacity>
          </View>

        </ScrollView>
        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => { console.log("hi") }}
        />
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
      title: params ? ("Checklist for " +params.itemId) : 'A Nested Details Screen',
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

    Tasks.all(tasks => this.setState({ tasks: tasks || [] }));
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

  render() {
      return (
        <View style={styles.container}>
        <SectionList
          sections={[
            {title: 'D', data: ['Devin']},
            {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
          ]}
          renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
      </View>
      )
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
    flex: 1,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'center'
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

});
