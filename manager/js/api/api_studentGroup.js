var api_studentGroup = {
  groupStudent: function (batch_name) {
    return post_query(
      base_url + '/studentGroup/groupStudent',
      { batch_name: batch_name }
    )
  },
}
 