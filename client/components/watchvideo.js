import React from 'react';
import {getSingleRoutine} from '../store'
import VideoPlayer from 'react-video-js-player'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
class WatchVideo extends React.Component{
    componentDidMount(){
        //using the generic name fetch video b/c we can recycle for a non-routine I think quite easily
        console.log("IN THE COMPONENT YOU THINK YOU'RE IN")
        this.props.fetchVideo(this.props.match.params.id);

    }
    render(){
        console.log("ATTEMPTING TO RENDER?");
        console.log("Available props: ", this.props);
        if(this.props.singleRoutine.url){
            console.log(this.props.singleRoutine.url);
        return <div>
<VideoPlayer
                    controls={true}
                    src={this.props.singleRoutine.url}
                    
                    width="680"
                    height="450"
                />
        </div>
        }
        return (<div>No URL YET</div>)
    }
}

const mapState=state=>({
    singleRoutine: state.singleRoutine
})
const mapDispatch=dispatch=>({fetchVideo: (id)=>dispatch(getSingleRoutine(id))})

export default withRouter(connect(mapState, mapDispatch)(WatchVideo));

/*
    STUFF:
        Video reducer
            Once we have a video url, we probably want the whole file also?
            So, the get route should also make another get request from cloudinary?
            

        Routine get route
        router.use('/:id', (req, res, next)=>{
            Routine.findByPk(req.params.id, include: [
                {Model: }
            ]
        }
        

const fetchVideo=(id)=>{
    //We don't have a video route, on account of routines/practices split
    //Will change in a bit
    //Probably actually
    return dispatch => Axios.get(`/api/video/${id}`).then(res=>dispatch(gotVideo(res.data)));
       // return Axios.get(res.data.url)}).then(otherRes=>dispatch(gotCloudVideo(otherRes.data))).catch(console.log)
}
const GOT_VIDEO="GOT_VIDEO";
const gotVideo=(data)=>({type: GOT_VIDEO, video: data})
const initialState={};
const reducer=(state=initialState, action)=>{
    switch(action.type){
        case GOT_VIDEO: 
            return action.video
        default: return state;
    }
}
*/
//Thought - do we want users to be able to define video resolution?
//Else, do we want to know the video resolution and scale it, or keep const width, height?
//Looks like the way to do that involves db stuff not currently set up - ask at next standup
/*

                

                Later stuff: 
                onReady={this.onPlayerReady.bind(this)}
                    onPlay={this.onVideoPlay.bind(this)}
                    onPause={this.onVideoPause.bind(this)}
                    onTimeUpdate={this.onVideoTimeUpdate.bind(this)}
                    onSeeking={this.onVideoSeeking.bind(this)}
                    onSeeked={this.onVideoSeeked.bind(this)}
                    onEnd={this.onVideoEnd.bind(this)}
            </div>

*/