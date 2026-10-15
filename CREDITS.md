# 参考与素材

- 策划案：用户此前创作并提供的《GPT: THE ATLAS OF KNOWLEDGE》v1.0，原文保留在 `docs/PLAN.md`。
- 方法参考：Nyankomintsu 的 [world-execute-me-lyric-mv](https://github.com/Nyankomintsu/world-execute-me-lyric-mv)，借鉴绝对时间渲染、单镜预览与离线逐帧导出的工作方式。没有复制该项目代码、美术、音乐或歌词。
- S001 画面：本工程原创 Canvas 几何、界面与文字排版。尘点属于装饰性视觉，不表示真实知识数据。
- 字体：Noto Sans SC、Space Grotesk 与 Cormorant Garamond，通过 Fontsource npm 包加载，SIL Open Font License 1.1。许可文件随相应依赖包提供。
- 渲染工具：Playwright Core（Apache-2.0）；FFmpeg 二进制由 ffmpeg-static npm 包提供，具体构建与组件许可见其随附说明。软件依赖通过 npm 安装，不复制进本仓库。
- 音乐：用户已选定 [Aphelion — Scott Buckley](https://www.scottbuckley.com.au/library/aphelion/)，[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。前三幕独立有声版节选原曲 0–24 秒，增益 +4dB，末尾淡出 0.45 秒，音乐速度不变。完整音频文件不进入 Git；有声视频与本说明共同提供署名、来源与改动记录。

音乐署名：`'Aphelion' by Scott Buckley - released under CC-BY 4.0. www.scottbuckley.com.au`。发布到视频网站时，将该署名、作者曲目页与许可链接放入视频简介，并注明节选与音量/淡出处理。

本工程尚未选择整体开源许可证，公开可见不等于授予额外素材许可。

## CUT90 有声审看版

Aphelion 连续节选原曲 0–90 秒，整体增益 +3dB，末尾 0.75 秒淡出；不变速、不在章节之间截断音乐。S004 / CUT04 的独立历史预览使用 +4dB 与原末尾淡出。所有画面为本工程原创程序绘制。科学示意参考见 docs/KNOWLEDGE_REFERENCES.md；不复制参考网站图像。

## FILM v001 · 全片音乐剪辑

- 原曲 0–177 秒，与原曲 386.250023–422.250023 秒尾奏组合为 210 秒配乐。
- 影片 174–177 秒做 3 秒线性交叉淡化；不变速。
- 开头至 90 秒 +3dB，90–102 秒平滑降至 0dB，之后保持 0dB。末尾 208.75–210 秒淡出。
- 画面和片尾均有配乐署名。完整音源及派生独立音频不进入 Git。
- 细胞、生命分枝、书页、交流球体、乐谱、图形、图鉴星点均为本工程原创程序绘制。分枝与路线不对应真实谱系或历史路线；星图不对应模型内部数据。
- 科学概念关系使用人工精选来源，见 data/knowledge-graph.json 与 docs/KNOWLEDGE_REFERENCES.md。
