var api_proced = {
    getAllProced:function(){
        return post_query(
            base_url + '/proced/getAllProced',
            {}
        )
    },



}