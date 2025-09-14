import { createSlice } from '@reduxjs/toolkit';

export const inputSlice = createSlice({
  name: 'input', // 命名空间，在调用action的时候会默认的设置为action的前缀
  // 初始值
  initialState: {
    poem: '',
    style:'水墨风格',
    ratio:'1:1',
  },
  // 这里的属性会自动的导出为actions，在组件中可以直接通过dispatch进行触发
  reducers: {
    setPoem (state, { payload }) {
      state.poem = payload;
    },
    setStyle (state, { payload }) {
      state.style = payload;
    },
    setRatio (state, { payload }) {
      state.ratio = payload;
  },
});

// 导出actions
export const { increment, decrement } = inputSlice.actions;

export default inputSlice.reducer; // 导出reducer，在创建store时使用到