<template>
  <view>
    <u-navbar title="选择好友" :background="head_background"></u-navbar>
    <u-index-list
      :scrollTop="scrollTop"
      :sticky="false"
      :indexList="vuex_indexList.letterArr"
    >
      <view v-for="(item, index) in vuex_indexList.list" :key="index">
        <u-index-anchor :use-slot="true" :index="item.letter">
          <view class="u-m-l-10">{{ item.letter }}</view>
        </u-index-anchor>
        <view
          class="list-wrap u-border-bottom"
          v-for="(item1, index) in item.data"
          :key="index"
        >
          <view class="body-item">
            <u-checkbox
              v-model="item1.checked"
              shape="circle"
              :name="item1.id"
              :key="item1.id"
              @change="checkbox"
            ></u-checkbox>
            <u-lazy-load
              class="images"
              border-radius="8"
              height="100"
              :image="item1.avatar"
              threshold="300"
              img-mode="widthFix"
            ></u-lazy-load>
            <view class="content">
              <view class="title">
                <view>{{ item1.nickname }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-index-list>
    <view class="bottom">
      <u-button type="primary" size="mini" class="button"
        >完成{{
          addlist.length == 0 ? '' : '    (' + addlist.length + ')'
        }}</u-button
      >
    </view>
  </view>
</template>

<script>
import { route } from '@/utils/common'

export default {
  data() {
    return {
      scrollTop: 0,
      offset_top: 0,
      addlist: []
    }
  },
  onLoad() {
    // var list = this.vuex_indexList.map(res => {
    // 	console.log(res)
    // });
    // console.log(this.vuex_indexList)
  },
  methods: {
    checkbox(e) {
      const list = this.addlist
      if (this.addlist.includes(e.name)) {
        const index = this.addlist.indexOf(e.name)
        this.addlist.splice(index, 1)
      } else {
        this.addlist.push(e.name)
      }
    }
  }
}
</script>

<style lang="scss">
.list-wrap {
  padding: 18rpx 30rpx;
  .body-item {
    display: flex;
    height: auto;
    width: 100%;
    color: #333;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
      .title {
        display: flex;
        padding-top: 10rpx;
        font-size: 35rpx;
        line-height: 40rpx;
        font-weight: bold;
      }
    }
  }
}

.body-item .images {
  width: 73rpx;
  height: 73rpx;
}

.bottom {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 150rpx;
  background-color: #f4f4f5;
  .button {
    width: 130rpx;
    height: 60rpx;
    margin: 10rpx 20rpx;
  }
}
</style>
