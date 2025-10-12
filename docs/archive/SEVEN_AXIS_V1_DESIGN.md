泽海，这是**整合我们前面全部讨论与外部参考后的「Xorigo UI 风格配方体系（v1.0）设计指南」完整版**。
我保持“先结论，后细节”，并把可治理、可扩展、可验证放在第一优先级。

---

# 一、总览与结论

* 把“主题（Theme）”升级为**风格配方（Style Recipe）**：用 **七轴**定义风格，配 **三层令牌**承载语义，并以 **响应级别 + 轴锁**控制在不同场景的变化边界。
* **七轴**：`Mode / Base / Accent / Tone / Density / Motion / Surface`。
* **三层令牌**：`Core（原子）→ Role（语义别名）→ Component Aliases（组件别名）`；并行的 `Motion/Surface/Density` 专用令牌。
* **配色与可访问**：统一使用 **OKLCH** 调色与 **WCAG 2.2** 对比度预算；Dark 模式采用**非对称映射（降彩+微提亮）**；覆盖 **forced-colors / reduced-motion** 系统偏好。
* **数据可视化色板**与 UI 完全解耦；默认仅随 `Mode` 轻调。
* **文档与演示**：提供 **1D/2D 演示矩阵**、**基线页（L0/L1）** 与 **官方 10 条配方**；令牌采用 **DTCG** 结构；发布前走 **A11y 自动化校验**。

> 目标效果：**新增或切换风格=改配方，不动组件代码；变更可被验证、可回滚、可复用。**

---

# 二、术语与范围

* **Style Axes（风格轴）**：决定风格“能变什么”。
* **Style Recipe（风格配方）**：七轴取值的组合体，唯一标识。
* **Tokens（令牌）**：跨实现层共享的设计语义与参数。
* **Axis Lock（轴锁）**：局部或全局锁定部分轴不响应配方变化。
* **Responsiveness（响应级别）**：L0–L3 控制“变多少”。
* **Foundations（基础）**：排版、间距、栅格等基础标尺。

---

# 三、七轴定义（v1 枚举与默认）

> **Recipe 语法**：`<mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>`

1. **Mode（光照/对比）**

   * 取值：`light | dark | hc`（高对比）
   * 默认：`light`
   * 规则：`dark` 采用 **非对称映射**（降彩 C、微升亮度 L）；`hc` 走系统色并强化可见元素。

2. **Base（中性色谱 × 对比）**

   * 取值：`neutral-warm | neutral-cool | neutral-true` × `contrast-low | mid | high`
   * 默认：`neutral-true.mid`
   * 规则：仅决定**背景/文本/边界**的大气层与对比基线，不承载品牌感。

3. **Accent（主色策略）**

   * 取值：`mono(hue)`｜`analog(hue)`｜`duo(hueA,hueB)`（v1 不启 triad）
   * 默认：`mono(blue)`
   * 规则：Accent 仅定义**交互与强调**色位；图表分类色来自 DataViz，不复用 Accent。

4. **Tone（强度：饱和/亮度曲线）**

   * 取值：`calm | standard | vivid`
   * 默认：`standard`
   * 规则：以 **OKLCH** 对 `accent` 与部分 `role.*` 做 C/L 调制；`dark` 的 `vivid` 仍需守对比阈。

5. **Density（信息密度/留白）**

   * 取值：`spacious | comfortable | compact`
   * 默认：`comfortable`
   * 规则：映射到行高、控件高、间距、描边粗细、阴影硬度的**系数表**。

6. **Motion（动效节奏/幅度）**

   * 取值：`subtle | standard | expressive`
   * 曲线套餐：`classic | soft | spring`
   * 默认：`standard.classic`
   * 规则：遵循 `prefers-reduced-motion` 降级为“最小必要反馈”。

7. **Surface（表面语言/材质）**

   * 取值：`flat | soft-shadow | glass | neon`（可 `glass+neon` 叠加）
   * 默认：`soft-shadow`
   * 规则：由阴影、混色、模糊、光晕参数组合；与配色解耦。

---

# 四、令牌体系（Tokens）

## 4.1 分层

* **Core（原子）**：跨配方共享的安全资源

  * 颜色：`neutral-0..12`、`<hue>-1..9`、`state.{success|warning|error|info}.1..7`
  * Elevation：`elev-0..5`（阴影/混色/透明度原子）
  * Motion Base：`duration.xs..xl`、`easing.standard|decel|anticipate`、`spring.*`
  * Surface Base：阴影半径/扩散、模糊、光晕
  * Foundations：`typography.*`、`spacing.*`（字阶、字重、行高、字距、间距标尺）

* **Role（语义别名）**：随配方变化

  * `bg.{primary|surface|elevated}`
  * `text.{primary|muted|inverse}`
  * `border.{default|emphasis}`
  * `accent.{default|hover|active}`
  * `state.{success|warning|error|info}`（仅指向 Core 的级别，不重定义色值）

* **Component Aliases（组件别名）**：组件层

  * `button.{fg|bg|border}`、`input.{bg|border|placeholder}`、`card.{bg|shadow}` 等
  * **只引用 Role**，不直连 Core。

## 4.2 命名与格式

* **色相命名**：`cyanScale/purpleScale/...`，避免用 `primary/secondary` 作为色表名。
* **标准化**：采用 **DTCG** 字段（`$value/$type/$description`），便于与设计工具互通。
* **安全前缀**：建议统一 `--th-` 前缀，避免与第三方变量冲突。

---

# 五、可访问性与系统偏好

1. **对比度预算（底线）**

   * 正文/小字 ≥ **4.5:1**；大字 ≥ **3:1**；非文本边界 ≥ **3:1**。
   * 焦点环 **始终 ≥ 3:1**，不受 Tone/Surface/Motion 影响。

2. **Dark 非对称映射**

   * 规则：降低彩度 C、轻升亮度 L，避免霓虹刺眼；边界选取“静态对比”稳定值。

3. **系统偏好**

   * **forced-colors**：为焦点/边界等关键可见元素提供系统色分支。
   * **prefers-reduced-motion**：在动效 tokens 层全局降级（缩短时长、去弹性、禁连续动效）。

4. **CVD 友好**

   * 状态色必须**色+形双编码**（颜色+图标/描边/纹理）。
   * 在 Deuter/Protan/Tritan 模拟下保持可辨识。

---

# 六、Density / Motion / Surface 的参数化

* **Density 系数**

  * `spacious`：行高↑、段距↑、控件高↑、描边↓、阴影柔
  * `comfortable`：默认中性
  * `compact`：行高↓、控件高↓、描边↑、阴影硬
  * 与 `typography/spacing` 映射表绑定（不在此给代码）。

* **Motion Packs**

  * `subtle`：短程、低振幅、无弹性
  * `standard`：均衡，适用于大多数 SaaS
  * `expressive`：高能量、分段节奏（入场→强调→衰减）
  * 曲线套餐：`classic | soft | spring`（只定义曲线族，不绑组件）

* **Surface Packs**

  * `flat`、`soft-shadow`、`glass`、`neon`（可 `glass+neon`）
  * 由阴影/混色/模糊/光晕原子组合；按 `elev-0..5` 定级。

---

# 七、数据可视化色板（独立于 UI）

* **Categorical（分类）**：`cat-8 | cat-12 | cat-20`
* **Sequential（连续）/ Diverging（发散）**：`seq-5 | seq-7`
* **响应**：默认 **L0/L1**，仅随 `Mode` 微调对比度；不受 `Accent/Tone` 影响。
* **色盲友好**：提供替代图案/描边与标注规范。

---

# 八、组件主题响应级别（L0–L3）

| 级别                              | 定义                  | 典型组件                                       | 说明                        |
| ------------------------------- | ------------------- | ------------------------------------------ | ------------------------- |
| **L0（Inert）**                   | 完全不随配方变化            | Logo、BrandBadge、CodeSyntax、DataViz Palette | 品牌/内容基线                   |
| **L1（Color-only）**              | 仅随 Mode/Base/Accent | Typography、Link、Badge                      | 不受 Density/Motion/Surface |
| **L2（Color + Density/Surface）** | 再加密度与表面             | Table、Form/Input、Card、List                 | 不受 Motion                 |
| **L3（Full Reactive）**           | 七轴全响应               | Button、Popover、Tooltip、Dialog、Toast、Nav    | 展现“系统人格”                  |

> 文档与演示中为每组件标注 **Lx 徽章**。

---

# 九、轴锁（Axis Lock）与演示矩阵

* **全局锁**：演示页固定若干轴，仅对比另一些（如只看 `Accent`）。
* **局部锁**：容器/组件可锁定轴（如图表区锁 `Base/Accent`）。
* **优先级**：**局部锁 > 全局配方**，保护品牌/数据可读性。
* **演示矩阵**：

  * 一维：固定 6 轴，只切 1 轴（`Accent`）。
  * 二维：固定 5 轴，切 2 轴（`Mode × Density`）。
  * **基线页**：L0/L1 组件集合，用于视觉回归与快检。

---

# 十、官方配方（v1 建议 10 条）

| 对外命名                  | Recipe ID（内部）                                                                  | 用途          |
| --------------------- | ------------------------------------------------------------------------------ | ----------- |
| Corporate Blue        | `light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow`  | 企业/SaaS 控制台 |
| Corporate Navy Dark   | `dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow`  | 深色企业后台      |
| Minimal White         | `light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat`                  | 文档/内容       |
| Minimal Graphite Dark | `dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat`               | 内容深色        |
| Tech Cyan             | `light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow`  | 开发者平台       |
| Tech Neon Dark        | `dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon` | AI/品牌页      |
| Creative Purple       | `light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring`       | 设计/创意       |
| Creative Aurora Dark  | `dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass`      | 品牌/展示       |
| Classic Neutral       | `light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow`  | 默认通用        |
| High-Contrast Pro     | `hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat`             | 无障碍/高可读     |

---

# 十一、品牌接入（Brand Onboarding）

* **三步法**

  1. 上传品牌主色 → 转换为 OKLCH；
  2. 应用 `C/L` 安全阈 → 生成 5–9 级可访问色阶；
  3. 选择配方，仅替换 `Accent` 与可选 `Tone`。
* **失败回退**：超阈值自动回退到合规近邻并提示原因。
* **建议**：在产品内**同一 Family**可使用多 `Variant`（登录页/后台色调不同），但 **Motion/Density/Surface** 保持一致，维持品牌人格统一。

---

# 十二、治理：版本、目录与导出

## 12.1 版本化

* `tokens@MAJOR.MINOR.PATCH`，`recipe@MAJOR.MINOR.PATCH`；
* **冷区**（Core/Role 基线）慎改；**热区**（Component Aliases）随组件演进；
* 废弃项标记 `deprecated`，保 1 个次要版本周期兼容映射。

## 12.2 目录（建议）

## 推荐目录结构（层为纲，轴进配方）

```
packages/
└─ thui-tokens/
   ├─ core/                      # 冷区：跨配方共享的原子资源
   │  ├─ palettes/               # 颜色色阶：neutralScale/cyanScale/purpleScale/...
   │  ├─ elevation/              # elev-0..5 阴影/混色/透明度原子
   │  ├─ motion-base/            # duration/easing/spring 原子标尺
   │  ├─ surface-base/           # 阴影半径/模糊/光晕等基础原子
   │  └─ foundations/            # typography/spacing 等基础标尺
   │
   ├─ recipes/                   # 配方：七轴取值 + 角色映射（热区）
   │  └─ <recipe-id>/            # 例：light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
   │     ├─ meta.json            # 七轴取值与参数（见下）
   │     ├─ roles.light.json     # Role 映射（bg/text/border/accent/...）
   │     └─ roles.dark.json      # Dark 侧非对称映射
   │
   ├─ aliases/                   # 组件别名（热区）：仅引用 Role，不直连 Core
   │  └─ components/
   │     ├─ button.json
   │     ├─ input.json
   │     └─ card.json
   │
   ├─ motion-packs/              # 轴的“风格包”实现（可与任意配方叠加）
   │  ├─ subtle/                 # 定义推荐的时长范围/缓动族/降级策略
   │  ├─ standard/
   │  └─ expressive/
   │
   ├─ surface-packs/             # 表面风格包（flat/soft-shadow/glass/neon）
   │  ├─ flat/
   │  ├─ soft-shadow/
   │  ├─ glass/
   │  └─ neon/
   │
   ├─ density-presets/           # 密度档位 → 行高/控件高/间距/描边系数
   │  ├─ spacious.json
   │  ├─ comfortable.json
   │  └─ compact.json
   │
   ├─ dataviz/                   # 图表色板：cat-12 / seq-5 等（与 UI 解耦）
   │  ├─ categorical/cat-12.json
   │  └─ sequential/seq-5.json
   │
   └─ index.(ts|json)            # DTCG 聚合导出 & 类型
```

---

## 七轴各自“放哪儿”的精确定位

| 轴                                | 作用          | 放置位置                                                               | 备注                               |                            |
| -------------------------------- | ----------- | ------------------------------------------------------------------ | -------------------------------- | -------------------------- |
| **Mode** (light/dark/hc)         | 光照/对比基线     | `recipes/<id>/roles.light                                          | dark`+`meta.json`                | `hc` 走系统色适配（forced-colors） |
| **Base** (neutral × contrast)    | 中性色与对比氛围    | `core/palettes/neutral*`，在 `meta.json` 选择并设对比等级                    | 只影响 bg/text/border 的大气层          |                            |
| **Accent** (mono/analog/duo)     | 交互/强调色策略    | `core/palettes/<hue>*` + `meta.json` 策略；在 `roles.*` 映射到 `accent.*` | v1 不启 triad                      |                            |
| **Tone** (calm/standard/vivid)   | 饱和/亮度强度曲线   | `recipes/<id>/meta.json`（OKLCH 参数）                                 | 对 Role 做 C/L 调制，Dark 非对称         |                            |
| **Density** (spacious/…/compact) | 信息密度/尺寸节奏   | `density-presets/*` + `foundations/*`                              | 以“系数表”映射到行高/控件高/间距/描边            |                            |
| **Motion** (subtle/…/expressive) | 动效节奏/幅度/曲线族 | `motion-base/*` + `motion-packs/*`                                 | 遵从 `prefers-reduced-motion` 全局降级 |                            |
| **Surface** (flat/…/neon)        | 表面语言/材质/海拔  | `surface-base/*` + `surface-packs/*`                               | 与颜色解耦，可叠加（如 glass+neon）          |                            |

> 关键点：**轴值存于 `recipes/<id>/meta.json`，具体效果体现在 `roles.*` 与 packs 的选择**；色阶/时长/阴影等原子始终在 `core/*`。

---

## 一个最小配方示例（结构示意）

```json
// recipes/light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow/meta.json
{
  "axes": {
    "mode": "light",
    "base": { "neutral": "neutral-true", "contrast": "mid" },
    "accent": { "strategy": "mono", "hues": ["blue"] },
    "tone": "standard",
    "density": "comfortable",
    "motion": { "pack": "standard", "curve": "classic" },
    "surface": ["soft-shadow"]
  },
  "oklchTone": { "calm": { "dC": -0.05, "dL": +0.02 }, "standard": { "dC": 0, "dL": 0 }, "vivid": { "dC": +0.05, "dL": -0.01 } },
  "a11y": { "text": 4.5, "largeText": 3.0, "nonText": 3.0 }
}
```

```json
// recipes/.../roles.light.json（片段）
{
  "bg": { "primary": "{core.palettes.neutral-true.0}", "surface": "{core.palettes.neutral-true.1}" },
  "text": { "primary": "{core.palettes.neutral-true.11}", "muted": "{core.palettes.neutral-true.8}" },
  "border": { "default": "{core.palettes.neutral-true.4}" },
  "accent": { "default": "{core.palettes.blue.6}", "hover": "{core.palettes.blue.7}", "active": "{core.palettes.blue.8}" }
}
```

> 说明：**配方=元数据 + 角色映射**；角色值引用 Core，再由 Tone 参数在构建期/运行期做 OKLCH 调制。

---

## 12.3 导出格式

* **DTCG JSON**（权威交换格式）
* **TS 类型**（开发时安全）
* **CSS Variables**（运行时切换）

---

# 十三、发布前检查清单（强制）

* **A11y 报告**：对比度（正文/大字/边界）、CVD 模拟、焦点环可见性。
* **Dark 非对称**：记录 C/L 调制曲线与阈值。
* **系统偏好**：`forced-colors` 截图、`reduced-motion` 降级截图。
* **DataViz**：图表在 Light/Dark 的可读性对比、水位/阈值标注清晰。
* **Lx/轴锁**：组件默认 Lx 标注、演示矩阵联动正常。
* **命名与映射**：外部名 ↔ Recipe ID 对齐，DTCG 字段完整。
* **回滚方案**：给出上一版配方与 Role 映射的回退路径。

---

# 十四、风险清单（红线）

* **禁止**用运行时拼接动态类名做风格切换（Tree-shaking 失败、难治理）；统一走变量/令牌。
* Dark 模式**禁止**直接复用高彩主色，必须降彩+提亮。
* **禁止**图表与 UI 共用 Accent；图表必须用 DataViz palette。
* 焦点环**不得**受 Tone/Surface/Motion 影响变弱。
* **控制枚举数量**：新增风格优先用 `Tone/Density/Motion` 调制，避免枚举爆炸。

---

# 十五、里程碑路线图

* **v1.0**（当前目标）：七轴体系、三层令牌、10 条官方配方、A11y 前置、DataViz 起步（`cat-12/seq-5`）、演示矩阵与基线页。
* **v1.5**：补充更多 Surface/Motion Packs、品牌接入向导（半自动 L/C 校正）、更细的 Density 系数表、更多 DataViz 套件。
* **v2.0**：在“护栏就绪”的前提下引入 `triad` 实验配方（限定角色占比+Dark 曲线），开放主题（风格配方）市场与生成式助手。

---

# 十六、参考结构图（Mermaid）

```mermaid
flowchart LR
  A[Style Axes<br/>Mode · Base · Accent · Tone · Density · Motion · Surface]
  B[Style Recipe<br/>light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow]
  C[Core Tokens<br/>color scales / states / elevation / motion-base / surface-base / foundations]
  D[Role Tokens<br/>bg/text/border/accent · per-mode]
  E[Component Aliases<br/>button/input/card/...]
  F[L0–L3 & Axis Lock<br/>per component/region]
  G[Docs & Demos<br/>1D/2D Matrix · Baseline · Gallery]
  A --> B --> C --> D --> E --> F --> G
```

---

## 收束

* 这份指南把“主题”系统化为**可组合（七轴）· 可承载（三层令牌）· 可控制（L0–L3/轴锁）· 可验证（A11y/系统偏好）· 可治理（版本/目录/DTCG）**的**风格配方体系**。
