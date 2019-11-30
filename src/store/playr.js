import axios from 'axios'
import {playMode} from '../config/play.config'

export default{
    state:{
        // 歌手
        singer:{},
        // 播放
        playing:false,
        // 全屏
        fullScreen:false,
        // 播放列表
        playList:[],
        // 顺序列表
        sequenceList:[],

        mode:playMode.sequence,

        curentIndex:-1,
    },
    getters:{
        singer:state =>state.singer,
        playing:state=>state.playing,
        fullScreen:state=>state.fullScreen,
        playList:state=>state.playList,
        sequenceList:state=>state.sequenceList,
        mode:state=>state.mode,
        curentIndex:state=>state.curentIndex,
        curentSong:state=>{
            return state.playList[state.curentIndex] || {}            
        }

    },
    mutations:{
        SET_SINGER(state,singer){
            state.singer=singer
        },
        SEt_PLAYING(state,flag){
            state.playing=flag
        },
        SET_FULL_SCREEN(state,flag){
            state.fullScreen=flag
        },
        SET_PLAYLIST(state,list){
            state.playList=list
        },
        SET_SEQUENCE_LIST(state,list){
            state.sequenceList=list
        },
        SET_MODE(state,mode){
            state.mode=mode
        },
        SET_CURENT_INDEX(state,index){
            state.curentIndex=index
        }


    },
    actions:{
        selectPlay({commit,state},{List,index}){
            console.log("异步操作")
            console.log(List)
            console.log(index)
            commit('SET_SEQUENCE_LIST',List)
            commit('SET_PLAYLIST',List)
            commit('SET_CURENT_INDEX',index)
            commit('SET_FULL_SCREEN',true)
            commit('SEt_PLAYING',true)
        }
    }
}