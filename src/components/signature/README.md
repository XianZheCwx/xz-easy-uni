# signature

uniapp 签名功能组件

**特点：**

- 自定义程度高，可根据具体需求，自定义 UI、内容。
- 无第三方依赖，开箱直用。
- 画布签名支持 base64 转码输出。
- 支持将已有签名再嵌入画布内。

---

## 一、使用示例

**1)、基本使用**

```vue

<template>
    <view class="signature">
        <view class="signature-label">申请人签名</view>
        <signature @save="signatureEvent" />
    </view>
</template>

<script lang="ts" setup>
    import { computed, reactive, onMounted } from "vue";

    const formOpts = reactive({
        model: {
            signature: ""
        }
    });

    function signatureEvent(base64: string) {
        formOpts.model.signature = base64;
    }
</script>
```

**2)、搭配 v-model 使用**

`v-model` 支持将已有的签名嵌入进画布中，注意签名必须是经过 base64 编码的图片，同时在点击保存后将同步新签名。

**如果需要保存已有签名且禁用画布，请将 `v-model` 与 `disable` 属性搭配使用。**

```vue

<template>
    <view class="signature">
        <view class="signature-label">申请人签名</view>
        <signature v-model="formOpts.model.signature" />
    </view>
</template>

<script lang="ts" setup>
    import { computed, reactive, onMounted } from "vue";

    const formOpts = reactive({
        model: {
            signature: "data:image/png;base64,............."
        }
    });
</script>
```

---

## 二、属性说明：

|         属性名         |   类型    |    默认值     |    说明    |
|:-------------------:|:-------:|:----------:|:--------:|
| modelValue(v-model) | string  |    `""`    |    值     |
|   backgroundColor   | string  | `#F0F0F0`  |  画布背景颜色  |
|     cancelText      | string  |   `"清空"`   |  取消按钮文案  |
|     confirmText     | string  |   `"保存"`   |  确定按钮文案  |
|      fileType       | `"png"  |  "jepg"`   | `"png"`  | 文件类型 |
|      disabled       | boolean |  `false`   |   是否禁用   |
|        width        | string  |  `"100%"`  |   画布宽度   |
|       height        | string  | `"200px"`  |   画布高度   |
|      lineWidth      | number  |    `5`     | 画笔宽度（大小） |
|      penColor       | string  |   `#000`   |   画笔颜色   |
|     placeholder     | string  | `"滑动此处签名"` |  签名占位内容  |
|         tip         | String  |    `""`    |  签名提示贴士  |
|       zIndex        | number  |    `99`    |  画布优先层级  |
