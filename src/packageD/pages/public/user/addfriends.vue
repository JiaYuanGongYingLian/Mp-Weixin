<template>
	<view>
		<u-navbar title="添加好友" :background="head_background" :border-bottom="false" :title-bold="true"></u-navbar>
		<view style="width:100%;background-color:rgba(237,237,237);padding:15rpx;">
			<u-search shape="square" v-model="value" height="70" bg-color="#ffffff" color="#909399" :show-action="true" placeholder="账号/手机号" @search="submit" @custom="submit"></u-search>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value:''
			}
		},
		methods: {
			submit(value){
				if(value == ''){
					return false;
				}
				this.$u.api.getfriends({username:this.value}).then(res => {
					if(res.code == 1){
						this.$u.vuex('vuex_user', res.msg);
						route({
							url: 'pages/public/user/usercard',
							params:{
								type:1
							}
						})
					}else{
						this.$u.toast("用户不存在");
					}
				});
			}
		}
	}
</script>

<style>

</style>
