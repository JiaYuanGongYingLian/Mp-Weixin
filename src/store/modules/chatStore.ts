/* eslint-disable import/order */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-25 15:30:59
 * @LastEditTime: 2023-11-16 18:12:34
 * @LastEditors:  Please set LastEditors
 */
import { defineStore } from 'pinia'
import { $toast, imageUrlToFile } from '@/utils/common'
import { Md5 } from 'ts-md5'
import useUserStore from './userStore'
import { useConfigStore } from '..'

let number = 0
const useStore = defineStore('chat', {
  state: () => ({
    jimLoginInfo: null,
    chatHasLogin: false,
    jimUserInfo: {},
    isJimInit: false,
    syncConversation: [],
    conversation: [],
    chatList: [],
    singleInfo: {},
    groupInfo: {},
    groupMemberList: []
  }),
  getters: {
    singleInfoAvatar: (state) => {
      return state.singleInfo.avatar
        ? $config.jimLocalhost + state.singleInfo.avatar
        : $config.$defaultAvatar
    },
    jimUserInfoAvatar: (state) => {
      return state.jimUserInfo.avatar
        ? $config.jimLocalhost + state.jimUserInfo.avatar
        : $config.$defaultAvatar
    }
  },
  actions: {}
})

export default useStore
