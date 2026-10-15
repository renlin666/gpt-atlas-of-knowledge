# GPT: THE ATLAS OF KNOWLEDGE

**GPT：知识宇宙图鉴** — 从人类的一个问题出发，探索不同学科之间的联系。

当前完成 **FILM v001：3 分 30 秒、1080p60、中英双语、有声全片**。已完成全部九章与片尾，最终 MP4 位于 deliverables/。

**用户已授权上传已完成内容。代码、成片、验证记录及署名说明同步保存在本仓库。**

## 审看

- [下载最终 MP4 · 3 分 30 秒 · 1080p60](https://github.com/renlin666/gpt-atlas-of-knowledge/raw/refs/heads/main/deliverables/GPT-The-Atlas-of-Knowledge-1080p60.mp4)
- [最终文件与 SHA256](deliverables/manifest.json)
- [制作审看版归档](review/FILM/FILM-v001-1080p60.mp4)
- [已通过的前 90 秒](review/CUT90/CUT90-v001-1080p60.mp4)
- [验证记录](review/FILM/verification.json)
- [分镜与章节时间](data/film.json)
- [制作记录](docs/PROGRESS.md)
- [原策划案](docs/PLAN.md)

| 时间 | 内容 |
| --- | --- |
| 0–24s | 唤醒：光标、提问、知识核心与原点 |
| 24–54s | 数学：函数、圆与波、递归三角形 |
| 54–78s | 物理：波的叠加、开普勒轨道 |
| 78–114s | 生命：DNA、细胞与生命分枝 |
| 114–138s | 文明：书页、记忆与知识交流 |
| 138–156s | 创造：韵律与程序化曲线 |
| 156–177s | 关联：概念关系与图鉴星图 |
| 177–198s | 边界：未知、不确定与求证 |
| 198–210s | 探索：下一次提问与片尾 |

```powershell
npm ci
npm run prepare:film
npm run preview
```

打开终端给出的本地地址（默认 http://127.0.0.1:4173/?shot=FILM）。支持播放、暂停、重播、拖动、音量与全屏。空格播放，左右键移动 0.25 秒。页面仅供本地审看，尚未部署。

## 渲染与验证

```powershell
npm run check:film
npm run export:film
npm run check:film-export
```

需要 Node.js 22+、Chrome 或 Edge。用 ATLAS_BROWSER 可指定浏览器路径。FFmpeg 随 npm 依赖安装。视频为 1920×1080、60fps、12600 帧、H.264 MP4，AAC 双声道 48kHz。

画面通过绝对时间 renderFrame(canvas,t) 计算。渲染使用 Canvas 2D；预览以音频为统一时钟，导出逐帧绘制后复用同一音轨。已通过的 BOOT、S004 与 CUT04 独立版本保留。

## 配乐与制作规则

配乐：[Aphelion — Scott Buckley](https://www.scottbuckley.com.au/library/aphelion/)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。本版将原曲 0–177 秒与 386.250023–422.250023 秒尾奏以 3 秒交叉淡化组合为 210 秒，不变速。开头 +3dB，在 90–102 秒降至 0dB；末尾 1.25 秒淡出。完整曲目与独立音频片段不进入 Git。准备脚本从作者源下载并验证 SHA256，授权和署名见 [CREDITS.md](CREDITS.md)。

最新交付指令：**“现在最终输出一个MP4格式文件，完成的部分可以上传github了”。** 据此输出最终 MP4，并同步已完成内容；原始第三方音频不进入 Git。

这是非官方独立艺术项目，呈现人工策展的科学意象；不表示 GPT 训练集、参数或内部推理。科学说明见 [参考记录](docs/KNOWLEDGE_REFERENCES.md)。

制作方法参考 [Nyankomintsu/world-execute-me-lyric-mv](https://github.com/Nyankomintsu/world-execute-me-lyric-mv)，未复制其代码、人物、音乐或歌词。全片保留原策划案的九章叙事；章节时间已按配乐调整，总时长 210 秒。
