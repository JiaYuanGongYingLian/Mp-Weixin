<template>
	<view>
		<u-navbar title="新的朋友" :background="head_background" :border-bottom="false" :title-bold="true">
			<view slot="right">
				<u-icon class="u-m-r-30" name="plus-circle" size="40" @click="addfriends"></u-icon>
			</view>
		</u-navbar>
		<u-swipe-action class="u-border-bottom" @click="click" :options="options" :index="index" v-for="(item,index) in vuex_addfriendslist">
			<view class="list-wrap">
				<view class="body-item">
					<u-lazy-load class="images" border-radius="8" height="100" :image="item.avatar" threshold="300" img-mode="widthFix"></u-lazy-load>
					<view class="content">
						<view class="title">
							<view>{{item.nickname}}</view>
						</view>
						<view class="head_right">
							<text v-if="item.status == 1">已同意</text>
							<u-tag v-else text="查看" type="success" border-color="#909399" bg-color="#f3f4f6" color="#909399" @click="usercard(item.username)" />
						</view>
					</view>
				</view>
			</view>
		</u-swipe-action>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				]
			}
		},
		onLoad() {
			this.$u.api.getfriendlist().then(res => {
				console.log("更新好友数据")
				if(res.code == 1){
					this.$u.vuex('vuex_addfriendslist', res.data.addfriends);
				}
			});
		},
		methods: {
			addfriends(){
				route({
					url: 'pages/public/user/addfriends'
				})
			},
			click(index, index1){
				this.$socket.delMessageList(this.vuex_friendslist[index].targetId,this.vuex_friendslist[index].type,index);
				// console.log(this.vuex_friendslist[index])
			},
			usercard(username){
				this.$u.api.getfriends({username:username}).then(res => {
					if(res.code == 1){
						this.$u.vuex('vuex_user', res.msg);
						route({
							url: 'pages/public/user/usercard',
							params:{
								type:2
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

<style lang="scss">
	page{
		background-color: #ededed;
	}
	.list-wrap {
		background-color: #FFFFFF;
		padding:18rpx 30rpx;
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
				.head_right {
					position: absolute;
					top: 25rpx;
					right:220rpx;
					font-size: 25rpx;
					color: $u-tips-color;
				}
			}
		}
	}
	
	.body-item .images {
		width: 73rpx;
		// flex: 0 0 100rpx;
		height: 73rpx;
	}
</style>
