import { defineStore } from 'pinia'

const useStore = defineStore('config', {
  state: () => ({
    navBarHeight: 44
  }),
  getters: {
    isEven: (state) => state.count % 2 === 0
  },
  actions: {}
})

export default useStore
