<template>
  <el-container>
    <el-container>
      <!--      视频播放器 开始-->
      <el-main>
        <div>

          <!-- 阿里云视频播放器样式 -->
          <link rel='stylesheet' href='https://g.alicdn.com/de/prismplayer/2.8.1/skins/default/aliplayer-min.css'>
          <!-- 阿里云视频播放器脚本 -->
          <script charset='utf-8' type='text/javascript'
                  src='https://g.alicdn.com/de/prismplayer/2.8.1/aliplayer-min.js' />

          <!-- 定义播放器dom -->
          <div id='J_prismPlayer' class='prism-player' />
        </div>
      </el-main>
      <!--      视频播放器 结束-->
      <!-- 课程大纲 开始-->
      <el-aside width='30%'>
        <div class='mt50'>
          <h6 class='c-g-content c-infor-title'>
            <span>课程大纲</span>
          </h6>
          <section class='mt20'>
            <div class='lh-menu-wrap'>
              <menu id='lh-menu' class='lh-menu mt10 mr10'>
                <ul>
                  <!-- 课程章节目录 -->
                  <li v-for='chapter in chapterList' :key='chapter.id' class='lh-menu-stair'>
                    <a :title='chapter.title' class='current-1'>
                      <em class='lh-menu-i-1 icon18 mr10' />{{ chapter.title }}
                    </a>
                    <ol class='lh-menu-ol' style='display: block;'>
                      <li v-for='video in chapter.children' :key='video.id' class='lh-menu-second ml30'>
                        <router-link v-if='video.type===1'
                                     :to="{name: 'video-id', params:{id:video.id+':'+video.courseId+':'+video.videoSourceId,vid:video.vid}}"
                                     :style="video.videoSourceId===sourceId?'background: #DCDFE6':''"
                        >
                                    <span class='fr'>
                                        <i class='free-icon vam mr10'>点我观看</i>
                                    </span>
                          <em class='lh-menu-i-2 icon16 mr5'>&nbsp;</em>{{ video.title }}
                        </router-link>
                        <a v-else :href='video.videoSourceId'>
                                    <span class='fr'>
                                        <i class='free-icon vam mr10'>点我下载</i>
                                    </span>
                          <em class='lh-menu-i-2 icon16 mr5'>&nbsp;</em>{{ video.title }}
                        </a>
                      </li>
                    </ol>
                  </li>
                </ul>
              </menu>
            </div>
          </section>
        </div>
      </el-aside>
      <!-- 课程大纲 结束 -->
    </el-container>

    <el-footer style='margin-top:50px;' height='auto'>
      <h6 class='c-g-content c-infor-title'>
        <span>课程评论</span>
      </h6>
      <video-comment :video-id='videoId'></video-comment>
    </el-footer>
  </el-container>
</template>

<script>
import vod from '@/api/vod'
import course from '@/api/course'
import VideoComment from '../../components/VideoComment.vue'
import cookie from 'js-cookie'
import { checkLogin } from '../../utils/checkLogin'

export default {
  name: '_id.vue',
  components: { VideoComment },
  comments: { VideoComment },
  asyncData({ params, error }) {
    let [videoId, courseId, videoSourceId] = params.id.split(':')
    return vod.getPlayAuth(videoSourceId).then(response => {
      return {
        videoId,
        courseId,
        sourceId: videoSourceId,
        playAuth: response.data.data.playAuth
      }
    })
  },
  data() {
    return {
      chapterList: []
    }
  },
  created() {
    checkLogin(this)
    //获取课程视频列表
    course.getById(this.courseId).then(response => {
      this.chapterList = response.data.data.chapterVoList
    })

  },
  mounted() {
    /**
     * mounted在页面渲染完成之后才会执行,需要操作dom元素的不能使用created
     * 页面渲染完成时：此时js脚本已加载，Aliplayer已定义，可以使用
     * 如果在created生命周期函数中使用，Aliplayer is not defined错误
     */
    // console.log(this.playAuth)
    new Aliplayer({
      id: 'J_prismPlayer',
      vid: this.sourceId, // 视频id
      playauth: this.playAuth, // 播放凭证
      // encryptType: '1', // 如果播放加密视频，则需设置encryptType=1，非加密视频无需设置此项
      width: '100%',
      height: '500px',
      // cover: 'http://guli.shop/photo/banner/1525939573202.jpg', // 封面
      qualitySort: 'asc', // 清晰度排序
      mediaType: 'video', // 返回音频还是视频
      autoplay: false // 自动播放
    }, function(player) {
      console.log('播放器创建成功')

    })
  }
}
</script>

<style scoped>

</style>
