
	export default {
		props:{
			url:{
				type:String,
				default(){
					return ''
				}
			},
			clipType:{
				type:String,
				default(){
					return 'all' // check  dray  all
				}
			},
			clipTemps:{
				type:Array,
				default(){
					return ['1-1','4-3','3-4','16-9','9-16']
				}
			},
			minScale:{
				type:Number,
				default(){
					return 0.2 //
				}
			},
			maxScale:{
				type:Number,
				default(){
					return 5 // 
				}
			},
			outputType:{
				type:String,
				default(){
					return 'save' //  'save' 'url'
				}
			},
			check:{
				type:Boolean,
				default(){
					return true 
				}
			},
		},
		computed:{
			oldImg(){
				let url = ''
				 url = this.url
				if(!url && this.img){
					url = this.img
				}
				return url
			},
			clipTempsListBuild(){
				let cType = this.clipType
				let allList = this.clipTempsList 
				let inputClipTemps = this.clipTemps
				let list = []
				
				switch (cType){
					case 'check':
						if(Array.isArray(inputClipTemps) && Array.isArray(allList)){
							list = allList.filter((item) =>{
								if(inputClipTemps.indexOf(item.no) !== -1 && item.no !== '0-0'){
									return item
								}
							})
						}
						break;
					case 'all':
						if(Array.isArray(allList)){
							list = allList.map((item) =>{
								return item
							})
						}
						break;
					default:
						break;
				}
				
				return list
			},
			systemInfo(){
				let info = uni.getSystemInfoSync()
				
				return info
				
			},
			windowHeight(){
				let height = 10
				if(this.systemInfo){
					height = this.systemInfo.windowHeight - this.bottomBarHeight
				}
				return height
			},
			windowWidth(){
				let width = 10
				if(this.systemInfo){
					width = this.systemInfo.windowWidth
				}
				return width
			},
			pixelRatio(){
				let pixelRatio = 2
				if(this.systemInfo){
					pixelRatio = this.systemInfo.pixelRatio
				}
				return pixelRatio
			},
			movableAreaStyle(){
				let style = {
					// width:`${this.windowWidth}px`,
					// height:`${this.windowHeight}px`,
					width:`${this.imgScaleLayoutStyle.layoutWidth}px`,
					height:`${this.imgScaleLayoutStyle.layoutHeight}px`,
					position: "fixed",
					top:`${this.imgScaleLayoutStyle.layoutTop}px`,
					left:`${this.imgScaleLayoutStyle.layoutLeft}px`
					
				}
				return style
			},
			touchMovableAreaStyle(){
				let style = {
					width:`${this.windowWidth}px`,
					height:`${this.windowHeight}px`,
					position: "fixed",
					top:0,
					left:0
					
				}
				return style
			},
			touchMovableViewStyle(){
				let style = {
					width:`${this.windowWidth}px`,
					height:`${this.windowHeight}px`
					
				}
				return style
			},
			windowWToH(){
				// 宽高比
				let WToH = 1
				if(this.windowWidth && this.windowHeight){
					WToH = this.windowWidth / this.windowHeight
				}
				return WToH
			},
			
			imgOldWToH(){
				// 宽高比
				let WToH = 1
				if(this.old.width && this.old.height){
					WToH = this.old.width / this.old.height
				}
				return WToH
			},
			imgChangeInfo(){
				let load = this.initStatus
				let info = {
					width: 0,
					height:0
				}
				if(!load){
					return info
				}
				if(this.imgScaleType == 'mask'){
					this.scale = 1
				}
				
				let maskWtoH = this.clipMask.width / this.clipMask.height
				
					if(this.imgOldWToH > 1){
						// 横图
						if(maskWtoH > 1){
							// 剪裁横图
							info['min-height'] = this.imgOldWToH > maskWtoH ? this.clipMask.height : this.getScale(this.clipMask.width,null,null).width;
							info['min-width'] = this.imgOldWToH > maskWtoH ? this.getScale(null,this.clipMask.height,null).width : this.clipMask.width;
						}else {
							info['min-height'] = this.clipMask.height;
							info['min-width'] = this.getScale(null,this.clipMask.height,null).width;
						}
						
					}else if(this.imgOldWToH == 1){
						// 方图
						if(maskWtoH > 1){
							// 剪裁横图
							info['min-height'] = this.clipMask.width;
							info['min-width'] = this.clipMask.width;
						}else {
							info['min-height'] = this.clipMask.height;
							info['min-width'] = this.getScale(null,this.clipMask.height,null).width;
						}
						
					}else if(this.imgOldWToH < 1){
						// 竖版
						if(maskWtoH < 1){
							// 剪裁竖图
							info['min-height'] = this.imgOldWToH > maskWtoH ? this.clipMask.height : this.getScale(this.clipMask.width,null,null).width;
							info['min-width'] = this.imgOldWToH > maskWtoH ? this.getScale(null,this.clipMask.height,null).width : this.clipMask.width;
						}else {
							
							info['min-height'] = this.getScale(this.clipMask.width,null,null).height;
							info['min-width'] = this.clipMask.width;
						}
						
					} 
					// this.scale = 1
					info.width = info['min-width']
					info.height = info['min-height']
					this.old.width = info['min-width']
					this.old.height = info['min-height']
					
					
				if(this.imgScaleType == 'touchs' && this.getScale(null,null,this.scale).width >=  info['min-width'] && this.getScale(null,null,this.scale).height >= info['min-height']){
					info.width = this.getScale(null,null,this.scale).width;
					info.height = this.getScale(null,null,this.scale).height;
					// info['min-width'] = this.getScale(null,null,this.scale).width;
					// info['min-height'] = this.getScale(null,null,this.scale).height;
					
					this.old.width = this.getScale(null,null,this.scale).width
					this.old.height = this.getScale(null,null,this.scale).height
				}else if(this.imgScaleType == 'move'){
					info.width = this.getScale(null,null,this.scale).width;
					info.height = this.getScale(null,null,this.scale).height;
					// info['min-width'] = this.getScale(null,null,this.scale).width;
					// info['min-height'] = this.getScale(null,null,this.scale).height;
					
					this.old.width = this.getScale(null,null,this.scale).width
					this.old.height = this.getScale(null,null,this.scale).height
				}
				
				console.log('imgChangeInfo',info)
				return info
			},
			
			imgChangeStyle(){
				let style = {
					width:this.imgChangeInfo.width + 'px',
					height:this.imgChangeInfo.height + 'px',
				}
				return style
			},
			imgScaleLayoutStyle(){
				// let imgInfo =
				// 图片缩放后 可拖动区域的大小
				
				let mask = this.clipMask
				let load = this.initStatus
					let style = {}
					let layoutWidth = this.old.width;
					let layoutHeight = this.old.height;
				layoutWidth = this.imgChangeInfo.width * 2 - mask.width;
				 layoutHeight = this.imgChangeInfo.height * 2 - mask.height;
				 style = {
					width:this.imgChangeInfo.width,
					height:this.imgChangeInfo.height,
					layoutWidth:layoutWidth,
					layoutHeight:layoutHeight,
					layoutTop: (this.windowHeight - layoutHeight)/2,
					layoutLeft:(this.windowWidth - layoutWidth)/2,
					maxx:(layoutWidth - mask.width) / 2,
					maxy:(layoutHeight - mask.height )/ 2,
					mixx:((layoutWidth - mask.width) / 2) -  (this.imgChangeInfo.width - mask.width),
					mixy: ((layoutHeight - mask.height )/ 2) - (this.imgChangeInfo.height - mask.height),
				}
				
				if(this.imgScaleType !== 'move' || this.imgScaleType !== 'touchs'){
					this.y =  (layoutHeight - this.imgChangeInfo.height) / 2
					this.x = (layoutWidth - this.imgChangeInfo.width) / 2
					this.old.x = (layoutWidth - this.imgChangeInfo.width) / 2
					this.old.y = (layoutHeight - this.imgChangeInfo.height) / 2
				}
				
				console.log('imgScaleLayoutStyle',style)
				return style
				
			},
			maskPoints(){
				let w = this.clipMask.width
				let h = this.clipMask.height
				let width = this.windowWidth;
				let height = this.windowHeight;
				let rectw =  width >= w ? (width - w) / 2 : 100
				let recth =  height >= h ? (height - h) / 2 : 100
				let color = "#000000"
				let tl = {x:rectw,y:recth} 
				let tr = {x:w + rectw,y:recth}
				let br = {x:w + rectw ,y:recth + h}
				let bl = {x:rectw,y:recth + h}
				
				return {tl,tr,br,bl}
			}
		},
		data() {
			return {
				maskCanvas:null,
				clipCanvas:null,
				disabled:false,
				startChange:{x:0,y:0},
				maskScale:false,
				onDraw:false,
				imgScaleType:"init",  // mask  touchs  init move
				initStatus:false,
				onTouchs:false,
				width:0,
				height:0,
				clip:false,
				maskMinWidth:200,
				clipTempsList:[{
					value:"1-1",
					label:"1:1"
				},{
					value:"4-3",
					label:"4:3"
				},{
					value:"3-4",
					label:"3:4"
				},{
					value:"16-9",
					label:"16:9"
				},{
					value:"9-16",
					label:"9:16"
				}],
				activeClipTemp:'',
				bottomBarHeight:80,  // 底部按钮区域高度
				clipUrl:'', // 剪裁输出图片的临时路径
			};
		}, 
		methods:{
			getScale(w = '',h = '',s = ''){
				// 根据 图片已知的 宽、高、缩放比例 求其他值
				// w 宽度  h 高度  s 缩放比例
				// 根据参数 求 完整 宽高和缩放比例
				let ow = this.old.width
				let oh = this.old.height
				let oslen = Math.sqrt( Math.pow( ow ,2) +  Math.pow(oh,2) ) // 原始斜边长
				let scale = s;
				let width = w;
				let height = h;
				if(!height && width !== null && !isNaN(Number(width))){
					console.log('width',width)
					height =  width * (oh/ow)
				}
				if(!width && height !== null &&  !isNaN(Number(height))){
					console.log('height',height)
					width = height * (ow/oh)
				}
				if(scale && !isNaN(Number(scale))){
					height =scale * oslen * (oh / oslen)
					width = scale * oslen * (ow / oslen)
					
						// height =Math.round(scale * oslen * (oh / oslen)) 
						// width = Math.round(scale * oslen * (ow / oslen))
				}else if(width && height && !isNaN(Number(width)) && !isNaN(Number(height)) && !scale){
					scale = Math.sqrt( Math.pow( width ,2) + Math.pow(height,2) ) /  Math.sqrt( Math.pow(ow,2) + Math.pow(oh,2) );
					// 勾股定理求缩放比例
				}
				console.log('getScale:',w,h,s,{width,height,scale},ow,oh)
				return {
					scale,width,height
				}
			},
			drawMasking(newW,newH,status){
				// 绘制剪裁框蒙版 status ，停止缩放 最后一次重绘制。
				let self = this
					self.onDraw = true
				let ctx  = uni.createCanvasContext('masking-out', this)
				ctx.width = this.windowWidth
				ctx.height =this.windowHeight
				this.maskCanvas = ctx 
				ctx.setGlobalAlpha(0.6)
				//绘制蒙版宫格：
				let x = 0;
				let y = 0;
				let w =newW ||  this.clipMask.width
				let h =newH ||  this.clipMask.height
				let width = ctx.width;
				let height = ctx.height;
				let rectw =  ctx.width > w ? (ctx.width - w) /2 : 0
				let recth =  ctx.height > h ? (ctx.height - h) / 2 : 0
				let color = "#000000"
				let tl = {x:x+rectw,y:recth} 
				let tr = {x:w + rectw,y:recth}
				let br = {x:w + rectw ,y:recth + h}
				let bl = {x:x+rectw,y:recth + h}
				
				// 遮罩
				 ctx.beginPath();    // 新建一条路径,图形绘制命令被指向到路径上生成路径。
				    ctx.moveTo(0, 0);  //移动笔触 将笔触移动到指定的坐标 x 以及 y 上。
				    ctx.lineTo(this.windowWidth, 0);
					ctx.lineTo(this.windowWidth, this.windowHeight);
					ctx.lineTo(this.windowWidth - rectw , this.windowHeight);
					ctx.lineTo(this.windowWidth - rectw , this.windowHeight - recth - h);
					ctx.lineTo(this.windowWidth - rectw - w, this.windowHeight - recth - h);
					ctx.lineTo(this.windowWidth - rectw - w, this.windowHeight - recth );
					ctx.lineTo(this.windowWidth - rectw, this.windowHeight - recth );
					ctx.lineTo(this.windowWidth - rectw, this.windowHeight );
					ctx.lineTo(0, this.windowHeight );
				    ctx.lineTo(0, 0);
				ctx.setFillStyle(color)
				    ctx.fill(); 
				// 外围九宫格 线条
				let lt = {
					x:0,
				}
				let lineColor = "#ffffff"
				let lineWidth = 1
				ctx.setGlobalAlpha(0.9)
				
				ctx.setLineDash([2, 2], 2);
				ctx.beginPath()
				ctx.moveTo(tl.x, tl.y)
				ctx.lineTo(tr.x, tr.y)
				ctx.lineTo(br.x, br.y)
				ctx.lineTo(bl.x, bl.y)
				ctx.lineTo(tl.x, tl.y)
				ctx.setStrokeStyle(lineColor)
				ctx.setLineWidth(lineWidth)
				ctx.stroke()
				ctx.save()
				// 角柄
				let toolWidth = 8 
				let lineLen = 20
				let gap = 8 
				
				ctx.setLineDash([0, 0], 0);
				// tl
				ctx.beginPath()
				ctx.moveTo(tl.x + gap + lineLen, tl.y + gap )
				ctx.lineTo(tl.x + gap , tl.y + gap)
				ctx.lineTo(tl.x + gap , tl.y + gap + lineLen)
				
				ctx.moveTo(tr.x - gap - lineLen, tr.y + gap)
				ctx.lineTo(tr.x - gap  , tr.y + gap)
				ctx.lineTo(tr.x - gap  , tr.y + gap +  lineLen)
				
				
				ctx.moveTo(br.x - gap - lineLen , br.y - gap)
				ctx.lineTo(br.x - gap , br.y - gap)
				ctx.lineTo(br.x - gap , br.y - gap - lineLen)
				
				
				//
				ctx.moveTo(bl.x + gap  + lineLen, bl.y - gap)
				ctx.lineTo(bl.x + gap  , bl.y - gap)
				ctx.lineTo(bl.x + gap , bl.y - gap - lineLen)
				//
				ctx.setStrokeStyle(lineColor)
				ctx.setLineWidth(toolWidth)
				ctx.stroke()
				
				
				
				// 角柄结束
				
				// 中心九宫格
				
				ctx.setLineDash([2, 2], 2);
				ctx.beginPath()
				ctx.moveTo(rectw, recth + (h/3))
				ctx.lineTo(rectw + w, recth + (h/3))
				ctx.moveTo(rectw, recth + ((h/3) * 2))
				ctx.lineTo(rectw + w, recth + ((h/3) * 2))
				ctx.moveTo(rectw + (w/3), recth)
				ctx.lineTo(rectw + (w/3), recth + h)
				ctx.moveTo(rectw + ((w/3) * 2), recth)
				ctx.lineTo(rectw + ((w/3) * 2), recth + h)
				ctx.setStrokeStyle(lineColor)
				ctx.setLineWidth(lineWidth)
				ctx.stroke()
				
				ctx.save()
				// 四个拖拽角
				ctx.setFillStyle('#f2f2f2')
				ctx.setTextAlign="center"
				ctx.setTextBaseline="middle"
				ctx.setFontSize(12)
				ctx.fillText(`${Math.round(w)} x${Math.round(h)}`,20,20)
				ctx.save()
				// 底部 工具栏背景
				// 遮罩
				// ctx.setGlobalAlpha(1)
				//  ctx.beginPath(); 
				// let bottomY =  this.windowHeight - this.bottomBarHeight
				// ctx.moveTo(0, bottomY);  //移动笔触 将笔触移动到指定的坐标 x 以及 y 上。
				// ctx.lineTo(this.windowWidth, bottomY);
				// ctx.lineTo(this.windowWidth, this.windowHeight);
				// ctx.lineTo(0, this.windowHeight);
				// ctx.lineTo(0,bottomY);
				// ctx.setFillStyle('#000000')
				// ctx.fill(); 
				// ctx.save()
				
				ctx.draw(false,()=>{
					if(status == 'end'){
						 // self.clipMask.width = Math.round(w);
						 // self.clipMask.height = Math.round(h);
						 
						self.$set(self.clipMask,'width',Math.round(w))
						self.$set(self.clipMask,'height',Math.round(h))
						console.log('draw end:',self.clipMask)
						self.scale = 1
					} 
					
					console.log('图片:',this.x,this.y,this.imgChangeInfo.width,this.imgChangeInfo.height)
					console.log('缩放容器 :',this.imgScaleLayoutStyle.layoutTop,this.imgScaleLayoutStyle.layoutLeft,this.imgScaleLayoutStyle.layoutWidth,this.imgScaleLayoutStyle.layoutHeight)
					console.log('剪裁框 :',this.clipMask.width,this.clipMask.height,this.windowWidth,this.windowHeight)
						self.onDraw = false
				})
				
				
			},
			checkImage(){
				console.log(this.oldImg)
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function (res) {
						console.log(JSON.stringify(res.tempFilePaths));
						let url = ''
						if(Array.isArray(res.tempFilePaths)){
							url = res.tempFilePaths[0]
						}
						// self.img = url
						self.$set(self,'img',url)
						self.initCutLayout()
						
					}
				});
			},
			 onTouchstart(e){
				 // 触屏位置
					let x = e.touches[0].clientX
					let y = e.touches[0].clientY
				 	console.log('onTouchstart',e,e.touches.length)
					if(y > (this.windowHeight) || !this.oldImg){
						if(this.check && !this.oldImg){
							this.checkImage()
						}else{
							return
						}
					}
					if(e.touches.length == 1){
						this.onScaleTool(e.touches[0].clientX,e.touches[0].clientY)
						setTimeout(()=>{
							if(this.imgScaleType != 'touchs'){
								this.$set(this.startChange,'x',x)
								this.$set(this.startChange,'y',y)
							}
						},20)
					}else if(e.touches.length > 1){
						this.imgScaleType = 'touchs'
					}
			 },
			async onTouchmove(e){
				// 手指移动
				 let self = this
				 
				 if(e.touches.length > 1  ||  (e.touches.length == 1 && e.touches[0].clientY > (this.windowHeight )) || (!this.oldImg)){
					 return 
				 }else if(this.imgScaleType != 'touchs'){
					 console.log("onTouchmove:",e.touches , this.point,"是否绘制遮罩：",self.onDraw,'缩放类型',this.imgScaleType)
					 if(e.touches[0].clientY > this.windowHeight){
						 return
					 }else{
						 
						 if(this.point == 'none' && e.touches.length == 1 && this.imgScaleType == 'move'){
							 
							 let start = this.startChange
							 let x = e.touches[0].clientX
							 let y = e.touches[0].clientY
							 let maxx = this.imgScaleLayoutStyle.maxx
							 let maxy = this.imgScaleLayoutStyle.maxy
							 let mixx = this.imgScaleLayoutStyle.mixx
							 let mixy = this.imgScaleLayoutStyle.mixy
							 let toX = (Math.round(x - start.x + this.old.x)) > maxx ? maxx : (Math.round(x - start.x + this.old.x)) <  mixx ?  mixx : (Math.round(x - start.x + this.old.x))
							 let toY = (Math.round(y - start.y + this.old.y)) > maxy ? maxy : (Math.round(y - start.y + this.old.y)) <  mixy ?  mixy : (Math.round(y - start.y + this.old.y))
							 self.x = toX
							 self.y = toY
							 
							 console.log('1.偏移量：',x - start.x,y - start.y,'移动到',toX,toY)
							 console.log('2.图片xy:',this.x,this.y,'宽高',this.imgChangeInfo.width,this.imgChangeInfo.height)
							 // console.log('3.缩放容器 top、left width height:',this.imgScaleLayoutStyle.layoutTop,this.imgScaleLayoutStyle.layoutLeft,this.imgScaleLayoutStyle.layoutWidth,this.imgScaleLayoutStyle.layoutHeight)
							 // console.log('4.剪裁框 :',this.clipMask.width,this.clipMask.height,this.windowWidth,this.windowHeight)
							 console.log('5.位移限制x:',maxx,mixx,'y',maxy,mixy)
						 }else if(e.touches.length == 1 && this.point !== 'none' && !self.onDraw && this.imgScaleType == 'mask'){
						 	self.onScaleMove( e.changedTouches[0].clientX, e.changedTouches[0].clientY)
						 } 
					 }
					
				 }
				 
				 
				 
			 },
			 touchEnd(e){
				 // 触屏结束
				 let x = e.changedTouches[0].clientX
				 let y = e.changedTouches[0].clientY
				 let self = this
				 if((e.changedTouches.length == 1 && y > (this.windowHeight)) || !this.oldImg){
				 	return 
				 }
				  console.log('end:',this.point,this.onTouchs,this.imgScaleType,e)
				 if(self.onTouchs){
					 self.onTouchs = false
					 self.old.scale = this.scale
				 }else if(self.point !== 'none'){
					 self.onScaleMove( x,y,'end')
					 console.log('end:',this.point,this.onTouchs)
				 }else if(this.point == 'none' && e.changedTouches.length == 1){
					 let start = this.startChange
					 let maxx = this.imgScaleLayoutStyle.maxx
					 let maxy = this.imgScaleLayoutStyle.maxy
					 let mixx = this.imgScaleLayoutStyle.mixx
					 let mixy = this.imgScaleLayoutStyle.mixy
					 let toX = (Math.round(x - start.x + this.old.x)) > maxx ? maxx : (Math.round(x - start.x + this.old.x)) <  mixx ?  mixx : (Math.round(x - start.x + this.old.x))
					 let toY = (Math.round(y - start.y + this.old.y)) > maxy ? maxy : (Math.round(y - start.y + this.old.y)) <  mixy ?  mixy : (Math.round(y - start.y + this.old.y))
					 this.$set(this.old,'x', toX)
					 this.$set(this.old,'y', toY)
					 console.log('1.偏移量：',x - start.x,y - start.y,'移动到',toX,toY)
					 console.log('2.图片xy:',this.x,this.y,'宽高',this.imgChangeInfo.width,this.imgChangeInfo.height)
					 console.log('3.缩放容器 top、left width height:',this.imgScaleLayoutStyle.layoutTop,this.imgScaleLayoutStyle.layoutLeft,this.imgScaleLayoutStyle.layoutWidth,this.imgScaleLayoutStyle.layoutHeight)
					 console.log('4.剪裁框 :',this.clipMask.width,this.clipMask.height,this.windowWidth,this.windowHeight)
					 console.log('5.位移限制x:',maxx,mixx,'y',maxy,mixy)
				 }
				 
				 
			 },
			 onScaleMove(x,y,status){
				 // 剪裁框缩放移动
				 let self = this
				 // console.log(this.disabled,x,y)
				 let cx = this.windowWidth / 2
				 let cy = this.windowHeight / 2
				 let start = this.startChange
				 let point = this.point
				 x = x;
				 y = y;
				 let w =  0
				 let h = 0
				 switch (point){
					 // 偏移量
				 	case 'tl':
						w = start.x - x
						h = start.y - y
				 		break;
				 	case 'tr':
						w = x - start.x
						h = start.y - y
				 		break;
				 	case 'br':
						w = x - start.x
						h = y - start.y
				 		break;
				 	case 'bl':
						w = start.x - x
						h = y - start.y
				 		break;
						
				 	default:
						return 
				 		break;
				 }
				 
				 let mixSize = this.maskMinWidth
				 let maskWidth = Math.round((this.clipMask.width + w + w) < mixSize ? mixSize :  (this.clipMask.width + w + w) > this.windowWidth ? this.windowWidth : (this.clipMask.width + w + w));
				 let maskHeight = Math.round((this.clipMask.height + h + h) < mixSize ? mixSize :  (this.clipMask.height + h + h) > this.windowHeight ? this.windowHeight : (this.clipMask.height + h + h));
				 
				 maskWidth =  Math.round(maskWidth);
				 maskHeight = Math.round(maskHeight);
				 if((!this.onDraw || status == 'end') ){
					 self.drawMasking(maskWidth,maskHeight,status)
				 }
				 
				  
				 
			 },
			onScaleTool(x,y){
				// 单手指移动的位置，剪裁缩放 或 移动，剪裁缩放 确定 四角哪个缩放手柄。
				let isScaleTool = 'none'
				let w = this.clipMask.width
				let h = this.clipMask.height
				let width = this.windowWidth;
				let height = this.windowHeight;
				let rectw =  width >= w ? (width - w) / 2 : 100
				let recth =  height >= h ? (height - h) / 2 : 100
				let color = "#000000"
				let tl = {x:rectw,y:recth} 
				let tr = {x:w + rectw,y:recth}
				let br = {x:w + rectw ,y:recth + h}
				let bl = {x:rectw,y:recth + h}
				
				let toolWidth = 40
				let isCheck = function(e){
					let self = this
					let touchSize = 40
					let side = 20
					let point = ''
					// 判断点击点 是否在 遮罩 剪裁框四个顶点 touchSize 见方范围。
					// console.log(x,y,w,h,tl,tr,br,bl)
					if(e.x <= ( tl.x + touchSize) && e.x >= (tl.x - side) && e.y <= (tl.y + touchSize) && e.y >= (tl.y - side)){
						point = 'tl'
					}else if(e.x <= ( tr.x + side ) && e.x >= (tr.x - touchSize) && e.y <= (tr.y + touchSize) && e.y >=( tr.y - side)){
						point = 'tr'
					}else if(e.x <= ( br.x + side) && e.x >= (br.x - touchSize) && e.y <= (br.y + side) && e.y >=( br.y - touchSize)){
						point = 'br'
					}else if(e.x <= ( bl.x + touchSize) && e.x >= (bl.x - side) && e.y <= (bl.y + side) && e.y >=( bl.y - touchSize)){
						point = 'bl'
					}else{
						point = 'none'
					}
					return point
				}
				isScaleTool = isCheck({x:x,y:y})
				console.log('onScaleTool : ',this.onDraw,isScaleTool)
				switch (isScaleTool){
					case 'none':
						this.imgScaleType = 'move'
						break;
					default:
						this.imgScaleType = 'mask'
						break;
				}
				this.point = isScaleTool
				
				return isScaleTool
			},
			onTouchScale(scale){
				// 双手指捏合缩放
				 console.log('touchs Scale:',scale)
				 let s = scale.detail.scale
				 this.onTouchs = true
				 if(this.getScale(null,null,s).width < this.clipMask.width || this.getScale(null,null,s).height < this.clipMask.height || !this.oldImg){
					 return 
				 }else{
					 s = s.toFixed(2)
					 this.imgScaleType = 'touchs'
					 this.scale = (s <= 0.5 ? 0.5 : s >= 3 ? 3 : s)
				 }
				 
			},
			onCheckClipType(e){
				this.activeClipTemp = e && e.value  ? e.value : ''
				let wh = this.activeClipTemp.split('-')
				console.log(wh)
				let width = this.windowWidth * 0.618
				let height = width * (wh[1] / wh[0])
				if(this.activeClipTemp !== '0-0' && this.activeClipTemp !== ''){
					this.imgScaleType = 'mask'
					this.drawMasking(Math.round(width),Math.round(height),'end') 
				}
				
			},
			
			onClip(){
				// 确定剪裁
				let self = this
				 self.clip = true
				console.log('on clip', this.x,this.y)
				let sizebw = Math.sqrt( Math.pow( this.imgChangeInfo.width ,2) + Math.pow(this.imgChangeInfo.height,2) );
				let sizeOldSize = Math.sqrt( Math.pow( this.old.oldWidth ,2) + Math.pow(this.old.oldHeight,2) );
				let size = sizebw / sizeOldSize
				let maskClipw =  this.clipMask.width  / size
				let maskCliph  = this.clipMask.height  / size
				
				let  cilpx = ((this.imgScaleLayoutStyle.layoutWidth - this.clipMask.width) / 2 - this.x) / size
				let  cilpy =((this.imgScaleLayoutStyle.layoutHeight - this.clipMask.height) / 2 - this.y) / size
				this.width = this.clipMask.width / size
				this.height = this.clipMask.height / size
				let ctx  = uni.createCanvasContext('clip-tool', this)
				ctx.width = this.width
				ctx.height = this.height
				let imageResource = this.img
				ctx.drawImage(imageResource,cilpx, cilpy, maskClipw, maskCliph, 0,0, this.width, this.height)
				//
				console.log('imageResource,cilpx, cilpy, maskClipw, maskCliph, 0,0, this.width, this.height:',cilpx, cilpy, maskClipw, maskCliph, 0,0, this.width, this.height)
				ctx.draw(false,()=>{
					self.saveSeal()
					// 剪裁完成保存图片
				})
			},
			saveSeal (url){
				let self = this
				uni.showLoading({
					title: '正在保存图片...'
				});
				// 回去剪裁好的图片
				uni.canvasToTempFilePath({
				  x: 0,
				  y: 0,
				  width: self.width,
				  height:self.height,
				  destWidth: self.width * 1,
				  destHeight: self.height * 1,
				  canvasId: 'clip-tool',
				  success: function(res) {
				    // 在H5平台下，tempFilePath 为 base64
					self.clipUrl = res.tempFilePath
					 
					 switch (self.outputType){
					 	case 'url':
							
							self.$emit('clip-change',self.clipUrl)
					 		break;
					 	default:
							//获取用户的当前设置。获取相册权限
							uni.getSetting({
								success: (res) => {
									//如果没有相册权限
									if (!res.authSetting["scope.writePhotosAlbum"]) {
										//向用户发起授权请求
										uni.authorize({
											scope: "scope.writePhotosAlbum",
											success: () => {
												//授权成功保存图片到系统相册
												uni.saveImageToPhotosAlbum({
													filePath: self.clipUrl,
													success: (res) => {
														uni.hideLoading();
														return uni.showToast({
															title: "保存成功！",
														});
													},
													fail: (res) => {
														uni.hideLoading();
														console.log(res.errMsg);
														return uni.showToast({
															title: res.errMsg,
														});
													},
													//无论成功失败都走的回调
													complete: (res) => {uni.hideLoading(); self.clip = false},
												});
											},
											//授权失败
											fail: () => {
												uni.hideLoading();
												uni.showModal({
													title: "您已拒绝获取相册权限",
													content: "是否进入权限管理，调整授权？",
													success: (res) => {
														if (res.confirm) {
									//调起客户端小程序设置界面，返回用户设置的操作结果。（重新让用户授权）
															uni.openSetting({
																success: (res) => {
																console.log(res.authSetting);
																},
															});
														} else if (res.cancel) {
															return uni.showToast({
																title: "已取消！",
															});
														}
													},
												});
											},
										});
									} else {
										//如果已有相册权限，直接保存图片到系统相册
										uni.saveImageToPhotosAlbum({
											filePath: self.clipUrl,
											success: (res) => {
												uni.hideLoading();
												return uni.showToast({
													title: "保存成功！",
												});
											},
											fail: (res) => {
												uni.hideLoading();
												console.log(res.errMsg);
												return uni.showToast({
													title: res.errMsg,
												});
											},
											//无论成功失败都走的回调
											complete: (res) => {uni.hideLoading(); self.clip = false},
										});
										
									}
								},
								fail: (res) => {},
							});
					 		break;
					 }
					
					
				  },
				  fail:function(err) {
				  	console.log('err',err)
				  }
				  
				},this)
				
			},
			
			   

		}
		
	}
