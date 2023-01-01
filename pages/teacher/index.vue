<template>
  <div id='aCoursesList' class='bg-fa of'>
    <!-- 讲师列表 开始 -->
    <section class='container'>
      <header class='comm-title all-teacher-title'>
        <h2 class='fl tac'>
          <span class='c-333'>全部讲师</span>
        </h2>
        <section class='c-tab-title'>
          <a id='subjectAll' title='全部' href='#'>全部</a>
          <!-- <c:forEach var="subject" items="${subjectList }">
                            <a id="${subject.subjectId}" title="${subject.subjectName }" href="javascript:void(0)" onclick="submitForm(${subject.subjectId})">${subject.subjectName }</a>
          </c:forEach>-->
        </section>
      </header>
      <section class='c-sort-box unBr'>
        <div>
          <!-- /无数据提示 开始-->
          <section class='no-data-wrap' v-if='teacherList&&teacherList.length===0'>
            <em class='icon30 no-data-ico'>&nbsp;</em>
            <span class='c-666 fsize14 ml10 vam'>没有相关数据，小编正在努力整理中...</span>
          </section>
          <!-- /无数据提示 结束-->
          <article class='i-teacher-list' v-else>
            <ul class='of'>
              <li v-for='teacher in teacherList'>
                <section class='i-teach-wrap'>
                  <div class='i-teach-pic'>
                    <a :href='"/teacher/"+teacher.id' :title='teacher.name' target='_blank'>
                      <img :src='teacher.avatar' alt='头像加载失败'>
                    </a>
                  </div>
                  <div class='mt10 hLh30 txtOf tac'>
                    <a :href='"/teacher/"+teacher.id' :title='teacher.name' target='_blank'
                       class='fsize18 c-666'>{{ teacher.name }}</a>
                  </div>
                  <div class='hLh30 txtOf tac'>
                    <span class='fsize14 c-999'>{{ teacher.intro }}</span>
                  </div>
                  <div class='mt15 i-q-txt'>
                    <p class='c-999 f-fA'>{{ teacher.career }}</p>
                  </div>
                </section>
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
    <!-- /讲师列表 结束 -->
  </div>
</template>
<script>
import teacher from '@/api/teacher'

export default {
  data() {
    return {
      //总记录数
      total: 0,
      //当前页
      page: 1,
      //每页最大记录数
      maxSize: 8,
      showLoading: false,
      teacherList: []
    }
  },
  computed: {
    totalPage() {
      console.log(Math.ceil(this.total / this.maxSize))
      return Math.ceil(this.total / this.maxSize)
    }
  },
  created() {
    this.getTeacherList()
  },
  methods: {
    getTeacherList() {
      teacher.getTeacherPage(this.page, this.maxSize)
        .then(response => {
          this.teacherList = response.data.data.rows
          this.total = response.data.data.total
        })
    },
    changeCurrentPage(index) {
      this.page = index
    }
  },
  watch: {
    conditions: {
      //表示开启深度监视，可不写，默认不开
      deep: true,
      handler: function(newValue, oldValue) { //或者是handle（），handle（newValue）
        //处理方法
        this.getTeacherList()
      }
    },
    page: {
      handler: function(newValue, oldValue) { //或者是handle（），handle（newValue）
        //处理方法
        this.getTeacherList()
      }
    }
  }
}
</script>
