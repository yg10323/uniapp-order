<template>
  <view class="shop-classify">
    <view class="shop-classify-list">
      <uni-grid :column="4" :showBorder="false"  :square="false">
        <uni-grid-item
          class="col-item"
          v-for="(item, index) in classifyList"
          :key="index"
          @click.native="getShopList(item.op_id)"
        >
          <view class="classify-img">
            <image
              style="width: 44px; height: 44px"
              :src="item.op_img"
            ></image>
          </view>
          <view class="classify-text">{{ item.options }}</view>
        </uni-grid-item>
      </uni-grid>
    </view>
  </view>
</template>

<script>
	// import ui from '../../../plugins/uni-ui/index.js'
	
export default {
  name: "",
	components:{
		// uniGrid:ui.uniGrid,
		// uniGridItem:ui.uniGridItem,
	},
  props: {
    classifyList: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  methods: {
    getShopList(op_id) {
			uni.navigateTo({
				url: `/pages/index/web/opList?op_id=${op_id}`
			})
    },
  },
};
</script>

<style scoped lang="scss">
.shop-classify {
  text-align: center;

  &-list {
    padding: 20px 10px;

    .col-item {
      margin-bottom: 10px;

      .classify-text {
        font-size: 14px;
      }
    }
  }
}
</style>