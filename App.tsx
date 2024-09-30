/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StatusBar,
  ToastAndroid,
  PermissionsAndroid,
  TextInput,
} from 'react-native';

import {Header, Colors} from 'react-native/Libraries/NewAppScreen';

import SMBClient from 'react-native-smb';

type FileItem = {
  name: string;
  isDirectory: boolean;
};

export default function HomeScreen() {
  const [state, setState] = useState({
    workGroup: 'WORKGROUP',
    ip: '192.168.188.29',
    port: '',
    username: 'ali',
    password: '1',
    sharedFolder: 'ali',
    currentPath: '',
    list: [] as FileItem[],
    isConnected: false,
    waitingForConnection: false,
  });

  const [permissions, setPermissions] = useState({
    read: false,
    write: false,
  });

  let smbClient: SMBClient | null = null;

  useEffect(() => {
    console.log('useEffect called.');
    return () => {
      smbDisconnect();
    };
  }, []);

  const requestStoragePermission = async () => {
    console.log('requestStoragePermission called');
    await requestWriteStoragePermission();
    await requestReadStoragePermission();
  };

  const requestReadStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Read Access Permission',
          message:
            'To upload a file, accessing storage read permission required.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can read from the EXTERNAL_STORAGE');
        setPermissions(prev => ({...prev, read: true}));
        showToast('READ_EXTERNAL_STORAGE GRANTED.');
      } else {
        console.log('READ_EXTERNAL_STORAGE permission denied');
        showToast('READ_EXTERNAL_STORAGE not GRANTED.');
        setPermissions(prev => ({...prev, read: false}));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestWriteStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage write Access Permission',
          message:
            'To download a file, accessing storage write permission required.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can write to the EXTERNAL_STORAGE');
        showToast('WRITE_EXTERNAL_STORAGE GRANTED.');
        setPermissions(prev => ({...prev, write: true}));
      } else {
        console.log('WRITE_EXTERNAL_STORAGE permission denied');
        showToast('WRITE_EXTERNAL_STORAGE not GRANTED.');
        setPermissions(prev => ({...prev, write: false}));
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const smbInit = () => {
    //  smbClient = new SMBClient(
    //    "192.168.188.29", //ip
    //    "", //port
    //    "ali", //sharedFolder,
    //    "WORKGROUP", //workGroup,
    //    "ali", //username,
    //    "1", //password,
    //    (data: any) => {
    //      //callback
    //      console.log("new SMBClient data (callback): " + JSON.stringify(data));
    //    }
    //  );

    smbClient = new SMBClient(
      state.ip, // "192.168.188.29", //ip
      state.port, // "", //port
      state.sharedFolder, // "ali", //sharedFolder,
      state.workGroup, // "WORKGROUP", //workGroup,
      state.username, // "ali", //username,
      state.password, // "1", //password,
      (data: any) => {
        //callback
        console.log('new SMBClient data (callback): ' + JSON.stringify(data));
      },
    );

    smbClient.on('error', (data: any) => {
      console.log('error in SMBClient (on error): ' + JSON.stringify(data));
    });

    smbClient.on('init', (data: any) => {
      console.log('new SMBClient data (on init): ' + JSON.stringify(data));
    });
  };

  const smbTestConnection = () => {
    if (!smbClient) return;

    smbClient.on('testConnection', (data: any) => {
      console.log(
        'testConnection data (on testConnection): ' + JSON.stringify(data),
      );
    });

    smbClient.testConnection((data: any) => {
      console.log('testConnection data (callback): ' + JSON.stringify(data));
    });
  };

  const smbList = (path: string) => {
    if (!smbClient) return;

    smbClient.on('list', (data: any) => {
      console.log('list data (on list): ' + JSON.stringify(data));
    });

    smbClient.list(path, (data: any) => {
      console.log('list data (callback): ' + JSON.stringify(data));
    });
  };

  const smbDownload = () => {
    if (!smbClient) return;

    smbClient.on('downloadProgress', (data: any) => {
      console.log(
        'download progress data (on downloadProgress): ' + JSON.stringify(data),
      );
      smbClient?.cancelDownload(data.downloadId);
    });

    smbClient.on('download', (data: any) => {
      console.log('download data (on download): ' + JSON.stringify(data));
    });

    smbClient.download('', '', '1.zip', (data: any) => {
      console.log('download data (callback): ' + JSON.stringify(data));
    });
  };

  const smbUpload = () => {
    if (!smbClient) return;

    smbClient.on('uploadProgress', (data: any) => {
      console.log(
        'upload progress data (on uploadProgress): ' + JSON.stringify(data),
      );
      smbClient?.cancelUpload(data.uploadId);
    });

    smbClient.on('upload', (data: any) => {
      console.log('upload data (on upload): ' + JSON.stringify(data));
    });

    smbClient.upload('', '', 'photo1.jpg', (data: any) => {
      console.log('upload data (callback): ' + JSON.stringify(data));
    });
  };

  const smbRename = () => {
    if (!smbClient) return;

    smbClient.on('rename', (data: any) => {
      console.log('rename data (on rename): ' + JSON.stringify(data));
    });

    smbClient.rename('', '7.jpg', '6.jpg', (data: any) => {
      console.log('rename data (callback): ' + JSON.stringify(data));
    });
  };

  const smbMoveTo = () => {
    if (!smbClient) return;

    smbClient.on('moveTo', (data: any) => {
      console.log('moveTo data (on moveTo): ' + JSON.stringify(data));
    });

    smbClient.moveTo('', '3', '6.jpg', (data: any) => {
      console.log('moveTo data (callback): ' + JSON.stringify(data));
    });
  };

  const smbCopyTo = () => {
    if (!smbClient) return;

    smbClient.on('copyTo', (data: any) => {
      console.log('copyTo data (on copyTo): ' + JSON.stringify(data));
    });

    smbClient.copyTo('3', '', '6.jpg', (data: any) => {
      console.log('copyTo data (callback): ' + JSON.stringify(data));
    });
  };

  const smbMakeDir = () => {
    if (!smbClient) return;

    smbClient.on('makeDir', (data: any) => {
      console.log('makeDir data (on makeDir): ' + JSON.stringify(data));
    });

    smbClient.makeDir('3/2/1/0', (data: any) => {
      console.log('makeDir data (callback): ' + JSON.stringify(data));
    });
  };

  const smbDelete = () => {
    if (!smbClient) return;

    smbClient.on('delete', (data: any) => {
      console.log('delete data (on delete): ' + JSON.stringify(data));
    });

    smbClient.delete('3/2/1/', (data: any) => {
      console.log('delete data (callback): ' + JSON.stringify(data));
    });
  };

  const smbDisconnect = () => {
    if (smbClient) {
      smbClient.on('disconnect', (data: any) => {
        console.log('disconnect data (on disconnect): ' + JSON.stringify(data));
        smbClient = null;
      });

      smbClient.disconnect((data: any) => {
        console.log('disconnect data (callback): ' + JSON.stringify(data));
      });
    }
  };

  const showToast = (message: string) => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      50,
    );
  };

  const initStates = () => {
    setState({
      workGroup: 'WORKGROUP',
      ip: '192.168.1.108',
      port: '',
      username: 'aba',
      password: '1',
      sharedFolder: 'ali',
      currentPath: '',
      list: [],
      isConnected: false,
      waitingForConnection: false,
    });
    smbClient?.disconnect();
    showToast('initializing app completed');
  };

  const SMBInitializingCall = () => {
    if (!smbClient) return;

    smbClient.on('error', (data: any) => {
      console.log('error in smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('init', (data: any) => {
      console.log('on init of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('testConnection', (data: any) => {
      console.log('on testConnection of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('list', (data: any) => {
      console.log('on list of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('downloadProgress', (data: any) => {
      console.log('on downloadProgress of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('download', (data: any) => {
      console.log('on download of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('uploadProgress', (data: any) => {
      console.log('on uploadProgress of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('upload', (data: any) => {
      console.log('on upload of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('rename', (data: any) => {
      console.log('on rename of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('moveTo', (data: any) => {
      console.log('on moveTo of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('copyTo', (data: any) => {
      console.log('on copyTo of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('makeDir', (data: any) => {
      console.log('on makeDir of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('delete', (data: any) => {
      console.log('on delete of smbClient: ' + JSON.stringify(data));
    });

    smbClient.on('disconnect', (data: any) => {
      console.log('on disconnect of smbClient: ' + JSON.stringify(data));
    });
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>A React Native App</Text>
            <Text style={styles.headerText}>for testing react-native-smb</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.text}>Username:</Text>
              <TextInput
                style={styles.text}
                onChangeText={(username: string) =>
                  setState(prev => ({...prev, username}))
                }
                value={state.username}
                placeholder="Username"
              />

              <Text style={styles.text}>Password:</Text>
              <TextInput
                style={styles.text}
                onChangeText={(password: string) =>
                  setState(prev => ({...prev, password}))
                }
                value={state.password}
                placeholder="Password"
              />

              <Text style={styles.text}>IP:</Text>
              <TextInput
                style={styles.text}
                onChangeText={(ip: string) => setState(prev => ({...prev, ip}))}
                value={state.ip}
                placeholder="IP"
              />

              <Text style={styles.text}>Shared Folder:</Text>
              <TextInput
                style={styles.text}
                onChangeText={(sharedFolder: string) =>
                  setState(prev => ({...prev, sharedFolder}))
                }
                value={state.sharedFolder}
                placeholder="Shared Folder"
              />

              <TouchableOpacity
                onPress={requestStoragePermission}
                style={styles.button}>
                <Text style={styles.text}>Request Storage Permission</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbInit} style={styles.button}>
                <Text style={styles.text}>Initialize SMB Client</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={smbTestConnection}
                style={styles.button}>
                <Text style={styles.text}>Test Connection</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => smbList(state.currentPath)}
                style={styles.button}>
                <Text style={styles.text}>List Files</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbDownload} style={styles.button}>
                <Text style={styles.text}>Download File</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbUpload} style={styles.button}>
                <Text style={styles.text}>Upload File</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbRename} style={styles.button}>
                <Text style={styles.text}>Rename File</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbMoveTo} style={styles.button}>
                <Text style={styles.text}>Move File</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbCopyTo} style={styles.button}>
                <Text style={styles.text}>Copy File</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbMakeDir} style={styles.button}>
                <Text style={styles.text}>Make Directory</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbDelete} style={styles.button}>
                <Text style={styles.text}>Delete File</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={initStates} style={styles.button}>
                <Text style={styles.text}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={smbDisconnect} style={styles.button}>
                <Text style={styles.text}>Disconnect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  headerContainer: {
    // height: 120,
    backgroundColor: Colors.black,
    paddingTop: 70,
  },
  headerText: {
    color: Colors.white,
    fontWeight: 'bold',
    margin: 'auto',

    paddingBottom: 20,
  },
  body: {
    backgroundColor: Colors.gray,
    paddingBottom: 50,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#DDDDDD',
    alignItems: 'center',
  },
  text: {
    color: Colors.black,
  },
});
