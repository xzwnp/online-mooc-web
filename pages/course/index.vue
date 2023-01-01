<template>
  <div id='aCoursesList' class='bg-fa of'>
    <!-- /课程列表 开始 -->
    <section class='container'>
      <header class='comm-title'>
        <h2 class='fl tac'>
          <span class='c-333'>全部课程</span>
        </h2>
      </header>
      <section class='c-sort-box'>
        <section class='c-s-dl'>
          <dl>
            <dt>
              <span class='c-999 fsize14'>课程类别</span>
            </dt>
            <dd class='c-s-dl-li'>
              <ul class='clearfix'>
                <li :class='{current:-1===selectedSubjectIndex}'>
                  <a title='全部'
                     href='#' @click='changeCurrentSubject(null)'>全部</a>
                </li>
                <li v-for='(subject,index) in subjectList'
                    :key='subject.id'
                    :class='{current:index===selectedSubjectIndex}'>   <!--     class样式悬停  -->
                  <a :title='subject.title' href='#' @click='changeCurrentSubject(subject,index)'>{{ subject.title
                    }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <dl>
            <dt>
              <span class='c-999 fsize14'>二级分类</span>
            </dt>
            <dd class='c-s-dl-li'>
              <ul class='clearfix'>
                <li v-for='(subject,index) in secondarySubjectList' :key='subject.id'
                    :class='{current:index===selectedSecondarySubjectIndex}'>
                  <a :title='subject.title' href='#' @click='changeCurrentSecondary(subject,index)'>{{ subject.title
                    }}</a>
                </li>
              </ul>
            </dd>
          </dl>
          <div class='clear'></div>
        </section>
        <div class='js-wrap'>
          <section class='fr'>
            <span class='c-ccc'>
              <i class='c-666 f-fM'>1</i>
            </span>
          </section>
          <section class='fl'>
            <ol class='js-tap clearfix'>
              <li :class="{'current bg-orange':1 ===conditions.sort}">
                <a title='最新' href='#' @click='changeSelectedSort(1)'>最新&nbsp;
                  <span v-show='conditions.sort===1'>
                    <span v-if='conditions.desc'>↓</span>
                    <span v-else>↑</span>
                </span>
                </a>
              </li>
              <li :class="{'current bg-orange':2 ===conditions.sort}">
                <a title='销量' href='#' @click='changeSelectedSort(2)'>销量&nbsp;
                  <span v-show='conditions.sort===2'>
                    <span v-if='conditions.desc'>↓</span>
                    <span v-else>↑</span>
                </span>
                </a>
              </li>
              <li :class="{'current bg-orange':3 ===conditions.sort}">
                <a title='价格' href='#' @click='changeSelectedSort(3)'>价格&nbsp;
                  <span v-show='conditions.sort===3'>
                    <span v-if='conditions.desc'>↓</span>
                    <span v-else>↑</span>
                  </span>
                </a>
              </li>
            </ol>
          </section>
        </div>
        <div class='mt40' v-loading='showCourseLoading'>
          <!-- /无数据提示 开始-->
          <section class='no-data-wrap' v-if='total === 0'>
            <em class='icon30 no-data-ico'>&nbsp;</em>
            <span class='c-666 fsize14 ml10 vam'>没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article class='comm-course-list'>
            <ul class='of' id='bna'>
              <li v-for='course in courseList' :key='course.id'>
                <div class='cc-l-wrap'>
                  <section class='course-img'>
                    <img
                      :src='course.cover'
                      class='img-responsive'
                      :alt='course.title'
                    >
                    <div class='cc-mask'>
                      <a :href='"/course/"+course.id' title='开始学习' class='comm-btn c-btn-1'>开始学习</a>
                    </div>
                  </section>
                  <h3 class='hLh30 txtOf mt10'>
                    <a :href='"/course/"+course.id' :title='course.title'
                       class='course-title fsize18 c-333'>{{ course.title }}</a>
                  </h3>
                  <section class='mt10 hLh20 of'>
                      <span class='fr jgTag bg-green' v-if='Number(course.price)===0'>
                        <i class='c-fff fsize12 f-fA'>免费</i>
                      </span>
                    <span class='fl jgAttr c-ccc f-fA'>
                        <i class='c-999 f-fA'>{{ course.buyCount }}人购买</i>
                        |
                        <i class='c-999 f-fA'>{{ course.viewCount }}人查看</i>
                      </span>
                  </section>
                </div>
              </li>
            </ul>
            <div class='clear'></div>
          </article>
        </div>
        <!-- 公共分页 开始 -->
        <div>
          <div class='paging'>
            <a href='#' title @click='changeCurrentPage(1)'>首</a>
            <a id='backpage'
               :class='{undisable:page-1<=0}'
               @click='changeCurrentPage(page-1)'
               href='#' title>&lt;</a>
            <!--            <a href='#' title class='current undisable'>1</a>-->
            <!--    如果in的对象是数字,那么索引从1开始        -->
            <a v-for='index in totalPage'
               href='#'
               :class='{"current undisable":index === page}'
               @click='changeCurrentPage(index)'
               title>{{ index }}</a>
            <a id='nextpage'
               :class='{undisable:page+1>totalPage}'
               href='#' @click='changeCurrentPage(page+1)' title>&gt;</a>
            <a href='#' title @click='changeCurrentPage(totalPage)'>末</a>
            <div class='clear'></div>
          </div>
        </div>
        <!-- 公共分页 结束 -->
      </section>
    </section>
    <!-- /课程列表 结束 -->
  </div>
</template>
<script>
import course from '@/api/course'

export default {
  data() {
    return {
      //总记录数
      total: 0,
      //当前页
      page: 1,
      //每页最大记录数
      maxSize: 4,
      showCourseLoading: false,
      subjectList: [],
      secondarySubjectList: [],
      selectedSubjectIndex: -1,
      selectedSecondarySubjectIndex: -1,
      courseList: [],
      conditions: {
        title: null,
        subjectParentId: null,
        subjectId: null,
        //"排序 1:上架日期 2:销量 3:价格"
        sort: 1,
        //是否降序排列
        desc: true
      }
    }
  },
  computed: {
    totalPage() {
      console.log(Math.ceil(this.total / this.maxSize))
      return Math.ceil(this.total / this.maxSize)
    }
  },
  methods: {
    getAllSubject() {
      course.getAllSubject()
        .then(response => {
          this.subjectList = response.data.data.list
        })
    },
    changeCurrentSubject(subject, index) {
      //选中以后,除了要更新被选中的一级学科索引,还要更新二级学科列表
      if (!subject) {
        //没有学科,说明选中了全部
        this.secondarySubjectList = []
        this.selectedSubjectIndex = -1
        this.conditions.subjectParentId = null
      } else {
        this.secondarySubjectList = subject.children
        this.selectedSubjectIndex = index
        this.conditions.subjectParentId = this.subjectList[this.selectedSubjectIndex].id

      }
      //切换一级学科后,重置被选中的二级学科
      this.selectedSecondarySubjectIndex = -1
      this.conditions.subjectId = null
    },
    changeCurrentSecondary(subject, index) {
      if (!subject) {
        //没有学科,说明选中了全部
        this.selectedSecondarySubjectIndex = -1
      } else {
        this.selectedSecondarySubjectIndex = index
        this.conditions.subjectId = this.secondarySubjectList[this.selectedSecondarySubjectIndex].id

      }
    },
    changeSelectedSort(sort) {
      if (this.conditions.sort !== sort) {
        this.conditions.sort = sort
      } else {
        this.conditions.desc = !this.conditions.desc
      }

    },
    changeCurrentPage(index) {
      this.page = index
    },
    getCourseList() {
      this.showCourseLoading = true
      course.getCoursePage(this.page, this.maxSize, this.conditions)
        .then(response => {
          this.courseList = response.data.data.list
          this.total = response.data.data.total
        }).finally(() => {
        this.showCourseLoading = false
      })
    }
  },
  created() {
    this.getAllSubject()
    this.getCourseList()
    //请求是异步的,这就导致total的值还没更新,页数就已经计算完毕了
  },
  watch: {
    conditions: {
      //表示开启深度监视，可不写，默认不开
      deep: true,
      handler: function(newValue, oldValue) { //或者是handle（），handle（newValue）
        //处理方法
        this.getCourseList()
      }
    },
    page: {
      handler: function(newValue, oldValue) { //或者是handle（），handle（newValue）
        //处理方法
        this.getCourseList()
      }
    }
  }

}
</script>
