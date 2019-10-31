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
    View,
    Text,
    StatusBar,
    NativeEventEmitter,
} from 'react-native';

import {
    Header,
    LearnMoreLinks,
    Colors,
    DebugInstructions,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import RNSmb from 'react-native-smb';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //RNSmb.show('Ali Bala testing RNSmb.show');
        this.testingRNSmbMethods()
    }

    async testingRNSmbMethods() {

        //init eventEmitter
        const eventEmitter = new NativeEventEmitter(RNSmb);

        this.smbInit();
        this.smbTestConnection(eventEmitter);
        this.smbList(eventEmitter);
        this.smbDownload(eventEmitter);

    }

    smbInit(){
        //init RNSmb
        let options = {
            workGroup: 'WORKGROUP',
            ip: '192.168.1.108',
            username: 'aba',
            password: '1',
            sharedFolder: 'ali',
        };
        RNSmb.init(options,
            (url) => {
                console.log('success. url: ' + url);
            }
            ,
            (errorMessage) => {
                console.log('errorMessage: ' + errorMessage);
            },
        );
    }

    smbTestConnection(eventEmitter){
        //TestConnection event listeners
        eventEmitter.addListener('SMBTestConnection', (event) => {
            if (event.success) {
                console.log('TestConnection success message: ' + event.message);
            } else {
                console.log('TestConnection error message: ' + event.message);
            }
        });
        //test connection
        RNSmb.testConnection();
    }

    smbList(eventEmitter){
        //list event listeners
        eventEmitter.addListener('SMBList', (event) => {
            if (event.success) {
                console.log('List success message: ' + event.message);
                console.log('event: ' + JSON.stringify(event));
            } else {
                console.log('List error message: ' + event.message);
            }
        });
        //list files & folders
        RNSmb.list('');
        //RNSmb.list('tast Ali');
    }

    smbDownload(eventEmitter){
        //download event listeners
        eventEmitter.addListener('SMBDownloadResult', (event) => {
            console.log(JSON.stringify(event));
            if (event.success) {
                console.log('SMBDownloadResult success');
            } else {
                console.log('SMBDownloadResult error');
            }
        });
        eventEmitter.addListener('SMBDownloadProgress', (data) => {
            console.log('SMBDownloadProgress data:' + JSON.stringify(data));
        });
        //test download
        RNSmb.download(
            'tast Ali',//source file path
            'video1.mp4',//source file name
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
                        <Header/>
                        {global.HermesInternal == null ? null : (
                            <View style={styles.engine}>
                                <Text style={styles.footer}>Engine: Hermes</Text>
                            </View>
                        )}
                        <View style={styles.body}>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Step One</Text>
                                <Text style={styles.sectionDescription}>
                                    Edit <Text style={styles.highlight}>App.js</Text> to change
                                    this screen and then come back to see your edits.
                                </Text>
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>See Your Changes</Text>
                                <Text style={styles.sectionDescription}>
                                    <ReloadInstructions/>
                                </Text>
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Debug</Text>
                                <Text style={styles.sectionDescription}>
                                    <DebugInstructions/>
                                </Text>
                            </View>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.sectionTitle}>Learn More</Text>
                                <Text style={styles.sectionDescription}>
                                    Read the docs to discover what to do next:
                                </Text>
                            </View>
                            <LearnMoreLinks/>
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
