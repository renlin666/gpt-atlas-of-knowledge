# GPT: THE ATLAS OF KNOWLEDGE

**GPT：知识宇宙图鉴** — 从人类的一个问题出发，探索不同学科之间的联系。

程序化动画工程。整体策划约 210 秒；当前只制作了 **S001「光标与提问」v001，8 秒**，等待用户审看。下一镜尚未开始。

## 审看第一镜

- [1080p60 MP4](review/S001/S001-v001-1080p60.mp4)（8 秒，无配乐）
- [完成提问时的关键帧](review/S001/S001-v001-7.6s.png)
- [分镜说明](docs/STORYBOARD.md)
- [完整策划案](docs/PLAN.md)
- [制作状态与审看记录](docs/PROGRESS.md)

```powershell
npm ci
npm run preview
```

浏览器打开终端给出的本地地址（默认 http://127.0.0.1:4173）。支持播放、暂停、重播、拖动时间轴与全屏。空格播放，左右方向键移动 0.25 秒。该页面仅供本地审看，尚未部署网站。

## 渲染和验证

```powershell
npm run check
npm run export:s001
```

需要 Node.js 22+，以及已安装的 Chrome 或 Edge。自动检测常见安装路径；其他位置用环境变量 `ATLAS_BROWSER` 指定浏览器可执行文件。FFmpeg 随 npm 依赖安装。

画面通过 `renderFrame(canvas, t)` 按绝对时间计算，同一环境下任意跳转可复现同一帧。视频由无头浏览器逐帧交给 FFmpeg，输出 1920×1080、60fps、480 帧 H.264 MP4。当前仅使用 Canvas 2D；后续空间章节再按实际需要加入三维渲染。

## 制作规则

**每完成一镜，先交付 MP4、关键帧和说明，等用户明确确认后才制作下一镜。** 修改意见继续在当前镜头迭代。配乐方向为原创或明确可授权曲目，尚未选曲，因此当前秒数为工作时间线。

这是独立的非官方艺术项目，展现人工策展的知识主题与艺术化联系，不是 GPT 训练集、参数或内部推理的可视化。

制作方法参考 [Nyankomintsu/world-execute-me-lyric-mv](https://github.com/Nyankomintsu/world-execute-me-lyric-mv)。本工程未复制其代码、人物、音乐或歌词。字体等第三方依赖及许可见 [CREDITS.md](CREDITS.md)。
