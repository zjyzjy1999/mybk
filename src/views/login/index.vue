<template>
  <div class="box">
    <div class="bj" ref="vantaRef"></div>
  </div>
</template>
<script>
import * as THREE from 'three'
// import BIRDS from 'vanta/src/vanta.birds'
import CLOUDS from 'vanta/src/vanta.clouds'
export  default  {
  name:'login',
  data(){
    return{
    }
  },
  methods:{

  },
  mounted() {
    this.vantaEffect=CLOUDS({
      el:this.$refs.vantaRef,
      THREE:THREE
    })
  },
  beforeDestroy() {
    if(this.vantaEffect){
      this.vantaEffect.destroy()
    }
  }
}
</script>
<style lang="scss" scoped>
 .box{
   width: 100%;
   height: 100%;
   display: flex;
   .bj{
     width: 100%;
     height: 100%;
   }
 }

</style>