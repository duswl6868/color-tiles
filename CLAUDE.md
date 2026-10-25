# 냥냥 컬러타일 (Color Tiles 고양이판)

gamesaien「Color Tiles」 규칙을 그대로 옮긴 고양이 테마 퍼즐. 서버 없음 · 빌드 없음 · `index.html` + PNG 에셋.

- 기획서: [`docs/nyangnyang-spec.md`](docs/nyangnyang-spec.md) — 규칙·수치·배치·연출·사운드·원작과의 차이·검증 결과
- 원작 역기획서: [`docs/original-reverse-spec.md`](docs/original-reverse-spec.md)
- **규칙·수치를 바꾸면 기획서도 같이 고친다** (특히 §3 수치, §9 원작과 다른 점)

## 폴더 구조

```
color-tiles/
  index.html            # 게임 전부 (마크업·스타일·로직·Web Audio 합성음)
  assets/               # PNG 에셋 (README.txt, manifest.json 참고)
    background/ board/ cats/ ui/
  app/                  # Expo SDK 58 앱 — 배포 URL을 여는 WebView 한 화면 (App.tsx)
  docs/
    nyangnyang-spec.md        # 우리 기획서
    original-reverse-spec.md  # 원작 역기획서 — git 제외
    original/                 # 원작 코드(난독화 해제본·리팩토링본·검증 스크립트) — git 제외
  CLAUDE.md             # 본 문서
```

## 실행 / 배포

- **독립 git 레포** `duswl6868/color-tiles` (공개). 부모 작업공간 레포는 `.gitignore`로 무시 → 이 폴더 안에서 커밋/푸시
- 배포: GitHub Pages (main 루트) — https://duswl6868.github.io/color-tiles/ · `git push` 후 1~2분 뒤 반영
- 로컬: `index.html`을 브라우저로 열기
- Expo 앱: `cd /Users/yj/Documents/claude/color-tiles/app && npx expo start` → 폰 Expo Go로 QR. 게임 수정은 Pages 배포만으로 앱에 반영 (앱 재빌드 불필요)
- 공개 제외 (`.gitignore`): `docs/original/`·`docs/original-reverse-spec.md`(원작 저작권 — 로컬에만 둔다), `nyangnyang-redesign.png`·`assets/preview_1080x1920.png`·`assets/generation-prompts.txt`(시안)

## 핵심 결정

| 항목 | 결정 |
|---|---|
| 규칙 | **원작과 동일** — 빈칸 탭 → 상하좌우 최근접 고양이 중 같은 색 2+ 제거, 1마리 1점, 헛손질 −10초, 고양이 탭은 무반응, 막혀도 안 끝남. **시간만 90초**(원작 120초) |
| 판 | 10×14, **10색×8 = 80마리** (원작 23×15·200개와 채움률 동일). 색 수는 `assets/cats/`에 있는 이미지 수로 자동 결정, 색당 짝수 |
| 기믹 | **없음** — 황금냥(조커)·피버·시계냥은 제거함. 조커는 색 짝수를 깨서 늘 남는 문제를 만들었음 (시뮬레이션 근거: 전부 제거 14% → 0.6%) |
| 화면 | 1080×1920 무대를 통째로 스케일 (`layout()`). 좌표는 에셋 `layout_1080x1920.json`/`preview` 기준 |
| 제한 시간 | **90초** — 80마리 판은 퍼펙트에 ≈40수라 120초면 너무 여유 → 원작의 '막판에 쫓기는' 긴장을 위해 줄임 |
| 시간 흐름 | 프레임 기준, 한 프레임 최대 0.1초 → 탭 내리면 멈춤 (원작은 벽시계 — 의도된 차이) |
| 기록 | `localStorage` `cattiles-record` {score, time} — 점수 높을수록, 같으면 퍼펙트 시간 짧을수록 |
| 사운드 | Web Audio 합성 (파일 없음), 켜기/끄기 `cattiles-sound`. iOS는 [시작!] 터치 때 `Sound.unlock()` |

## 지켜야 할 것

- **규칙 로직(`scan`, 헛손질, 퍼펙트 시간 계산)을 바꾸면 검증을 다시 돌린다**:
  `node docs/original/verify_logic.js docs/original/color_tiles_003_o.deobfuscated.js` → 14/14 통과해야 함 (약 1.5분)
  원작과 일부러 다르게 바꾸는 경우엔 기획서 §9에 이유와 함께 적는다
- 에셋 PNG는 찌그러뜨리지 않는다. 게이지 막대처럼 늘려야 하면 양 끝 유지·가운데만 늘림(`border-image`) / 잘라서 표시(`clip-path`)
- 새 고양이 색 추가 = `assets/cats/cat_<이름>.png`(256×256 투명) + `ALL_CATS`에 `[이름, 반짝임 색]` 한 줄
- `app/`의 `react-native-webview` 14는 타입 기본값 문제로 `WebView<object>` 제네릭을 명시해야 tsc가 통과한다
- Expo SDK를 올릴 땐 Expo Go 버전에 맞춘다 (`npx expo install expo@^<버전> --fix` → `tsc` → `expo-doctor`)
