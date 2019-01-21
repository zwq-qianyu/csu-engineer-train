var api_proced = {
    getAllProced:function(){
        return post_query(
             '/proced/getAllProced',
            {}
        )
    },
}