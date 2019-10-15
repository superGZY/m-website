module.exports = {
  get(dir) {
    return $.ajax({
      url: dir
    })
  },
  post(dir,datas){
    return $.ajax({
      url:dir,
      type: "POST",
      data:datas
    })
  }
}