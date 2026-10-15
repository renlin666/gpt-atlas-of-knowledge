# GPT: THE ATLAS OF KNOWLEDGE

**GPT：知识宇宙图鉴** — 从人类的一个问题出发，探索不同学科之间的联系。

程序化动画工程。当前交付为 **前三幕 Aphelion 连续节奏版（BOOT music-v001），24 秒，1080p60，有配乐**，等待用户审看。后续分镜暂停。旧的无配乐视频与已有批准记录保留。

## 审看配乐版

- [24 秒连续有声 MP4](review/BOOT/BOOT-music-v001-1080p60.mp4)
- [节奏落点与音乐选择记录](docs/MUSIC_SELECTION.md)
- [验证记录](review/BOOT/verification.json)
- [完整策划案](docs/PLAN.md)
- [分镜说明](docs/STORYBOARD.md)
- [制作进度](docs/PROGRESS.md)

```powershell
npm ci
npm run prepare:audio
npm run preview
```

浏览器打开终端给出的本地地址（默认 http://127.0.0.1:4173）。支持播放、暂停、重播、拖动时间轴与全屏。空格播放，左右方向键移动 0.25 秒。该页面仅供本地审看，尚未部署网站。

## 渲染和验证

```powershell
npm run check:music
npm run export:boot
```

需要 Node.js 22+，以及已安装的 Chrome 或 Edge。自动检测常见安装路径；其他位置用环境变量 `ATLAS_BROWSER` 指定浏览器可执行文件。FFmpeg 随 npm 依赖安装。

画面通过 `renderFrame(canvas, t)` 按绝对时间计算，同一环境下任意跳转可复现同一帧。视频由无头浏览器逐帧交给 FFmpeg，输出 1920×1080、60fps、H.264 MP4（当前配乐版 1440 帧，AAC 双声道 48kHz）。当前仅使用 Canvas 2D；后续空间章节再按实际需要加入三维渲染。

## 制作规则

**每完成一镜，先交付 MP4、关键帧和说明，等用户明确确认后才制作下一镜。** 修改意见继续在当前镜头迭代。已选定 Aphelion — Scott Buckley（CC BY 4.0）。当前先审看三幕配乐重排，确认后继续后续镜头。

这是独立的非官方艺术项目，展现人工策展的知识主题与艺术化联系，不是 GPT 训练集、参数或内部推理的可视化。

制作方法参考 [Nyankomintsu/world-execute-me-lyric-mv](https://github.com/Nyankomintsu/world-execute-me-lyric-mv)。本工程未复制其代码、人物、音乐或歌词。字体等第三方依赖及许可见 [CREDITS.md](CREDITS.md)。


## 音频与复现

完整曲目与独立音频片段不进入 Git。npm run prepare:audio 从作者官网获取并核对已确认源文件，自动生成带增益和尾部淡出的 24 秒审看音频。源文件哈希、来源、授权及处理参数见 data/music-edit.json；发布视频时附上 CREDITS.md 中的音乐署名及许可链接。当前片段末尾的短淡出只用于独立审看，整片接续时移除。

音频分析可选使用 tools/analyze_audio.py（Python + NumPy，--ffmpeg 指定 FFmpeg 路径）；日常预览与导出只需要 Node.js、Chrome/Edge 及 npm 依赖。
