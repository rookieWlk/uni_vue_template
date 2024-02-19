<template>
	<view class="watermark-content">
		<canvas :canvas-id="'watermarkCanvas'+index" :id="'watermarkCanvas'+index" :style="{width:canvasWidth + 'px', height:canvasHeight + 'px'}"></canvas>
	</view>
</template>

<script>
	export default {
		name:'hpy-watermark',
		props:{
                        /**
			 * 组件唯一值标识
			 */
			index:{
				type:[Number, String],
				default:0
			},
			/**
			 * 文字文字位置（默认：左下角）可选值：左上角：topLeft、右上角：topRight、左下角：bottomLeft、右下角：bottomRight
			 */
			markAlign:{
				type:String,
				default:function(){
					return 'bottomLeft'
				}
			},
			/**
			 * 设置文本的水平对齐方式，默认：start，文本在指定的位置开始。
			 * end	文本在指定的位置结束。
			 * center 文本的中心被放置在指定的位置。
			 * left	文本左对齐。
			 * right	文本右对齐。
			 */
			textAlign:{
				type:String,
				default:function(){
					return 'start';
				}
			},
			/**
			 * 设置文本的垂直对齐方式，默认：alphabetic文本基线是普通的字母基线。
			 * top	文本基线是 em 方框的顶端。
			 * hanging	文本基线是悬挂基线。
			 * middle	文本基线是 em 方框的正中。
			 * ideographic	文本基线是表意基线。
			 * bottom	文本基线是 em 方框的底端。
			 */
			textBaseline:{
				type:String,
				default:function(){
					return 'alphabetic';
				}
			},
			/**
			 * 文字大小
			 */
			fontSize:{
				type:[Number, String],
				default:40
			},
			/**
			 * 文字颜色
			 */
			fontColor:{
				type:String,
				default:function(){
					return '#FFFFFF'
				}
			},
			/**
			 * 阴影颜色
			 */
			shadowColor:{
				type:String,
				default:function(){
					return 'rgba(0, 0, 0, 1.0)';
				}
			},
			/**
			 * 阴影边框大小
			 */
			shadowWidth:{
				type:[Number, String],
				default:2
			},
			/**
			 * 图片的质量，取值范围为 (0, 1]，不在范围内时当作1处理
			 */
			quality:{
				type:[Number, String],
				default:1
			},
			/**
			 * 目标文件的类型，只支持 'jpg' 或 'png'。默认为 'png'
			 */
			fileType:{
				type:String,
				default:function(){
					return 'png'
				}
			}
		},
		data() {
			return {
				canvasWidth:0,
				canvasHeight:0
			};
		},
		methods: {
			/**
			 * 增加水印
			 * @param {Object} {filePaths:['图片地址1', '图片地址2'], fillTexts:['水印1', '水印2']}
			 */
			async addWaterMark({ filePaths = [], fillTexts = [] }) {
				uni.showLoading({title:'图片处理中···'});
				try{
					for (const filePath of filePaths) {
						await this.drawImage(filePath, fillTexts.reverse());
					}
				}catch(e){
					// TODO handle the exception
				}finally{
					uni.hideLoading();
				}
			},
			/**
			 * 绘制单个图片
			 */
			async drawImage(filePath, fillTexts,index){
				const ctx = uni.createCanvasContext('watermarkCanvas'+this.index, this);
				return new Promise(resolve => {
					uni.getImageInfo({
						src: filePath,
						success: (image) => {
							let scale = 0.8
							let customWidth = image.width * scale
							let customHeight = image.height *scale
							this.canvasWidth = customWidth;
							this.canvasHeight = customHeight;
							ctx.clearRect(0, 0, customWidth, customHeight);
							setTimeout(()=>{
								ctx.drawImage(image.path, 0, 0, customWidth, customHeight);
								ctx.setFontSize(this.fontSize * (customWidth/960));
								ctx.setFillStyle(this.fontColor);
								// 设置阴影
								let shadowWidth = Number(this.shadowWidth + "");
								if(shadowWidth > 0){
									ctx.shadowColor = this.shadowColor;
									ctx.shadowOffsetX = shadowWidth;
									ctx.shadowOffsetY = shadowWidth;
								}
								// 设置水平对齐方式
								ctx.textAlign = this.textAlign;
								// 设置垂直对齐方式
								ctx.textBaseline = this.textBaseline;
								fillTexts.forEach((mark, index) => {
									let gap = (index*60+60)* (customWidth/960)
									if(this.markAlign == "topLeft"){
										ctx.fillText(mark, 20, customHeight - gap);
									}else{
										ctx.fillText(mark, 20, gap);
									}
								});
								ctx.draw(false, (() => {
									setTimeout(()=>{
										uni.canvasToTempFilePath({
											canvasId: 'watermarkCanvas'+this.index,
											fileType:this.fileType,
											quality:Number(this.quality + "" || "1"),
											success: (res) => {
												this.$emit('waterMark', res.tempFilePath);
											},
											fail:(err) => {
												console.log(err)
											},
											complete: () => {
												resolve();
											}
										}, this);
									}, 300);
								})());
							}, 200);
						},
						fail: (e) => {
							resolve();
						}
					});
				});
			}
		}
	}
</script>

<style scoped>
	.watermark-content{width: 0;height: 0;overflow: hidden;}
</style>
