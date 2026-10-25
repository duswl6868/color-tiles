# 냥냥 컬러타일

말랑한 고양이 타일 퍼즐 (모바일 세로, 90초). 서버 없음 · 빌드 없음 · `index.html` + PNG 에셋.

- 기획서: [`docs/nyangnyang-spec.md`](docs/nyangnyang-spec.md) — 규칙·수치·배치·연출·사운드·설계 결정·테스트
- **규칙·수치를 바꾸면 기획서도 같이 고친다** (특히 §3 수치, §9 설계 결정)
- 로컬 전용 메모가 있으면 `CLAUDE.local.md`(git 제외)도 함께 읽는다

## 폴더 구조

```
color-tiles/
  index.html            # 게임 전부 (마크업·스타일·로직·Web Audio 합성음)
  assets/               # PNG 에셋 (README.txt, manifest.json 참고)
    background/ board/ cats/ ui/
  app/                  # Expo SDK 58 앱 — 배포 URL을 여는 WebView 한 화면 (App.tsx)
  docs/
    nyangnyang-spec.md  # 기획서
  CLAUDE.md             # 본 문서
```

## 실행 / 배포

- **독립 git 레포** `duswl6868/color-tiles` (공개). 부모 작업공간 레포는 `.gitignore`로 무시 → 이 폴더 안에서 커밋/푸시
- 배포: GitHub Pages (main 루트) — https://duswl6868.github.io/color-tiles/ · `git push` 후 1~2분 뒤 반영
- 로컬: `index.html`을 브라우저로 열기
- Expo 앱: `cd /Users/yj/Documents/claude/color-tiles/app && npx expo start` → 폰 Expo Go로 QR. 게임 수정은 Pages 배포만으로 앱에 반영 (앱 재빌드 불필요)
- 공개 제외는 `.gitignore` 참고 (시안 이미지, 로컬 전용 문서)

## 핵심 결정

| 항목 | 결정 |
|---|---|
| 규칙 | 빈칸 탭 → 상하좌우로 처음 만나는 고양이 중 같은 색 2+ 제거, 1마리 1점, 헛손질 −10초, 고양이 탭은 무반응, 90초, 막혀도 안 끝남 |
| 판 | 10×14, **10색×8 = 80마리**. 색 수는 `assets/cats/`에 있는 이미지 수로 자동 결정, 색당 짝수 (모든 판 클리어 가능) |
| 기믹 | **없음** — 조커·피버·시간 보너스 고양이는 시험 후 제거. 조커는 색 짝수를 깨서 늘 남는 판을 만들었음 (전부 제거 14% → 0.6%) |
| 화면 | 1080×1920 무대를 통째로 스케일 (`layout()`). 좌표는 에셋 `layout_1080x1920.json` 기준. 세로 화면은 배경만 cover로 꽉 채움(흐린 띠 없음), PC는 양옆 블러 |
| 제한 시간 | **90초** — 퍼펙트 ≈40수 기준으로 막판 긴장이 남게 |
| 시작 | [시작!] → 판 공개·시간 정지 → **첫 터치(어디든)부터 시간 흐름**. 판 위 첫 터치는 그대로 판정(지움/−10초), 판 밖은 시작만 (`ready` → `begin()`) |
| 시간 흐름 | 프레임 기준, 한 프레임 최대 0.1초 → 탭 내리면 멈춤 |
| 기록 | `localStorage` `cattiles-record` {score, time} — 점수 높을수록, 같으면 퍼펙트 시간 짧을수록 |
| 제거 연출 | **합체** — 짝이 된 고양이가 누른 칸으로 날아와(0.15초, `MERGE_MS`) 뭉쳤다 펑. 판정·점수는 터치 즉시 반영 (`mergeInto()`) |
| 사운드 | Web Audio 합성 (파일 없음), 켜기/끄기 `cattiles-sound`. iOS는 [시작!] 터치 때 `Sound.unlock()` |

## 지켜야 할 것

- 에셋 PNG는 찌그러뜨리지 않는다. 게이지 막대처럼 늘려야 하면 양 끝 유지·가운데만 늘림(`border-image`) / 잘라서 표시(`clip-path`)
- 새 고양이 색 추가 = `assets/cats/cat_<이름>.png`(256×256 투명) + `ALL_CATS`에 `[이름, 반짝임 색]` 한 줄
- `app/`의 `react-native-webview` 14는 타입 기본값 문제로 `WebView<object>` 제네릭을 명시해야 tsc가 통과한다
- Expo SDK를 올릴 땐 Expo Go 버전에 맞춘다 (`npx expo install expo@^<버전> --fix` → `tsc` → `expo-doctor`)
