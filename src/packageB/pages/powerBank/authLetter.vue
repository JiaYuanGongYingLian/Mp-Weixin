<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-16 17:55:33
 * @LastEditTime: 2023-10-25 18:02:37
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/store'

const userStore = useUserStore()
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <!-- <u-navbar
      back-text=""
      title=""
      :title-bold="true"
      v-if="!userStore.isWeChatBrowser"
      color="#fff"
      title-color="#fff"
      :border-bottom="false"
      back-icon-color="#fff"
    ></u-navbar> -->
    <view>
      <h2 style="text-align: center">委托扣款授权书</h2>
      <view class="section">
        本授权书由您向成都黑银积分科技集团有限责任公司（下称“黑银”）出具，具有授权之法律效力。
        请您务必审慎阅读、充分理解本授权书各条款内容，特别是免除或者限制责任的条款，前述条款可能以加粗字体显示，
        您应重点阅读。除非您已阅读并接受本授权书所有条款，否则您无权使用微信支付的自动续费、自动缴费、
        自动扣款等服务。您同意本授权书即视为您已授权黑银代理您向财付通支付科技有限公司（下称“财付通”）申请开通微信支付自动续费和免密支付功能，
        并自愿承担由此导致的一切法律后果。
      </view>
      <view class="section">
        您确认并不可撤销地授权黑银向财付通发出扣款指令，
        财付通即可在不验证您的支付密码、短信动态码等信息的情况下直接从您的银行账户或微信
        支付账户中扣划黑银指定的款项至黑银指定账户。
      </view>
      <view class="section">
        在任何情况下，只要黑银向财付通发出支付指令，财付通就可按照该指令进行资金扣划，
        财付通对黑银的支付指令的正确性、合法性、完整性、
        真实性不承担任何法律责任，相关法律责任由您和黑银自行承担。
      </view>
      <view class="section">
        您在扣款账户内必须预留有足够的资金余额，否则因账户余额不足导致无法及时扣款或扣款错误、失败的，
        一切责任由您自行承担。因不可归责于财付通的事由，导致的不能及时划付款项、划账错误等责任与财付通无关。
      </view>
      <view class="section">
        您确认，因黑银的原因导致您遭受经济损失的，由您与黑银协商解决，与财付通无关。
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background: #fff;
  line-height: 40rpx;
  .section {
    margin-top: 40rpx;
  }
}
</style>
