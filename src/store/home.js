import axios from 'axios'
export default{
    state:{
        home_recommend:''
    },
    getters:{
        home_recommend:state=>state.home_recommend
    },
    mutations:{
        SET_HOME_Recommend(state,data){
            state.home_recommend = data
        }
    },
    actions:{
        async get_home_recommend({state,commit}){
            let res = await axios.get("/mobile/songlist/first",{
                params:{
                    isfirst:1
                }
            })
            console.log('小编推荐');
            console.log(res);
            commit('SET_HOME_Recommend',res.data)
        

        }
    }
}