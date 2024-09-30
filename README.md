# example_RNSmb
A sample usage of react-native-smb with React-native version 0.61.2


## running and testing specifications:

React-native: "0.61.2"
- node : v14.21.3
- java: 1.8.0_131

### correct node and java version In MacOS:
set node version to 14 with nvm:
```
nvm use 14
```

set java version to 1.8.0_131:
```
export JAVA_HOME=$(/usr/libexec/java_home -v 1.8.0_131)
```


## Running app on Android:
open Project folder in a terminal and run:
```
yarn install
```
```
yarn start
```

open Project folder in an other terminal:
```
yarn android
```

### important
The fist step in every new terminal is to check node and java version