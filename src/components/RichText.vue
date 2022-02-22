<template>
  <QuillEditor @ready='richText' :toolbar='options' ref='richTextRef' contentType='html' theme='snow'></QuillEditor>
</template>

<script>
// 引入富文本组件
import { QuillEditor } from '@vueup/vue-quill'
// 引入富文本样式
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  name: 'RichText',
  // 注册组件
  components: {
    QuillEditor
  },
  data() {
    return {
      options: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote', 'code-block'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        ['clean'] // remove formatting button
      ]
    }
  },
  methods: {
    // 组件加载完成
    richText() {
      // 执行向父组件传递富文本ref
      this.$emit('richTextReady', this.$refs.richTextRef)
    }
  }
}
</script>

<style scoped>

</style>
