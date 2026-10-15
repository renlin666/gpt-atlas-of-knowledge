# 全片科学示意与概念关系

2026-10-15 核对。画面由原创代码绘制；下面记录概念依据，不复制来源图片。

| 分镜 | 概念与表达 | 依据及边界 |
| --- | --- | --- |
| S004–S005 | 直线、抛物线、正弦；单位圆的坐标为 cos θ、sin θ | 直接按公式绘制；S004 x/y 等比例、角度采用弧度；S005 同一角度驱动旋转点与波上的点 |
| S006 | 谢尔宾斯基三角形 | 每个三角形保留三个角部的半尺寸副本，递归 n 层有 3ⁿ 个末级三角形；仿射拉伸的二维构造，不宣称黄金比例 |
| S007 | 线性叠加 | 展示两个解析函数及逐点相加的结果，三行纵向采用相同单位比例；示意线性系统，非某种实际介质测量 |
| S008 | 椭圆轨道、共同中心质量下 T²∝a³ | [NASA：Orbits and Kepler’s Laws](https://science.nasa.gov/solar-system/orbits-and-keplers-laws/)。使用 E−e sin(E)=M 求轨道位置；中心在焦点。两条轨道作倾斜投影，非真实太阳系尺寸、行星或质量数据 |
| S009 | 双螺旋、A/T 和 G/C 互补配对 | [NHGRI：DNA Fact Sheet](https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet)、[NHGRI：Double Helix](https://www.genome.gov/genetics-glossary/Double-Helix?id=53)。字母序列是为构图人工选取的示例，不代表真实基因；骨架、间距和投影均为结构示意，非原子模型 |

轨道求解、互补配对、递归数量、函数数值与加和关系在 `tools/check_cut90.mjs` 中核对。所有章节之间的关系是叙事顺序，不表示生命由所示天体轨道直接生成。

## S010–S020

- S010：真核细胞、细胞核与 DNA 的关系，参考 [NHGRI DNA Fact Sheet](https://www.genome.gov/about-genomics/fact-sheets/Deoxyribonucleic-Acid-Fact-Sheet)。只表现膜、核与部分细胞器的艺术图形，不是完整解剖图或尺度准确模型。
- S011：二叉分枝作为生命多样性意象，6 层末级分枝、127 条边段；不映射具体物种、祖先或分歧时间。
- S012–S013：书页、字形及球体连线为原创概念构图，不主张文明单线演进，也不展示实际历史路线。
- S014：原创诗句和乐谱装饰；波形是解析函数的叠加，不是声轨的频谱数据。
- S015：按 x=sin(3θ+φ)、y=sin(2θ) 绘制利萨如曲线；相位 φ 直接由绝对时间计算。
- S016：傅里叶分析用于声音信号的频率分析，参考 [MIT Signals and Systems](https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/)。图论与路径建模关系，参考 [NIST Shortest Path](https://xlinux.nist.gov/dads/HTML/shortestpath.html)。DNA 携带遗传信息及其在细胞中的位置，参考上述 NHGRI 资料。实际使用的 6 个节点和 3 条关系保存在 data/knowledge-graph.json，每条有明确关系名与来源。
- S017：6 个学科标记与 96 个装饰节点；连线为艺术星图，不声称这 96 个点是真实知识样本或 GPT 的内部表示。
- S018–S019：未知、来源与核对是创作主题，不是对任何模型错误率或知识缺口的测量。
- S020：回归观众的问题，原创片尾文案。
