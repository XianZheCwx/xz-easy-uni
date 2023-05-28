# cascader

uni-app 级联选择组件

可根据具体需求，修改、自定义其他内容。使用之前请确保已查看或阅读<font color=bold>**注意事项**</font>

**特点：**

- 自定义程度高，可根据具体需求，自定义 UI、内容。
- 无第三方依赖，开箱直用。

---

## 一、属性说明

| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :-: |
| modelValue（v-model） | String \| Number | "" | 选中项值 |
| show（v-model） | Boolean | false | 是否显示弹出层 |
| type | "top" \| "bottom" | "bottom" | 弹出层类型 |
| options | Node[] | [] | 级联节点数据 |
| close | Boolean | true | 是否显示弹出层关闭按钮 |
| closeIcon | String | ”closeempty“ | 弹出层 icon 类型 |
| title | String | ”请选择” | 弹出层标题 |
| **props** | Props | {multiple: false, checkStrictly: false, lazy: false, label: "label", value: "value", children: "children", isleaf: "isleaf"} | 自定义配置与级联配置项，<br />详情参考<font color=teal>props 属性说明</font> |

### props 属性说明

|    属性名     |  类型   |   默认值   |                         说明                         |
| :-----------: | :-----: | :--------: | :--------------------------------------------------: |
|     label     | string  |  "label"   |            自定义 label 属性名（节点名）             |
|     value     | string  |  "value"   |            自定义 value 属性名（节点值）             |
|    isleaf     | string  |  "isleaf"  |        自定义 isleaf 属性名（是否是叶子节点）        |
|   children    | string  | "children" |           自定义 children 属性名（子节点）           |
|   multiple    | boolean |   false    |                      是否开启选                      |
| checkStrictly | boolean |   false    | <font color=bold>严格选择模式，支持选择父节点</font> |

---

## 二、事件说明

|  事件名  | 传值类型 | 默认传值 |                            说明                            |
| :------: | :------: | :------: | :--------------------------------------------------------: |
|  close   |          |          |                    级联选择器弹出层关闭                    |
|   open   |          |          |                    级联选择器弹出层打开                    |
| comfrim  |          |          |                     级联选择器点击确定                     |
|  cancel  |          |          |                     级联选择器点击取消                     |
| clickTab |          |          |                    点击选择器面包屑节点                    |
|  finish  |          |          | 节点是否完成，在为叶子节点情况下触发，一般用于**异步加载** |
|  change  |          |          |                      节点是否发生更改                      |

---

## 三、使用示例

## 四、注意事项
