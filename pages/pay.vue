<template>
  <div class='cart py-container'>
    <!--主内容-->
    <div class='fl code'>
      <!-- <img id="qrious" src="~/assets/img/erweima.png" alt=""> -->
      <!-- 安装qriously插件,可以把    weixin://解析为二维码       -->
      <qriously value='weixin://wxpay/bizpayurl?pr=g8fK00rzz' :size='338' />
      <!--            <qriously :value='payObj.code_url' :size='338' />-->

      <div class='saosao'>
        <p>请使用微信扫一扫</p>
        <p>扫描二维码支付</p>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'pay'
}
</script>

