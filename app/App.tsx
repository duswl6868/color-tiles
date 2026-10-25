import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// 게임 본체는 GitHub Pages에 올린 index.html. 게임 수정은 앱을 다시 빌드하지 않아도 바로 반영된다.
const GAME_URL = 'https://duswl6868.github.io/color-tiles/';
const BG = '#bfe9fb'; // 게임 배경 하늘색 — 노치/홈바 영역과 로딩 화면에 쓴다

// react-native-webview 14는 제네릭 기본값이 undefined라 props가 never로 추론된다 → 빈 객체 타입을 명시
type GameWebView = WebView<object>;

export default function App() {
  const web = useRef<GameWebView>(null);
  const [failed, setFailed] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar style="dark" />
        {failed ? (
          <View style={styles.center}>
            <Text style={styles.msg}>게임을 불러오지 못했어요.{'\n'}인터넷 연결을 확인해 주세요.</Text>
            <Pressable
              style={styles.retry}
              onPress={() => {
                setFailed(false);
                web.current?.reload();
              }}
            >
              <Text style={styles.retryText}>다시 시도</Text>
            </Pressable>
          </View>
        ) : null}
        <WebView<object>
          ref={web}
          source={{ uri: GAME_URL }}
          style={[styles.web, failed && styles.hidden]}
          // 게임 화면은 스크롤/확대 없이 고정
          scrollEnabled={false}
          bounces={false}
          overScrollMode="never"
          setBuiltInZoomControls={false}
          // 효과음(Web Audio)이 첫 터치 뒤 바로 나도록
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState
          renderLoading={() => (
            <View style={[StyleSheet.absoluteFill, styles.center]}>
              <ActivityIndicator size="large" color="#1f8f98" />
            </View>
          )}
          onError={() => setFailed(true)}
          onHttpError={() => setFailed(true)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },
  web: { flex: 1, backgroundColor: BG },
  hidden: { display: 'none' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: BG },
  msg: { fontSize: 17, color: '#6b4226', textAlign: 'center', lineHeight: 26 },
  retry: { marginTop: 16, paddingHorizontal: 28, paddingVertical: 10, borderRadius: 999, backgroundColor: '#3bbfc7' },
  retryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
