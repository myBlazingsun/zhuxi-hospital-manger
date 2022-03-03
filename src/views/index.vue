<template>
  <div>index</div>
</template>

<script>

export default {
  data(){
    return{

    }
  } ,
  computed: {
    messageType: function (type) {
      var that = this
      return function (type) {
        var dict = that.messageTypeList.find(function (x) {
          return x.dictValue == type;
        });
        if (dict) {
          return dict.dictLabel;
        }
        return '';

      }
    }
  },
  watch: {

  },
  methods: {
  },
  created: function () {

  },
  mounted: function () {

  },
}
</script>

<style lang="scss">

</style>