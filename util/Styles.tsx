import { StyleSheet } from "react-native";

export const CommonStyle = StyleSheet.create({
  header: {
    color: "#1A1A0F",
    textAlign: "center",
    fontSize: 30,
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 20
  },
  label: {
    color: "#1A1A0F",
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10
  },
  hint: {
    color: "#757575",
    marginBottom: 10,
    padding: 5,
    fontSize: 15
  },
  input: {
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#E2E2E2',
    overflow: 'hidden'
  },
  formView: {
    padding:20,
    flex:1,
    flexDirection:'column',
    justifyContent:'center'
  },
  bigButton: {
    marginTop: 10,
    padding: 15,
    fontSize: 15,
    borderWidth: 1,
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "#8FE388",
    borderRadius: 5
  },
  inputContainer: {
    paddingTop: 10,
    paddingBottom: 10
  },
  view: {
    padding: 10
  },
  greenBorder: { 
    borderWidth: 1, 
    borderRadius: 5,
    borderColor:'#94ffb0'
  },
  greenBackground: {
    backgroundColor:'#94ffb0',
  },
  redBackground: {
    backgroundColor:'#e32749'
  },
  neutralBorder: { 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor:'#E2E2E2'
  },
  redBorder: { 
    borderWidth: 1, 
    borderRadius: 5, 
    borderColor:'red'
  },
});


export const colors = {
  lightgray: "#E2E2E2",
  red: "#f54e42",
  green: "#69FFAA"
}


