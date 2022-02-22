/**
 * 导出base64转图片工具方法
 * @param src base64
 */
export const base64ToImg = src => {
  if (!src) {
    return
  }
  // base64图片转图片
  const arr = src.substring(src.indexOf(',') + 1)
  let bstr = ''
  try {
    bstr = atob(arr)
  } catch (err) {
  }
  if (bstr.length === 0) {
    return
  }
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  const obj = new Blob([u8arr], { type: 'img' })
  return obj
}
