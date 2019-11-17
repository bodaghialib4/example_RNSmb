/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    View,
    Text,
    StatusBar,
    NativeEventEmitter,
    ToastAndroid,
    PermissionsAndroid,
} from 'react-native';

import {
    Header,
    Colors,
} from 'react-native/Libraries/NewAppScreen';

import {TextField} from 'react-native-material-textfield';
import SMBClient from 'react-native-smb';

let RNSmb = '';

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        };

        this.permissions = {
            read: false,
            write: false,
        };

    }

    componentDidMount() {
        //RNSmb.show('Ali Bala testing RNSmb.show');
        this.testingRNSmbMethods();
        this.requestStoragePermission();
    }

    componentWillUnmount() {
        this.removeAllSMBListener();
    }

    async requestStoragePermission() {
        await this.requestWriteStoragePermission();
        await this.requestReadStoragePermission();
    }

    async requestReadStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                    // title: 'دسترسی خواندن از حافظه گوشی',
                    // message: 'جهت آپلود فایل در سرور نیاز به اجازه دسترسی خواندن از حافظه گوشی می باشد ',
                    // buttonNeutral: 'بعدا ازم بپرس',
                    // buttonNegative: 'اجازه نمی دهم',
                    // buttonPositive: 'اجازه می دهم',
                    title: 'Storage Read Access Permission',
                    message: 'To upload a file, accessing storage read permission required.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can read from the EXTERNAL_STORAGE');
                this.permissions.read = true;
                this.showToast('READ_EXTERNAL_STORAGE GRANTED.');
            } else {
                console.log('READ_EXTERNAL_STORAGE permission denied');
                this.showToast('READ_EXTERNAL_STORAGE not GRANTED.');
                this.permissions.read = false;
            }
        } catch (err) {
            console.warn(err);
        }
    }

    async requestWriteStoragePermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    // title: 'دسترسی نوشتن در حافظه گوشی',
                    // message: 'جهت آپلود فایل در سرور نیاز به اجازه دسترسی نوشتن در حافظه گوشی می باشد ',
                    // buttonNeutral: 'بعدا ازم بپرس',
                    // buttonNegative: 'اجازه نمی دهم',
                    // buttonPositive: 'اجازه می دهم',
                    title: 'Storage write Access Permission',
                    message: 'To download a file, accessing storage write permission required.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can write to the EXTERNAL_STORAGE');
                this.showToast('WRITE_EXTERNAL_STORAGE GRANTED.');
                this.permissions.write = true;
            } else {
                console.log('WRITE_EXTERNAL_STORAGE permission denied');
                this.showToast('WRITE_EXTERNAL_STORAGE not GRANTED.');
                this.permissions.write = false;
            }
        } catch (err) {
            console.warn(err);
        }
    }


    async testingRNSmbMethods() {

        //init eventEmitter
        const eventEmitter = new NativeEventEmitter(RNSmb);

        this.smbInit();
        this.smbTestConnection();
        this.smbList();
        this.smbDownload();
        // this.smbUpload();
        // this.smbRename();
        // this.smbMoveTo();
        // this.smbCopyTo();
        // this.smbMakeDir();
        // this.smbDelete();

    }

    smbInit() {
        //init RNSmb

        this.smbClient = new SMBClient(
            '192.168.1.192',//ip
            '',//port
            'ali',//sharedFolder,
            'WORKGROUP',//workGroup,
            'aba',//username,
            '1',//password,
            (data) => {//callback
                console.log('new SMBClient data (callback): ' + JSON.stringify(data));
            },
        );

        this.smbClient.on(
            'error',
            (data) => {
                console.log('error in SMBClient (on error): ' + JSON.stringify(data));
            },
        );

        this.smbClient.on(
            'init',
            (data) => {
                console.log('new SMBClient data (on init): ' + JSON.stringify(data));
            },
        );
    }

    smbTestConnection() {
        //test connection
        this.smbClient.on(
            'testConnection',
            (data) => {
                console.log('testConnection data (on testConnection): ' + JSON.stringify(data));
            },
        );

        this.smbClient.testConnection(
            (data) => {//callback
                console.log('testConnection data (callback): ' + JSON.stringify(data));
            },
        );

    }

    smbList() {
        //list files & folders
        this.smbClient.on(
            'list',
            (data) => {
                console.log('list data (on list): ' + JSON.stringify(data));
            },
        );

        this.smbClient.list(
            '3/2/1',
            (data) => {//callback
                console.log('list data (callback): ' + JSON.stringify(data));
            },
        );
    }

    smbDownload(eventEmitter) {
        //test download
        this.smbClient.on(
            'downloadProgress',
            (data) => {
                console.log('download progress data (on downloadProgress): ' + JSON.stringify(data));
            },
        );

        this.smbClient.on(
            'download',
            (data) => {
                console.log('download data (on download): ' + JSON.stringify(data));
            },
        );

        this.smbClient.download(
            '',
            '',
            '1.zip',
            (data) => {//callback
                console.log('download data (callback): ' + JSON.stringify(data));
            },
        );

    }

    smbUpload(eventEmitter) {
        //upload event listeners
        eventEmitter.addListener('SMBUploadResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBUploadResult success');
            } else {
                console.log('SMBUploadResult error');
            }
        });
        eventEmitter.addListener('SMBUploadProgress', (data) => {
            console.log('SMBUploadProgress data:' + JSON.stringify(data));
        });
        //test upload
        RNSmb.upload(
            'tast Ali/folder4',//destination path in smb server
            '',//source path in download directory of android device
            'video1.mp4',//file name
        );
    }

    smbRename(eventEmitter) {
        //rename event listeners
        eventEmitter.addListener('SMBRenameResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBRenameResult success');
            } else {
                console.log('SMBRenameResult error');
            }
        });
        //test rename
        RNSmb.rename(
            'tast Ali/folder4',//file path in smb server
            'video1.mp4',//old file name
            'video11.mp4',//new file name
        );
    }

    smbMoveTo(eventEmitter) {
        //move event listeners
        eventEmitter.addListener('SMBMoveResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBMoveResult success');
            } else {
                console.log('SMBMoveResult error');
            }
        });
        //test move
        RNSmb.moveTo(
            'tast Ali/folder3',//file old path in smb server
            'tast Ali/folder5',//file new path in smb server
            'video1.mp4',//file name
        );
    }

    smbCopyTo(eventEmitter) {
        //copy event listeners
        eventEmitter.addListener('SMBCopyResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBCopyResult success');
            } else {
                console.log('SMBCopyResult error');
            }
        });
        //test copy
        RNSmb.copyTo(
            'tast Ali/folder3',//file old path in smb server
            'tast Ali/folder6',//file new path in smb server
            'video1.mp4',//file name
        );
    }

    smbMakeDir(eventEmitter) {
        //makeDir event listeners
        eventEmitter.addListener('SMBMakeDirResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBMakeDirResult success');
            } else {
                console.log('SMBMakeDirResult error');
            }
        });
        //test makeDir
        RNSmb.makeDir(
            'tast Ali/folder7',// path of new directory in smb server
        );
    }

    smbDelete(eventEmitter) {
        //delete event listeners
        eventEmitter.addListener('SMBDeleteResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBDeleteResult success');
            } else {
                console.log('SMBDeleteResult error');
            }
        });
        //test delete
        RNSmb.delete(
            'tast Ali/folder7/',// path of a file or directory in smb server that must delete
        );
    }

    /**
     * for UI
     */


    showToast(message) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
            0,
            50,
        );
    }

    initStates() {
        this.setState({
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
        this.removeAllSMBListener();
        this.showToast('initialing app completed');
    }

    SMBCall() {

        //init eventEmitter
        const eventEmitter = new NativeEventEmitter(RNSmb);

        //TestConnection event listeners
        eventEmitter.addListener('SMBTestConnection', (event) => {
            if (event.success) {
                console.log('TestConnection success message: ' + event.message);
                this.showToast('server accessible');
                this.setState({isConnected: true});

                this.showToast('listing root directory');

                RNSmb.list('');
            } else {
                this.showToast('error in accessing server');
                console.log('TestConnection error message: ' + event.message);
                this.setState({isConnected: false});
            }
            this.setState({waitingForConnection: false});
        });
        eventEmitter.addListener('SMBList', (event) => {
            if (event.success && this.state.isConnected) {
                console.log('List success message: ' + event.message);
                console.log('event: ' + JSON.stringify(event));
                let message = event.message;
                message = message.split('[')[1];
                let currentPath = message.split(']')[0];
                this.setState({
                    list: event.list,
                    currentPath: currentPath,
                });
            } else {
                this.showToast('error in listing directory');
                console.log('List error message: ' + event.message);
            }
        });
        //test connection
        RNSmb.testConnection();

    }

    connectServer() {
        let options = {
            workGroup: this.state.workGroup,
            ip: this.state.ip,
            port: this.state.port,
            username: this.state.username,
            password: this.state.password,
            sharedFolder: this.state.sharedFolder,
        };
        RNSmb.init(options,
            (url) => {
                console.log('init options success. url: ' + url);
                this.SMBCall();
                this.showToast('testing server accessibility');
            }
            ,
            (errorMessage) => {
                console.log('init options errorMessage: ' + errorMessage);
                this.showToast('server init options error');
            },
        );

    }

    removeAllSMBListener() {
        const eventEmitter = new NativeEventEmitter(RNSmb);
        eventEmitter.removeAllListeners('SMBTestConnection');
        eventEmitter.removeAllListeners('SMBList');

    }

    goBack() {
        //list
        if (this.state.currentPath) {
            let targetPath = '';
            let splitPath = this.state.currentPath.split('/');
            console.log('splitPath in go back: ' + splitPath);
            if (splitPath.length) {
                let a = 'tast Ali/folder4/';
                let removePart = splitPath[splitPath.length - 2] + '/' + splitPath[splitPath.length - 1];
                targetPath = this.state.currentPath.replace(removePart, '');
            }
            console.log('targetPath to go back: ' + targetPath);
            this.showToast(targetPath ? 'go back to ' + targetPath + ' directory' : 'go back to root directory');
            RNSmb.list(targetPath);
        } else {
            this.showToast('no parent directory to go back');
        }
    }

    enterDirectory(directoryName) {

        let targetPath = this.state.currentPath + directoryName;
        console.log('targetPath to go: ' + targetPath);
        this.showToast('listing ' + targetPath + ' directory');

        RNSmb.list(targetPath);

    }


    _renderListItems() {
        if (this.state.list && this.state.list.length > 0) {
            return this.state.list.map((file, id) => {
                return (
                    <View key={id}>
                        {
                            file['isDirectory'] ?
                                <TouchableOpacity
                                    onPress={() => {
                                        console.log('inter to directory: ' + file['name']);
                                        this.enterDirectory(file['name']);
                                        //this.enterDirectory.bind(this, f['filename']);
                                    }}>
                                    <Text style={styles.directory}>{file['name']}</Text>
                                </TouchableOpacity>
                                : <Text style={styles.file}>{file['name']}</Text>
                        }
                    </View>
                );
            });
        }
    }

    _renderList() {
        return (
            <View style={styles.listContainer}>
                <TouchableOpacity
                    onPress={() => {
                        console.log('go back');
                        this.goBack();
                        //this.goBack.bind(this)
                    }}>
                    {
                        this.state.currentPath ?
                            <Text style={{
                                padding: 4,
                                marginBottom: 3,
                                borderBottomColor: 'gray',
                                borderBottomWidth: 1,
                            }}>{'==> ' + this.state.currentPath}</Text>
                            :
                            null
                    }
                </TouchableOpacity>
                <View>
                    {this._renderListItems()}
                </View>
            </View>

        );
    }

    _renderOptions() {
        return (
            <View style={styles.options}>
                <View style={styles.optionsRow}>
                    <View style={{flex: 2, marginRight: 10}}>
                        <TextField
                            disabled={this.state.isConnected || this.state.waitingForConnection}
                            labelHeight={15}
                            label='Server IP'
                            value={this.state.ip}
                            onChangeText={(ip) => this.setState({ip})}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <TextField
                            disabled={this.state.isConnected || this.state.waitingForConnection}
                            labelHeight={15}
                            label='Server Port'
                            value={this.state.port}
                            onChangeText={(port) => this.setState({port})}
                        />
                    </View>
                </View>
                <View style={styles.optionsRow}>
                    <View style={{flex: 1, marginRight: 10}}>
                        <TextField
                            disabled={this.state.isConnected || this.state.waitingForConnection}
                            labelHeight={15}
                            label='Username'
                            value={this.state.workGroup}
                            onChangeText={(workGroup) => this.setState({workGroup})}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <TextField
                            disabled={this.state.isConnected || this.state.waitingForConnection}
                            labelHeight={15}
                            label='Password'
                            value={this.state.sharedFolder}
                            onChangeText={(sharedFolder) => this.setState({sharedFolder})}
                        />
                    </View>
                </View>
                <View style={styles.optionsRow}>
                    <View style={{flex: 1, marginRight: 10}}>
                        <TextField
                            disabled={this.state.isConnected || this.state.waitingForConnection}
                            labelHeight={15}
                            label='Username'
                            value={this.state.username}
                            onChangeText={(username) => this.setState({username})}
                        />
                    </View>
                    <View style={{flex: 1}}>
                        <TextField
                            disabled={this.state.isConnected || this.state.waitingForConnection}
                            labelHeight={15}
                            label='Password'
                            value={this.state.password}
                            onChangeText={(password) => this.setState({password})}
                        />
                    </View>
                </View>
                <View style={[styles.optionsRow]}>
                    <View style={[styles.connectionButtonContainer]}>
                        <TouchableOpacity
                            disabled={this.state.waitingForConnection}
                            style={[styles.connectionButton, {backgroundColor: this.state.waitingForConnection ? 'gray' : '#09B4BB'}]}
                            onPress={() => {
                                //console.log('test connection');
                                if (this.state.isConnected) {
                                    this.initStates();
                                } else {
                                    this.setState({waitingForConnection: true});
                                    this.connectServer();
                                }
                            }}>
                            <Text style={{padding: 4}}>{this.state.isConnected ? 'Disconnect' : 'Connect'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    render() {
        return (
            <>
                <StatusBar barStyle="dark-content"/>
                <SafeAreaView>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={styles.scrollView}>
                        {global.HermesInternal == null ? null : (
                            <View style={styles.engine}>
                                <Text style={styles.footer}>Engine: Hermes</Text>
                            </View>
                        )}
                        <View style={styles.body}>
                            {this._renderOptions()}
                            {this._renderList()}

                        </View>
                    </ScrollView>
                </SafeAreaView>
            </>
        );
    }
}

const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: Colors.lighter,
    },
    engine: {
        position: 'absolute',
        right: 0,
    },
    body: {
        backgroundColor: Colors.white,
    },
    options: {
        paddingHorizontal: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
    },
    optionsRow: {
        flexDirection: 'row',
    },
    connectionButtonContainer: {
        flex: 1,
        margin: 5,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    connectionButton: {
        backgroundColor: 'rgba(30,255,216,0.51)',
        width: 150,
        height: 35,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        flex: 1,
        marginTop: 15,
        marginBottom: 20,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        color: Colors.dark,
    },
    highlight: {
        fontWeight: '700',
    },
    footer: {
        color: Colors.dark,
        fontSize: 12,
        fontWeight: '600',
        padding: 4,
        paddingRight: 12,
        textAlign: 'right',
    },
});
